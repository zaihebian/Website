import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Only the assets the browser actually needs may be relayed. Anything else on the
// marketing host (admin UI, Mautic segment links, ...) stays private.
const ALLOWED_PATHS = new Set(["mtc.js", "mtc", "mtc/event", "mtracking.gif"]);
const UPSTREAM_TIMEOUT_MS = 8000;
const FORWARDED_HEADERS = [
  "accept",
  "accept-language",
  "referer",
  "user-agent",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-real-ip",
];

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function mauticOrigin() {
  return (process.env.MAUTIC_BASE_URL ?? "https://mautic.liqentech.com").replace(/\/$/, "");
}

function errorResponse(status: number, error: string) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function proxyMauticRequest(request: NextRequest, context: RouteContext) {
  let upstreamPath = "";

  try {
    const { path } = await context.params;
    upstreamPath = path.join("/");

    if (!ALLOWED_PATHS.has(upstreamPath)) {
      return errorResponse(404, "This Mautic path is not proxied");
    }

    const origin = mauticOrigin();
    let host: string;
    try {
      host = new URL(origin).host;
    } catch {
      console.error("[mautic-proxy] MAUTIC_BASE_URL is not a valid URL", { origin });
      return errorResponse(502, "Mautic upstream is not configured correctly");
    }

    const upstreamUrl = new URL(`${origin}/${upstreamPath}`);
    upstreamUrl.search = request.nextUrl.search;

    const requestHeaders = new Headers();
    for (const headerName of FORWARDED_HEADERS) {
      const headerValue = request.headers.get(headerName);
      if (headerValue) requestHeaders.set(headerName, headerValue);
    }
    requestHeaders.set("origin", request.nextUrl.origin);

    const contentType = request.headers.get("content-type");
    if (contentType) requestHeaders.set("content-type", contentType);

    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers: requestHeaders,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const responseHeaders = new Headers();
    const upstreamContentType = upstreamResponse.headers.get("content-type");
    if (upstreamContentType) responseHeaders.set("content-type", upstreamContentType);

    if (upstreamPath === "mtc.js") {
      const script = await upstreamResponse.text();
      // Never rewrite an error page (or an HTML interstitial) into a "script".
      if (!upstreamResponse.ok || /^\s*</.test(script)) {
        console.error("[mautic-proxy] mtc.js did not return JavaScript", {
          status: upstreamResponse.status,
          contentType: upstreamContentType,
        });
        return errorResponse(502, "Mautic tracking script is unavailable");
      }

      const proxyOrigin = `${request.nextUrl.origin}/api/mautic`;
      const proxiedScript = script
        .replaceAll(origin, proxyOrigin)
        .replaceAll(`http://${host}`, proxyOrigin)
        .replaceAll(`(l.protocol=='https:'?'https:':'https:')+'//${host}`, `'${proxyOrigin}'`);

      responseHeaders.set("cache-control", "public, max-age=300");
      return new Response(proxiedScript, { status: upstreamResponse.status, headers: responseHeaders });
    }

    return new Response(upstreamResponse.body, { status: upstreamResponse.status, headers: responseHeaders });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    const reason = name === "TimeoutError" || name === "AbortError" ? "timed out" : "failed";
    console.error(`[mautic-proxy] ${upstreamPath || "request"} ${reason}`, error);
    return errorResponse(502, "Mautic upstream unavailable");
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyMauticRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyMauticRequest(request, context);
}
