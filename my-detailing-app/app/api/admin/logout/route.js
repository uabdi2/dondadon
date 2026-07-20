// POST /api/admin/logout
//
// Clears the admin_session cookie set by /api/admin/login.

import { NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
