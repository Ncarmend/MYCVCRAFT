/**
 * AI generation helpers — backed by Anthropic Claude
 */
import Anthropic from "@anthropic-ai/sdk";
import type { CVFormData } from "@/types";

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

const MODEL = "claude-haiku-4-5-20251001";

async function ask(system: string, user: string, maxTokens = 2000): Promise<string> {
  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  const block = msg.content[0];
  return block.type === "text" ? block.text : "";
}

async function askJSON(system: string, user: string, maxTokens = 1024): Promise<unknown> {
  const text = await ask(system, user + "\n\nRespond with valid JSON only, no markdown.", maxTokens);
  const match = text.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : text);
}

export async function generateCV(data: CVFormData): Promise<string> {
  return ask(
    "You are an expert CV writer and career coach. Generate professional, ATS-optimized CV content in clean HTML format. Use strong action verbs, quantify achievements where possible, and ensure the content is tailored to the job title.",
    buildCVPrompt(data),
    2000,
  );
}

export async function optimizeCV(
  cvContent: string,
): Promise<{ content: string; score: number; suggestions: string[] }> {
  const result = (await askJSON(
    "You are an ATS optimization expert. Analyze the CV and return a JSON object with: content (improved CV HTML), score (ATS score 0-100), suggestions (array of improvement tips).",
    `Optimize this CV for ATS systems and return JSON:\n\n${cvContent}`,
    1500,
  )) as { content?: string; score?: number; suggestions?: string[] };

  return {
    content: result.content ?? cvContent,
    score: result.score ?? 70,
    suggestions: result.suggestions ?? [],
  };
}

export async function matchJobDescription(
  cvContent: string,
  jobDescription: string,
): Promise<{ matchScore: number; improvements: string[]; keywords: string[] }> {
  const result = (await askJSON(
    "You are a career expert. Analyze how well a CV matches a job description. Return JSON with: matchScore (0-100), improvements (array of specific changes), keywords (missing keywords to add).",
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
): Promise<string> {
  return ask(
    "You are a professional cover letter writer. Write compelling, personalized cover letters that highlight relevant experience and show enthusiasm for the role.",
    `Write a professional cover letter for ${companyName}.\n\nCV:\n${cvContent}\n\nJob Description:\n${jobDescription}`,
    800,
  );
}

export async function getOpenAIBullets({
  role,
  company,
  description,
}: {
  role: string;
  company?: string;
  description?: string;
}): Promise<string[]> {
  const result = (await askJSON(
    "You are an expert CV writer. Generate 3-5 concise, impactful achievement bullet points for a job role. Use strong action verbs, quantify achievements where plausible, and keep each bullet under 15 words. Return a JSON object with a 'bullets' array of strings.",
    `Role: ${role}\nCompany: ${company || "N/A"}\nDescription: ${description || "N/A"}\n\nGenerate bullet points.`,
  )) as { bullets?: string[] };

  return Array.isArray(result.bullets) ? result.bullets : [];
}

export async function generateSummary(data: CVFormData): Promise<string> {
  const text = await ask(
    "You are an expert CV writer. Write a concise, compelling professional summary paragraph (3-4 sentences, under 80 words). Rules: plain text only, no HTML tags, no markdown, no bullet points, no headings, do NOT repeat the person's name or job title — jump straight into the description. Return only the paragraph text, nothing else.",
    `Job Title: ${data.jobTitle}
Experience: ${JSON.stringify(data.experience?.slice(0, 2) ?? [])}
Skills: ${Array.isArray(data.skills) ? data.skills.join(", ") : (data.skills ?? "")}

Write the professional summary paragraph now.`,
    200,
  );
  return text.trim();
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
