import { NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/admin/mock-users";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/admin/session";

// Constant-time string compare so response time doesn't leak how much of a guess was right
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: Request) {
  let body: { email?: unknown; password?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const expected = process.env.ADMIN_DEMO_PASSWORD ?? "nsbe-demo";

  const user = DEMO_USERS.find((u) => u.email === email);
  const valid = !!user && user.status === "active" && safeEqual(password, expected);

  // Same message for every failure so the form never reveals which emails exist
  if (!valid || !user) {
    return NextResponse.json({ ok: false, message: "That email and password don’t match an active admin account." }, { status: 401 });
  }

  const token = await signSession({
    sub: user.id, name: user.name, email: user.email, role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE,
  });
  return res;
}
