/**
 * POST /api/cv/photo
 * Accepts multipart/form-data { photo: File }
 * Uploads to Supabase Storage bucket "cv-photos" and returns the public URL.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "cv-photos";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await request.formData();
    const file = form.get("photo") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (!file.type.startsWith("image/"))
      return NextResponse.json({ error: "Only image files are accepted" }, { status: 400 });

    if (file.size > MAX_BYTES)
      return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    // Try to upload; if bucket missing, create it then retry once.
    let uploadError: { message: string } | null = null;
    let uploadPath: string | null = null;

    const first = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,
      upsert: true,
    });

    if (first.error) {
      if (first.error.message.toLowerCase().includes("bucket")) {
        await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: MAX_BYTES });
        const retry = await supabase.storage.from(BUCKET).upload(path, bytes, {
          contentType: file.type,
          upsert: true,
        });
        if (retry.error) { uploadError = retry.error; } else { uploadPath = retry.data.path; }
      } else {
        uploadError = first.error;
      }
    } else {
      uploadPath = first.data.path;
    }

    if (uploadError || !uploadPath)
      return NextResponse.json({ error: uploadError?.message ?? "Upload failed" }, { status: 500 });

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(uploadPath);
    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("[POST /api/cv/photo]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
