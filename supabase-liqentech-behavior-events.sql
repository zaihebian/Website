create table if not exists public.liqentech_behavior_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  site_source text not null default 'liqentech',
  type text not null,
  visitor_id text,
  session_id text,
  page_url text,
  page_path text,
  referrer text,
  section text,
  target text,
  value text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  metadata_json jsonb,
  user_agent text,
  ip_hint text
);

create index if not exists liqentech_behavior_events_created_at_idx
  on public.liqentech_behavior_events (created_at desc);

create index if not exists liqentech_behavior_events_type_idx
  on public.liqentech_behavior_events (type);

create index if not exists liqentech_behavior_events_visitor_id_idx
  on public.liqentech_behavior_events (visitor_id);

create index if not exists liqentech_behavior_events_utm_source_idx
  on public.liqentech_behavior_events (utm_source);

alter table public.liqentech_behavior_events enable row level security;

create table if not exists public.liqentech_lead_submissions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  site_source text not null default 'liqentech',
  visitor_id text,
  session_id text,
  name text,
  email text not null,
  company text,
  query text,
  page_url text,
  page_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  max_scroll_depth integer,
  clicked_targets text[],
  viewed_sections text[],
  user_agent text,
  ip_hint text
);

create index if not exists liqentech_lead_submissions_created_at_idx
  on public.liqentech_lead_submissions (created_at desc);

create index if not exists liqentech_lead_submissions_email_idx
  on public.liqentech_lead_submissions (email);

create index if not exists liqentech_lead_submissions_utm_source_idx
  on public.liqentech_lead_submissions (utm_source);

alter table public.liqentech_lead_submissions enable row level security;

-- The Next.js server writes with the Supabase service role key.
-- Do not expose the service role key in browser/client code.
