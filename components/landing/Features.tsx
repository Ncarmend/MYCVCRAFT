"use client";

import {
  Sparkles,
  FileDown,
  Target,
  LayoutTemplate,
  Gauge,
  SearchCheck,
  WandSparkles,
  PenLine,
} from "lucide-react";
import Link from "next/link";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { LANDING_ROUTES, TOOLS_HUB, type LandingId } from "@/lib/landing-routes";

// Order matches translations[lang].features.items.
const icons = [Sparkles, Gauge, Target, SearchCheck, WandSparkles, LayoutTemplate, FileDown, PenLine];
const colors = ["indigo", "purple", "emerald", "violet", "indigo", "blue", "sky", "emerald"];

// Landing page for each feature card (same order). Dutch has no landing pages
// yet, so Dutch cards stay unlinked rather than pointing to English content.
const featureLinks: Record<"en" | "fr", (LandingId | null)[]> = {
  en: ["ai-cv-builder", "ats-cv-builder", "job-description-matching", "job-description-matching", "resume-optimizer", null, null, "cover-letter-generator"],
  fr: ["generateur-cv-ia", "cv-ats", "cv-offre-emploi", "cv-offre-emploi", "optimiser-cv", null, null, "lettre-motivation"],
};

const colorMap: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  purple: "bg-purple-50 text-purple-600 ring-purple-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
};

export function Features() {
  const { lang } = useLanguage();
  const T = translations[lang].features;

  return (
    <section className="bg-gray-50 py-14 sm:py-20" id="features">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-semibold text-emerald-900 uppercase tracking-widest">
            {T.sectionLabel}
          </p>
          <h2 className="mt-2 text-base font-bold tracking-tight text-gray-900 sm:text-xl">
            {T.headline}
          </h2>
          <p className="mt-2 text-sm text-gray-500">{T.subtext}</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {T.items.map((feature, i) => {
            const Icon = icons[i % icons.length];
            const color = colors[i % colors.length];
            const linkId = lang === "nl" ? null : featureLinks[lang][i] ?? null;
            return (
              <div
                key={feature.title}
                className="relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className={`inline-flex rounded-xl p-3 ring-1 ${colorMap[color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {linkId ? (
                    <Link href={LANDING_ROUTES[linkId].path} className="hover:text-emerald-800 hover:underline">
                      {feature.title}
                    </Link>
                  ) : (
                    feature.title
                  )}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">{feature.description}</p>
              </div>
            );
          })}
        </div>
        {lang !== "nl" && (
          <p className="mt-8 text-center">
            <Link href={TOOLS_HUB[lang].path} className="text-sm font-medium text-emerald-800 underline underline-offset-2 hover:text-emerald-950">
              {TOOLS_HUB[lang].label} →
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
