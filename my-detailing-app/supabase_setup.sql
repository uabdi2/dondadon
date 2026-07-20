-- Supabase setup for Don's Professional Car Detailing
-- Run in: Supabase Dashboard -> SQL Editor -> New query

create extension if not exists "pgcrypto"; -- for gen_random_uuid() / gen_random_bytes()

-- ────────────────────────────────────────────────────────────
-- services
-- ────────────────────────────────────────────────────────────
create table services (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  price             numeric(10, 2) not null,
  duration_minutes  integer not null,
  description       text
);

-- ────────────────────────────────────────────────────────────
-- appointments
-- ────────────────────────────────────────────────────────────
create table appointments (
  id                        uuid primary key default gen_random_uuid(),
  customer_name             text not null,
  customer_email            text not null,
  customer_phone            text not null,
  service_address           text not null,
  vehicle_info              text,
  notes                     text,
  service_id                uuid not null references services (id),

  -- Unified date+time window for the booking, used directly for calendar
  -- range checks (Google Calendar + overlap queries) instead of separate
  -- date/time columns. booking_end_timestamp is computed by the app as
  -- booking_start_timestamp + the service's duration_minutes at insert time.
  booking_start_timestamp   timestamptz not null,
  booking_end_timestamp     timestamptz not null,

  -- Anti-scam verification: a one-time token emailed to the customer to
  -- confirm the booking. The 2-hour hold expires automatically so unverified
  -- slots free back up.
  verification_token        text unique default encode(gen_random_bytes(32), 'hex'),
  verification_expires_at   timestamptz not null default (now() + interval '2 hours'),
  google_calendar_event_id  text,

  status                    text not null default 'pending_verification'
                              check (status in ('pending_verification', 'confirmed', 'completed', 'canceled')),
  created_at                timestamptz not null default now(),

  constraint booking_end_after_start check (booking_end_timestamp > booking_start_timestamp)
);

-- Range/overlap checks against Google Calendar and other bookings key off
-- this column, so it carries its own index rather than a composite one.
create index idx_appointments_booking_start on appointments (booking_start_timestamp);
create index idx_appointments_status on appointments (status);

-- ────────────────────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────────────────────
alter table services enable row level security;
alter table appointments enable row level security;

-- services: anyone can read the menu
create policy "Anyone can view services"
  on services for select
  using (true);

-- appointments: anyone can submit a booking request
create policy "Anyone can create an appointment"
  on appointments for insert
  with check (true);

-- appointments: reads/updates require either a logged-in Supabase user
-- (auth.role() = 'authenticated') or a custom admin header secret.
--
-- NOTE: In practice, the admin dashboard and /api routes should call
-- Supabase with the SERVICE ROLE key, which bypasses RLS entirely — that's
-- the primary access path. The header-secret check below is a secondary
-- layer only relevant if you ever query appointments directly with the
-- anon/public key (e.g. client-side). Set the real secret via:
--   alter role authenticator set app.admin_secret = 'replace-with-a-long-random-value';
-- then reload the API (Dashboard -> Settings -> API -> "Reload schema").
create policy "Admin can view appointments"
  on appointments for select
  using (
    auth.role() = 'authenticated'
    or coalesce(current_setting('request.headers', true)::json ->> 'x-admin-secret', '')
       = coalesce(current_setting('app.admin_secret', true), '')
  );

create policy "Admin can update appointments"
  on appointments for update
  using (
    auth.role() = 'authenticated'
    or coalesce(current_setting('request.headers', true)::json ->> 'x-admin-secret', '')
       = coalesce(current_setting('app.admin_secret', true), '')
  );
