/**
 * Registry of SEO landing pages (paths, language, cross-language equivalent,
 * short link labels). Kept separate from the page copy in lib/landing-pages.ts
 * so client components (Navbar, Footer, Features) can import it without
 * pulling every page's full content into the browser bundle.
 */

export type LandingId =
  // English
  | "ai-cv-builder"
  | "ats-cv-builder"
  | "ai-resume-builder"
  | "resume-optimizer"
  | "cv-optimizer"
  | "job-description-matching"
  | "cover-letter-generator"
  // French
  | "creer-cv"
  | "generateur-cv-ia"
  | "cv-ats"
  | "optimiser-cv"
  | "analyser-cv"
  | "cv-offre-emploi"
  | "lettre-motivation"
  // French guide pillars (children of the careers section, not the tools hub)
  | "cv-belgique";

export interface LandingRoute {
  id: LandingId;
  lang: "en" | "fr";
  path: string;
  /** Same-intent page in the other language (emitted as hreflang alternates). */
  alternate?: LandingId;
  /** Short anchor text for internal links. */
  label: string;
  /** One-line description used on related-page cards. */
  blurb: string;
  /** Guide pillar that sits under Career resources instead of the Resume Tools hub. */
  parent?: "careers";
}

export const LANDING_ROUTES: Record<LandingId, LandingRoute> = {
  "ai-cv-builder": {
    id: "ai-cv-builder", lang: "en", path: "/ai-cv-builder", alternate: "generateur-cv-ia",
    label: "AI CV Builder",
    blurb: "Build a complete, professional CV from scratch with AI.",
  },
  "ats-cv-builder": {
    id: "ats-cv-builder", lang: "en", path: "/ats-cv-builder", alternate: "cv-ats",
    label: "ATS Resume Builder",
    blurb: "How applicant tracking systems read resumes, and how to pass them.",
  },
  "ai-resume-builder": {
    id: "ai-resume-builder", lang: "en", path: "/ai-resume-builder",
    label: "AI Resume Builder",
    blurb: "Write a concise, achievement-focused resume with AI bullet points.",
  },
  "resume-optimizer": {
    id: "resume-optimizer", lang: "en", path: "/resume-optimizer", alternate: "optimiser-cv",
    label: "Resume Optimizer",
    blurb: "Import your existing resume and let AI rewrite it sharper.",
  },
  "cv-optimizer": {
    id: "cv-optimizer", lang: "en", path: "/cv-optimizer", alternate: "analyser-cv",
    label: "CV Checker & Optimizer",
    blurb: "Get an ATS score and a section-by-section review of your CV.",
  },
  "job-description-matching": {
    id: "job-description-matching", lang: "en", path: "/job-description-matching", alternate: "cv-offre-emploi",
    label: "Job Description Matching",
    blurb: "Compare your CV with a job posting: missing skills, keywords and a score.",
  },
  "cover-letter-generator": {
    id: "cover-letter-generator", lang: "en", path: "/cover-letter-generator", alternate: "lettre-motivation",
    label: "Cover Letter Generator",
    blurb: "Generate a cover letter tailored to the job and the company.",
  },

  "creer-cv": {
    id: "creer-cv", lang: "fr", path: "/fr/creer-cv",
    label: "Créer un CV",
    blurb: "Les étapes et rubriques pour créer un CV professionnel en ligne.",
  },
  "generateur-cv-ia": {
    id: "generateur-cv-ia", lang: "fr", path: "/fr/generateur-cv-ia", alternate: "ai-cv-builder",
    label: "Générateur de CV IA",
    blurb: "Créer, améliorer et adapter votre CV avec l'intelligence artificielle.",
  },
  "cv-ats": {
    id: "cv-ats", lang: "fr", path: "/fr/cv-ats", alternate: "ats-cv-builder",
    label: "CV compatible ATS",
    blurb: "Comprendre les ATS et rendre votre CV lisible par les logiciels de recrutement.",
  },
  "optimiser-cv": {
    id: "optimiser-cv", lang: "fr", path: "/fr/optimiser-cv", alternate: "resume-optimizer",
    label: "Optimiser son CV",
    blurb: "Importez votre CV existant et améliorez-le avec l'IA.",
  },
  "analyser-cv": {
    id: "analyser-cv", lang: "fr", path: "/fr/analyser-cv", alternate: "cv-optimizer",
    label: "Analyser son CV",
    blurb: "Score ATS et diagnostic de votre CV, rubrique par rubrique.",
  },
  "cv-offre-emploi": {
    id: "cv-offre-emploi", lang: "fr", path: "/fr/cv-offre-emploi", alternate: "job-description-matching",
    label: "Adapter son CV à une offre",
    blurb: "Comparez votre CV à une offre : compétences manquantes, mots-clés et score.",
  },
  "lettre-motivation": {
    id: "lettre-motivation", lang: "fr", path: "/fr/lettre-motivation", alternate: "cover-letter-generator",
    label: "Lettre de motivation IA",
    blurb: "Générez une lettre de motivation adaptée à l'offre et à l'entreprise.",
  },

  "cv-belgique": {
    id: "cv-belgique", lang: "fr", path: "/fr/cv-belgique", parent: "careers",
    label: "CV en Belgique",
    blurb: "Ce qui change vraiment pour un CV en Belgique : langues, Bruxelles, néerlandais.",
  },
};

