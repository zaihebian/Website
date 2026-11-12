import { NextRequest, NextResponse } from "next/server";
import { isRateLimited, recordFailure } from "@/lib/rateLimit";

const AUTH_ATTEMPT_LIMIT = 10;
const AUTH_ATTEMPT_WINDOW_MS = 60_000;

export async function middleware(request: NextRequest) {
  const username = process.env.ANALYTICS_USERNAME;
  const password = process.env.ANALYTICS_PASSWORD;

  if (!username || !password) {
    return new NextResponse("Analytics access is not configured.", { status: 503 });
  }

  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown";
  const attemptKey = `analytics-auth:${clientIp}`;
  const quota = isRateLimited(attemptKey, AUTH_ATTEMPT_LIMIT);
  if (!quota.allowed) {
    return new NextResponse("Too many authentication attempts.", {
      status: 429,
      headers: { "retry-after": String(quota.retryAfterSeconds) },
    });
  }

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const [providedUsername, providedPassword] = decodeBasicAuth(auth);
    // Compare digests instead of raw strings: Edge has no timingSafeEqual, and
    // hashing first removes the length-dependent timing signal.
    const [providedUserDigest, expectedUserDigest, providedPassDigest, expectedPassDigest] = await Promise.all([
      digest(providedUsername),
      digest(username),
      digest(providedPassword),
      digest(password),
    ]);

    if (
      constantTimeEqual(providedUserDigest, expectedUserDigest) &&
      constantTimeEqual(providedPassDigest, expectedPassDigest)
    ) {
      return NextResponse.next();
    }
  }

  // Only failures consume the brute-force budget.
  recordFailure(attemptKey, AUTH_ATTEMPT_WINDOW_MS);

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="LiqenTech Analytics"',
    },
  });
}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return new Uint8Array(hash);
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a[index] ^ b[index];
  }
  return difference === 0;
}

function decodeBasicAuth(authHeader: string) {
  try {
    const decoded = atob(authHeader.slice("Basic ".length));
    const separator = decoded.indexOf(":");
    if (separator === -1) return [];
    return [decoded.slice(0, separator), decoded.slice(separator + 1)];
  } catch {
    return [];
  }
}

export const config = {
  matcher: ["/analytics/:path*", "/admin/:path*"],
};
