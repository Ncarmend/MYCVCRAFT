/**
 * POST /api/ai/summary
 * Generate a plain-text professional summary for the CV form
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSummary } from "@/lib/openai";
import { checkAIQuota, aiErrorResponse, AIQuotaError } from "@/lib/aiGuard";
import prisma from "@/lib/prisma";
import type { CVFormData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { subscription: true },
    });
    if (dbUser?.subscription?.plan !== "PRO") {
      return NextResponse.json(
        { error: "AI summary generation is a Premium feature. Please upgrade." },
        { status: 403 }
      );
    }

    await checkAIQuota(user.id);

    const body = await request.json();
    const lang = body.lang === "fr" ? "fr" : "en";
    const data = body as CVFormData;

    if (!data.name || !data.jobTitle) {
      return NextResponse.json(
        { error: "Name and job title are required" },
        { status: 400 }
      );
    }

    const summary = await generateSummary(data, lang);
    return NextResponse.json({ summary });
  } catch (err) {
    console.error("[POST /api/ai/summary]", err);
    const mapped = aiErrorResponse(err);
    const status = err instanceof AIQuotaError ? 429 : 500;
    return NextResponse.json(mapped, { status });
  }
}
