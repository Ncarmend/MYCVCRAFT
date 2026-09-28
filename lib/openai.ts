/**
 * AI generation helpers — backed by Anthropic Claude
 */
import Anthropic, { APIError, AuthenticationError, PermissionDeniedError, RateLimitError, APIConnectionError } from "@anthropic-ai/sdk";
import type { CVFormData } from "@/types";

export type Lang = "en" | "fr" | "nl";

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("AI_MISSING_KEY");
  }
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

const MODEL = "claude-haiku-4-5-20251001";

/** Appended to every system prompt when the user chose French or Dutch. */
function langInstruction(lang: Lang): string {
  if (lang === "fr") return " Write ALL text content (summaries, bullet points, descriptions, suggestions, improvements) in French.";
  if (lang === "nl") return " Write ALL text content (summaries, bullet points, descriptions, suggestions, improvements) in Dutch (Belgian Dutch register — e.g. \"cv\", \"sollicitatie\", \"werkervaring\").";
  return "";
}

async function ask(system: string, user: string, maxTokens = 2000): Promise<string> {
  try {
    const msg = await getClient().messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    });
    const block = msg.content[0];
    return block.type === "text" ? block.text : "";
  } catch (err: unknown) {
    // Rethrow our own sentinel errors as-is
    if (err instanceof Error && (err.message === "AI_MISSING_KEY" || err.message === "AI_NO_CREDITS")) {
      throw err;
    }
    // Map Anthropic SDK errors to named sentinels so aiErrorResponse can handle them
    if (err instanceof AuthenticationError || err instanceof PermissionDeniedError) {
      console.error("[ai] API key rejected by Anthropic:", err.message);
      throw new Error("AI_AUTH_ERROR");
    }
    if (err instanceof RateLimitError) {
      console.error("[ai] Anthropic rate limit hit");
      throw new Error("AI_RATE_LIMIT");
    }
    if (err instanceof APIConnectionError) {
      console.error("[ai] Could not reach Anthropic API:", err.message);
      throw new Error("AI_CONNECTION_ERROR");
    }
    if (err instanceof APIError) {
      const msg = err.message ?? "";
      if (msg.includes("credit balance") || msg.includes("insufficient_quota")) {
        throw new Error("AI_NO_CREDITS");
      }
      console.error("[ai] Anthropic API error", err.status, err.message);
      throw new Error(`AI_API_ERROR:${err.status}`);
    }
    // Unknown error — log the full details for debugging
    console.error("[ai] Unexpected error in ask():", err);
    throw err;
  }
}

async function askJSON(system: string, user: string, maxTokens = 1024): Promise<unknown> {
  const text = await ask(system, user + "\n\nRespond with valid JSON only, no markdown.", maxTokens);
  const match = text.match(/\{[\s\S]*\}/);
  try {
    return JSON.parse(match ? match[0] : text);
  } catch {
    console.error("[ai] JSON parse failed. Raw response:", text.slice(0, 500));
    throw new Error("AI_INVALID_JSON");
  }
}

export async function generateCV(data: CVFormData, lang: Lang = "en"): Promise<string> {
  return ask(
    `You are an expert CV writer and career coach. Generate professional, ATS-optimized CV content in clean HTML format. Use strong action verbs, quantify achievements where possible, and ensure the content is tailored to the job title.${langInstruction(lang)}`,
    buildCVPrompt(data),
    2000,
  );
}

export async function optimizeCV(
  cvContent: string,
  lang: Lang = "en",
): Promise<{ score: number; suggestions: string[] }> {
  const result = (await askJSON(
    `You are an ATS optimization expert. Analyze the CV and return a JSON object with exactly two fields: score (integer 0-100 representing ATS compatibility), suggestions (array of 3-5 concise improvement tips as strings).${langInstruction(lang)}`,
    `Analyze this CV for ATS compatibility and return JSON with score and suggestions:\n\n${cvContent}`,
    512,
  )) as { score?: number; suggestions?: string[] };

  return {
    score: typeof result.score === "number" ? result.score : 70,
    suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
  };
}

