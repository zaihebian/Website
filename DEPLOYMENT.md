# LiqenTech site — deployment guide

Next.js 15 (App Router) on Vercel, with Supabase as the analytics store and a
self-hosted Mautic instance for marketing automation. This document replaces the
old "no environment variables required" guide: the site **needs** the variables
below before `/analytics` and the tracking pipeline fully work.

## 1. Required environment variables

| Variable | Required | What breaks without it |
|---|---|---|
| `SUPABASE_URL` | yes | Behaviour events and leads are not stored; the dashboard shows "Supabase is not configured" |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Same as above (server-side only — never expose it to the browser) |
| `MAUTIC_BASE_URL` | yes | `/api/mautic/*` cannot proxy the tracking script; contact sync is skipped |
| `MAUTIC_USERNAME` | yes | No contact creation, tagging or lead scoring |
| `MAUTIC_PASSWORD` | yes | Same as above |
| `ANALYTICS_USERNAME` | yes | `/analytics` answers 503 instead of asking for Basic Auth |
| `ANALYTICS_PASSWORD` | yes | Same as above |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical URLs and OG tags default to `https://liqentech.com`; set it on preview deployments |
| `MAUTIC_TIMEOUT_MS` | optional | Defaults to 5000 ms per Mautic API call |
| `BEHAVIOR_RATE_LIMIT` | optional | Defaults to 120 events/minute per client IP |
| `BEHAVIOR_LEAD_RATE_LIMIT` | optional | Defaults to 30 lead submissions/hour per client IP |

`NEXT_PUBLIC_SITE_URL` is inlined at build time; every other variable is read at
runtime. `ANALYTICS_USERNAME` / `ANALYTICS_PASSWORD` are read by the middleware on
every request, so rotating them only needs a redeploy, not a rebuild.

## 2. Database

Run `supabase-liqentech-behavior-events.sql` in the Supabase SQL editor. It creates
`liqentech_behavior_events` and `liqentech_lead_submissions` with indexes and RLS
enabled (the service role key bypasses RLS; nothing else should write to them).

Then run `supabase-liqentech-admin.sql`. It adds the columns the `/admin` backend
maintains (`status`, `notes`, `updated_at`, `mautic_contact_id`,
`mautic_sync_status`, `mautic_tags`, `mautic_points`), the check constraints for the
allowed status values, and the listing indexes. Both files are idempotent.

Two settings matter for the dashboard:

- **Project Settings → API → Max Rows**: the default 1000 silently caps every
  response. Raise it (e.g. 50000) or the totals are wrong for busy periods.
- **Retention**: the dashboard reads a rolling window (7/30/90 days). Old rows can
  be pruned with a scheduled `delete from … where created_at < now() - interval '12 months'`.

## 3. Deploy on Vercel

1. Import the repository; the framework preset is Next.js.
2. Add every variable from section 1 to **Production** (and **Preview**, with
   `NEXT_PUBLIC_SITE_URL` pointing at the preview domain).
3. Deploy. `vercel.json` only declares the framework; build settings come from
   `package.json` (`next build`).

## 4. Verify a deployment

```bash
curl -s https://<domain>/api/health
# {"ok":true,"ready":true,"supabaseConfigured":true,"mauticConfigured":true,"analyticsAuthConfigured":true}

curl -sI https://<domain>/ | grep -iE "x-content-type|referrer-policy|x-frame|permissions-policy"
curl -s  https://<domain>/robots.txt
```

Then, in a private window:

1. Open the site and submit the consultation form with an address you can check.
2. Confirm the contact exists in Mautic with the `liqentech-lead` tag and points.
3. Confirm a row exists in `liqentech_lead_submissions`.
4. Open `/analytics` (Basic Auth) and confirm the lead appears in the chosen window.
5. Open `/admin` (same Basic Auth) — the lead should be listed as `New` with a
   `Mautic synced` or `Mautic skipped` badge, and the CSV export should contain it.

If the form shows "We couldn't send your request", check `/api/health` first: a
false `mauticConfigured` or `supabaseConfigured` explains it.

## 5. Mautic notes

- The browser loads `/api/mautic/mtc.js`, which the Next route proxies to
  `MAUTIC_BASE_URL`. Only `mtc.js`, `mtc`, `mtc/event` and `mtracking.gif` are
  proxied; anything else returns 404.
- A TLS problem on the Mautic host surfaces as `502 Mautic upstream unavailable`
  from the proxy and as `sinks.mautic:false` in the tracking response. The site
  keeps working; leads are stored in Supabase only.
- `MAUTIC_TRACKING_SETUP.md` documents the tracking specifics.

