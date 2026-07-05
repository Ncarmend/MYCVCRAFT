/**
 * POST /api/resume/import
 * Accepts a PDF, DOCX, or TXT file, extracts text, and uses AI to parse
 * and improve the content into a structured CVFormData object.
 *
 * PDF extraction uses pdfjs-dist directly (text-only, no canvas/rendering).
 * The legacy build is used for maximum Node.js compatibility.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAIQuota, aiErrorResponse, AIQuotaError } from "@/lib/aiGuard";
import { parseAndImproveResume } from "@/lib/openai";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/** Extract plain text from a PDF buffer using pdfjs-dist (server-side, no worker). */
async function extractPdfText(buffer: Buffer): Promise<string> {
  // Dynamic import keeps pdfjs-dist out of the client bundle
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  // Disable the web worker — not needed for server-side text extraction
  pdfjs.GlobalWorkerOptions.workerSrc = "";

  const data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const loadingTask = pdfjs.getDocument({ data, disableFontFace: true });
  const pdf = await loadingTask.promise;

  const pages: string[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => {
        if (!("str" in item)) return "";
        const t = item as { str: string; hasEOL: boolean };
        return t.str + (t.hasEOL ? "\n" : " ");
      })
      .join("");
    pages.push(pageText);
  }

  return pages.join("\n").replace(/[ \t]+/g, " ").trim();
}

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
    const isPdf = ext === "pdf" || file.type === "application/pdf";
    const isDocx =
      ext === "docx" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const isTxt = ext === "txt" || file.type === "text/plain";

    // Allow application/octet-stream as a fallback (browsers sometimes send it for .docx)
    const mimeOk = isPdf || isDocx || isTxt || file.type === "application/octet-stream";
    if (!mimeOk) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOCX, or TXT." },
        { status: 415 },
      );
    }

    // ── Text extraction ───────────────────────────────────────────────────────
    let text = "";
    const buffer = Buffer.from(await file.arrayBuffer());

    if (isPdf) {
      text = await extractPdfText(buffer);
    } else if (isDocx || file.type === "application/octet-stream") {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      // TXT
      text = buffer.toString("utf-8");
    }

    text = text.trim();
    if (!text) {
      return NextResponse.json(
        { error: "Could not extract text from file. Please try a different file." },
        { status: 422 },
      );
    }

    console.log("[resume:import] Extracted", text.length, "chars from", ext);

    // ── AI parsing + improvement ──────────────────────────────────────────────
    const lang = (formData.get("lang") as string) === "fr" ? "fr" : "en";
    const data = await parseAndImproveResume(text, lang);

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[resume:import] Error:", err);
    const mapped = aiErrorResponse(err);
    const status = err instanceof AIQuotaError ? 429 : 500;
    return NextResponse.json(mapped, { status });
  }
}