export async function matchJobDescription(
  cvContent: string,
  jobDescription: string,
  lang: Lang = "en",
): Promise<{ matchScore: number; improvements: string[]; keywords: string[] }> {
  const result = (await askJSON(
    `You are a career expert. Analyze how well a CV matches a job description. Return JSON with: matchScore (0-100), improvements (array of specific changes), keywords (missing keywords to add).${langInstruction(lang)}`,
    `CV:\n${cvContent}\n\nJob Description:\n${jobDescription}\n\nReturn JSON analysis.`,
  )) as { matchScore?: number; improvements?: string[]; keywords?: string[] };

  return {
    matchScore: result.matchScore ?? 50,
    improvements: result.improvements ?? [],
    keywords: result.keywords ?? [],
  };
}

export async function generateCoverLetter(
  cvContent: string,
  jobDescription: string,
  companyName: string,
  lang: Lang = "en",
): Promise<string> {
  return ask(
    `You are a professional cover letter writer. Write compelling, personalized cover letters that highlight relevant experience and show enthusiasm for the role.${langInstruction(lang)}`,
    `Write a professional cover letter for ${companyName}.\n\nCV:\n${cvContent}\n\nJob Description:\n${jobDescription}`,
    800,
  );
}

export async function getOpenAIBullets({
  role,
  company,
  description,
  lang = "en",
}: {
  role: string;
  company?: string;
  description?: string;
  lang?: Lang;
}): Promise<string[]> {
  const result = (await askJSON(
    `You are an expert CV writer. Generate 3-5 concise, impactful achievement bullet points for a job role. Use strong action verbs, quantify achievements where plausible, and keep each bullet under 15 words. Return a JSON object with a 'bullets' array of strings.${langInstruction(lang)}`,
    `Role: ${role}\nCompany: ${company || "N/A"}\nDescription: ${description || "N/A"}\n\nGenerate bullet points.`,
  )) as { bullets?: string[] };

  return Array.isArray(result.bullets) ? result.bullets : [];
}

export async function generateSummary(data: CVFormData, lang: Lang = "en"): Promise<string> {
  const text = await ask(
    `You are an expert CV writer. Write a concise, compelling professional summary paragraph (3-4 sentences, under 80 words). Rules: plain text only, no HTML tags, no markdown, no bullet points, no headings, do NOT repeat the person's name or job title — jump straight into the description. Return only the paragraph text, nothing else.${langInstruction(lang)}`,
    `Job Title: ${data.jobTitle}
Experience: ${JSON.stringify(data.experience?.slice(0, 2) ?? [])}
Skills: ${Array.isArray(data.skills) ? data.skills.join(", ") : (data.skills ?? "")}

Write the professional summary paragraph now.`,
    200,
  );
  return text.trim();
}

