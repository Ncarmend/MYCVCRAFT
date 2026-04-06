/**
 * GET    /api/cv/:id  — Get a single CV
 * PATCH  /api/cv/:id  — Update a CV
 * DELETE /api/cv/:id  — Delete a CV
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

async function getAuthorizedCV(cvId: string, supabaseUserId: string) {
  const dbUser = await prisma.user.findUnique({ where: { supabaseId: supabaseUserId } });
  if (!dbUser) return null;

  const cv = await prisma.cV.findFirst({ where: { id: cvId, userId: dbUser.id } });
  return cv;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cv = await getAuthorizedCV(id, user.id);
    if (!cv) return NextResponse.json({ error: "CV not found" }, { status: 404 });

    return NextResponse.json({ cv });
  } catch (err) {
    console.error("[GET /api/cv/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await getAuthorizedCV(id, user.id);
    if (!existing) return NextResponse.json({ error: "CV not found" }, { status: 404 });

    const body = await request.json();

    const updated = await prisma.cV.update({
      where: { id },
      data: {
        title: body.title,
        template: body.template,
        name: body.name,
        jobTitle: body.jobTitle,
        email: body.email || null,
        phone: body.phone || null,
        location: body.location || null,
        website: body.website || null,
        linkedin: body.linkedin || null,
        summary: body.summary || null,
        experience: body.experience ?? [],
        education: body.education ?? [],
        skills: body.skills ?? [],
        projects: body.projects ?? [],
        languages: body.languages ?? [],
        certifications: body.certifications ?? [],
        generatedContent: body.generatedContent ?? existing.generatedContent,
        atsScore: body.atsScore ?? existing.atsScore,
        coverLetter: body.coverLetter ?? existing.coverLetter,
      },
    });

    return NextResponse.json({ cv: updated });
  } catch (err) {
    console.error("[PATCH /api/cv/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await getAuthorizedCV(id, user.id);
    if (!existing) return NextResponse.json({ error: "CV not found" }, { status: 404 });

    await prisma.cV.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/cv/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
