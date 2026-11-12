# Mautic tracking — how this site actually wires it

> This file was rewritten to match the code. The previous version documented an
> ngrok-era setup (including an `ngrok-skip-browser-warning` header the proxy never
> sent) and described behaviour that no longer exists.

## What the browser loads

`src/app/layout.tsx` injects Mautic's official loader with a **same-origin** script
URL, so ad blockers and cross-origin restrictions never see the marketing host:

```html
<script>
  (function (w, d, t, u, n, a, m) { … })(window, document, "script", "/api/mautic/mtc.js", "mt");
  mt("send", "pageview");
</script>
```

`ConsultationModal` then calls `mt("send", "pageview", { email, firstname, … })` and
`mt("send", "event", …)` before submitting the form, which lets Mautic's own cookie
(`mtc_id`) get attached to the enquiry.

## What the proxy does

`src/app/api/mautic/[...path]/route.ts` forwards to `MAUTIC_BASE_URL`:

| Aspect | Behaviour |
|---|---|
| Allowed paths | `mtc.js`, `mtc`, `mtc/event`, `mtracking.gif` — anything else returns **404** (no admin relay) |
| Forwarded headers | `accept`, `accept-language`, `referer`, `user-agent`, `x-forwarded-for`, `x-forwarded-host`, `x-forwarded-proto`, `x-real-ip`, plus `origin` and `content-type` |
| Extra headers | **None.** There is no `ngrok-skip-browser-warning` header in the code |
| Timeout | 8 s (`AbortSignal.timeout`), after which the route answers **502** `{"error":"Mautic upstream unavailable"}` |
| `mtc.js` handling | Rewrites the origin to `/api/mautic` so tracking calls stay same-origin; refuses to rewrite an HTML error page; serves it with `cache-control: public, max-age=300` |
| Failures | Logged and answered with 502 — no unhandled exception, no request hang |

## Server-side lead sync

`src/lib/mautic.ts` writes the contact with the service credentials:

1. `GET /api/contacts?search=email:<address>` — reuse the contact when one exists.
2. `PATCH /api/contacts/{id}/edit` or `POST /api/contacts/new` — email, name, company.
3. `POST /api/contacts/{id}/points/plus/{points}` — lead score, plus tags:

```
site:liqentech, liqentech-lead, landing-form-submit
+ high-scroll-depth      (scroll ≥ 75%)
+ clicked-consultation-cta (hero/contact CTA clicked)
+ viewed-systems / viewed-why-us
+ submitted-message
```

Scoring: 50 base, +5 ≥50% scroll, +10 ≥75%, +5 =100%, +15 high-intent click,
+10 relevant section viewed, +10 message left (maximum 105).

Every call is bounded by `MAUTIC_TIMEOUT_MS` (default 5 s); a timeout is reported as
`Mautic request timed out after Nms` and never blocks the visitor's submission.

## Diagnosing the current production issue

`mautic.liqentech.com` (Hetzner, Caddy) was returning `TLS alert 80` for every SNI,
so the proxy answered 502 and `sinks.mautic` was false. Checks:

```bash
# 1. TLS handshake + certificate
openssl s_client -connect mautic.liqentech.com:443 -servername mautic.liqentech.com </dev/null | head -20

# 2. On the server: ACME / certificate state
sudo journalctl -u caddy --since "1 hour ago" | tail -50

# 3. Through the site
curl -s -o /dev/null -w "%{http_code}\n" https://liqentech.com/api/mautic/mtc.js   # 200 = recovered
```

While the host is broken, the site degrades as designed: leads are stored in
Supabase, `sinks.mautic` is false, and the visitor is not shown a false success page
when no sink accepted the submission.

## Verifying tracking locally

```bash
# fleet: mock Mautic on 4010, an instance pointed at it on 3001
node shots/scripts/mock-mautic.mjs
PORT=3001 MAUTIC_BASE_URL=http://127.0.0.1:4010 MAUTIC_USERNAME=mock MAUTIC_PASSWORD=mock npm run start
node shots/scripts/verify-behavior-events.mjs   # 25 assertions incl. Mautic sync
```

The mock logs every call to `shots/verify/logs/mautic-mock.log`, so you can confirm
the contact creation, tags and points without a real Mautic instance.
