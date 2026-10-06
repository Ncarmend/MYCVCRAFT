import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/lib/articles";
import { LANDING_ROUTES, type LandingId } from "@/lib/landing-routes";

// First matching rules win; matched against slug + category + tags.
const RULES: { test: RegExp; en?: LandingId; fr?: LandingId }[] = [
  { test: /cover.?letter|lettre.?(de.?)?motivation/, en: "cover-letter-generator", fr: "lettre-motivation" },
  { test: /tailor|adapter|offre|job.?posting|job.?description/, en: "job-description-matching", fr: "cv-offre-emploi" },
  { test: /\bats\b|ats-/, en: "ats-cv-builder", fr: "cv-ats" },
  { test: /mistake|erreur|skill|compétence|competence/, en: "cv-optimizer", fr: "analyser-cv" },
  { test: /intelligence.?artificielle|chatgpt|\bia\b|\bai\b/, en: "ai-cv-builder", fr: "generateur-cv-ia" },
  { test: /career.?change|reconversion/, en: "resume-optimizer", fr: "optimiser-cv" },
  { test: /one.?page|resume/, en: "ai-resume-builder" },
  { test: /\bcv\b|cv-/, fr: "creer-cv" },
];

const DEFAULTS: Record<"en" | "fr", LandingId[]> = {
  en: ["job-description-matching", "ai-cv-builder", "ats-cv-builder"],
  fr: ["cv-offre-emploi", "generateur-cv-ia", "cv-ats"],
};

const COPY = {
  en: { heading: "Put it into practice with CVixeo" },
  fr: { heading: "Passez à la pratique avec CVixeo" },
};

function pickTools(article: Article, lang: "en" | "fr"): LandingId[] {
  const haystack = `${article.slug} ${article.category} ${article.tags.join(" ")}`.toLowerCase();
  const matched = RULES.filter((r) => r.test.test(haystack)).map((r) => r[lang]);
  const candidates = [...matched, ...DEFAULTS[lang]].filter((id): id is LandingId => !!id);
  return [...new Set(candidates)].slice(0, 3);
}

/** Links from a careers article to the most relevant SEO landing pages. */
export function ArticleToolLinks({ article, lang }: { article: Article; lang: "en" | "fr" }) {
  const tools = pickTools(article, lang);

  return (
    <aside className="mt-10 rounded-2xl bg-emerald-50/60 p-5 ring-1 ring-emerald-100 sm:p-6">
      <h2 className="text-base font-bold tracking-tight text-slate-900">{COPY[lang].heading}</h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tools.map((id) => {
          const r = LANDING_ROUTES[id];
          return (
            <li key={id}>
              <Link
                href={r.path}
                className="group flex h-full flex-col rounded-xl bg-white p-4 ring-1 ring-gray-100 transition-shadow hover:shadow-md"
              >
                <span className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
                  {r.label}
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-300 group-hover:text-emerald-700" />
                </span>
                <span className="mt-1 text-xs leading-relaxed text-slate-500">{r.blurb}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
