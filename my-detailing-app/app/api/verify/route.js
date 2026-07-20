// GET /api/verify?token=...
//
// Consumes a verification link from the booking confirmation email. On a
// valid, unexpired token: marks the appointment confirmed, writes the event
// to Google Calendar via the Service Account, and redirects to a status
// page. Never renders JSON — this is a link a customer clicks in their inbox.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCalendarClient } from "../../../lib/googleCalendar";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const redirectTo = (status) =>
    NextResponse.redirect(new URL(`/verify?status=${status}`, request.url));

  if (!token) return redirectTo("expired");

  const supabase = supabaseAdmin();

  const { data: appointment, error } = await supabase
    .from("appointments")
    .select(
      "id, status, verification_expires_at, booking_start_timestamp, booking_end_timestamp, customer_name, customer_phone, service_address, vehicle_info, notes, services(name)"
    )
    .eq("verification_token", token)
    .maybeSingle();

  if (error || !appointment) return redirectTo("expired");

  // Re-clicking an already-confirmed link is a success, not an error.
  if (appointment.status === "confirmed") return redirectTo("success");

  const isExpired =
    appointment.status !== "pending_verification" ||
    new Date(appointment.verification_expires_at).getTime() <= Date.now();

  if (isExpired) return redirectTo("expired");

  try {
    const calendar = getCalendarClient();
    const serviceName = appointment.services?.name || "Detailing Appointment";

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `${serviceName} — ${appointment.customer_name}`,
        description: [
          `Phone: ${appointment.customer_phone}`,
          `Vehicle: ${appointment.vehicle_info || "—"}`,
          appointment.notes ? `Notes: ${appointment.notes}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        location: appointment.service_address,
        start: { dateTime: appointment.booking_start_timestamp },
        end: { dateTime: appointment.booking_end_timestamp },
      },
    });

    // Guard on status still being pending_verification so two concurrent
    // clicks of the same link can't double-book the calendar.
    const { error: updateError } = await supabase
      .from("appointments")
      .update({ status: "confirmed", google_calendar_event_id: event.data.id })
      .eq("id", appointment.id)
      .eq("status", "pending_verification");

    if (updateError) throw updateError;

    return redirectTo("success");
  } catch (err) {
    // Don't mark confirmed if the calendar write failed — the token stays
    // valid and the customer can retry the same link until it expires.
    console.error("Verification failed to sync with Google Calendar:", err);
    return redirectTo("error");
  }
}
