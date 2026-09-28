/**
 * Job Match scoring engine — deterministic, documented, and independent of
 * any single AI call's phrasing. AI is only ever used upstream to turn free
 * text (a job posting, or the user's own CV list items) into the structured
 * shapes below; the actual score is plain arithmetic over those shapes, so
 * re-running the same structured input always produces the same number.
 *
 * Anti-fabrication guarantee: `CvProfile` is built by `buildCvProfile()`
 * directly from the CV's own stored fields (skills/languages/education/
 * experience) — never by asking AI to "extract" or "guess" the user's
 * profile. AI only relabels items that are already in the list (see
 * `canonicalizeCvSkills` in lib/openai.ts); it can't add one the user never
 * entered, because there's no generative step on the CV side of the match.
 */
import { parseCvDate } from "@/lib/cvSort";

export const JOB_MATCH_WEIGHTS = {
  skills: 0.40,
  experience: 0.25,
  keywords: 0.20,
  education: 0.10,
  languages: 0.05,
} as const;

/** A skill/keyword/requirement tagged with a language-independent id ("react", "web-developer") alongside its original-language display text. */
export interface CanonicalItem {
  canonical: string;
  label: string;
}

export interface JobRequirements {
  requiredSkills: CanonicalItem[];
  niceToHaveSkills: CanonicalItem[];
  minYears: number | null;
  domains: string[];
  education: CanonicalItem[];
  languages: CanonicalItem[];
  keywords: CanonicalItem[];
  responsibilities: string[];
}

export interface CvProfile {
  skills: CanonicalItem[];
  totalExperienceYears: number;
  experienceText: string;
  education: CanonicalItem[];
  languages: CanonicalItem[];
}

export interface MatchBreakdown {
  skills: number;
  experience: number;
  keywords: number;
  education: number;
  languages: number;
}

export interface MatchResult {
  score: number;
  breakdown: MatchBreakdown;
  matchingSkills: string[];
  missingSkills: string[];
  matchingKeywords: string[];
  missingKeywords: string[];
}

interface CvLike {
  skills?: unknown;
  languages?: unknown;
  education?: unknown;
  experience?: unknown;
}

/**
 * Builds the CV half of the comparison straight from the CV's own stored
 * data — no AI call, no chance of inventing a skill. `skillCanonicals` /
 * `languageCanonicals` / `educationCanonicals` are the AI-assigned canonical
 * ids for the user's own existing list items (see canonicalizeCvSkills);
 * when absent, the raw lowercased label is used as its own canonical id, so
 * the engine still works (same-language matching only) if that call fails.
 */
export function buildCvProfile(
  cv: CvLike,
  canonicals?: { skills?: Record<string, string>; languages?: Record<string, string>; education?: Record<string, string> }
): CvProfile {
  const rawSkills = Array.isArray(cv.skills) ? (cv.skills as string[]) : [];
  const rawLanguages = Array.isArray(cv.languages)
    ? (cv.languages as Array<{ name?: string }>).map((l) => l?.name).filter((n): n is string => Boolean(n))
    : [];
  const rawEducation = Array.isArray(cv.education)
    ? (cv.education as Array<{ degree?: string; field?: string }>).map((e) => [e?.degree, e?.field].filter(Boolean).join(" "))
    : [];
  const experience = Array.isArray(cv.experience) ? (cv.experience as Array<Record<string, unknown>>) : [];

  const toCanonical = (label: string, map?: Record<string, string>): CanonicalItem => ({
    canonical: map?.[label] ?? label.trim().toLowerCase(),
    label,
  });

  const experienceText = experience
    .map((e) =>
      [e.role, e.company, e.description, ...(Array.isArray(e.achievements) ? (e.achievements as string[]) : [])]
        .filter((v) => typeof v === "string")
        .join(" ")
    )
    .join(" ")
    .toLowerCase();

  let totalExperienceYears = 0;
  for (const e of experience) {
    const start = parseCvDate((e as Record<string, unknown>).startDate);
    const endRaw = parseCvDate((e as Record<string, unknown>).endDate);
    if (start === null) continue;
    const end = endRaw === null ? start : endRaw === Infinity ? monthsNow() : endRaw;
    if (end > start) totalExperienceYears += (end - start) / 12;
  }

  return {
    skills: rawSkills.filter(Boolean).map((s) => toCanonical(s, canonicals?.skills)),
    totalExperienceYears: Math.round(totalExperienceYears * 10) / 10,
    experienceText,
    education: rawEducation.filter(Boolean).map((s) => toCanonical(s, canonicals?.education)),
    languages: rawLanguages.map((s) => toCanonical(s, canonicals?.languages)),
  };
}

