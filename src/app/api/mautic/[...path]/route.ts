import { NextRequest } from "next/server";

const MAUTIC_ORIGIN = (process.env.MAUTIC_BASE_URL ?? "https://mautic.liqentech.com").replace(/\/$/, "");
const MAUTIC_HOST = new URL(MAUTIC_ORIGIN).host;

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxyMauticRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const upstreamPath = path.join("/");
  const upstreamUrl = new URL(`${MAUTIC_ORIGIN}/${upstreamPath}`);
  upstreamUrl.search = request.nextUrl.search;

  const requestHeaders = new Headers();

  const forwardedHeaderNames = [
    "accept",
    "accept-language",
    "referer",
    "user-agent",
    "x-forwarded-for",
    "x-forwarded-host",
    "x-forwarded-proto",
    "x-real-ip",
  ];

  for (const headerName of forwardedHeaderNames) {
    const headerValue = request.headers.get(headerName);
    if (headerValue) {
      requestHeaders.set(headerName, headerValue);
    }
  }

  requestHeaders.set("origin", request.nextUrl.origin);

  const contentType = request.headers.get("content-type");
  if (contentType) {
    requestHeaders.set("content-type", contentType);
  }

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers: requestHeaders,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const upstreamContentType = upstreamResponse.headers.get("content-type");
  if (upstreamContentType) {
    responseHeaders.set("content-type", upstreamContentType);
  }

  if (upstreamPath === "mtc.js") {
    const script = await upstreamResponse.text();
    const proxyOrigin = `${request.nextUrl.origin}/api/mautic`;
    const proxiedScript = script
      .replaceAll(MAUTIC_ORIGIN, proxyOrigin)
      .replaceAll(`http://${MAUTIC_HOST}`, proxyOrigin)
      .replaceAll(`(l.protocol=='https:'?'https:':'https:')+'//${MAUTIC_HOST}`, `'${proxyOrigin}`);

    return new Response(proxiedScript, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyMauticRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyMauticRequest(request, context);
}
