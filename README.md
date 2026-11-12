# LiqenTech website

Marketing site for LiqenTech (Athlone, Ireland): a Next.js 15 App Router project with
a WebGL water-ripple background, a consultation form, a Mautic-integrated lead
pipeline, and a self-hosted analytics dashboard.

## Stack

- Next.js 15.5 (App Router, Turbopack builds) · React 19 · TypeScript
- Tailwind v4 with a light "water" theme (`src/app/globals.css`)
- three.js shader background (`src/components/FluidScene.tsx`, loaded lazily)
- framer-motion for entrance/reveal animations
- Supabase (behaviour events + leads) and Mautic (contacts, tags, lead scoring)

## Local development

```bash
npm ci
cp .env.example .env.local   # optional: the site runs without credentials, degraded
npm run build && npm run start   # http://localhost:3000
# or
npm run dev
```

Without credentials: tracking events return `stored:false`, the consultation form
shows an honest error instead of a fake success page, and `/analytics` reports that
Supabase is not configured. See `DEPLOYMENT.md` for the full variable list.

## Routes

| Route | Purpose |
|---|---|
| `/` | Marketing page: hero, systems, statement, why-us, contact |
| `/careers` | Open roles with `JobPosting` structured data |
| `/success` | Post-submission confirmation (noindex) |
| `/integration` | Integration & RPA landing page (Power Automate, WhatsApp Cloud API, legacy systems) |
| `/privacy` | Privacy policy (data collected, retention, rights) |
| `/analytics` | Visitor dashboard, Basic Auth via `ANALYTICS_*` |
| `/admin` | Lead maintenance backend, Basic Auth via `ANALYTICS_*` (see below) |
| `/api/behavior-events` | Public tracking endpoint (rate limited, sanitised) |
| `/api/mautic/[...path]` | Same-origin proxy for `mtc.js` / `mtc/event` / tracking pixel |
| `/api/health` | Secrets-free readiness probe |

## Admin backend

`/admin` is a small internal CRM for the records the tracking pipeline produces —
no separate login: it reuses the `/analytics` Basic Auth credentials.

| Page | What it does |
|---|---|
| `/admin` | Lead list with search (email/name/company), status filter, 7/30/90-day window, pagination, and summary cards (leads/open/new/won) |
| `/admin/leads/<id>` | Full enquiry, tracking attributes, behaviour timeline for the visitor, status + internal notes form, Mautic snapshot (sync status, contact id, points, tags), and a delete action that also removes the visitor's behaviour rows (GDPR erasure) |
| `/admin/events` | Raw event stream with type/window filters and pagination |
| `/admin/export` | CSV of the current lead filter selection (≤5000 rows) |

Writes go through server actions that verify the request Origin before touching data.
Mautic itself is not queried by the admin: every submission stores a snapshot of what
was (or would be) sent to Mautic, so the backend stays useful while the marketing host
is unreachable.

Two SQL files are required: `supabase-liqentech-behavior-events.sql` (base tables) and
`supabase-liqentech-admin.sql` (status/notes/updated_at/mautic_* columns, constraints
and indexes).

## Tracking pipeline

`VisitorTracker` posts behaviour events (page views, scroll milestones, section
views, clicks) to `/api/behavior-events`. The route writes to Supabase and, for form
submissions, syncs the contact to Mautic — three independent sinks with an honest
failure contract (see `MAUTIC_TRACKING_SETUP.md` and `DEPLOYMENT.md`).

A consultation submission is only treated as delivered when at least one sink
accepted it; otherwise the modal keeps the visitor's input and offers a retry.

## Synthetic traffic

`scripts/simulate-visitors.mjs` drives a headless browser through realistic journeys
(scrolls, clicks, optional form submissions). It targets `http://localhost:3000` by
default; remote targets require an explicit `--allow-production` and are marked as
synthetic so the dashboard can hide them.

```bash
npm run simulate:visitors -- --visitors 5
npm run simulate:visitors -- --visitors 5 --headed
npm run simulate:visitors -- --url https://liqentech.com --visitors 20 --allow-production
```

## Verification

End-to-end suites live in `shots/scripts` (outside the repo tree, gitignored) and are
wired as npm scripts:

```bash
npm test                   # 42 unit tests (Vitest): scoring, payload sanitising, delivery, storage
npm run verify:api         # 25 assertions: sink matrix, idempotency, duplicates
npm run verify:ui          # 14 assertions: honest failure + success paths (Playwright)
npm run verify:hardening   # 24 assertions: rate limits, origin, headers, privacy
npm run verify:batch4      # 11 assertions: nav a11y, asset weights
npm run verify:tracking    # session reuse + time-on-page flush
npm run verify:webgl       # WebGL-disabled fallback
npm run verify:admin       # 18 assertions: admin auth, list/search, edit, delete, CSV
npm run check:supabase     # 9 checks against a REAL Supabase project (self-cleaning round-trip)
npm run db:apply -- supabase-liqentech-admin.sql   # apply a SQL migration via DATABASE_URL (no psql needed)
node scripts/setup-staging.mjs --org <id>   # create the staging project + run SQL + write .env.local (needs SUPABASE_ACCESS_TOKEN)
npm run check:deployment -- --base https://<url>   # 13 post-deploy smoke checks (health, headers, auth, Mautic)
```

They expect the local fleet described in `shots/scripts/verify-env.ps1` (mock Mautic
on 4010, mock Supabase on 4020, app instances on 3000–3004).

## Deployment

See `DEPLOYMENT.md`. Health check: `GET /api/health`.
Staging without Docker is documented in `DEPLOYMENT.md` §7 (dedicated staging project +
`npm run check:supabase`); the production project is for smoke checks only. Using the cloud database from a local machine is documented in `DEPLOYMENT.md` §8 (synthetic rows are hidden in `/admin`, and `SUPABASE_ENV_LABEL` shows which database you are on).
