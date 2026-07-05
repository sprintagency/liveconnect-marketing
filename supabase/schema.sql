-- Contact form submissions for the LiveConnect marketing site.
-- Run once in the Supabase SQL editor (or via the CLI) to provision the table.

create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  org         text,
  event_type  text,
  message     text
);

-- Row Level Security on, with no public policies: the marketing site writes
-- using the service-role key (which bypasses RLS), so no anon access is needed.
alter table public.contact_submissions enable row level security;
