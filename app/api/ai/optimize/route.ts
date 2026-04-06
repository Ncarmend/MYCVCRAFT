/**
 * POST /api/ai/optimize
 * ATS optimization check — scores CV and returns suggestions
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { optimizeCV } from "@/lib/openai";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { cvId, data } = await request.json();

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

    const result = await optimizeCV(cvText);

    // Persist ATS score to DB if cvId provided
    if (cvId) {
      const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
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
    return NextResponse.json({ error: "Optimization failed" }, { status: 500 });
  }
}
