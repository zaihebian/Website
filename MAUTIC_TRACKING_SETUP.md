# Mautic Tracking Setup Notes

## What Usually Works

For a normal public Mautic domain, use Mautic's official tracking snippet directly in the site's global layout or document head.

The usual snippet:

```html
<script>
(function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n;
w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),
m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://your-mautic-domain.com/mtc.js','mt');

mt('send', 'pageview');
</script>
```

That is the preferred setup when `https://your-mautic-domain.com/mtc.js` returns real JavaScript directly to browsers.

## What Went Wrong Here

This site originally used a free ngrok URL:

```text
https://elated-unbutton-scuff.ngrok-free.dev/mtc.js
```

Browser requests to free ngrok domains can receive an ngrok warning/interstitial HTML page instead of JavaScript. A normal `<script src="...">` request cannot send the `ngrok-skip-browser-warning` header, so Mautic's tracking script did not actually run for visitors.

What made this case unusual was ngrok, not Mautic. Free ngrok puts a browser warning in front of requests, so the browser tried to load HTML instead of JavaScript. A real VPS domain will return the actual `mtc.js`, so tracking is straightforward.

The clue was this Mautic response:

```json
{
  "success": 1,
  "id": 0,
  "sid": null,
  "device_id": null,
  "events": []
}
```

`success: 1` means the event reached Mautic, but `id: 0` and `device_id: null` mean no visitor/contact was created.

## Correct Approach For ngrok-backed Mautic

If the Mautic instance is behind free ngrok, proxy Mautic through the website backend instead of loading ngrok directly in the browser.

In this Next.js project, the browser loads:

```text
/api/mautic/mtc.js
```

The Next API route then fetches:

```text
https://elated-unbutton-scuff.ngrok-free.dev/mtc.js
```

with:

```text
ngrok-skip-browser-warning: true
```

The proxy also rewrites Mautic's internal URLs so event tracking, contact lookup, and tracking pixels stay on the website domain:

```text
/api/mautic/mtc/event
/api/mautic/mtc
/api/mautic/mtracking.gif
```

It also forwards visitor headers such as `user-agent`, `referer`, `accept-language`, and forwarding headers so Mautic sees a real visitor-like request rather than a generic backend request.

## How To Verify

1. Visit the website in a fresh/private browser window.
2. In ngrok inspect or server logs, confirm:

```text
GET /mtc.js
POST /mtc/event 200 OK
```

3. Check the `POST /mtc/event` response.

Good sign:

```json
{
  "success": 1,
  "id": 123,
  "device_id": "..."
}
```

Bad sign:

```json
{
  "success": 1,
  "id": 0,
  "device_id": null
}
```

4. In Mautic, check anonymous contacts with:

```text
is:anonymous
```

## Recommendation

For production, use a real public Mautic domain or subdomain instead of free ngrok, for example:

```text
https://mautic.example.com
```

Then use the official Mautic snippet directly and remove the proxy. The proxy approach is mainly for ngrok/free-tunnel situations where browser requests are blocked by the ngrok warning page.