export async function parseAndImproveResume(rawText: string, lang: Lang = "en"): Promise<Partial<CVFormData>> {
  const langNote = lang === "fr"
    ? " Write ALL text content (summary, achievements, descriptions, role names, skill names) in French. JSON keys must stay in English. The 'proficiency' field must use only these exact English values: Native, Fluent, Advanced, Intermediate, Basic."
    : "";

  const result = (await askJSON(
    `You are an expert CV parser and ATS optimizer. Extract structured data from a resume and return it as clean JSON. Improve all content: rewrite the summary to be compelling (2–3 sentences, strong action verbs, ATS keywords), rewrite bullet points with quantified achievements (action verb + metric), and identify all relevant skills.${langNote}`,
    `Parse and improve this resume. Return JSON only matching the schema below.

RESUME TEXT:
${rawText.slice(0, 8000)}

Required JSON schema:
{
  "title": "job-based CV title string",
  "name": "full name",
  "jobTitle": "current or target job title",
  "email": "email or empty string",
  "phone": "phone or empty string",
  "location": "city, country or empty string",
  "website": "URL or empty string",
  "linkedin": "linkedin URL or handle or empty string",
  "github": "github URL or handle or empty string",
  "summary": "REWRITTEN: compelling 2-3 sentence summary with ATS keywords and action verbs",
  "skills": ["up to 15 relevant skills"],
  "experience": [{"id":"1","company":"","role":"","startDate":"e.g. 2020","endDate":"year or Present","description":"one-line summary","achievements":["IMPROVED bullet: action verb + quantified result"]}],
  "education": [{"id":"1","institution":"","degree":"","field":"","startDate":"year","endDate":"year","grade":"GPA or empty string"}],
  "projects": [{"id":"1","name":"","description":"","technologies":[],"url":""}],
  "languages": [{"id":"1","name":"","proficiency":"Native|Fluent|Advanced|Intermediate|Basic"}],
  "certifications": [{"id":"1","name":"","issuer":"","date":"year or year-month","url":""}]
}`,
    4096,
  )) as Partial<CVFormData>;

  // Normalise IDs to prevent collisions in react-hook-form fieldArrays
  return {
    ...result,
    experience:     (result.experience     ?? []).map((e, i) => ({ ...e, id: `exp_${i}` })),
    education:      (result.education      ?? []).map((e, i) => ({ ...e, id: `edu_${i}` })),
    projects:       (result.projects       ?? []).map((e, i) => ({ ...e, id: `proj_${i}` })),
    languages:      (result.languages      ?? []).map((e, i) => ({ ...e, id: `lang_${i}` })),
    certifications: (result.certifications ?? []).map((e, i) => ({ ...e, id: `cert_${i}` })),
  };
}

// --- Job Match ---
//
// AI is used in two narrowly-scoped, non-fabricating ways here:
//  1. extractJobRequirements() reads ONLY the job posting's own text — it
//     can't invent anything about the candidate because it never sees a CV.
//  2. canonicalizeCvSkills() relabels items the user already entered with a
//     cross-language id; it must return exactly one output per input item,
//     never more, never fewer — so it cannot add a skill.
// The actual score is computed elsewhere (lib/jobMatch.ts) as plain
// arithmetic over these structured shapes, not by asking AI for a number.

const CANONICAL_ID_RULE =
  "Every \"canonical\" value must be a short, generic, lowercase, hyphenated English identifier for the underlying concept, independent of the language it was written in — e.g. \"react\", \"typescript\", \"docker\", \"web-development\", \"rest-api\", \"bachelor-computer-science\", \"french\", \"english\", \"dutch\". Equivalent concepts in different languages (e.g. \"développeur web\", \"web developer\", \"webontwikkelaar\") MUST resolve to the exact same canonical id.";

export interface JobRequirementsRaw {
  requiredSkills: { canonical: string; label: string }[];
  niceToHaveSkills: { canonical: string; label: string }[];
  minYears: number | null;
  domains: string[];
  education: { canonical: string; label: string }[];
  languages: { canonical: string; label: string }[];
  keywords: { canonical: string; label: string }[];
  responsibilities: string[];
}

/**
 * Extracts structured requirements from a job posting's free text. Job
 * descriptions may be French, English, or Dutch — the model detects this
 * itself, since "label" is always returned in the posting's own language
 * regardless of the app's current UI language.
 */
