export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { isProUser } from "@/lib/isPro";
import { CVPreview } from "@/components/cv/CVPreview";
import { ArrowLeft, Edit, FileDown } from "lucide-react";
import type { CV, CVFormData } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CVPreviewPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { subscription: true },
  });
  if (!dbUser) redirect("/onboarding");

  const cv = await prisma.cV.findFirst({ where: { id, userId: dbUser.id } });
  if (!cv) notFound();

  const isPro = isProUser(dbUser.subscription);
  const cvTitle = (cv as unknown as CV).title || cv.name;

  const cvData: Partial<CVFormData> = {
    ...(cv as unknown as CVFormData),
    email:          cv.email          ?? "",
    phone:          cv.phone          ?? "",
    location:       cv.location       ?? "",
    website:        cv.website        ?? "",
    linkedin:       cv.linkedin       ?? "",
    github:         cv.github         ?? "",
    portfolio:      cv.portfolio      ?? "",
    summary:        cv.summary        ?? "",
    experience:     (cv.experience    as unknown as CVFormData["experience"])      ?? [],
    education:      (cv.education     as unknown as CVFormData["education"])       ?? [],
    skills:         (cv.skills        as unknown as string[])                      ?? [],
    projects:       (cv.projects      as unknown as CVFormData["projects"])        ?? [],
    languages:      (cv.languages     as unknown as CVFormData["languages"])       ?? [],
    certifications: (cv.certifications as unknown as CVFormData["certifications"]) ?? [],
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-100">

      {/* Toolbar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        <div className="mx-2 h-4 w-px bg-gray-200" />

        <p className="flex-1 truncate text-sm font-semibold text-gray-900">
          {cvTitle}
        </p>

        <div className="flex items-center gap-2">
          <Link
            href={`/cv/${id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Link>
          {/* Opens PDF in new tab; user prints to PDF from there */}
          <a
            href={`/api/pdf?cvId=${id}&template=${cv.template ?? "BASIC"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 transition-colors"
          >
            <FileDown className="h-3.5 w-3.5" />
            Download PDF
          </a>
        </div>
      </div>

      {/* Full-width scrollable preview */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          {!isPro && (
            <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
              <p className="text-xs font-medium text-amber-800">
                Free plan — PDF export includes a watermark.{" "}
                <Link href="/pricing" className="underline hover:text-amber-900">
                  Upgrade to remove it.
                </Link>
              </p>
            </div>
          )}
          <CVPreview data={cvData} watermark={!isPro} />
        </div>
      </div>
    </div>
  );
}
