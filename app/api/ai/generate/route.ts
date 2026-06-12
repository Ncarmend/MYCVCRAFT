/**
 * POST /api/ai/generate
 * Generate CV content using OpenAI given structured form data
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCV } from "@/lib/openai";
import { checkAIQuota, aiErrorResponse, AIQuotaError } from "@/lib/aiGuard";
import type { CVFormData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await checkAIQuota(user.id);

    const body = await request.json();
    const lang = body.lang === "fr" ? "fr" : "en";
    const data = body as CVFormData;

    if (!data.name || !data.jobTitle) {
      return NextResponse.json(
        { error: "Name and job title are required for generation" },
        { status: 400 }
      );
    }

    const content = await generateCV(data, lang);
    return NextResponse.json({ content });
  } catch (err) {
    console.error("[POST /api/ai/generate]", err);
    const mapped = aiErrorResponse(err);
    const status = err instanceof AIQuotaError ? 429 : 500;
    return NextResponse.json(mapped, { status });
  }
}
