/**
 * GET  /api/settings — Get user CV/AI settings
 * PUT  /api/settings — Save user CV/AI settings
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) return NextResponse.json(null);

    const settings = await prisma.userSettings.findUnique({
      where: { userId: dbUser.id },
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("[GET /api/settings]", err);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { cvLanguage, cvFont, cvColor, cvFormat, showSummary, showProjects, showSkills, showInterests, aiTone, aiLength, aiLanguage, aiStyle } = body;

    const settings = await prisma.userSettings.upsert({
      where: { userId: dbUser.id },
      create: { userId: dbUser.id, cvLanguage, cvFont, cvColor, cvFormat, showSummary, showProjects, showSkills, showInterests, aiTone, aiLength, aiLanguage, aiStyle },
      update: { cvLanguage, cvFont, cvColor, cvFormat, showSummary, showProjects, showSkills, showInterests, aiTone, aiLength, aiLanguage, aiStyle },
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("[PUT /api/settings]", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
