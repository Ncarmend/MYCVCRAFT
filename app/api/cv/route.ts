/**
 * POST /api/cv — Create a new CV
 * GET  /api/cv — List user's CVs
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { isProUser } from "@/lib/isPro";
import { normalizeWebsite } from "@/lib/utils";

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
    const isPro = isProUser(dbUser.subscription);
    if (!isPro && dbUser._count.cvs >= 1) {
      return NextResponse.json(
        { error: "Free plan is limited to 1 CV. Upgrade to Pro for unlimited CVs." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Server-side guard for the fields the client already requires — never trust the
    // client alone. This mirrors CVForm's own required-field rule, so it should never
    // trigger from the app itself; it only stops a malformed/direct API call from
    // reaching the database.
    if (typeof body.name !== "string" || !body.name.trim() || typeof body.jobTitle !== "string" || !body.jobTitle.trim()) {
      return NextResponse.json({ error: "name and jobTitle are required" }, { status: 400 });
    }

    // Normalize website server-side too (defense in depth): the value may have
    // reached this endpoint via AI resume import or a direct API call, not just
    // the form's own onBlur/setValueAs normalization.
    const website = (normalizeWebsite(body.website) as string | null | undefined) || null;

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
        website,
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