export async function extractJobRequirements(jobDescription: string): Promise<JobRequirementsRaw> {
  const result = (await askJSON(
    `You are a recruiting analyst. Read a job description (it may be written in French, English, or Dutch — detect the language yourself) and extract structured requirements. ${CANONICAL_ID_RULE} "label" must stay in the job description's own original language. Return JSON only, matching this schema exactly:
{
  "requiredSkills": [{"canonical":"","label":""}],
  "niceToHaveSkills": [{"canonical":"","label":""}],
  "minYears": null,
  "domains": ["short lowercase-hyphenated domain/keyword tokens, e.g. frontend-development, saas"],
  "education": [{"canonical":"","label":""}],
  "languages": [{"canonical":"","label":""}],
  "keywords": [{"canonical":"","label":""}],
  "responsibilities": ["short strings in the original language"]
}
Do not invent requirements that aren't stated or clearly implied by the posting. If a category has no information, return an empty array (or null for minYears).`,
    `Job description:\n\n${jobDescription.slice(0, 6000)}`,
    1536,
  )) as Partial<JobRequirementsRaw>;

  return {
    requiredSkills: Array.isArray(result.requiredSkills) ? result.requiredSkills : [],
    niceToHaveSkills: Array.isArray(result.niceToHaveSkills) ? result.niceToHaveSkills : [],
    minYears: typeof result.minYears === "number" ? result.minYears : null,
    domains: Array.isArray(result.domains) ? result.domains : [],
    education: Array.isArray(result.education) ? result.education : [],
    languages: Array.isArray(result.languages) ? result.languages : [],
    keywords: Array.isArray(result.keywords) ? result.keywords : [],
    responsibilities: Array.isArray(result.responsibilities) ? result.responsibilities : [],
  };
}

/**
 * Tags the CV's OWN existing skills/languages/education with a cross-language
 * canonical id. This never adds, removes, or rewrites an item's meaning —
 * each output entry corresponds 1:1 to an input entry by position.
 */
export async function canonicalizeCvSkills(
  skills: string[],
  languages: string[],
  education: string[],
): Promise<{ skills: Record<string, string>; languages: Record<string, string>; education: Record<string, string> }> {
  if (skills.length === 0 && languages.length === 0 && education.length === 0) {
    return { skills: {}, languages: {}, education: {} };
  }

  const result = (await askJSON(
    `You are tagging a person's existing CV list items with a cross-language identifier — you are NOT extracting or inventing anything, only relabeling exactly the items given to you. ${CANONICAL_ID_RULE} Return one output entry for every input entry, in the same order, never more and never fewer. Return JSON only, matching this schema exactly:
{
  "skills": [{"original":"","canonical":""}],
  "languages": [{"original":"","canonical":""}],
  "education": [{"original":"","canonical":""}]
}`,
    `Skills: ${JSON.stringify(skills)}\nLanguages: ${JSON.stringify(languages)}\nEducation: ${JSON.stringify(education)}`,
    1024,
  )) as { skills?: { original: string; canonical: string }[]; languages?: { original: string; canonical: string }[]; education?: { original: string; canonical: string }[] };

  const toMap = (arr?: { original: string; canonical: string }[]): Record<string, string> =>
    Object.fromEntries((arr ?? []).filter((e) => e && e.original).map((e) => [e.original, e.canonical]));

  return {
    skills: toMap(result.skills),
    languages: toMap(result.languages),
    education: toMap(result.education),
  };
}

export interface JobMatchRecommendationInput {
  matchingSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  experienceGap: string | null;
  educationGap: boolean;
  languageGap: string[];
}

/**
 * Writes recommendation text strictly from the pre-computed matching/missing
 * lists — the prompt forbids introducing anything not already in them, so it
 * cannot fabricate experience, employers, degrees, or skills. If this call
 * fails, callers should use `fallbackJobMatchRecommendations()` instead.
 */
