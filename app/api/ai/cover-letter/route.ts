/**
 * POST /api/ai/cover-letter
 * Generates a tailored cover letter (Pro feature)
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCoverLetter } from "@/lib/openai";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Pro-only feature
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { subscription: true },
    });
    if (dbUser?.subscription?.plan !== "PRO") {
      return NextResponse.json(
        { error: "Cover letter generation is a Pro feature. Please upgrade." },
        { status: 403 }
      );
    }

    const { cvContent, jobDescription, companyName, cvId } = await request.json();

    if (!cvContent || !jobDescription || !companyName) {
      return NextResponse.json(
        { error: "CV content, job description, and company name are required" },
        { status: 400 }
      );
    }

    const coverLetter = await generateCoverLetter(
      cvContent,
      jobDescription,
      companyName
    );

    // Optionally save cover letter to CV record
    if (cvId && dbUser) {
      await prisma.cV.updateMany({
        where: { id: cvId, userId: dbUser.id },
        data: { coverLetter },
      });
    }

    return NextResponse.json({ coverLetter });
  } catch (err) {
    console.error("[POST /api/ai/cover-letter]", err);
    return NextResponse.json({ error: "Cover letter generation failed" }, { status: 500 });
  }
}