export const LANDING_IDS = Object.keys(LANDING_ROUTES) as LandingId[];

/**
 * "Resume Tools" hub: lists every landing page for a language and is the
 * middle level of their breadcrumbs (Home → Resume Tools → page).
 */
export const TOOLS_HUB: Record<"en" | "fr", { path: string; label: string }> = {
  en: { path: "/resume-tools", label: "Resume Tools" },
  fr: { path: "/fr/outils-cv", label: "Outils CV" },
};

/** Hub groupings, in display order. */
export const TOOL_GROUPS: Record<"en" | "fr", { title: string; ids: LandingId[] }[]> = {
  en: [
    { title: "Create", ids: ["ai-cv-builder", "ai-resume-builder"] },
    { title: "Check and optimize", ids: ["ats-cv-builder", "cv-optimizer", "resume-optimizer"] },
    { title: "Target and apply", ids: ["job-description-matching", "cover-letter-generator"] },
  ],
  fr: [
    { title: "Créer", ids: ["creer-cv", "generateur-cv-ia"] },
    { title: "Vérifier et optimiser", ids: ["cv-ats", "analyser-cv", "optimiser-cv"] },
    { title: "Cibler et postuler", ids: ["cv-offre-emploi", "lettre-motivation"] },
  ],
};

/** Tool landing pages for a language (guide pillars excluded). */
export function landingRoutesFor(lang: "en" | "fr" | "nl"): LandingRoute[] {
  return LANDING_IDS.map((id) => LANDING_ROUTES[id]).filter((r) => r.lang === lang && !r.parent);
}

export function findLandingByPath(pathname: string): LandingRoute | undefined {
  return LANDING_IDS.map((id) => LANDING_ROUTES[id]).find((r) => r.path === pathname);
}

/**
 * Path of the landing page with the same intent in `target` language, if any.
 * Used by the language switcher so /ai-cv-builder ⇄ /fr/generateur-cv-ia.
 */
export function landingAlternatePath(pathname: string, target: "en" | "fr" | "nl"): string | null {
  if (pathname === TOOLS_HUB.en.path || pathname === TOOLS_HUB.fr.path) {
    return target === "nl" ? "/nl" : TOOLS_HUB[target].path;
  }
  const route = findLandingByPath(pathname);
  if (!route) return null;
  if (route.lang === target) return route.path;
  if (route.alternate && LANDING_ROUTES[route.alternate].lang === target) {
    return LANDING_ROUTES[route.alternate].path;
  }
  return target === "en" ? "/" : `/${target}`;
}