function monthsNow(): number {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Normalizes a canonical id at comparison time (lowercase, alnum-only,
 * hyphen-joined). Canonical ids should already arrive in this shape from AI
 * extraction/canonicalization, but the CV side falls back to a raw lowercased
 * label when that call is unavailable — normalizing both sides here means a
 * punctuation difference ("Next.js" vs "next-js") can never cause a false
 * "missing" verdict for a skill that's actually present.
 */
function slug(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** Pure, deterministic scoring — same inputs always produce the same output. */
export function computeJobMatch(job: JobRequirements, cv: CvProfile): MatchResult {
  const cvSkillSet = new Set(cv.skills.map((s) => slug(s.canonical)));
  const cvEducationSet = new Set(cv.education.map((s) => slug(s.canonical)));
  const cvLanguageSet = new Set(cv.languages.map((s) => slug(s.canonical)));
  const haystack = [
    cv.experienceText,
    ...cv.skills.map((s) => s.label.toLowerCase()),
    ...cv.education.map((s) => s.label.toLowerCase()),
    ...cv.languages.map((s) => s.label.toLowerCase()),
  ].join(" ");

  // ── Skills ──
  const requiredMatched = job.requiredSkills.filter((s) => cvSkillSet.has(slug(s.canonical)));
  const niceMatched = job.niceToHaveSkills.filter((s) => cvSkillSet.has(slug(s.canonical)));
  const requiredMissing = job.requiredSkills.filter((s) => !cvSkillSet.has(slug(s.canonical)));
  const niceMissing = job.niceToHaveSkills.filter((s) => !cvSkillSet.has(slug(s.canonical)));

  let skillsScore: number;
  if (job.requiredSkills.length === 0 && job.niceToHaveSkills.length === 0) {
    skillsScore = 100;
  } else if (job.requiredSkills.length > 0 && job.niceToHaveSkills.length > 0) {
    skillsScore = clamp(
      (requiredMatched.length / job.requiredSkills.length) * 80 +
      (niceMatched.length / job.niceToHaveSkills.length) * 20
    );
  } else if (job.requiredSkills.length > 0) {
    skillsScore = clamp((requiredMatched.length / job.requiredSkills.length) * 100);
  } else {
    skillsScore = clamp((niceMatched.length / job.niceToHaveSkills.length) * 100);
  }

  // ── Experience ──
  let experienceScore = 100;
  {
    const hasYears = job.minYears !== null && job.minYears > 0;
    const hasDomains = job.domains.length > 0;
    const yearsScore = hasYears ? clamp((cv.totalExperienceYears / (job.minYears as number)) * 100) : null;
    const matchedDomains = job.domains.filter((d) => haystack.includes(d.toLowerCase()));
    const domainScore = hasDomains ? clamp((matchedDomains.length / job.domains.length) * 100) : null;

    if (yearsScore !== null && domainScore !== null) experienceScore = clamp(yearsScore * 0.6 + domainScore * 0.4);
    else if (yearsScore !== null) experienceScore = yearsScore;
    else if (domainScore !== null) experienceScore = domainScore;
  }

  // ── Keywords (general, beyond the skills list) ──
  const keywordsMatched = job.keywords.filter((k) => haystack.includes(slug(k.canonical)) || haystack.includes(k.label.toLowerCase()));
  const keywordsMissing = job.keywords.filter((k) => !keywordsMatched.includes(k));
  const keywordsScore = job.keywords.length === 0 ? 100 : clamp((keywordsMatched.length / job.keywords.length) * 100);

  // ── Education ──
  const educationScore =
    job.education.length === 0
      ? 100
      : job.education.some((e) => cvEducationSet.has(slug(e.canonical))) ? 100 : 0;

  // ── Languages ──
  const languagesMatchedCount = job.languages.filter((l) => cvLanguageSet.has(slug(l.canonical))).length;
  const languagesScore = job.languages.length === 0 ? 100 : clamp((languagesMatchedCount / job.languages.length) * 100);

  const breakdown: MatchBreakdown = {
    skills: skillsScore,
    experience: experienceScore,
    keywords: keywordsScore,
    education: educationScore,
    languages: languagesScore,
  };

  const score = clamp(
    breakdown.skills * JOB_MATCH_WEIGHTS.skills +
    breakdown.experience * JOB_MATCH_WEIGHTS.experience +
    breakdown.keywords * JOB_MATCH_WEIGHTS.keywords +
    breakdown.education * JOB_MATCH_WEIGHTS.education +
    breakdown.languages * JOB_MATCH_WEIGHTS.languages
  );

  return {
    score,
    breakdown,
    matchingSkills: [...requiredMatched, ...niceMatched].map((s) => s.label),
    missingSkills: [...requiredMissing, ...niceMissing].map((s) => s.label),
    matchingKeywords: keywordsMatched.map((k) => k.label),
    missingKeywords: keywordsMissing.map((k) => k.label),
  };
}
