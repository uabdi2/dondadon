// POST /api/admin/login
//
// Lightweight, dependency-free admin auth: a single shared password checked
// against process.env.ADMIN_PASSWORD. On success, sets an HTTP-only session
// cookie that middleware.js checks to gate everything under /admin.

import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Constant-time compare so a wrong guess can't be narrowed down by response
// timing. Both buffers are padded to equal length before comparing.
function passwordsMatch(a, b) {
  const bufA = Buffer.from(a || "", "utf8");
  const bufB = Buffer.from(b || "", "utf8");
  const maxLength = Math.max(bufA.length, bufB.length, 1);
  const paddedA = Buffer.alloc(maxLength);
  const paddedB = Buffer.alloc(maxLength);
  bufA.copy(paddedA);
  bufB.copy(paddedB);
  return bufA.length === bufB.length && timingSafeEqual(paddedA, paddedB);
}

export async function POST(request) {
  let password;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !passwordsMatch(password, adminPassword)) {
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
