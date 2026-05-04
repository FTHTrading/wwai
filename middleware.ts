import { NextResponse, type NextRequest } from "next/server";

/**
 * Server-side demo access gate.
 *
 * Protects operator-only surfaces by requiring a valid `wwai_demo_access`
 * cookie. The cookie is set by /demo-access after the visitor submits the
 * shared `DEMO_ACCESS_CODE` (server-only env var).
 *
 * NOTE: This is demo gating, NOT production auth. Replace with real
 * SSO/RBAC before any live customer data flows through these routes.
 */

const PROTECTED_PREFIXES = [
  "/admin",
  "/billing",
  "/analytics",
  "/settings/integrations",
  "/launch",
];

const COOKIE_NAME = "wwai_demo_access";
const COOKIE_VALUE = "ok";

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(COOKIE_NAME);
  if (cookie?.value === COOKIE_VALUE) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/demo-access";
  url.search = `?from=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/billing/:path*",
    "/analytics/:path*",
    "/settings/integrations/:path*",
    "/launch/:path*",
  ],
};
