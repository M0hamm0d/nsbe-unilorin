import { NextResponse } from "next/server";
import { getSession } from "@/lib/admin/auth";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase-admin";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

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
      { ok: false, error: "Image exceeds maximum size of 5 MB." },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { ok: false, error: "Only image files (JPG, PNG, WebP) are accepted." },
      { status: 400 }
    );
  }

  const folder = (formData.get("folder") as string) || "leaders";
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now()}-${cleanName}`;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      url: `/images/${cleanName}`,
      name: file.name,
    });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin()
      .storage.from("media")
      .upload(path, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase media upload error:", uploadError);
      return NextResponse.json({ ok: false, error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin()
      .storage.from("media")
      .getPublicUrl(path);

    return NextResponse.json({
      ok: true,
      url: publicUrlData.publicUrl,
      name: file.name,
      path,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ ok: false, error: "Server upload failed" }, { status: 500 });
  }
}
