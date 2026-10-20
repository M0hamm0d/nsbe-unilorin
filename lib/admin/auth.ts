import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { can } from "./permissions";
import { SESSION_COOKIE, verifySession } from "./session";
import type { Area } from "./types";

export async function getSession() {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Use at the top of every admin page. The middleware is the first gate; this is the second. */
export async function guard(area: Area) {
  const session = await requireSession();
  return { session, allowed: can(session.role, area) };
}
