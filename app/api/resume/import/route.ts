/**
 * POST /api/resume/import
 * Accepts a PDF, DOCX, or TXT file, extracts text, and uses Claude to parse
 * and improve the content into a structured CVFormData object.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAIQuota, aiErrorResponse, AIQuotaError } from "@/lib/aiGuard";
import { parseAndImproveResume } from "@/lib/openai";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    // ── Auth ─────────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await checkAIQuota(user.id);

    // ── File ─────────────────────────────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5 MB." },
        { status: 413 },
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const mimeOk =
      file.type === "application/pdf" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "text/plain" ||
      file.type === "application/octet-stream"; // browsers sometimes send this for .docx

    if (!mimeOk && !["pdf", "docx", "txt"].includes(ext)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOCX, or TXT." },
        { status: 415 },
      );
    }

    // ── Text extraction ───────────────────────────────────────────────────────
    let text = "";
    const buffer = Buffer.from(await file.arrayBuffer());

    if (ext === "pdf" || file.type === "application/pdf") {
      // pdf-parse ships CJS; cast through unknown so TS doesn't trip on .default
      const pdfParse = (await import("pdf-parse") as unknown as {
        default: (buf: Buffer) => Promise<{ text: string }>;
      }).default;
      const parsed = await pdfParse(buffer);
      text = parsed.text;
    } else if (
      ext === "docx" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      text = buffer.toString("utf-8");
    }

    text = text.trim();
    if (!text) {
      return NextResponse.json(
        { error: "Could not extract text from file. Please try a different file." },
        { status: 422 },
      );
    }

    // ── AI parsing + improvement ──────────────────────────────────────────────
    const data = await parseAndImproveResume(text);

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[POST /api/resume/import]", err);
    const mapped = aiErrorResponse(err);
    const status = err instanceof AIQuotaError ? 429 : 500;
    return NextResponse.json(mapped, { status });
  }
}
