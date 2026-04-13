/**
 * POST /api/cv — Create a new CV
 * GET  /api/cv — List user's CVs
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
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const cvs = await prisma.cV.findMany({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ cvs });
  } catch (err) {
    console.error("[GET /api/cv]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { subscription: true, _count: { select: { cvs: true } } },
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Free plan limit: 1 CV
    const isPro = dbUser.subscription?.plan === "PRO";
    if (!isPro && dbUser._count.cvs >= 1) {
      return NextResponse.json(
        { error: "Free plan is limited to 1 CV. Upgrade to Pro for unlimited CVs." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const cv = await prisma.cV.create({
      data: {
        userId: dbUser.id,
        title: body.title || `${body.name}'s CV`,
        template: body.template || "BASIC",
        name: body.name,
        jobTitle: body.jobTitle,
        email: body.email || null,
        phone: body.phone || null,
        location: body.location || null,
        website: body.website || null,
        linkedin: body.linkedin || null,
        github: body.github || null,
        portfolio: body.portfolio || null,
        summary: body.summary || null,
        experience: body.experience ?? [],
        education: body.education ?? [],
        skills: body.skills ?? [],
        projects: body.projects ?? [],
        languages: body.languages ?? [],
        certifications: body.certifications ?? [],
      },
    });

    return NextResponse.json({ cv }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/cv]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
