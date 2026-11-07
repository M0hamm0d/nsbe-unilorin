import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { normalizeResourceRequest, validateResourceRequest } from "@/lib/validation";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const raw = payload as Record<string, unknown>;

  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const input = normalizeResourceRequest(raw);
  const errors = validateResourceRequest(input);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const { error } = await supabaseAdmin().from("resource_requests").insert({
      full_name: input.fullName,
      email: input.email,
      department: input.department,
      level: input.level,
      phone: input.phone || null,
      resource_type: input.resourceType,
      course_code: input.courseCode || null,
      course_title: input.courseTitle,
      session: input.session || null,
      details: input.details || null,
      consented_at: new Date().toISOString(),
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("resource_requests insert failed", (error as { code?: string })?.code ?? "unknown");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
