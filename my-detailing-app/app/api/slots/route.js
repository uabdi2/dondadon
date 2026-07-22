// The secret logic filtering Google Calendar
//
// GET /api/slots?date=YYYY-MM-DD&serviceId=<uuid>
//
// Returns clean, bookable start times for the given date. Never exposes
// Don's raw calendar (titles, other clients' info, personal events) — it
// only ever reads Google's FreeBusy endpoint, which returns busy time
// ranges with zero event detail.
//
// Auth is a Google Cloud Service Account (no OAuth redirect/refresh-token
// flow) — see .env.local for GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY
// setup, and remember to share Don's calendar with that service account.
//
// npm install googleapis @supabase/supabase-js date-fns date-fns-tz

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { getCalendarClient } from "../../../lib/googleCalendar";

export const dynamic = "force-dynamic";

const TIMEZONE = process.env.BUSINESS_TIMEZONE || "America/Chicago";

// Don's operational windows. 0 = Sunday ... 6 = Saturday. null = closed.
const BUSINESS_HOURS = {
  0: null,
  1: { start: "16:00", end: "21:00" },
  2: { start: "16:00", end: "21:00" },
  3: { start: "16:00", end: "21:00" },
  4: { start: "16:00", end: "21:00" },
  5: { start: "16:00", end: "21:00" },
  6: { start: "08:00", end: "20:00" },
};

const SLOT_INTERVAL_MINUTES = 30; // candidate start times are on this grid
const TRAVEL_BUFFER_MINUTES = 45; // drive time Don needs before AND after every job
const DEFAULT_SERVICE_DURATION_MINUTES = 60; // fallback if serviceId isn't given/found
const MIN_LEAD_TIME_MINUTES = 120; // can't book a slot starting less than 2hrs from now

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// Fetch busy ranges from Google Calendar (FreeBusy API — no event details returned).
async function getGoogleBusyRanges(dayStartUtc, dayEndUtc) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const calendar = getCalendarClient();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStartUtc.toISOString(),
      timeMax: dayEndUtc.toISOString(),
      timeZone: "UTC",
      items: [{ id: calendarId }],
    },
  });

  // Google's FreeBusy API reports per-calendar failures (bad calendar ID,
  // calendar not shared with the service account, etc.) as an `errors` array
  // inside a 200 response — never as an HTTP error. Reading only `.busy`
  // here would silently treat a broken calendar as "nothing busy", showing
  // every slot as open even though Don's real calendar was never checked.
  const calendarResult = res.data.calendars?.[calendarId];
  if (calendarResult?.errors?.length) {
    throw new Error(
      `Google FreeBusy could not read calendar "${calendarId}": ` +
        JSON.stringify(calendarResult.errors) +
        ". Check GOOGLE_CALENDAR_ID and that the calendar is shared with " +
        `${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL} ("Make changes to events").`
    );
  }

  const busy = calendarResult?.busy || [];
  return busy.map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
}

// Fetch live holds/bookings from Supabase: confirmed appointments, plus
// pending_verification appointments whose 2-hour hold hasn't expired yet.
// Filters on the unified booking_start_timestamp/booking_end_timestamp
// columns so any appointment overlapping the day's window is caught,
// regardless of which calendar day it was created against.
async function getSupabaseBusyRanges(supabase, dayStartUtc, dayEndUtc) {
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .select("booking_start_timestamp, booking_end_timestamp, status, verification_expires_at")
    .lt("booking_start_timestamp", dayEndUtc.toISOString())
    .gt("booking_end_timestamp", dayStartUtc.toISOString())
    .in("status", ["pending_verification", "confirmed"]);

  if (error) throw error;

  return (data || [])
    .filter(
      (row) =>
        row.status === "confirmed" ||
        (row.status === "pending_verification" && row.verification_expires_at > nowIso)
    )
    .map((row) => ({
      start: new Date(row.booking_start_timestamp),
      end: new Date(row.booking_end_timestamp),
    }));
}

async function getServiceDurationMinutes(supabase, serviceId) {
  if (!serviceId) return DEFAULT_SERVICE_DURATION_MINUTES;

  const { data, error } = await supabase
    .from("services")
    .select("duration_minutes")
    .eq("id", serviceId)
    .maybeSingle();

  if (error || !data) return DEFAULT_SERVICE_DURATION_MINUTES;
  return data.duration_minutes;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const serviceId = searchParams.get("serviceId");
    const explicitDuration = Number(searchParams.get("duration"));

    if (!date || !DATE_RE.test(date)) {
      return NextResponse.json(
        { error: "Query param 'date' is required as YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const [year, month, day] = date.split("-").map(Number);
    const dayOfWeek = utcToZonedTime(new Date(Date.UTC(year, month - 1, day)), TIMEZONE).getDay();
    const window = BUSINESS_HOURS[dayOfWeek];

    if (!window) {
      return NextResponse.json({ date, slots: [] });
    }

    const supabase = supabaseAdmin();
    // A caller-supplied duration (e.g. the booking wizard, which knows the
    // selected package's duration up front) skips the services lookup
    // entirely; otherwise fall back to resolving it from serviceId.
    const durationMinutes =
      Number.isFinite(explicitDuration) && explicitDuration > 0
        ? explicitDuration
        : await getServiceDurationMinutes(supabase, serviceId);

    // Convert Don's local business-hour window for this date into the
    // corresponding UTC instants, using BUSINESS_TIMEZONE.
    const dayStartUtc = zonedTimeToUtc(`${date}T${window.start}:00`, TIMEZONE);
    const dayEndUtc = zonedTimeToUtc(`${date}T${window.end}:00`, TIMEZONE);

    const [googleBusy, supabaseBusy] = await Promise.all([
      getGoogleBusyRanges(dayStartUtc, dayEndUtc),
      getSupabaseBusyRanges(supabase, dayStartUtc, dayEndUtc),
    ]);

    // Every busy range gets padded by the travel buffer on both sides so
    // Don always has drive time before AND after each job.
    const bufferMs = TRAVEL_BUFFER_MINUTES * 60 * 1000;
    const paddedBusy = [...googleBusy, ...supabaseBusy].map((r) => ({
      start: new Date(r.start.getTime() - bufferMs),
      end: new Date(r.end.getTime() + bufferMs),
    }));

    const now = new Date();
    const earliestBookable = new Date(now.getTime() + MIN_LEAD_TIME_MINUTES * 60 * 1000);
    const durationMs = durationMinutes * 60 * 1000;
    const intervalMs = SLOT_INTERVAL_MINUTES * 60 * 1000;

    const slots = [];
    for (
      let candidateStart = new Date(dayStartUtc);
      candidateStart.getTime() + durationMs <= dayEndUtc.getTime();
      candidateStart = new Date(candidateStart.getTime() + intervalMs)
    ) {
      const candidateEnd = new Date(candidateStart.getTime() + durationMs);

      if (candidateStart < earliestBookable) continue;

      const collides = paddedBusy.some((b) =>
        rangesOverlap(candidateStart, candidateEnd, b.start, b.end)
      );
      if (collides) continue;

      slots.push({
        startISO: candidateStart.toISOString(),
        endISO: candidateEnd.toISOString(),
        label: format(utcToZonedTime(candidateStart, TIMEZONE), "h:mm a", {
          timeZone: TIMEZONE,
        }),
      });
    }

    return NextResponse.json({ date, durationMinutes, slots });
  } catch (err) {
    console.error("GET /api/slots failed:", err);
    return NextResponse.json(
      { error: "Unable to load availability right now." },
      { status: 500 }
    );
  }
}
