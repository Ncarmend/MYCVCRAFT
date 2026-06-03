/**
 * POST /api/cv/photo
 * Accepts multipart/form-data { photo: File }
 * Uploads to Supabase Storage bucket "cv-photos" and returns the public URL.
 * Uses the service-role key so it can create the bucket if it doesn't exist.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const BUCKET = "cv-photos";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/** Admin client that bypasses RLS — server-side only, never sent to the browser. */
function adminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated
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

    const admin = adminClient();
    if (!admin) {
      return NextResponse.json(
        { error: "Photo storage is not configured. Add SUPABASE_SERVICE_ROLE_KEY to your environment variables, or create the 'cv-photos' bucket manually in the Supabase dashboard.", code: "NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    // Ensure bucket exists (idempotent — does nothing if it already exists)
    const { data: buckets } = await admin.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === BUCKET);
    if (!bucketExists) {
      const { error: createErr } = await admin.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: MAX_BYTES,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      });
      if (createErr && !createErr.message.includes("already exists")) {
        return NextResponse.json({ error: `Could not create storage bucket: ${createErr.message}` }, { status: 500 });
      }
    }

    // Upload the file
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { data, error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: true });

    if (uploadError || !data)
      return NextResponse.json({ error: uploadError?.message ?? "Upload failed" }, { status: 500 });

    const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(data.path);
    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("[POST /api/cv/photo]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
