/**
 * POST /api/ai/generate
 * Generate CV content using OpenAI given structured form data
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCV } from "@/lib/openai";
import type { CVFormData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data: CVFormData = await request.json();

    if (!data.name || !data.jobTitle) {
      return NextResponse.json(
        { error: "Name and job title are required for generation" },
        { status: 400 }
      );
    }

    const content = await generateCV(data);

    return NextResponse.json({ content });
  } catch (err) {
    console.error("[POST /api/ai/generate]", err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
