/**
 * Editorial architecture: every careers article belongs to one topic cluster.
 * A cluster defines
 *   - its pillar page(s) — the commercial landing page articles point to,
 *   - the conversion CTA shown in its articles,
 * and drives "related articles" so readers move through a topic, not at random.
 *
 * The roadmap of planned (not yet written) content lives in docs/seo-content-plan.md.
 */
import { articles, type Article } from "@/lib/articles";
import { LANDING_ROUTES, type LandingId } from "@/lib/landing-routes";

export type ClusterId =
  | "ai-resumes"
  | "ats"
  | "job-matching"
  | "application"
  | "france"
  | "belgium"
  | "job-search";

type Lang = "en" | "fr" | "nl";
type CtaKey = "build" | "ats" | "match" | "cover" | "improve";

interface CtaCopy {
  heading: string;
  body: string;
  button: string;
  href: string;
}

/**
 * Conversion CTAs. Wording must match the product: the ATS score, job matching
 * and cover letters are Premium; creating, importing and AI drafting are free.
 * Dutch has no landing pages yet, so NL CTAs point to the app directly.
 */
const CTAS: Record<CtaKey, Record<Lang, CtaCopy>> = {
  build: {
    en: { heading: "Build your CV with AI", body: "Turn your experience into a structured, professional CV — free to start.", button: "Start my CV for free", href: "/ai-cv-builder" },
    fr: { heading: "Créez votre CV avec l'IA", body: "Transformez votre parcours en un CV structuré et professionnel — gratuit pour commencer.", button: "Créer mon CV gratuitement", href: "/fr/generateur-cv-ia" },
    nl: { heading: "Maak je cv met AI", body: "Zet je ervaring om in een gestructureerd, professioneel cv — gratis om te starten.", button: "Maak gratis je cv", href: "/signup" },
  },
  ats: {
    en: { heading: "Check your CV's ATS readiness", body: "Start from an ATS-friendly template for free, then get an ATS score from 0 to 100 with concrete suggestions (Premium).", button: "Check my CV with CVixeo", href: "/cv-optimizer" },
    fr: { heading: "Vérifiez la compatibilité ATS de votre CV", body: "Partez d'un modèle compatible ATS gratuitement, puis obtenez un score ATS de 0 à 100 avec des suggestions concrètes (Premium).", button: "Analyser mon CV avec CVixeo", href: "/fr/analyser-cv" },
    nl: { heading: "Controleer of je cv ATS-proof is", body: "Start gratis met een ATS-vriendelijk sjabloon en krijg met Premium een ATS-score van 0 tot 100 met concrete suggesties.", button: "Start met CVixeo", href: "/signup" },
  },
  match: {
    en: { heading: "Compare your resume to a job posting with CVixeo", body: "Paste the job description to see the missing skills and keywords, a match score by category, and what to change (Premium).", button: "Compare my CV to a job", href: "/job-description-matching" },
    fr: { heading: "Comparez votre CV à une offre avec CVixeo", body: "Collez l'annonce : compétences et mots-clés manquants, score de correspondance détaillé et modifications à faire (Premium).", button: "Comparer mon CV à une offre", href: "/fr/cv-offre-emploi" },
    nl: { heading: "Vergelijk je cv met een vacature", body: "Plak de vacature: ontbrekende vaardigheden en zoekwoorden, een matchscore per onderdeel en concrete aanpassingen (Premium).", button: "Probeer Job Match", href: "/nl/job-match" },
  },
  cover: {
    en: { heading: "Write a cover letter tailored to the job", body: "Generate a first draft from your CV, the job description and the company name, then make it yours (Premium).", button: "Generate my cover letter", href: "/cover-letter-generator" },
    fr: { heading: "Rédigez une lettre adaptée à l'offre", body: "Générez un premier jet à partir de votre CV, de l'offre et du nom de l'entreprise, puis personnalisez-le (Premium).", button: "Générer ma lettre", href: "/fr/lettre-motivation" },
    nl: { heading: "Schrijf een sollicitatiebrief op maat", body: "Genereer een eerste versie op basis van je cv, de vacature en de bedrijfsnaam, en maak hem daarna persoonlijk (Premium).", button: "Start met CVixeo", href: "/signup" },
  },
  improve: {
    en: { heading: "Improve the CV you already have", body: "Import your CV (PDF, DOCX or TXT) and let AI rewrite it sharper — free to start.", button: "Improve my CV", href: "/resume-optimizer" },
    fr: { heading: "Améliorez le CV que vous avez déjà", body: "Importez votre CV (PDF, DOCX ou TXT) et laissez l'IA le reformuler — gratuit pour commencer.", button: "Optimiser mon CV", href: "/fr/optimiser-cv" },
    nl: { heading: "Verbeter het cv dat je al hebt", body: "Importeer je cv (PDF, DOCX of TXT) en laat AI het scherper herschrijven — gratis om te starten.", button: "Verbeter mijn cv", href: "/signup" },
  },
};