export async function generateJobMatchRecommendations(input: JobMatchRecommendationInput, lang: Lang = "en"): Promise<string[]> {
  const result = (await askJSON(
    `You are a career coach writing CV improvement recommendations. You will be given exactly which skills/keywords are already present and which are missing. Rules: ONLY reference items that appear in the provided lists below. NEVER invent or assume any skill, employer, degree, certification, language, or achievement that isn't explicitly listed. If something is missing, phrase it as missing/to highlight-if-applicable, never as something the person already has. Return JSON with a "recommendations" array of 3-6 short, concrete, actionable strings.${langInstruction(lang)}`,
    `Already present (matching skills): ${JSON.stringify(input.matchingSkills)}
Missing skills: ${JSON.stringify(input.missingSkills)}
Missing keywords: ${JSON.stringify(input.missingKeywords)}
Experience gap: ${input.experienceGap ?? "none"}
Education requirement unmet: ${input.educationGap}
Missing languages: ${JSON.stringify(input.languageGap)}`,
    768,
  )) as { recommendations?: string[] };

  return Array.isArray(result.recommendations) ? result.recommendations : [];
}

/** Deterministic, non-AI fallback used when generateJobMatchRecommendations fails or returns malformed JSON — guarantees a safe, non-fabricating result even on AI failure. */
export function fallbackJobMatchRecommendations(input: JobMatchRecommendationInput, lang: Lang = "en"): string[] {
  const out: string[] = [];
  const templates = {
    en: {
      skill: (s: string) => `If you have experience with ${s}, make sure it's clearly visible on your CV.`,
      keyword: (k: string) => `Consider adding "${k}" if it genuinely applies to your background.`,
      experience: (g: string) => `Experience gap: ${g}.`,
      education: () => `This role lists an education requirement not currently reflected on your CV.`,
      language: (l: string) => `This role expects ${l}, which isn't currently listed on your CV.`,
    },
    fr: {
      skill: (s: string) => `Si vous avez de l'expérience avec ${s}, assurez-vous qu'elle apparaît clairement sur votre CV.`,
      keyword: (k: string) => `Envisagez d'ajouter « ${k} » si cela correspond réellement à votre profil.`,
      experience: (g: string) => `Écart d'expérience : ${g}.`,
      education: () => `Cette offre mentionne un niveau d'études qui n'apparaît pas actuellement sur votre CV.`,
      language: (l: string) => `Cette offre requiert ${l}, qui n'est pas actuellement mentionné sur votre CV.`,
    },
    nl: {
      skill: (s: string) => `Als je ervaring hebt met ${s}, zorg er dan voor dat dit duidelijk zichtbaar is op je cv.`,
      keyword: (k: string) => `Overweeg "${k}" toe te voegen als dit echt bij jouw profiel past.`,
      experience: (g: string) => `Ervaringskloof: ${g}.`,
      education: () => `Deze vacature vermeldt een opleidingsvereiste die momenteel niet op je cv staat.`,
      language: (l: string) => `Deze vacature vereist ${l}, wat momenteel niet op je cv staat.`,
    },
  }[lang];

  input.missingSkills.slice(0, 3).forEach((s) => out.push(templates.skill(s)));
  input.missingKeywords.slice(0, 2).forEach((k) => out.push(templates.keyword(k)));
  if (input.experienceGap) out.push(templates.experience(input.experienceGap));
  if (input.educationGap) out.push(templates.education());
  input.languageGap.forEach((l) => out.push(templates.language(l)));

  return out;
}

// --- Helpers ---

function buildCVPrompt(data: CVFormData): string {
  return `Generate a professional CV in clean HTML for:

Name: ${data.name}
Job Title: ${data.jobTitle}
Email: ${data.email || "N/A"}
Phone: ${data.phone || "N/A"}
Location: ${data.location || "N/A"}
Summary: ${data.summary || "Generate a compelling professional summary"}

Experience:
${JSON.stringify(data.experience, null, 2)}

Education:
${JSON.stringify(data.education, null, 2)}

Skills: ${Array.isArray(data.skills) ? data.skills.join(", ") : data.skills}

Projects:
${JSON.stringify(data.projects, null, 2)}

Return only the HTML content for the CV body (no <html> or <body> tags). Use professional formatting with clear sections. Quantify achievements where data is available.`;
}
