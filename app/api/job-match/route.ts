/**
 * POST /api/job-match — run a CV ↔ job description analysis (Premium/Pass feature)
 * GET  /api/job-match — list the authenticated user's own past analyses
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { isProUser } from "@/lib/isPro";
import { checkAIQuota, aiErrorResponse, AIQuotaError } from "@/lib/aiGuard";
import {
  extractJobRequirements,
  canonicalizeCvSkills,
  generateJobMatchRecommendations,
  fallbackJobMatchRecommendations,
  type Lang,
} from "@/lib/openai";
import { buildCvProfile, computeJobMatch } from "@/lib/jobMatch";

function parseLang(value: unknown): Lang {
  return value === "fr" || value === "nl" ? value : "en";
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { subscription: true },
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await request.json();
    const cvId = typeof body.cvId === "string" ? body.cvId : "";
    const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim().slice(0, 200) : "";
    const companyName = typeof body.companyName === "string" ? body.companyName.trim().slice(0, 200) : "";
    const jobDescription = typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";
    const lang = parseLang(body.lang);

    if (!cvId) return NextResponse.json({ error: "cvId is required" }, { status: 400 });
    if (jobDescription.length < 40) {
      return NextResponse.json({ error: "Please paste the full job description (at least a few sentences)." }, { status: 400 });
    }

    // Ownership check — never trust a client-supplied user id, and never let
    // a user analyze a CV that isn't theirs.
    const cv = await prisma.cV.findFirst({ where: { id: cvId, userId: dbUser.id } });
    if (!cv) return NextResponse.json({ error: "CV not found" }, { status: 404 });

    // Job Match's full analysis is a Premium/7-Day-Pass feature (already the
    // documented plan in lib/plans.ts) — the page itself stays open to
    // everyone, only this action is gated.
    if (!isProUser(dbUser.subscription)) {
      return NextResponse.json(
        { error: "Job Match analysis is a Premium feature. Upgrade to run it.", code: "UPGRADE_REQUIRED" },
        { status: 403 }
      );
    }

    await checkAIQuota(user.id);

    const skills = Array.isArray(cv.skills) ? (cv.skills as string[]) : [];
    const languages = Array.isArray(cv.languages)
      ? (cv.languages as Array<{ name?: string }>).map((l) => l?.name).filter((n): n is string => Boolean(n))
      : [];
    const education = Array.isArray(cv.education)
      ? (cv.education as Array<{ degree?: string; field?: string }>).map((e) => [e?.degree, e?.field].filter(Boolean).join(" ")).filter(Boolean)
      : [];

    const [job, canonicals] = await Promise.all([
      extractJobRequirements(jobDescription),
      canonicalizeCvSkills(skills, languages, education),
    ]);

    const cvProfile = buildCvProfile(cv, canonicals);
    const result = computeJobMatch(job, cvProfile);

    const experienceGap =
      job.minYears && cvProfile.totalExperienceYears < job.minYears
        ? `${job.minYears}+ years required, CV shows ~${cvProfile.totalExperienceYears}`
        : null;
    const educationGap = result.breakdown.education < 100 && job.education.length > 0;
    const languageGap = job.languages
      .filter((l) => !cvProfile.languages.some((cl) => cl.canonical === l.canonical))
      .map((l) => l.label);

    const recInput = {
      matchingSkills: result.matchingSkills,
      missingSkills: result.missingSkills,
      missingKeywords: result.missingKeywords,
      experienceGap,
      educationGap,
      languageGap,
    };

    let recommendations: string[];
    try {
      recommendations = await generateJobMatchRecommendations(recInput, lang);
      if (recommendations.length === 0) recommendations = fallbackJobMatchRecommendations(recInput, lang);
    } catch {
      recommendations = fallbackJobMatchRecommendations(recInput, lang);
    }

    const saved = await prisma.jobMatch.create({
      data: {
        userId: dbUser.id,
        cvId: cv.id,
        jobTitle: jobTitle || null,
        companyName: companyName || null,
        jobDescription,
        lang,
        score: result.score,
        skillsScore: result.breakdown.skills,
        experienceScore: result.breakdown.experience,
        keywordsScore: result.breakdown.keywords,
        educationScore: result.breakdown.education,
        languagesScore: result.breakdown.languages,
        matchingSkills: result.matchingSkills,
        missingSkills: result.missingSkills,
        matchingKeywords: result.matchingKeywords,
        missingKeywords: result.missingKeywords,
        recommendations,
      },
    });

    return NextResponse.json({
      id: saved.id,
      score: result.score,
      breakdown: result.breakdown,
      matchingSkills: result.matchingSkills,
      missingSkills: result.missingSkills,
      matchingKeywords: result.matchingKeywords,
      missingKeywords: result.missingKeywords,
      recommendations,
      createdAt: saved.createdAt,
    });
  } catch (err) {
    console.error("[POST /api/job-match]", err);
    const mapped = aiErrorResponse(err);
    const status = err instanceof AIQuotaError ? 429 : 500;
    return NextResponse.json(mapped, { status });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const cvId = request.nextUrl.searchParams.get("cvId");

    const history = await prisma.jobMatch.findMany({
      where: { userId: dbUser.id, ...(cvId ? { cvId } : {}) },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        cvId: true,
        jobTitle: true,
        companyName: true,
        score: true,
        skillsScore: true,
        experienceScore: true,
        keywordsScore: true,
        educationScore: true,
        languagesScore: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ history });
  } catch (err) {
    console.error("[GET /api/job-match]", err);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}