export const CLUSTERS: Record<
  ClusterId,
  { label: Record<Lang, string>; cta: CtaKey; pillar?: Partial<Record<Lang, LandingId>> }
> = {
  "ai-resumes":   { label: { en: "AI resumes", fr: "CV et IA", nl: "Cv en AI" }, cta: "build", pillar: { en: "ai-cv-builder", fr: "generateur-cv-ia" } },
  ats:            { label: { en: "ATS", fr: "ATS", nl: "ATS" }, cta: "ats", pillar: { en: "ats-cv-builder", fr: "cv-ats" } },
  "job-matching": { label: { en: "Job matching", fr: "Adapter son CV à une offre", nl: "Cv afstemmen op een vacature" }, cta: "match", pillar: { en: "job-description-matching", fr: "cv-offre-emploi" } },
  application:    { label: { en: "Applications", fr: "Candidature", nl: "Solliciteren" }, cta: "build" },
  france:         { label: { en: "CVs in France", fr: "CV en France", nl: "Cv in Frankrijk" }, cta: "build" },
  belgium:        { label: { en: "CVs in Belgium", fr: "CV en Belgique", nl: "Cv in België" }, cta: "build", pillar: { fr: "cv-belgique" } },
  "job-search":   { label: { en: "Job search", fr: "Recherche d'emploi", nl: "Werk zoeken" }, cta: "build" },
};

/** Cluster of every article. Unlisted slugs fall back to "application". */
const ARTICLE_CLUSTER: Record<string, ClusterId> = {
  // EN
  "how-to-create-ats-friendly-resume-2026": "ats",
  "what-is-an-ats": "ats",
  "does-my-resume-pass-ats": "ats",
  "resume-keywords": "ats",
  "how-to-tailor-resume-to-job-posting": "job-matching",
  "how-to-analyze-job-posting": "job-matching",
  "how-to-use-ai-to-write-resume": "ai-resumes",
  "10-resume-mistakes-that-prevent-interview": "application",
  "how-to-write-effective-cover-letter": "application",
  "one-page-vs-two-page-resume": "application",
  "best-practices-career-change": "application",
  "resume-no-experience": "application",
  "how-to-optimize-linkedin-profile": "job-search",
  "skills-most-sought-after-by-recruiters-2026": "job-search",
  "how-to-ace-job-interview": "job-search",
  "how-to-negotiate-salary": "job-search",
  // FR
  "cv-intelligence-artificielle-optimiser-candidature": "ai-resumes",
  "ia-adapter-cv-offre-emploi": "ai-resumes",
  "chatgpt-peut-il-creer-bon-cv": "ai-resumes",
  "analyser-offre-emploi": "job-matching",
  "adapter-cv-offre-emploi-belgique": "job-matching",
  "cv-sans-experience": "application",
  "15-erreurs-a-eviter-cv-professionnel": "application",
  "mettre-en-valeur-competences-cv": "application",
  "lettre-motivation-emploi-belgique": "application",
  "cv-ats-compatible-france": "france",
  "cv-avec-ou-sans-photo-france": "france",
  "presenter-competences-cv-france": "france",
  "lettre-motivation-france": "france",
  "cv-professionnel-belgique-guide-2026": "belgium",
  "regles-cv-belge": "belgium",
  "cv-belge-avec-ou-sans-photo": "belgium",
  "premier-emploi-bruxelles-cv-candidature": "belgium",
  "trouver-emploi-bruxelles-guide-2026": "job-search",
  "travailler-bruxelles-reussir-recherche-emploi": "job-search",
  "actiris-inscription-trouver-emploi-bruxelles": "job-search",
  "onem-demarches-demandeurs-emploi-belgique": "job-search",
  "forem-actiris-vdab-quel-organisme-choisir": "job-search",
  "agences-interim-recrutement-belgique": "job-search",
  "chomage-belgique-2026-taux-statistiques-mesures": "job-search",
  "combien-chomeurs-belgique-2026": "job-search",
  "sites-emploi-france-guide": "job-search",
  "inscription-france-travail-guide": "job-search",
  "apec-ou-france-travail": "job-search",
  "interim-france-trouver-mission-rapidement": "job-search",
  "chomage-france-2026-taux-statistiques-tendances": "job-search",
  // NL
  "ats-vriendelijk-cv-maken": "ats",
  "cv-aanpassen-aan-vacature": "job-matching",
  "professioneel-cv-maken-belgie": "belgium",
  "goede-sollicitatiebrief-schrijven": "application",
  "job-vinden-zonder-ervaring": "application",
  "solliciteren-belgie-tips-kandidatuur": "job-search",
  "job-vinden-brussel": "job-search",
  "vdab-job-vinden-vlaanderen": "job-search",
  "werk-zoeken-belgie-complete-gids": "job-search",
  "werkloosheid-belgie-cijfers-regels": "job-search",
};

