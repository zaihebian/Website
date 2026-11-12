-- LiqenTech admin backend — additional columns used by /admin.
-- Run after supabase-liqentech-behavior-events.sql. Idempotent.

alter table public.liqentech_lead_submissions
  add column if not exists status text not null default 'new',
  add column if not exists notes text,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists mautic_contact_id text,
  add column if not exists mautic_sync_status text not null default 'pending',
  add column if not exists mautic_tags text[],
  add column if not exists mautic_points integer,
  add column if not exists synthetic boolean not null default false;

-- Only the statuses the admin UI offers; keeps bad values out of the table.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'liqentech_lead_submissions_status_check'
  ) then
    alter table public.liqentech_lead_submissions
      add constraint liqentech_lead_submissions_status_check
      check (status in ('new', 'contacted', 'qualified', 'won', 'lost', 'spam'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'liqentech_lead_submissions_mautic_sync_status_check'
  ) then
    alter table public.liqentech_lead_submissions
      add constraint liqentech_lead_submissions_mautic_sync_status_check
      check (mautic_sync_status in ('pending', 'synced', 'failed', 'skipped'));
  end if;
end
$$;

create index if not exists liqentech_lead_submissions_status_idx
  on public.liqentech_lead_submissions (status);

-- Test/simulator rows are flagged so the admin backend can hide them by default.
create index if not exists liqentech_lead_submissions_synthetic_idx
  on public.liqentech_lead_submissions (synthetic);

create index if not exists liqentech_lead_submissions_created_at_id_idx
  on public.liqentech_lead_submissions (created_at desc, id desc);
