import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { normalizeTutorial, validateTutorial } from "@/lib/validation";

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof raw.website === "string" && raw.website.trim() !== "") return NextResponse.json({ ok: true });

  const input = normalizeTutorial(raw);
  const errors = validateTutorial(input);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  try {
    const { error } = await supabaseAdmin().from("tutorial_interest").insert({
      full_name: input.fullName,
      email: input.email,
      department: input.department,
      level: input.level,
      subjects: input.subjects,
      phone: input.phone || null,
      consented_at: new Date().toISOString(),
    });
    if (error && error.code !== "23505") throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("tutorial_interest insert failed", (err as { code?: string })?.code ?? "unknown");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
