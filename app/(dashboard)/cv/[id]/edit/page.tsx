/**
 * CV edit page — loads existing CV, shows form + preview
 */
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { CVEditorClient } from "./CVEditorClient";
import type { CV } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCVPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { subscription: true },
  });
  if (!dbUser) redirect("/onboarding");

  const cv = await prisma.cV.findFirst({
    where: { id, userId: dbUser.id },
  });
  if (!cv) notFound();

  const isPro = dbUser.subscription?.plan === "PRO";

  // Cast Prisma JSON fields to proper types
  const cvData: CV = {
    ...(cv as unknown as CV),
    email: cv.email ?? "",
    phone: cv.phone ?? "",
    location: cv.location ?? "",
    website: cv.website ?? "",
    linkedin: cv.linkedin ?? "",
    github: cv.github ?? "",
    portfolio: cv.portfolio ?? "",
    summary: cv.summary ?? "",
    experience: (cv.experience as unknown as CV["experience"]) ?? [],
    education: (cv.education as unknown as CV["education"]) ?? [],
    skills: (cv.skills as unknown as string[]) ?? [],
    projects: (cv.projects as unknown as CV["projects"]) ?? [],
    languages: (cv.languages as unknown as CV["languages"]) ?? [],
    certifications: (cv.certifications as unknown as CV["certifications"]) ?? [],
  };

  return <CVEditorClient cv={cvData} isPro={isPro} />;
}
