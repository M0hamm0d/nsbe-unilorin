import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { normalizeJoin, validateJoin } from "@/lib/validation";

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field
  if (typeof raw.website === "string" && raw.website.trim() !== "") return NextResponse.json({ ok: true });

  const input = normalizeJoin(raw);
  const errors = validateJoin(input);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  try {
    const { error } = await supabaseAdmin().from("join_requests").insert({
      full_name: input.fullName,
      email: input.email,
      department: input.department,
      level: input.level,
      phone: input.phone || null,
      interests: input.interests,
      consented_at: new Date().toISOString(),
    });
    // 23505 = duplicate email. Treat as success so we never reveal who has already applied.
    if (error && error.code !== "23505") throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("join_requests insert failed", (err as { code?: string })?.code ?? "unknown"); // no personal data in logs
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
