import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const username = process.env.ANALYTICS_USERNAME;
  const password = process.env.ANALYTICS_PASSWORD;

  if (!username || !password) {
    return new NextResponse("Analytics access is not configured.", { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const [providedUsername, providedPassword] = decodeBasicAuth(auth);
    if (providedUsername === username && providedPassword === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="LiqenTech Analytics"',
    },
  });
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
  matcher: ["/analytics/:path*"],
};
