// POST /api/book
//
// Creates a pending_verification appointment from the booking wizard
// (app/book). Price/duration are always re-resolved from the live `services`
// table server-side — the client's selected package is only used to look up
// the row by name, never trusted for the actual charge or scheduling math.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { findService } from "../../../lib/services";
import { verificationEmailHtml } from "../../../lib/emailTemplates";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VERIFICATION_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours
const TIMEZONE = process.env.BUSINESS_TIMEZONE || "America/Chicago";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

function filled(value) {
  return typeof value === "string" && value.trim().length > 0;
}

let gmailTransporter;
function getGmailTransporter() {
  if (!gmailTransporter) {
    gmailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return gmailTransporter;
}

async function sendVerificationEmail({ verifyUrl, to, name, serviceName, bookingStart }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn(
      "[book] Skipping verification email — GMAIL_USER or GMAIL_APP_PASSWORD is missing. " +
        "Set both in .env.local (the app password comes from your Google Account's " +
        "App Passwords page), or just use the confirmation URL logged above to test " +
        "without email.\n" +
        `[book]   GMAIL_USER set: ${Boolean(process.env.GMAIL_USER)}, ` +
        `GMAIL_APP_PASSWORD set: ${Boolean(process.env.GMAIL_APP_PASSWORD)}`
    );
    return;
  }

  try {
    const dateLabel = new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(bookingStart);
    const timeLabel = new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      hour: "numeric",
      minute: "2-digit",
    }).format(bookingStart);

    await getGmailTransporter().sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: "Confirm your appointment with Don's Professional Car Detailing",
      html: verificationEmailHtml({
        customerName: name,
        serviceName,
        dateLabel,
        timeLabel,
        verifyUrl,
      }),
    });
  } catch (err) {
    // A failed send never blocks the booking — the hold still exists and
    // simply expires in 2 hours if the customer never verifies.
    console.error("[book] Verification email send failed:", err);
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    serviceSlug,
    startISO,
    customerName,
    customerEmail,
    customerPhone,
    address,
    city,
    zip,
    vehicleMake,
    vehicleModel,
    vehicleColor,
    notes,
  } = body || {};

  const servicePreset = findService(serviceSlug);
  if (!servicePreset) {
    return NextResponse.json({ error: "Select a valid service." }, { status: 400 });
  }

  const bookingStart = new Date(startISO);
  if (!startISO || Number.isNaN(bookingStart.getTime())) {
    return NextResponse.json({ error: "Select a valid appointment time." }, { status: 400 });
  }

  if (!filled(customerName) || !filled(customerEmail) || !EMAIL_RE.test(customerEmail)) {
    return NextResponse.json({ error: "A valid name and email are required." }, { status: 400 });
  }
  if (!filled(customerPhone) || !filled(address) || !filled(city) || !filled(zip)) {
    return NextResponse.json(
      { error: "Full contact and address details are required." },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();

  const { data: serviceRow, error: serviceError } = await supabase
    .from("services")
    .select("id, duration_minutes")
    .eq("name", servicePreset.name)
    .maybeSingle();

  if (serviceError || !serviceRow) {
    console.error("Booking failed — service not found in Supabase:", servicePreset.name, serviceError);
    return NextResponse.json(
      { error: "That service isn't available right now. Please try again shortly." },
      { status: 500 }
    );
  }

  const bookingEnd = new Date(bookingStart.getTime() + serviceRow.duration_minutes * 60 * 1000);
  const verificationToken = randomBytes(16).toString("hex"); // 32-character token
  const verificationExpiresAt = new Date(Date.now() + VERIFICATION_WINDOW_MS);

  const { data: appointment, error: insertError } = await supabase
    .from("appointments")
    .insert({
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      customer_phone: customerPhone.trim(),
      service_address: `${address.trim()}, ${city.trim()}, NE ${zip.trim()}`,
      vehicle_info: [vehicleColor, vehicleMake, vehicleModel]
        .filter((part) => filled(part))
        .join(" ") || null,
      notes: filled(notes) ? notes.trim() : null,
      service_id: serviceRow.id,
      booking_start_timestamp: bookingStart.toISOString(),
      booking_end_timestamp: bookingEnd.toISOString(),
      verification_token: verificationToken,
      verification_expires_at: verificationExpiresAt.toISOString(),
      status: "pending_verification",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Booking insert failed:", insertError);
    return NextResponse.json(
      { error: "Unable to create your appointment. Please try again." },
      { status: 500 }
    );
  }

  const verifyUrl = new URL(`/api/verify?token=${verificationToken}`, request.url).toString();

  // Local-dev bypass: this lets you confirm a booking (and trigger the
  // Google Calendar write in /api/verify) without a working email service —
  // copy/paste the URL straight into a browser tab.
  console.log(`[book] Appointment ${appointment.id} pending verification.`);
  console.log(`[book] Confirmation URL: ${verifyUrl}`);
  console.log(`[book] Confirmation token: ${verificationToken}`);

  await sendVerificationEmail({
    verifyUrl,
    to: customerEmail.trim(),
    name: customerName.trim(),
    serviceName: servicePreset.name,
    bookingStart,
  });

  return NextResponse.json({ success: true, appointmentId: appointment.id });
}
