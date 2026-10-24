import { NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/admin/mock-users";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/admin/session";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase-admin";
import { verifyPassword } from "@/lib/admin/password";
import type { Role } from "@/lib/admin/types";

// Constant-time string compare so response time doesn't leak how much of a guess was right
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ ok: false, message: "Enter your email and password." }, { status: 400 });
  }

  // 1. Check Supabase database users
  if (isSupabaseConfigured()) {
    try {
      const { data: dbUser } = await supabaseAdmin()
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (dbUser) {
        if (dbUser.status === "invited") {
          return NextResponse.json(
            { ok: false, message: "Your account request has been submitted and is pending administrator approval." },
            { status: 403 }
          );
        }

        if (dbUser.status === "revoked") {
          return NextResponse.json(
            { ok: false, message: "Your admin dashboard access has been revoked." },
            { status: 403 }
          );
        }

        if (dbUser.status === "active") {
          const passOk = verifyPassword(password, dbUser.password_hash);
          if (!passOk) {
            return NextResponse.json(
              { ok: false, message: "That email and password don’t match an active admin account." },
              { status: 401 }
            );
          }

          // Update last_active
          const nowStr = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          await supabaseAdmin()
            .from("admin_users")
            .update({ last_active: nowStr })
            .eq("id", dbUser.id);

          const token = await signSession({
            sub: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: (dbUser.role as Role) || "editor",
            exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
          });

          const res = NextResponse.json({ ok: true });
          res.cookies.set(SESSION_COOKIE, token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: SESSION_MAX_AGE,
          });
          return res;
        }
      }
    } catch (err) {
      console.error("Database admin login error:", err);
      // Fall through to demo user check
    }
  }

  // 2. Demo accounts fallback (e.g. admin@nsbe.test)
  const expected = process.env.ADMIN_DEMO_PASSWORD ?? "nsbe-demo";
  const user = DEMO_USERS.find((u) => u.email === email);
  const valid = !!user && user.status === "active" && safeEqual(password, expected);

  // Same message for every failure so the form never reveals which emails exist
  if (!valid || !user) {
    return NextResponse.json(
      { ok: false, message: "That email and password don’t match an active admin account." },
      { status: 401 }
    );
  }

  const token = await signSession({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