## 6. Local development

```bash
npm ci
cp .env.example .env.local   # fill in what you have; missing values degrade gracefully
npm run build && npm run start
```

Without credentials the site still runs: tracking events return `stored:false`,
consultation submissions show an honest error instead of a fake success page, and
`/analytics` reports that Supabase is not configured.

## 7. Staging setup without Docker (recommended for this project)

Local Supabase needs Docker Desktop + WSL2. When that is not available, use a
**separate free staging project** and keep the existing mock for fast tests:

0. Fast path (one command, needs a Management API token from Dashboard → Account → Access Tokens):

   ```bash
   $env:SUPABASE_ACCESS_TOKEN="sbp_..."
   node scripts/setup-staging.mjs --org <organization-id>   # creates the project, runs both SQL files, sets Max Rows, writes .env.local, self-checks
   node scripts/setup-staging.mjs --dry-run                 # print the plan without credentials
   ```

1. Manual path: create a new Supabase project (e.g. `liqentech-staging`) — never the production one.
2. In the SQL editor run, in order:
   - `supabase-liqentech-behavior-events.sql` (base tables)
   - `supabase-liqentech-admin.sql` (admin columns, constraints, indexes)
3. Settings → API → **Max Rows**: set `1000` to mimic the hosted default, or higher if
   you want truthful dashboard totals (the code documents this cap).
4. Put the credentials in `.env.local`:

   ```ini
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service_role key>
   ANALYTICS_USERNAME=dev
   ANALYTICS_PASSWORD=dev
   ```

5. Prove the database is wired correctly (creates and removes its own rows):

   ```bash
   npm run check:supabase
   ```

6. Run the app against staging and click around:

   ```bash
   npm run build && npm run start        # http://localhost:3000
   # /  -> scroll, submit a consultation form
   # /analytics (dev:dev) and /admin (dev:dev)
   ```

7. For a deployed environment (Vercel preview or production) use the smoke test:

   ```bash
   npm run check:deployment -- --base https://<preview-url> --user <analytics-user> --pass <analytics-pass>
   # optionally add --with-lead to prove the whole pipeline (posts one synthetic lead;
   # it is marked as synthetic so dashboards hide it — delete it from /admin afterwards)
   ```

Rules of thumb:

- **Production Supabase is for smoke checks only** — no manual test data, no development.
- The `shots/scripts/mock-supabase.mjs` mock stays the fast double for the 142 automated
  assertions (`npm test` + `npm run verify:*`); the staging project is what proves the
  real PostgREST/SQL behaviour.
- Keep staging and production keys in different places; never copy the production
  `service_role` key onto a development machine.

## 8. Using the cloud (production) Supabase from a local machine

This works, but every write from your laptop lands in the real database. Use it only
when a separate staging project is not available, and follow the guardrails below.

Credentials needed (nothing else):

| What | Where to find it |
|---|---|
| `SUPABASE_URL` | Project Settings → API → Project URL (`https://<ref>.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → Project API keys → `service_role` (reveal) |

Put them in `.env.local` (gitignored), plus a label so the UI shows which database you
are using:

```ini
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role>
SUPABASE_ENV_LABEL=production
ANALYTICS_USERNAME=dev
ANALYTICS_PASSWORD=dev
```

Then verify and clean up after yourself:

```bash
npm run check:supabase        # 9 checks; creates and deletes its own rows
npm run check:deployment -- --base http://127.0.0.1:3000 --user dev --pass dev
```

Guardrails that the code already gives you:

- `/admin` shows a `db: production` badge (from `SUPABASE_ENV_LABEL`) so nobody forgets.
- Leads created through the simulator or `--with-lead` are flagged `synthetic`; `/admin`
  hides them by default (`Include test data` shows them) and `/analytics` excludes them.
- `/admin` can delete a lead and all behaviour rows for the same visitor, which is also
  the GDPR erasure path — the only reliable way to remove test data from production.

What you must avoid on a production database: bulk edits, deleting leads you did not
create, and running the simulator without `--with-lead`-style flags that mark rows.
Prefer `@example.com` addresses for any manual test.

If the project has not been migrated yet, run `supabase-liqentech-behavior-events.sql`
and then `supabase-liqentech-admin.sql` in the SQL editor (or give a project-scoped
Management API token and `node scripts/setup-staging.mjs --ref <project-ref>`).

## 9. Known gaps

- The optional `?deep=1` probe on `/api/health` is not implemented.
- Unit tests cover pure helpers only; the HTTP contract is covered by the `verify:*`
  suites (which need the local mock fleet, see `shots/HANDOFF.md`).