/** Per-article CTA when the cluster default isn't the most relevant next step. */
const CTA_OVERRIDE: Record<string, CtaKey> = {
  "how-to-write-effective-cover-letter": "cover",
  "lettre-motivation-france": "cover",
  "lettre-motivation-emploi-belgique": "cover",
  "goede-sollicitatiebrief-schrijven": "cover",
  "cv-ats-compatible-france": "ats",
  "ia-adapter-cv-offre-emploi": "match",
  "adapter-cv-offre-emploi-belgique": "match",
  "10-resume-mistakes-that-prevent-interview": "improve",
  "15-erreurs-a-eviter-cv-professionnel": "improve",
  "best-practices-career-change": "improve",
  "mettre-en-valeur-competences-cv": "match",
  "presenter-competences-cv-france": "match",
  "skills-most-sought-after-by-recruiters-2026": "match",
  "how-to-use-ai-to-write-resume": "build",
};

export function getArticleCluster(article: Article): ClusterId {
  return ARTICLE_CLUSTER[article.slug] ?? "application";
}

export function getArticleCta(article: Article): CtaCopy {
  const key = CTA_OVERRIDE[article.slug] ?? CLUSTERS[getArticleCluster(article)].cta;
  return CTAS[key][(article.lang ?? "en") as Lang];
}

/** Pillar page of the article's cluster in its language, if one exists. */
export function getArticlePillar(article: Article) {
  const id = CLUSTERS[getArticleCluster(article)].pillar?.[(article.lang ?? "en") as Lang];
  return id ? LANDING_ROUTES[id] : null;
}

/** Same language; same cluster first, then same category, then most recent. */
export function getClusterRelated(current: Article, limit = 3): Article[] {
  const lang = current.lang ?? "en";
  const cluster = getArticleCluster(current);
  const score = (a: Article) =>
    (getArticleCluster(a) === cluster ? 2 : 0) + (a.category === current.category ? 1 : 0);
  return articles
    .filter((a) => a.slug !== current.slug && (a.lang ?? "en") === lang)
    .sort((a, b) => score(b) - score(a) || +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, limit);
}

/** Articles of one cluster in one language (used to check coverage and by pillar pages). */
export function articlesInCluster(cluster: ClusterId, lang: Lang): Article[] {
  return articles.filter((a) => (a.lang ?? "en") === lang && getArticleCluster(a) === cluster);
}
