/**
 * POST /api/ai/optimize
 * ATS optimization check — scores CV and returns suggestions
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { optimizeCV } from "@/lib/openai";
import { checkAIQuota, aiErrorResponse, AIQuotaError } from "@/lib/aiGuard";
import { isProUser } from "@/lib/isPro";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { subscription: true },
    });
    console.log("[ai:optimize] plan check", {
      userId: user.id,
      plan: dbUser?.subscription?.plan,
      status: dbUser?.subscription?.status,
      isPro: dbUser?.subscription?.plan === "PRO",
    });
    if (!isProUser(dbUser?.subscription)) {
      return NextResponse.json(
        { error: "ATS optimization is a Premium feature. Please upgrade." },
        { status: 403 }
      );
    }

    await checkAIQuota(user.id);

    const { cvId, data, lang = "en" } = await request.json();

    // Build a plain-text representation of the CV for the AI
    const cvText = [
      `Name: ${data.name}`,
      `Job Title: ${data.jobTitle}`,
      `Summary: ${data.summary || ""}`,
      `Skills: ${(data.skills || []).join(", ")}`,
      `Experience: ${JSON.stringify(data.experience || [])}`,
      `Education: ${JSON.stringify(data.education || [])}`,
      `Projects: ${JSON.stringify(data.projects || [])}`,
    ].join("\n");

    const result = await optimizeCV(cvText, lang);

    // Persist ATS score to DB if cvId provided
    if (cvId) {
      if (dbUser) {
        await prisma.cV.updateMany({
          where: { id: cvId, userId: dbUser.id },
          data: { atsScore: result.score },
        });
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[POST /api/ai/optimize]", err);
    const mapped = aiErrorResponse(err);
    const status = err instanceof AIQuotaError ? 429 : 500;
    return NextResponse.json(mapped, { status });
  }
}
