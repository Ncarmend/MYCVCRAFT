/**
 * Registry of SEO landing pages (paths, language, cross-language group,
 * short link labels). Kept separate from the page copy in lib/landing-pages.ts
 * so client components (Navbar, Footer, Features) can import it without
 * pulling every page's full content into the browser bundle.
 */

export type LandingLang = "en" | "fr" | "nl";

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
  // Dutch
  | "ai-cv-maker"
  | "ats-cv"
  | "cv-verbeteren"
  | "cv-check"
  | "cv-afstemmen-op-vacature"
  | "sollicitatiebrief-generator"
  // French guide pillars (children of the careers section, not the tools hub)
  | "cv-belgique";

/**
 * Same-intent pages across languages share a group. Groups drive hreflang
 * alternates, the sitemap and the language switcher. Pages without a group
 * (e.g. /ai-resume-builder, /fr/creer-cv) have no equivalent in other languages.
 */
export type LandingGroup = "builder" | "ats" | "improve" | "check" | "match" | "cover";

export interface LandingRoute {
  id: LandingId;
  lang: LandingLang;
  path: string;
  group?: LandingGroup;
  /** Short anchor text for internal links. */
  label: string;
  /** One-line description used on related-page cards. */
  blurb: string;
  /** Guide pillar that sits under Career resources instead of the Resume Tools hub. */
  parent?: "careers";
}

export const LANDING_ROUTES: Record<LandingId, LandingRoute> = {
  "ai-cv-builder": {
    id: "ai-cv-builder", lang: "en", path: "/ai-cv-builder", group: "builder",
    label: "AI CV Builder",
    blurb: "Build a complete, professional CV from scratch with AI.",
  },
  "ats-cv-builder": {
    id: "ats-cv-builder", lang: "en", path: "/ats-cv-builder", group: "ats",
    label: "ATS Resume Builder",
    blurb: "How applicant tracking systems read resumes, and how to pass them.",
  },
  "ai-resume-builder": {
    id: "ai-resume-builder", lang: "en", path: "/ai-resume-builder",
    label: "AI Resume Builder",
    blurb: "Write a concise, achievement-focused resume with AI bullet points.",
  },
  "resume-optimizer": {
    id: "resume-optimizer", lang: "en", path: "/resume-optimizer", group: "improve",
    label: "Resume Optimizer",
    blurb: "Import your existing resume and let AI rewrite it sharper.",
  },
  "cv-optimizer": {
    id: "cv-optimizer", lang: "en", path: "/cv-optimizer", group: "check",
    label: "CV Checker & Optimizer",
    blurb: "Get an ATS score and a section-by-section review of your CV.",
  },
  "job-description-matching": {
    id: "job-description-matching", lang: "en", path: "/job-description-matching", group: "match",
    label: "Job Description Matching",
    blurb: "Compare your CV with a job posting: missing skills, keywords and a score.",
  },
  "cover-letter-generator": {
    id: "cover-letter-generator", lang: "en", path: "/cover-letter-generator", group: "cover",
    label: "Cover Letter Generator",
    blurb: "Generate a cover letter tailored to the job and the company.",
  },

  "creer-cv": {
    id: "creer-cv", lang: "fr", path: "/fr/creer-cv",
    label: "Créer un CV",
    blurb: "Les étapes et rubriques pour créer un CV professionnel en ligne.",
  },
  "generateur-cv-ia": {
    id: "generateur-cv-ia", lang: "fr", path: "/fr/generateur-cv-ia", group: "builder",
    label: "Générateur de CV IA",
    blurb: "Créer, améliorer et adapter votre CV avec l'intelligence artificielle.",
  },
  "cv-ats": {
    id: "cv-ats", lang: "fr", path: "/fr/cv-ats", group: "ats",
    label: "CV compatible ATS",
    blurb: "Comprendre les ATS et rendre votre CV lisible par les logiciels de recrutement.",
  },
  "optimiser-cv": {
    id: "optimiser-cv", lang: "fr", path: "/fr/optimiser-cv", group: "improve",
    label: "Optimiser son CV",
    blurb: "Importez votre CV existant et améliorez-le avec l'IA.",
  },
  "analyser-cv": {
    id: "analyser-cv", lang: "fr", path: "/fr/analyser-cv", group: "check",
    label: "Analyser son CV",
    blurb: "Score ATS et diagnostic de votre CV, rubrique par rubrique.",
  },
  "cv-offre-emploi": {
    id: "cv-offre-emploi", lang: "fr", path: "/fr/cv-offre-emploi", group: "match",
    label: "Adapter son CV à une offre",
    blurb: "Comparez votre CV à une offre : compétences manquantes, mots-clés et score.",
  },
  "lettre-motivation": {
    id: "lettre-motivation", lang: "fr", path: "/fr/lettre-motivation", group: "cover",
    label: "Lettre de motivation IA",
    blurb: "Générez une lettre de motivation adaptée à l'offre et à l'entreprise.",
  },

  "ai-cv-maker": {
    id: "ai-cv-maker", lang: "nl", path: "/nl/ai-cv-maker", group: "builder",
    label: "AI cv-maker",
    blurb: "Maak met AI een volledig, professioneel cv vanaf nul.",
  },
  "ats-cv": {
    id: "ats-cv", lang: "nl", path: "/nl/ats-cv", group: "ats",
    label: "ATS-vriendelijk cv",
    blurb: "Hoe ATS-systemen je cv lezen en hoe je ervoor zorgt dat het goed gelezen wordt.",
  },
  "cv-verbeteren": {
    id: "cv-verbeteren", lang: "nl", path: "/nl/cv-verbeteren", group: "improve",
    label: "Cv verbeteren",
    blurb: "Importeer je bestaande cv en laat AI het scherper herschrijven.",
  },
  "cv-check": {
    id: "cv-check", lang: "nl", path: "/nl/cv-check", group: "check",
    label: "Cv-check",
    blurb: "Krijg een ATS-score en een analyse van je cv, sectie per sectie.",
  },
  "cv-afstemmen-op-vacature": {
    id: "cv-afstemmen-op-vacature", lang: "nl", path: "/nl/cv-afstemmen-op-vacature", group: "match",
    label: "Cv afstemmen op een vacature",
    blurb: "Vergelijk je cv met een vacature: ontbrekende vaardigheden, zoekwoorden en een score.",
  },
  "sollicitatiebrief-generator": {
    id: "sollicitatiebrief-generator", lang: "nl", path: "/nl/sollicitatiebrief-generator", group: "cover",
    label: "Sollicitatiebrief-generator",
    blurb: "Genereer een sollicitatiebrief op maat van de vacature en het bedrijf.",
  },

  "cv-belgique": {
    id: "cv-belgique", lang: "fr", path: "/fr/cv-belgique", parent: "careers",
    label: "CV en Belgique",
    blurb: "Ce qui change vraiment pour un CV en Belgique : langues, Bruxelles, néerlandais.",
  },
};

