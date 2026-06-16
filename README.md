This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Synthetic Visitor Simulation

Use the Playwright visitor simulator to generate realistic browsing sessions that your tracking script can record.

```bash
npm run simulate:visitors
```

Useful options:

```bash
npm run simulate:visitors -- --url https://liqentech.com --visitors 100 --concurrency 5
npm run simulate:visitors -- --url https://liqentech.com --visitors 40 --concurrency 2 --spread-minutes 240
npm run simulate:visitors -- --url https://liqentech.com --visitors 40 --spread-minutes 240 --submit-forms --lead-rate 25
npm run simulate:visitors -- --url http://localhost:3000 --visitors 10 --headed
npm run simulate:visitors -- --submit-forms
```

By default the simulator does not submit consultation forms. It opens the modal, fills fields, scrolls, clicks, visits `/careers`, varies devices/referrers/campaigns, and lets the existing tracking script collect the behavior. Add `--submit-forms` only when you intentionally want conversion/success-page traffic.

Use `--spread-minutes` to distribute visitors randomly over a time window. For example, `--visitors 40 --spread-minutes 240` starts 40 visitors at random times over four hours.

Use `--lead-rate` with `--submit-forms` to control the approximate percentage of visitors who submit the consultation form. For example, `--lead-rate 25` means about 25% of visitors become synthetic leads. Traffic from one machine will use that machine's IP address.

## Mautic And Supabase Behavior Tracking

This site uses the same shared Mautic server pattern as ClinicFlow, with LiqenTech-specific source markers.

Required environment variables:

```bash
MAUTIC_BASE_URL=https://mautic.liqentech.com
MAUTIC_USERNAME=
MAUTIC_PASSWORD=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ANALYTICS_USERNAME=
ANALYTICS_PASSWORD=
```

Create the Supabase tables by running `supabase-liqentech-behavior-events.sql` in the Supabase SQL editor. Events are saved into `liqentech_behavior_events`; consultation submissions are saved into `liqentech_lead_submissions`.

The tracker records `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content` on every event. When there is no campaign URL, events default to the LiqenTech source marker.

The `/analytics` dashboard is protected with Basic Auth. Set `ANALYTICS_USERNAME` and `ANALYTICS_PASSWORD` in deployment before opening it.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
