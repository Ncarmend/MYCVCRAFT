/**
 * OpenAI client + CV generation helpers
 */
import OpenAI from "openai";
import type { CVFormData } from "@/types";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

/**
 * Generate a professional CV from structured form data
 */
export async function generateCV(data: CVFormData): Promise<string> {
  const prompt = buildCVPrompt(data);

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an expert CV writer and career coach. Generate professional, ATS-optimized CV content in clean HTML format. Use strong action verbs, quantify achievements where possible, and ensure the content is tailored to the job title.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content ?? "";
}

/**
 * Optimize an existing CV for ATS (Applicant Tracking Systems)
 */
export async function optimizeCV(
  cvContent: string
): Promise<{ content: string; score: number; suggestions: string[] }> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an ATS optimization expert. Analyze the CV and return a JSON object with: content (improved CV HTML), score (ATS score 0-100), suggestions (array of improvement tips).",
      },
      {
        role: "user",
        content: `Optimize this CV for ATS systems and return JSON:\n\n${cvContent}`,
      },
    ],
    temperature: 0.5,
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");
  return {
    content: result.content ?? cvContent,
    score: result.score ?? 70,
    suggestions: result.suggestions ?? [],
  };
}

/**
 * Match a CV against a job description and suggest improvements
 */
export async function matchJobDescription(
  cvContent: string,
  jobDescription: string
): Promise<{ matchScore: number; improvements: string[]; keywords: string[] }> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a career expert. Analyze how well a CV matches a job description. Return JSON with: matchScore (0-100), improvements (array of specific changes), keywords (missing keywords to add).",
      },
      {
        role: "user",
        content: `CV:\n${cvContent}\n\nJob Description:\n${jobDescription}\n\nReturn JSON analysis.`,
      },
    ],
    temperature: 0.5,
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");
  return {
    matchScore: result.matchScore ?? 50,
    improvements: result.improvements ?? [],
    keywords: result.keywords ?? [],
  };
}

/**
 * Generate a tailored cover letter
 */
export async function generateCoverLetter(
  cvContent: string,
  jobDescription: string,
  companyName: string
): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a professional cover letter writer. Write compelling, personalized cover letters that highlight relevant experience and show enthusiasm for the role.",
      },
      {
        role: "user",
        content: `Write a professional cover letter for ${companyName}.\n\nCV:\n${cvContent}\n\nJob Description:\n${jobDescription}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  return response.choices[0]?.message?.content ?? "";
}

/**
 * Generate achievement bullet points for a job experience entry
 */
export async function getOpenAIBullets({
  role,
  company,
  description,
}: {
  role: string;
  company?: string;
  description?: string;
}): Promise<string[]> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an expert CV writer. Generate 3-5 concise, impactful achievement bullet points for a job role. Use strong action verbs, quantify achievements where plausible, and keep each bullet under 15 words. Return a JSON object with a 'bullets' array of strings.",
      },
      {
        role: "user",
        content: `Role: ${role}\nCompany: ${company || "N/A"}\nDescription: ${description || "N/A"}\n\nGenerate bullet points.`,
      },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");
  return Array.isArray(result.bullets) ? result.bullets : [];
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
