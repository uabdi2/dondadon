// Gates every /admin route behind the admin_session cookie set by
// /api/admin/login. Missing or wrong cookie value -> redirect to /login.

import { NextResponse } from "next/server";

export function middleware(request) {
  const session = request.cookies.get("admin_session")?.value;

  if (session !== "authenticated") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
