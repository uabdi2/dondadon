# Supabase Schema — Don's Professional Car Detailing

Run this in the Supabase SQL editor (Project → SQL Editor → New query).

## Extensions

```sql
create extension if not exists "pgcrypto"; -- gen_random_uuid()
```

## `services`

The menu of detailing packages. Public, read-only on the site.

```sql
create table services (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  description       text,
  price             numeric(10, 2) not null,
  duration_minutes  integer not null,        -- actual hands-on job time (travel buffer is NOT included here)
  active            boolean not null default true,
  display_order     integer not null default 0,
  created_at        timestamptz not null default now()
);

create index idx_services_active on services (active, display_order);
```

## `appointments`

Every booking request, from first submission through completion.

```sql
create table appointments (
  id                       uuid primary key default gen_random_uuid(),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),

  status                   text not null default 'pending_verification'
                             check (status in ('pending_verification', 'confirmed', 'completed', 'canceled')),

  service_id               uuid not null references services (id),

  -- customer info
  customer_name            text not null,
  customer_email           text not null,
  customer_phone           text not null,
  service_address          text not null,   -- Don travels to the customer
  vehicle_info             text,            -- year/make/model/color
  notes                    text,

  -- scheduling
  appointment_date         date not null,        -- denormalized for fast slot-query filtering
  start_time               timestamptz not null, -- job start (no buffer applied)
  end_time                 timestamptz not null, -- job end = start + service duration (no buffer applied)

  -- Google Calendar sync (set once an event is created for a confirmed booking)
  google_calendar_event_id text,

  -- anti-no-show / anti-scam email verification loop
  verification_token       uuid not null default gen_random_uuid(),
  verification_expires_at  timestamptz not null default (now() + interval '2 hours')
);

create index idx_appointments_date_status on appointments (appointment_date, status);
create index idx_appointments_verification_token on appointments (verification_token);
create index idx_appointments_pending_cleanup on appointments (status, verification_expires_at)
  where status = 'pending_verification';

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_appointments_updated_at
  before update on appointments
  for each row
  execute function set_updated_at();
```

## Row Level Security

All writes to `appointments` happen server-side (API routes) using the Supabase **service role key**, which bypasses RLS entirely. RLS below is defense-in-depth for the anon/public key, which the browser holds.

```sql
alter table services enable row level security;
alter table appointments enable row level security;

-- Public site can read active services (the menu)
create policy "Public can view active services"
  on services for select
  using (active = true);

-- No public policies on appointments: all reads/writes go through
-- server-side routes using the service_role key (which bypasses RLS).
```

## Notes on the "pending_verification" expiry

There is no cron job required for slot availability to stay accurate: `app/api/slots/route.js` treats a `pending_verification` row as a live hold **only while** `verification_expires_at > now()`. Once it expires, the slot opens back up automatically on the next read — no delete needed.

For admin-dashboard tidiness (optional, not required for correctness), you can periodically flip stale holds to `canceled`:

```sql
update appointments
set status = 'canceled'
where status = 'pending_verification'
  and verification_expires_at < now();
```

This can be wired up later as a Vercel Cron Job (free tier) hitting a small `/api/cron/expire-holds` route if you want the admin dashboard to stop showing dead rows — functionally optional.

## Seed data (optional, for local dev)

```sql
insert into services (name, slug, description, price, duration_minutes, display_order) values
  ('Express Wash & Vacuum', 'express-wash-vacuum', 'Exterior hand wash, wheel clean, full interior vacuum.', 60.00, 45, 1),
  ('Full Interior & Exterior Detail', 'full-detail', 'Complete interior deep clean + exterior wash, wax, and tire shine.', 175.00, 120, 2),
  ('Premium Ceramic Boost', 'premium-ceramic-boost', 'Full detail plus spray ceramic sealant for extended shine and protection.', 250.00, 150, 3);
```
