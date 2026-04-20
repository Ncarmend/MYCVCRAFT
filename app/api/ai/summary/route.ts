/**
 * POST /api/ai/summary
 * Generate a plain-text professional summary for the CV form
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSummary } from "@/lib/openai";
import type { CVFormData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data: CVFormData = await request.json();

    if (!data.name || !data.jobTitle) {
      return NextResponse.json(
        { error: "Name and job title are required" },
        { status: 400 }
      );
    }

    const summary = await generateSummary(data);
    return NextResponse.json({ summary });
  } catch (err) {
    console.error("[POST /api/ai/summary]", err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