export const LANDING_IDS = Object.keys(LANDING_ROUTES) as LandingId[];

/** Same-intent pages in every language for a page (including itself), keyed by language. */
export function landingAlternates(id: LandingId): Partial<Record<LandingLang, LandingRoute>> {
  const group = LANDING_ROUTES[id].group;
  const out: Partial<Record<LandingLang, LandingRoute>> = {};
  if (!group) {
    out[LANDING_ROUTES[id].lang] = LANDING_ROUTES[id];
    return out;
  }
  for (const r of Object.values(LANDING_ROUTES)) if (r.group === group) out[r.lang] = r;
  return out;
}

/**
 * Tools hub ("Resume Tools" / "Outils CV" / "AI-tools"): lists every tool page
 * for a language and is the middle level of their breadcrumbs.
 */
export const TOOLS_HUB: Record<LandingLang, { path: string; label: string }> = {
  en: { path: "/resume-tools", label: "Resume Tools" },
  fr: { path: "/fr/outils-cv", label: "Outils CV" },
  nl: { path: "/nl/ai-tools", label: "AI-tools" },
};

/** Hub groupings, in display order. */
export const TOOL_GROUPS: Record<LandingLang, { title: string; ids: LandingId[] }[]> = {
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
  nl: [
    { title: "Maken", ids: ["ai-cv-maker"] },
    { title: "Controleren en verbeteren", ids: ["ats-cv", "cv-check", "cv-verbeteren"] },
    { title: "Afstemmen en solliciteren", ids: ["cv-afstemmen-op-vacature", "sollicitatiebrief-generator"] },
  ],
};

/** Tool landing pages for a language (guide pillars excluded). */
export function landingRoutesFor(lang: LandingLang): LandingRoute[] {
  return LANDING_IDS.map((id) => LANDING_ROUTES[id]).filter((r) => r.lang === lang && !r.parent);
}

export function findLandingByPath(pathname: string): LandingRoute | undefined {
  return LANDING_IDS.map((id) => LANDING_ROUTES[id]).find((r) => r.path === pathname);
}

/** The page of `group` in `lang` (e.g. the Dutch "match" page), if it exists. */
export function landingInGroup(group: LandingGroup, lang: LandingLang): LandingRoute | undefined {
  return Object.values(LANDING_ROUTES).find((r) => r.group === group && r.lang === lang);
}

/**
 * Path of the equivalent page in `target` language, if `pathname` is a tool
 * page or a tools hub. Used by the language switcher so the user stays on the
 * same tool (/ai-cv-builder ⇄ /fr/generateur-cv-ia ⇄ /nl/ai-cv-maker).
 * Pages with no equivalent fall back to the target language's tools hub.
 */
export function landingAlternatePath(pathname: string, target: LandingLang): string | null {
  const langs: LandingLang[] = ["en", "fr", "nl"];
  if (langs.some((l) => TOOLS_HUB[l].path === pathname)) return TOOLS_HUB[target].path;
  const route = findLandingByPath(pathname);
  if (!route) return null;
  if (route.lang === target) return route.path;
  const equivalent = landingAlternates(route.id)[target]?.path;
  if (equivalent) return equivalent;
  // Deliberate fallback: guides go to Career resources, tools to the tools hub.
  if (route.parent === "careers") return target === "en" ? "/careers" : `/${target}/careers`;
  return TOOLS_HUB[target].path;
}
