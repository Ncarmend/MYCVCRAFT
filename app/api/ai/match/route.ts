/**
 * POST /api/ai/match
 * Matches a CV against a job description (Pro feature)
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { matchJobDescription } from "@/lib/openai";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // This is a Pro-only feature
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { subscription: true },
    });
    if (dbUser?.subscription?.plan !== "PRO") {
      return NextResponse.json(
        { error: "Job description matching is a Pro feature. Please upgrade." },
        { status: 403 }
      );
    }

    const { cvContent, jobDescription } = await request.json();

    if (!cvContent || !jobDescription) {
      return NextResponse.json(
        { error: "Both CV content and job description are required" },
        { status: 400 }
      );
    }

    const result = await matchJobDescription(cvContent, jobDescription);

    return NextResponse.json(result);
  } catch (err) {
    console.error("[POST /api/ai/match]", err);
    return NextResponse.json({ error: "Job matching failed" }, { status: 500 });
  }
}
