import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { Rich } from "@/components/seo/Rich";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/seo/Breadcrumbs";
import { LANDING_ROUTES, TOOLS_HUB, TOOL_GROUPS } from "@/lib/landing-routes";
import { OG_DEFAULTS, OG_LOCALE, SITE_NAME, SITE_URL, localePath } from "@/lib/seo";
import { graph, webPageNode, SOFTWARE_ID } from "@/lib/structured-data";

type HubLang = "en" | "fr";

const COPY: Record<HubLang, {
  home: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  guideHeading: string;
  guide: string[];
}> = {
  en: {
    home: "Home",
    metaTitle: "Resume Tools – AI CV Builder, ATS Check & Job Matching",
    metaDescription:
      "All CVixeo resume tools in one place: build a CV with AI, check it for ATS, improve an existing resume, match it to a job description and write a cover letter.",
    h1: "Resume and CV tools",
    intro:
      "Each tool covers one step of a job application. Start where you are: from a blank page, from an existing CV, or from a job posting you want to apply for.",
    guideHeading: "Which tool should I start with?",
    guide: [
      "**No CV yet?** Start with the [AI CV Builder](/ai-cv-builder), or the [AI Resume Builder](/ai-resume-builder) if you're applying in the US or Canada.",
      "**Have an old CV?** Import it into the [Resume Optimizer](/resume-optimizer).",
      "**Not sure what's wrong with your CV?** Run the [CV Checker & Optimizer](/cv-optimizer) and read the [ATS Resume Builder](/ats-cv-builder) guide.",
      "**Applying for a specific job?** Use [Job Description Matching](/job-description-matching), then the [Cover Letter Generator](/cover-letter-generator).",
    ],
  },
  fr: {
    home: "Accueil",
    metaTitle: "Outils CV – Générateur de CV IA, analyse ATS et matching",
    metaDescription:
      "Tous les outils CV de CVixeo : créer un CV avec l'IA, vérifier sa compatibilité ATS, optimiser un CV existant, l'adapter à une offre et rédiger une lettre de motivation.",
    h1: "Outils pour créer et optimiser votre CV",
    intro:
      "Chaque outil couvre une étape de votre candidature. Partez de là où vous en êtes : une page blanche, un CV existant ou une offre d'emploi précise.",
    guideHeading: "Par quel outil commencer ?",
    guide: [
      "**Pas encore de CV ?** Suivez le guide pour [créer un CV](/fr/creer-cv) ou utilisez le [générateur de CV IA](/fr/generateur-cv-ia).",
      "**Un ancien CV à moderniser ?** Importez-le pour [optimiser votre CV](/fr/optimiser-cv).",
      "**Vous ne savez pas ce qui bloque ?** Commencez par [analyser votre CV](/fr/analyser-cv) et lisez le guide du [CV compatible ATS](/fr/cv-ats).",
      "**Une offre précise en vue ?** [Adaptez votre CV à l'offre](/fr/cv-offre-emploi), puis rédigez votre [lettre de motivation IA](/fr/lettre-motivation).",
    ],
  },
};

function hubCrumbs(lang: HubLang): Crumb[] {
  return [
    { name: COPY[lang].home, href: localePath(lang, "/") },
    { name: TOOLS_HUB[lang].label, href: TOOLS_HUB[lang].path },
  ];
}

export function toolsHubMetadata(lang: HubLang): Metadata {
  const c = COPY[lang];
  const url = `${SITE_URL}${TOOLS_HUB[lang].path}`;
  const en = `${SITE_URL}${TOOLS_HUB.en.path}`;
  const fr = `${SITE_URL}${TOOLS_HUB.fr.path}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: url, languages: { en, fr, "x-default": en } },
    openGraph: {
      ...OG_DEFAULTS,
      title: `${c.metaTitle} | ${SITE_NAME}`,
      description: c.metaDescription,
      url,
      locale: OG_LOCALE[lang],
    },
  };
}

export function ToolsHub({ lang }: { lang: HubLang }) {
  const c = COPY[lang];
  const url = `${SITE_URL}${TOOLS_HUB[lang].path}`;
  const groups = TOOL_GROUPS[lang];

  const jsonLd = graph(
    webPageNode({ type: "CollectionPage", url, name: c.h1, description: c.metaDescription, lang, breadcrumb: true, about: SOFTWARE_ID }),
    breadcrumbJsonLd(hubCrumbs(lang)),
    {
      "@type": "ItemList",
      "@id": `${url}#tools`,
      itemListElement: groups.flatMap((g) => g.ids).map((id, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: LANDING_ROUTES[id].label,
        url: `${SITE_URL}${LANDING_ROUTES[id].path}`,
      })),
    },
  );

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={jsonLd} />
      <NavbarServer />
      <main className="flex-1">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-6 pb-10 pt-8 sm:pt-12">
            <Breadcrumbs items={hubCrumbs(lang)} />
            <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{c.h1}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">{c.intro}</p>
          </div>
        </section>

        {groups.map((g, gi) => (
          <section key={g.title} className={gi % 2 === 0 ? "bg-slate-50/70 py-10" : "bg-white py-10"}>
            <div className="mx-auto max-w-5xl px-6">
              <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">{g.title}</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.ids.map((id) => {
                  const r = LANDING_ROUTES[id];
                  return (
                    <Link
                      key={id}
                      href={r.path}
                      className="group flex items-start justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-800 sm:text-base">{r.label}</h3>
                        <p className="mt-1 text-sm text-gray-500">{r.blurb}</p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-300 group-hover:text-emerald-700" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ))}

        <section className="bg-white py-12">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">{c.guideHeading}</h2>
            <ul className="mt-5 max-w-3xl space-y-3">
              {c.guide.map((g) => (
                <li key={g} className="text-sm leading-relaxed text-gray-700 sm:text-base">
                  <Rich text={g} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
