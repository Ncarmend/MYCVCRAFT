/**
 * GET /api/pdf?cvId=xxx&template=MODERN
 * Returns a styled HTML document for the CV, ready for browser print-to-PDF.
 * The `template` query param overrides whatever is stored in the DB so the user
 * can download with an unsaved template change.
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

    const cv = await prisma.cV.findFirst({ where: { id: cvId, userId: dbUser.id } });
    if (!cv) return NextResponse.json({ error: "CV not found" }, { status: 404 });

    const isPro = dbUser.subscription?.plan === "PRO";

    // Allow client to pass the currently selected (possibly unsaved) template
    const templateOverride = request.nextUrl.searchParams.get("template");
    const cvData = { ...cv, template: templateOverride ?? cv.template ?? "BASIC" };

    const html = buildCVHTML(cvData as Record<string, unknown>, !isPro);

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

function stripHtml(str: unknown): string {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

// Inline SVG strings — identical paths to ContactIcons.tsx, compatible with browser print-to-PDF
const SVG_BASE = `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;flex-shrink:0"`;
const ICON = {
  mail:      `<svg width="11" height="11" viewBox="0 0 24 24" ${SVG_BASE}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone:     `<svg width="11" height="11" viewBox="0 0 24 24" ${SVG_BASE}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18a2 2 0 0 1 0-.92z"/></svg>`,
  location:  `<svg width="11" height="11" viewBox="0 0 24 24" ${SVG_BASE}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  web:       `<svg width="11" height="11" viewBox="0 0 24 24" ${SVG_BASE}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20A14.5 14.5 0 0 0 12 2"/><path d="M2 12h20"/></svg>`,
  linkedin:  `<svg width="11" height="11" viewBox="0 0 24 24" ${SVG_BASE}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  github:    `<svg width="11" height="11" viewBox="0 0 24 24" ${SVG_BASE}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  portfolio: `<svg width="11" height="11" viewBox="0 0 24 24" ${SVG_BASE}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
} as const;

function sidebarContact(icon: string, value: unknown): string {
  if (!value) return "";
  return `<div class="contact" style="display:flex;align-items:center;gap:4px;">${icon}${String(value)}</div>`;
}

// ─── Per-template CSS + layout ───────────────────────────────────────────────

function getTemplateStyles(template: string, watermark: boolean): string {
  const wm = watermark
    ? `.watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:64pt;font-weight:900;color:rgba(99,102,241,0.06);white-space:nowrap;pointer-events:none;z-index:9999;}`
    : "";

  const base = `*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11pt;background:white;color:#1a1a1a;}ul{padding-left:16px;margin-top:4px;}li{margin-bottom:2px;font-size:10pt;color:#444;line-height:1.6;}${wm}`;

  switch (template) {
    case "MODERN":
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;display:flex;}
        .sidebar{width:240px;flex-shrink:0;background:#4f46e5;color:white;padding:40px 24px;}
        .sidebar h1{font-size:18pt;font-weight:700;line-height:1.2;color:white;}
        .sidebar .jobtitle{font-size:10pt;color:#c7d2fe;margin-top:6px;}
        .sidebar .contact{font-size:8.5pt;color:#c7d2fe;margin-top:4px;word-break:break-all;}
        .sidebar h2{font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#a5b4fc;border-bottom:1px solid #6366f1;padding-bottom:4px;margin:20px 0 8px;}
        .sidebar .skill{display:inline-block;background:#6366f1;border-radius:3px;padding:2px 7px;font-size:8.5pt;color:white;margin:2px 2px 2px 0;}
        .main{flex:1;padding:40px 36px;}
        .main h2{font-size:8.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#4f46e5;border-bottom:2px solid #4f46e5;padding-bottom:3px;margin-bottom:10px;}
        h3{font-size:11pt;font-weight:600;}
        .section{margin-bottom:20px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;color:#888;}
        p{font-size:10pt;color:#444;line-height:1.6;}`;

    case "EXECUTIVE":
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;}
        .header{background:#1e293b;color:white;padding:40px 56px;}
        .header h1{font-size:26pt;font-weight:700;letter-spacing:-0.5px;}
        .header .jobtitle{font-size:13pt;color:#94a3b8;margin-top:6px;}
        .header .contacts{display:flex;flex-wrap:wrap;gap:16px;margin-top:12px;font-size:9pt;color:#94a3b8;}
        .body{padding:40px 56px;}
        h2{font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#1e293b;border-bottom:2px solid #1e293b;padding-bottom:4px;margin-bottom:12px;}
        h3{font-size:11pt;font-weight:600;}
        .section{margin-bottom:22px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;color:#888;}
        p{font-size:10pt;color:#444;line-height:1.6;}
        .skill{border:1px solid #334155;border-radius:3px;padding:2px 8px;font-size:9pt;display:inline-block;margin:2px;}`;

    case "CREATIVE":
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;padding:0;}
        .header{background:#f59e0b;padding:36px 56px;}
        .header h1{font-size:26pt;font-weight:800;color:white;}
        .header .jobtitle{font-size:12pt;color:#fef3c7;margin-top:4px;font-weight:500;}
        .header .contacts{display:flex;flex-wrap:wrap;gap:16px;margin-top:10px;font-size:9pt;color:#fef3c7;}
        .body{padding:36px 56px;}
        h2{font-size:10pt;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#f59e0b;margin-bottom:10px;}
        h3{font-size:11pt;font-weight:700;}
        .section{margin-bottom:22px;border-left:3px solid #fde68a;padding-left:14px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;color:#888;}
        p{font-size:10pt;color:#444;line-height:1.6;}
        .skill{background:#fef3c7;border-radius:999px;padding:2px 10px;font-size:9pt;display:inline-block;margin:2px;color:#92400e;}`;

    case "MINIMAL":
      return `${base}
        .page{max-width:720px;margin:0 auto;min-height:1056px;padding:64px 56px;}
        .header{margin-bottom:40px;}
        .header h1{font-size:22pt;font-weight:300;letter-spacing:-0.5px;color:#111;}
        .header .jobtitle{font-size:11pt;color:#888;margin-top:4px;font-weight:400;}
        .header .contacts{display:flex;flex-wrap:wrap;gap:20px;margin-top:10px;font-size:9pt;color:#aaa;}
        h2{font-size:8pt;font-weight:400;text-transform:uppercase;letter-spacing:0.15em;color:#bbb;margin-bottom:12px;}
        h3{font-size:11pt;font-weight:600;}
        .section{margin-bottom:28px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;color:#bbb;}
        p{font-size:10pt;color:#555;line-height:1.7;}
        .skill{border:1px solid #eee;border-radius:2px;padding:2px 8px;font-size:9pt;display:inline-block;margin:2px;color:#555;}`;

    case "ELEGANT":
      return `${base}
        .page{max-width:760px;margin:0 auto;min-height:1056px;padding:56px 60px;}
        .header{text-align:center;padding-bottom:24px;margin-bottom:28px;border-bottom:1px solid #d1c4a8;}
        .header h1{font-family:Georgia,serif;font-size:28pt;font-weight:400;letter-spacing:2px;color:#2c2416;}
        .header .jobtitle{font-family:Georgia,serif;font-size:11pt;color:#7c6a4e;margin-top:6px;font-style:italic;}
        .header .contacts{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;margin-top:10px;font-size:9pt;color:#999;}
        h2{font-family:Georgia,serif;font-size:11pt;font-weight:400;font-style:italic;color:#7c6a4e;border-bottom:1px solid #d1c4a8;padding-bottom:4px;margin-bottom:12px;}
        h3{font-size:11pt;font-weight:600;}
        .section{margin-bottom:22px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;color:#aaa;}
        p{font-size:10pt;color:#444;line-height:1.7;}
        .skill{border:1px solid #d1c4a8;border-radius:2px;padding:2px 8px;font-size:9pt;display:inline-block;margin:2px;color:#7c6a4e;}`;

    case "TECH":
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;display:flex;}
        .sidebar{width:220px;flex-shrink:0;background:#0f172a;color:white;padding:36px 20px;}
        .sidebar h1{font-size:16pt;font-weight:700;color:white;line-height:1.2;}
        .sidebar .jobtitle{font-size:9pt;color:#10b981;margin-top:6px;font-family:monospace;}
        .sidebar .contact{font-size:8pt;color:#64748b;margin-top:3px;word-break:break-all;font-family:monospace;}
        .sidebar h2{font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#10b981;border-bottom:1px solid #1e293b;padding-bottom:3px;margin:18px 0 8px;}
        .sidebar .skill{display:block;font-size:8.5pt;color:#94a3b8;padding:2px 0;font-family:monospace;}
        .main{flex:1;padding:36px 32px;background:#fff;}
        .main h2{font-size:8.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#0f172a;border-bottom:2px solid #10b981;padding-bottom:3px;margin-bottom:10px;}
        h3{font-size:11pt;font-weight:600;color:#0f172a;}
        .section{margin-bottom:18px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;color:#10b981;font-family:monospace;}
        p{font-size:10pt;color:#334155;line-height:1.6;}`;

    case "CORPORATE":
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;padding:0;}
        .header{background:#1e40af;padding:36px 56px;}
        .header h1{font-size:24pt;font-weight:700;color:white;}
        .header .jobtitle{font-size:11pt;color:#bfdbfe;margin-top:6px;}
        .header .contacts{display:flex;flex-wrap:wrap;gap:16px;margin-top:12px;font-size:9pt;color:#bfdbfe;}
        .body{padding:36px 56px;}
        h2{font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#1e40af;background:#eff6ff;padding:4px 8px;margin-bottom:12px;}
        h3{font-size:11pt;font-weight:600;}
        .section{margin-bottom:20px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;color:#888;}
        p{font-size:10pt;color:#444;line-height:1.6;}
        .skill{border:1px solid #bfdbfe;border-radius:3px;padding:2px 8px;font-size:9pt;display:inline-block;margin:2px;color:#1e40af;}`;

    case "SLATE":
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;display:flex;}
        .sidebar{width:230px;flex-shrink:0;background:#334155;color:white;padding:40px 24px;}
        .sidebar h1{font-size:17pt;font-weight:700;color:white;line-height:1.2;}
        .sidebar .jobtitle{font-size:9pt;color:#94a3b8;margin-top:5px;}
        .sidebar .contact{font-size:8.5pt;color:#cbd5e1;margin-top:3px;word-break:break-all;}
        .sidebar h2{font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#94a3b8;border-bottom:1px solid #475569;padding-bottom:3px;margin:16px 0 7px;}
        .sidebar .skill{display:inline-block;background:#475569;border-radius:3px;padding:2px 7px;font-size:8pt;color:#e2e8f0;margin:2px 2px 2px 0;}
        .main{flex:1;padding:40px 32px;}
        .main h2{font-size:8.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#334155;border-bottom:2px solid #334155;padding-bottom:3px;margin-bottom:10px;}
        h3{font-size:11pt;font-weight:600;color:#111;}
        .section{margin-bottom:18px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;color:#888;background:#f1f5f9;padding:1px 6px;border-radius:3px;}
        p{font-size:10pt;color:#444;line-height:1.6;}`;

    case "WARM":
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;}
        .header{background:#f5f0e8;padding:40px 56px 32px;}
        .header h1{font-size:24pt;font-weight:700;color:#3d2b1f;}
        .header .jobtitle{font-size:12pt;color:#7c5c3e;margin-top:4px;}
        .header .contacts{display:flex;flex-wrap:wrap;gap:16px;margin-top:10px;font-size:9pt;color:#a07a5a;}
        .divider{height:3px;background:linear-gradient(90deg,#c9956a,#e8c9a0);}
        .body{padding:32px 56px;}
        h2{font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7c5c3e;border-bottom:1px solid #e8d5c0;padding-bottom:3px;margin-bottom:10px;}
        h3{font-size:11pt;font-weight:600;color:#3d2b1f;}
        .section{margin-bottom:20px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;color:#a07a5a;}
        p{font-size:10pt;color:#555;line-height:1.6;}
        .skill{background:#f5ece2;border:1px solid #e8d5c0;border-radius:999px;padding:2px 10px;font-size:9pt;display:inline-block;margin:2px;color:#7c5c3e;}`;

    case "SOFT":
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;}
        .header{background:linear-gradient(135deg,#fdf2f8 0%,#ede9fe 100%);padding:44px 56px 32px;}
        .header h1{font-size:24pt;font-weight:700;color:#4c1d5c;}
        .header .jobtitle{font-size:12pt;color:#7c3aed;margin-top:5px;}
        .header .contacts{display:flex;flex-wrap:wrap;gap:16px;margin-top:10px;font-size:9pt;color:#9461b8;}
        .body{padding:32px 56px;}
        h2{font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7c3aed;margin-bottom:10px;}
        h3{font-size:11pt;font-weight:600;color:#111;}
        .section{margin-bottom:20px;background:#faf5ff;border:1px solid #ede9fe;border-radius:8px;padding:12px 14px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;background:#ede9fe;color:#5b21b6;padding:1px 7px;border-radius:999px;}
        p{font-size:10pt;color:#444;line-height:1.6;}
        .skill{background:#fce7f3;border:1px solid #fbcfe8;border-radius:999px;padding:2px 10px;font-size:9pt;display:inline-block;margin:2px;color:#9d174d;}`;

    case "PHOTO":
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;display:flex;}
        .sidebar{width:220px;flex-shrink:0;background:#1e1b4b;color:white;padding:40px 20px;text-align:center;}
        .photo{width:100px;height:100px;border-radius:50%;background:#4f46e5;margin:0 auto 16px;border:3px solid #6366f1;display:flex;align-items:center;justify-content:center;font-size:24pt;font-weight:700;color:white;overflow:hidden;}
        .photo img{width:100%;height:100%;object-fit:cover;}
        .sidebar h1{font-size:15pt;font-weight:700;color:white;text-align:center;}
        .sidebar .jobtitle{font-size:8.5pt;color:#a5b4fc;margin-top:5px;text-align:center;}
        .sidebar-contact{text-align:left;margin-top:16px;}
        .sidebar-contact .contact{font-size:8pt;color:#c7d2fe;margin-top:3px;word-break:break-all;}
        .sidebar h2{font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#818cf8;border-bottom:1px solid #312e81;padding-bottom:3px;margin:16px 0 7px;text-align:left;}
        .sidebar .skill{display:block;font-size:8pt;text-align:left;}
        .bar-bg{height:4px;background:#312e81;border-radius:2px;margin-top:2px;}
        .bar-fg{height:4px;background:#6366f1;border-radius:2px;}
        .main{flex:1;padding:40px 32px;}
        .main h2{font-size:8.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#4338ca;border-bottom:2px solid #4338ca;padding-bottom:3px;margin-bottom:10px;}
        h3{font-size:11pt;font-weight:600;color:#111;}
        .section{margin-bottom:18px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;color:#3730a3;background:#e0e7ff;padding:1px 7px;border-radius:999px;}
        p{font-size:10pt;color:#444;line-height:1.6;}`;

    case "CLASSIC":
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;padding:52px 64px;font-family:'Times New Roman',Times,serif;font-size:11pt;color:#111;line-height:1.5;}
        .header{text-align:center;padding-bottom:14px;margin-bottom:20px;border-bottom:2px solid #111;}
        .header h1{font-size:24pt;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;}
        .header .jobtitle{font-size:12pt;color:#444;margin-top:4px;font-style:italic;}
        .header .contacts{font-size:9pt;color:#555;margin-top:6px;}
        h2{font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#111;border-bottom:1.5px solid #111;padding-bottom:3px;margin-bottom:10px;}
        h3{font-size:11pt;font-weight:700;}
        .section{margin-bottom:18px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-style:italic;color:#555;}
        .company{font-style:italic;color:#333;}
        p{color:#333;}
        .skill-list{color:#333;}`;

    case "CRISP":
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;}
        .header{background:#eff6ff;border-bottom:3px solid #2563eb;padding:36px 52px 28px;}
        .header h1{font-size:22pt;font-weight:800;color:#0f172a;margin:0;letter-spacing:-0.3px;}
        .header .jobtitle{font-size:12pt;color:#2563eb;font-weight:500;margin-top:5px;}
        .header .contacts{display:flex;flex-wrap:wrap;gap:16px;margin-top:10px;font-size:9pt;color:#64748b;}
        .body{padding:32px 52px;}
        h2{font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#2563eb;margin-bottom:8px;display:flex;align-items:center;gap:8px;}
        h2::before{content:'';display:inline-block;width:3px;height:14px;background:#2563eb;border-radius:2px;flex-shrink:0;}
        h3{font-size:11pt;font-weight:700;color:#0f172a;}
        .section{margin-bottom:22px;}
        .entry{padding-left:12px;border-left:2px solid #e2e8f0;margin-bottom:14px;}
        .row{display:flex;justify-content:space-between;align-items:flex-start;}
        .date{font-size:9pt;color:#64748b;background:#eff6ff;padding:2px 8px;border-radius:4px;white-space:nowrap;}
        .company{color:#2563eb;font-weight:500;}
        p{color:#475569;line-height:1.6;}
        .skill{border:1px solid #2563eb;border-radius:4px;padding:2px 10px;font-size:9.5pt;color:#2563eb;background:#eff6ff;display:inline-block;margin:2px;}`;

    default: // BASIC
      return `${base}
        .page{max-width:816px;margin:0 auto;min-height:1056px;padding:48px 56px;}
        .header{border-bottom:2px solid #111;padding-bottom:16px;margin-bottom:24px;}
        .header h1{font-size:22pt;font-weight:700;color:#111;}
        .header .jobtitle{font-size:12pt;color:#555;margin-top:3px;}
        .header .contacts{display:flex;flex-wrap:wrap;gap:16px;margin-top:8px;font-size:9pt;color:#666;}
        h2{font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#111;border-bottom:1.5px solid #ddd;padding-bottom:4px;margin-bottom:10px;}
        h3{font-size:11pt;font-weight:600;}
        .section{margin-bottom:20px;}
        .row{display:flex;justify-content:space-between;}
        .date{font-size:9pt;color:#888;}
        p{font-size:10pt;color:#444;line-height:1.6;}
        .skill{border:1px solid #ddd;border-radius:4px;padding:2px 8px;font-size:9pt;display:inline-block;margin:2px;}`;
  }
}

// ─── Reusable section builders ────────────────────────────────────────────────

function experienceHTML(experience: Array<Record<string, unknown>>): string {
  if (!experience.length) return "";
  return `<div class="section">
    <h2>Work Experience</h2>
    ${experience.map((exp) => `
      <div style="margin-bottom:14px;">
        <div class="row">
          <div><h3>${exp.role}</h3><p style="font-size:10pt;color:#555;">${exp.company}</p></div>
          <span class="date">${exp.startDate} — ${exp.endDate}</span>
        </div>
        ${exp.description ? `<p style="margin-top:4px;">${stripHtml(exp.description)}</p>` : ""}
        ${Array.isArray(exp.achievements) && (exp.achievements as string[]).length
          ? `<ul>${(exp.achievements as string[]).map((a) => `<li>${a}</li>`).join("")}</ul>`
          : ""}
      </div>`).join("")}
  </div>`;
}

function educationHTML(education: Array<Record<string, unknown>>): string {
  if (!education.length) return "";
  return `<div class="section">
    <h2>Education</h2>
    ${education.map((edu) => `
      <div class="row" style="margin-bottom:10px;">
        <div>
          <h3>${edu.degree}${edu.field ? ` in ${edu.field}` : ""}</h3>
          <p style="font-size:10pt;color:#555;">${edu.institution}</p>
        </div>
        <span class="date">${edu.startDate} — ${edu.endDate}</span>
      </div>`).join("")}
  </div>`;
}

function skillsHTML(skills: string[], className = "skill"): string {
  if (!skills.length) return "";
  return `<div class="section">
    <h2>Skills</h2>
    <div style="display:flex;flex-wrap:wrap;gap:4px;">
      ${skills.map((s) => `<span class="${className}">${s}</span>`).join("")}
    </div>
  </div>`;
}

function projectsHTML(projects: Array<Record<string, unknown>>): string {
  if (!projects.length) return "";
  return `<div class="section">
    <h2>Projects</h2>
    ${projects.map((proj) => `
      <div style="margin-bottom:12px;">
        <div class="row" style="align-items:baseline;">
          <h3>${proj.name}</h3>
          ${proj.url ? `<span style="font-size:9pt;color:#888;">${proj.url}</span>` : ""}
        </div>
        ${proj.description ? `<p style="margin-top:3px;">${stripHtml(proj.description as string)}</p>` : ""}
        ${Array.isArray(proj.technologies) && (proj.technologies as string[]).length
          ? `<p style="margin-top:4px;font-size:9pt;color:#888;">${(proj.technologies as string[]).join(" · ")}</p>`
          : ""}
      </div>`).join("")}
  </div>`;
}

function languagesHTML(languages: Array<Record<string, unknown>>): string {
  if (!languages.length) return "";
  return `<div class="section">
    <h2>Languages</h2>
    <div style="display:flex;flex-wrap:wrap;gap:4px;">
      ${languages.map((l) => `<span class="skill"><strong>${l.name}</strong> — ${l.proficiency}</span>`).join("")}
    </div>
  </div>`;
}

function certificationsHTML(certifications: Array<Record<string, unknown>>): string {
  if (!certifications.length) return "";
  return `<div class="section">
    <h2>Certifications</h2>
    ${certifications.map((c) => `
      <div class="row" style="margin-bottom:6px;">
        <span><strong>${c.name}</strong> · ${c.issuer}</span>
        <span class="date">${c.date}</span>
      </div>`).join("")}
  </div>`;
}

// ─── Main builder ─────────────────────────────────────────────────────────────

function buildCVHTML(cv: Record<string, unknown>, watermark: boolean): string {
  const template = (cv.template as string) || "BASIC";
  const skills = Array.isArray(cv.skills) ? (cv.skills as string[]) : [];
  const experience = Array.isArray(cv.experience) ? cv.experience as Array<Record<string, unknown>> : [];
  const education = Array.isArray(cv.education) ? cv.education as Array<Record<string, unknown>> : [];
  const projects = Array.isArray(cv.projects) ? cv.projects as Array<Record<string, unknown>> : [];
  const languages = Array.isArray(cv.languages) ? cv.languages as Array<Record<string, unknown>> : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications as Array<Record<string, unknown>> : [];

  const css = getTemplateStyles(template, watermark);
  const wm = watermark ? `<div class="watermark">Cvixeo Free</div>` : "";

  // Two-column templates with sidebar
  const twoColumnTemplates = ["MODERN", "TECH", "SLATE", "PHOTO"] as const;
  if (twoColumnTemplates.includes(template as typeof twoColumnTemplates[number])) {
    const skillEl = template === "TECH" ? "div" : "span";
    const sidebarSkillsHtml = skills.length
      ? `<h2>Skills</h2>${skills.map((s) => `<${skillEl} class="skill">${s}</${skillEl}>`).join(" ")}`
      : "";
    const sidebarLangHtml = languages.length
      ? `<h2>Languages</h2>${languages.map((l) => `<div class="contact"><strong>${l.name}</strong> — ${l.proficiency}</div>`).join("")}`
      : "";

    // PHOTO template has circular photo / initials at top of sidebar
    const photoEl = template === "PHOTO"
      ? cv.photoUrl
        ? `<div class="photo"><img src="${cv.photoUrl}" alt="${cv.name}" /></div>`
        : `<div class="photo">${String(cv.name ?? "").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}</div>`
      : "";

    return `<!DOCTYPE html><html lang="en"><head>
      <meta charset="UTF-8"/>
      <title>${cv.name} — CV</title>
      <style>${css}</style>
    </head><body>
      <div class="page">
        ${wm}
        <div class="sidebar">
          ${photoEl}
          <h1>${cv.name}</h1>
          <div class="jobtitle">${cv.jobTitle}</div>
          <div class="${template === "PHOTO" ? "sidebar-contact" : ""}">
            ${sidebarContact(ICON.mail,      cv.email)}
            ${sidebarContact(ICON.phone,     cv.phone)}
            ${sidebarContact(ICON.location,  cv.location)}
            ${sidebarContact(ICON.web,       cv.website)}
            ${sidebarContact(ICON.linkedin,  cv.linkedin)}
            ${sidebarContact(ICON.github,    cv.github)}
          </div>
          ${sidebarSkillsHtml}
          ${sidebarLangHtml}
          ${certificationsHTML(certifications)}
        </div>
        <div class="main">
          ${cv.summary ? `<div class="section"><h2>Summary</h2><p>${stripHtml(cv.summary)}</p></div>` : ""}
          ${experienceHTML(experience)}
          ${educationHTML(education)}
          ${projectsHTML(projects)}
        </div>
      </div>
    </body></html>`;
  }

  // All single-column templates share the same structure, only CSS differs
  const hasColorHeader = ["EXECUTIVE", "CREATIVE", "CORPORATE", "WARM", "SOFT", "CRISP"].includes(template);

  const contactSpans = (
    [
      [ICON.mail,      cv.email],
      [ICON.phone,     cv.phone],
      [ICON.location,  cv.location],
      [ICON.web,       cv.website],
      [ICON.linkedin,  cv.linkedin],
      [ICON.github,    cv.github],
      [ICON.portfolio, cv.portfolio],
    ] as [string, unknown][]
  )
    .filter(([, v]) => Boolean(v))
    .map(([icon, v]) => `<span style="display:inline-flex;align-items:center;gap:4px;">${icon}${String(v)}</span>`)
    .join("");

  const headerHTML = hasColorHeader
    ? `<div class="header">
        <h1>${cv.name}</h1>
        <div class="jobtitle">${cv.jobTitle}</div>
        <div class="contacts">${contactSpans}</div>
      </div>
      ${template === "WARM" ? `<div class="divider"></div>` : ""}
      <div class="body">`
    : `<div class="page">
        ${wm}
        <div class="header">
          <h1>${cv.name}</h1>
          <div class="jobtitle">${cv.jobTitle}</div>
          <div class="contacts">${contactSpans}</div>
        </div>`;

  const bodyContent = `
    ${cv.summary ? `<div class="section"><h2>Professional Summary</h2><p>${stripHtml(cv.summary)}</p></div>` : ""}
    ${experienceHTML(experience)}
    ${educationHTML(education)}
    ${skillsHTML(skills)}
    ${projectsHTML(projects)}
    ${languagesHTML(languages)}
    ${certificationsHTML(certifications)}`;

  const footerHTML = hasColorHeader ? `</div>` : `</div>`;

  return `<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8"/>
    <title>${cv.name} — CV</title>
    <style>${css}</style>
  </head><body>
    ${wm}
    ${headerHTML}
    ${bodyContent}
    ${footerHTML}
  </body></html>`;
}
