/**
 * POST /api/ai/bullets
 * Generate achievement bullet points for a job experience entry
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOpenAIBullets } from "@/lib/openai";
import { checkAIQuota, aiErrorResponse, AIQuotaError } from "@/lib/aiGuard";
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
    console.log("[ai:bullets] plan check", {
      userId: user.id,
      plan: dbUser?.subscription?.plan,
      status: dbUser?.subscription?.status,
      isPro: dbUser?.subscription?.plan === "PRO",
    });
    if (dbUser?.subscription?.plan !== "PRO") {
      return NextResponse.json(
        { error: "AI bullet generation is a Premium feature. Please upgrade." },
        { status: 403 }
      );
    }

    await checkAIQuota(user.id);

    const { role, company, description, lang = "en" } = await request.json();
    if (!role) return NextResponse.json({ error: "Role is required" }, { status: 400 });

    const bullets = await getOpenAIBullets({ role, company, description, lang });
    return NextResponse.json({ bullets });
  } catch (err) {
    console.error("[POST /api/ai/bullets]", err);
    const mapped = aiErrorResponse(err);
    const status = err instanceof AIQuotaError ? 429 : 500;
    return NextResponse.json(mapped, { status });
  }
}
