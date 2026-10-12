import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Protected: product details + profile pages (cookie presence check; pages re-validate the session).
export function middleware(req: NextRequest) {
  if (!getSessionCookie(req)) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/product/:path*", "/profile/:path*", "/profile"] };
