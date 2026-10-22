import { NextResponse } from "next/server";
import { getSession } from "@/lib/admin/auth";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase-admin";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "File exceeds maximum size of 25 MB." },
      { status: 400 }
    );
  }

  const dept = (formData.get("dept") as string) || "general";
  const level = (formData.get("level") as string) || "all";
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${dept}/${level}/${Date.now()}-${cleanName}`;

  const fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

  // Fallback if Supabase is not yet connected
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      url: `/downloads/mock-${cleanName}`,
      fileName: file.name,
      fileSize,
    });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin()
      .storage.from("academic-resources")
      .upload(path, buffer, {
        contentType: file.type || "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json({ ok: false, error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin()
      .storage.from("academic-resources")
      .getPublicUrl(path);

    return NextResponse.json({
      ok: true,
      url: publicUrlData.publicUrl,
      fileName: file.name,
      fileSize,
      path,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ ok: false, error: "Server upload failed" }, { status: 500 });
  }
}
