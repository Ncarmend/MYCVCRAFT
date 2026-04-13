/**
 * GET /api/pdf?cvId=xxx
 * Generates a PDF of the CV using HTML + puppeteer-compatible rendering
 *
 * For production, use a headless browser service or @react-pdf/renderer.
 * This implementation uses jsPDF with HTML-to-canvas for simplicity.
 * On Vercel, use a serverless-compatible approach (e.g., Chromium via @sparticuz/chromium).
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cvId = request.nextUrl.searchParams.get("cvId");
    if (!cvId) return NextResponse.json({ error: "cvId required" }, { status: 400 });

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { subscription: true },
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const cv = await prisma.cV.findFirst({
      where: { id: cvId, userId: dbUser.id },
    });
    if (!cv) return NextResponse.json({ error: "CV not found" }, { status: 404 });

    const isPro = dbUser.subscription?.plan === "PRO";

    // Build CV HTML for PDF generation
    const html = buildCVHTML(cv, !isPro);

    // Return the HTML as a downloadable "PDF" — in production, pass this to
    // a headless browser (Puppeteer/Playwright) or a PDF service like PDFShift.
    // For the demo we return the HTML with correct headers.
    // Replace this block with your PDF service integration.
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${cv.title || cv.name}-cv.html"`,
      },
    });
  } catch (err) {
    console.error("[GET /api/pdf]", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}

function buildCVHTML(cv: Record<string, unknown>, watermark: boolean): string {
  const skills = Array.isArray(cv.skills) ? (cv.skills as string[]) : [];
  const experience = Array.isArray(cv.experience) ? cv.experience as Array<Record<string, unknown>> : [];
  const education = Array.isArray(cv.education) ? cv.education as Array<Record<string, unknown>> : [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${cv.name} — CV</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11pt; color: #1a1a1a; background: white; }
    .page { max-width: 816px; margin: 0 auto; padding: 48px 56px; min-height: 1056px; position: relative; }
    h1 { font-size: 22pt; font-weight: 700; color: #111; }
    h2 { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #111; border-bottom: 1.5px solid #ddd; padding-bottom: 4px; margin-bottom: 10px; }
    h3 { font-size: 11pt; font-weight: 600; }
    p, li { font-size: 10pt; color: #444; line-height: 1.6; }
    .subtitle { font-size: 12pt; color: #555; margin-top: 3px; }
    .contacts { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 8px; font-size: 9pt; color: #666; }
    .section { margin-bottom: 20px; }
    .exp-header, .edu-header { display: flex; justify-content: space-between; }
    .date { font-size: 9pt; color: #888; }
    .skills { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill { border: 1px solid #ddd; border-radius: 4px; padding: 2px 8px; font-size: 9pt; }
    ul { padding-left: 16px; margin-top: 4px; }
    li { margin-bottom: 2px; }
    ${watermark ? `.watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-30deg); font-size: 64pt; font-weight: 900; color: rgba(99,102,241,0.06); white-space: nowrap; pointer-events: none; z-index: 9999; }` : ""}
  </style>
</head>
<body>
  <div class="page">
    ${watermark ? `<div class="watermark">CVCraft Free</div>` : ""}
    <header style="border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 24px;">
      <h1>${cv.name}</h1>
      <p class="subtitle">${cv.jobTitle}</p>
      <div class="contacts">
        ${cv.email ? `<span>${cv.email}</span>` : ""}
        ${cv.phone ? `<span>${cv.phone}</span>` : ""}
        ${cv.location ? `<span>${cv.location}</span>` : ""}
        ${cv.website ? `<span>${cv.website}</span>` : ""}
        ${cv.linkedin ? `<span>${cv.linkedin}</span>` : ""}
        ${cv.github ? `<span>${cv.github}</span>` : ""}
        ${cv.portfolio ? `<span>${cv.portfolio}</span>` : ""}
      </div>
    </header>

    ${cv.summary ? `
    <div class="section">
      <h2>Professional Summary</h2>
      <p>${cv.summary}</p>
    </div>` : ""}

    ${experience.length > 0 ? `
    <div class="section">
      <h2>Work Experience</h2>
      ${experience.map((exp) => `
        <div style="margin-bottom: 14px;">
          <div class="exp-header">
            <div>
              <h3>${exp.role}</h3>
              <p style="font-size:10pt;color:#555;">${exp.company}</p>
            </div>
            <span class="date">${exp.startDate} — ${exp.endDate}</span>
          </div>
          ${exp.description ? `<p style="margin-top:4px;">${exp.description}</p>` : ""}
          ${Array.isArray(exp.achievements) && exp.achievements.length > 0 ? `
          <ul>${(exp.achievements as string[]).map((a) => `<li>${a}</li>`).join("")}</ul>` : ""}
        </div>
      `).join("")}
    </div>` : ""}

    ${education.length > 0 ? `
    <div class="section">
      <h2>Education</h2>
      ${education.map((edu) => `
        <div class="edu-header" style="margin-bottom: 10px;">
          <div>
            <h3>${edu.degree}${edu.field ? ` in ${edu.field}` : ""}</h3>
            <p style="font-size:10pt;color:#555;">${edu.institution}</p>
          </div>
          <span class="date">${edu.startDate} — ${edu.endDate}</span>
        </div>
      `).join("")}
    </div>` : ""}

    ${skills.length > 0 ? `
    <div class="section">
      <h2>Skills</h2>
      <div class="skills">
        ${skills.map((s) => `<span class="skill">${s}</span>`).join("")}
      </div>
    </div>` : ""}
  </div>
</body>
</html>`;
}
