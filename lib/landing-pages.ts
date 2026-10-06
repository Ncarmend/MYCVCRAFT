/**
 * Copy for the SEO landing pages (see lib/landing-routes.ts for the registry).
 *
 * Each page targets one search intent and must stay factually aligned with the
 * product: Premium-only features (ATS score, job match, cover letters, AI
 * summary/bullets) are labelled as such, and no statistic appears here that
 * isn't derived from the code (e.g. job-match weights come from lib/jobMatch.ts).
 *
 * Inline links use a minimal "[anchor](/path)" syntax, rendered by
 * components/seo/SeoLandingPage.tsx.
 */
import type { LandingId } from "@/lib/landing-routes";

export interface LandingSection {
  heading: string;
  /** Rendered before the blocks below. */
  paragraphs?: string[];
  cards?: { title: string; body: string }[];
  bullets?: string[];
  steps?: { title: string; body: string }[];
  dosDonts?: { doTitle: string; dontTitle: string; dos: string[]; donts: string[] };
  example?: { beforeLabel: string; before: string; afterLabel: string; after: string };
  /** Renders the real job-match scoring weights from lib/jobMatch.ts. */
  matchWeights?: boolean;
  /** Rendered after all other blocks (concluding remarks). */
  outro?: string[];
}

export interface LandingPageContent {
  /** Without brand: the root layout template appends "| Cvixeo". */
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  highlights: string[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  sections: LandingSection[];
  faq: { q: string; a: string }[];
  related: LandingId[];
  /** Careers article slugs (same language) for "Further reading". */
  articles: string[];
  closing: { heading: string; body: string };
}

export const LANDING_PAGES: Record<LandingId, LandingPageContent> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // ENGLISH
  // ═══════════════════════════════════════════════════════════════════════════

  "ai-cv-builder": {
    metaTitle: "AI CV Builder – Create a Professional CV with AI",
    metaDescription:
      "Build a professional CV with AI: enter your experience, get a polished summary and bullet points, pick one of 15 templates and export to PDF. Free to start.",
    eyebrow: "AI CV Builder",
    h1: "Build a Professional CV with AI, Step by Step",
    intro:
      "Cvixeo's AI CV builder turns your experience into a structured, well-written CV. You provide the facts — roles, dates, skills, results — and the AI drafts clear sections you can review, edit and export as a PDF.",
    highlights: ["AI-written summary and bullet points", "15 professional templates", "ATS-friendly structure", "PDF export"],
    primaryCta: { label: "Build my CV for free", href: "/signup" },
    secondaryCta: { label: "See pricing", href: "/pricing" },
    sections: [
      {
        heading: "How an AI CV builder works",
        paragraphs: [
          "A blank page is the hardest part of writing a CV. An AI CV generator removes it: you fill in a guided form (or import an existing CV), and the AI turns your raw information into professional wording with strong action verbs and a consistent tone.",
          "The important word is *your*. Cvixeo works from the information you enter. It improves phrasing and structure, but you remain the author: review every line and remove anything that doesn't reflect your real experience before you send it.",
        ],
      },
      {
        heading: "What the AI helps you write",
        cards: [
          { title: "Professional summary", body: "A short paragraph at the top of your CV that states who you are, your level of experience and what you bring to your target role." },
          { title: "Experience bullet points", body: "Each role rewritten as concise, results-oriented bullet points instead of a list of duties." },
          { title: "Skills section", body: "Your skills grouped clearly so both recruiters and screening software find them quickly." },
          { title: "Content improvements", body: "Clearer wording, consistent tense and fewer vague phrases like \"responsible for\" or \"helped with\"." },
        ],
      },
      {
        heading: "A professional structure, by default",
        paragraphs: [
          "Recruiters skim. A predictable structure lets them find what they need in seconds: contact details, summary, work experience in reverse-chronological order, education, skills and languages. Cvixeo's editor follows this order so you don't have to think about layout while writing.",
          "The same structure also helps applicant tracking systems parse your CV correctly. If you want to understand why, read our guide to the [ATS resume builder](/ats-cv-builder).",
        ],
      },
      {
        heading: "Templates, customization and PDF export",
        cards: [
          { title: "15 templates", body: "From classic and corporate to modern and creative. Switch at any time without retyping anything. The free plan includes 2 templates." },
          { title: "One CV per application", body: "Duplicate a CV and adjust it for each job. Use [job description matching](/job-description-matching) to see what a specific posting expects." },
          { title: "PDF export", body: "Download a clean, print-ready PDF. Free-plan exports carry a small watermark; Premium removes it." },
        ],
      },
      {
        heading: "Build your CV in five steps",
        steps: [
          { title: "Add your information", body: "Fill in the guided form, or import an existing CV in PDF, DOCX or TXT." },
          { title: "Let the AI draft it", body: "Generate professional wording for your summary and experience." },
          { title: "Choose a template", body: "Preview your content in different designs instantly." },
          { title: "Review and tailor", body: "Edit freely, then check it against a job posting if you're applying for a specific role." },
          { title: "Download", body: "Export your CV as a PDF, ready to send." },
        ],
      },
    ],
    faq: [
      { q: "Is the AI CV builder free?", a: "You can create a CV for free: the free plan includes 1 CV, 2 templates, AI generation (up to 5 AI requests per day) and a watermarked PDF. Premium unlocks all templates, AI summary and bullet-point tools, the ATS score, job matching and cover letters." },
      { q: "Will the AI invent experience I don't have?", a: "It works from what you enter, but any AI can phrase things more strongly than reality. Treat the output as a draft: check every claim, figure and date before using your CV." },
      { q: "Can recruiters tell that AI wrote my CV?", a: "Generic AI text is easy to spot. That's why you should add specifics only you know — project names, tools, results — and edit the draft in your own voice." },
      { q: "What's the difference between a CV and a resume?", a: "In much of Europe \"CV\" is the standard term; in the US and Canada \"resume\" usually means a shorter, more concise document. See our [AI resume builder](/ai-resume-builder) page for resume-specific advice." },
      { q: "Which languages can I write my CV in?", a: "Cvixeo is available in English, French and Dutch, and the AI can write your content in any of these three languages." },
    ],
    related: ["ats-cv-builder", "resume-optimizer", "job-description-matching", "cover-letter-generator"],
    articles: ["10-resume-mistakes-that-prevent-interview", "one-page-vs-two-page-resume"],
    closing: { heading: "Start your CV now", body: "Create your first CV for free, then upgrade only if you need the advanced tools." },
  },

  "ats-cv-builder": {
    metaTitle: "ATS Resume Builder – Create an ATS-Friendly CV",
    metaDescription:
      "Learn how applicant tracking systems read resumes, which keywords and structure matter, the mistakes to avoid, and how to check your CV's ATS score.",
    eyebrow: "ATS Resume Builder",
    h1: "Create an ATS-Friendly Resume That Software and Recruiters Can Read",
    intro:
      "Most mid-size and large employers receive applications through an applicant tracking system (ATS). An ATS resume is simply a CV that this software can read accurately — and that still convinces the human who reads it next.",
    highlights: ["How ATS software works", "Keywords and structure", "Common mistakes", "ATS score and suggestions"],
    primaryCta: { label: "Create an ATS-friendly CV", href: "/signup" },
    secondaryCta: { label: "Check against a job posting", href: "/job-match" },
    sections: [
      {
        heading: "How an applicant tracking system works",
        paragraphs: [
          "When you apply online, the ATS extracts the text of your CV and splits it into fields: name, contact details, job titles, employers, dates, education and skills. Recruiters then search, filter and sort candidates using those fields and keywords.",
          "Two consequences follow. If the software can't parse a section, that information may be invisible in searches. And if your CV doesn't use the terms the recruiter searches for, you can rank low even when you're qualified.",
          "You may read that ATS software \"automatically rejects\" most resumes. In practice, behaviour depends on the system and on how the employer configures it — knock-out questions and filters exist, but humans usually make the decisions. The goal isn't to trick a machine; it's to be easy to find and easy to read.",
        ],
      },
      {
        heading: "Keywords: speak the language of the job posting",
        bullets: [
          "Use the exact job title from the posting when it honestly matches your experience.",
          "Mirror the posting's terms for hard skills and tools (for example \"Salesforce\", \"IFRS\", \"React\").",
          "Write acronyms in full at least once: \"Search Engine Optimization (SEO)\".",
          "Put important keywords where they naturally belong: summary, skills section and experience bullet points.",
          "Never copy hidden text or keyword lists — recruiters read the CV too, and it damages trust.",
        ],
        outro: [
          "Finding the right keywords by hand is slow. Cvixeo's [job description matching](/job-description-matching) lists the skills and keywords from a posting that weren't found in your CV.",
        ],
      },
      {
        heading: "An ATS-compatible structure",
        cards: [
          { title: "Standard section headings", body: "\"Work Experience\", \"Education\", \"Skills\". Creative headings can confuse parsers." },
          { title: "Text, not images", body: "Skills shown as icons, charts or images can't be read. Keep information in real text." },
          { title: "Consistent dates", body: "Use one date format throughout (e.g. 03/2022 – 06/2024) so experience can be calculated." },
          { title: "Clean file", body: "Send a text-based PDF unless the employer asks for Word. A scanned image of a CV can't be parsed." },
        ],
      },
      {
        heading: "ATS mistakes to avoid",
        dosDonts: {
          doTitle: "Do",
          dontTitle: "Avoid",
          dos: [
            "Use a clear, single reading order",
            "Spell out job titles and skills in words",
            "Tailor keywords to each application",
            "Keep contact details in the main body of the CV",
          ],
          donts: [
            "Key information inside images or text boxes",
            "Skill ratings shown only as bars or stars",
            "Unusual section names",
            "One generic CV for every job",
          ],
        },
      },
      {
        heading: "Analyze and optimize your resume for ATS",
        paragraphs: [
          "Cvixeo's templates use standard headings and real text, so your content stays readable. With Premium, the ATS check gives your CV a score from 0 to 100 with three to five concrete suggestions; for a deeper review, see the [CV optimizer](/cv-optimizer).",
          "Remember that an ATS score is an indicator of readability and keyword alignment — not a guarantee. A CV that scores well still needs to show real, relevant results to a human reader.",
        ],
      },
    ],
    faq: [
      { q: "Is a PDF ATS-friendly?", a: "A text-based PDF (one where you can select the text) is read correctly by most modern ATS. Image-only PDFs, such as scans, are not. If a posting explicitly asks for a Word file, follow the instruction." },
      { q: "What is an ATS score?", a: "It's an estimate of how readable and keyword-aligned your CV is for screening software. Cvixeo's score (0–100) comes with suggestions; it's a guide for improvement, not a prediction of whether you'll be hired." },
      { q: "Do all companies use an ATS?", a: "No. Many small businesses read applications directly. But an ATS-friendly CV is also clearer for humans, so the same rules are worth following everywhere." },
      { q: "Should I use a one-column template?", a: "A clear reading order matters more than the number of columns. Avoid putting essential information in sidebars made of images or text boxes, and check how your content reads top to bottom." },
      { q: "How is the ATS score different from the job match score?", a: "The ATS score looks at your CV on its own. The job match score compares your CV with one specific job description. Use the first to fix general issues and the second before each application." },
    ],
    related: ["cv-optimizer", "job-description-matching", "ai-cv-builder", "resume-optimizer"],
    articles: ["how-to-create-ats-friendly-resume-2026", "skills-most-sought-after-by-recruiters-2026"],
    closing: { heading: "Make your CV readable by software and people", body: "Start with an ATS-friendly template for free, then check your score with Premium." },
  },

  "ai-resume-builder": {
    metaTitle: "AI Resume Builder – Concise, Achievement-Focused Resumes",
    metaDescription:
      "Write a concise resume with AI: achievement-based bullet points, a sharp summary and clean formatting. Learn what recruiters expect and tailor it to each job.",
    eyebrow: "AI Resume Builder",
    h1: "Write a Concise, Achievement-Focused Resume with AI",
    intro:
      "A resume has one job: show a recruiter in a few seconds that you can deliver results in the role. Cvixeo's AI resume builder helps you turn duties into achievements and keep the whole document focused.",
    highlights: ["Achievement-based bullet points", "Sharp professional summary", "Clean, readable layout", "Tailored for each job"],
    primaryCta: { label: "Write my resume", href: "/signup" },
    secondaryCta: { label: "Improve an existing resume", href: "/resume-optimizer" },
    sections: [
      {
        heading: "Resume or CV: which one do you need?",
        paragraphs: [
          "In the US and Canada, a resume is a short summary of your most relevant experience — usually one page early in your career and rarely more than two. In the UK and much of Europe, the same document is generally called a CV. (In US academia, a \"CV\" is a long, exhaustive record of publications and research.)",
          "The writing principles are the same: relevance, clarity and proof. If you're applying in Europe, our [AI CV builder](/ai-cv-builder) page covers the European conventions.",
        ],
      },
      {
        heading: "Anatomy of a strong resume",
        cards: [
          { title: "Header", body: "Name, job title you're targeting, email, phone, city and a LinkedIn or portfolio link." },
          { title: "Summary", body: "Two to three lines connecting your experience to the role you want." },
          { title: "Experience", body: "Reverse-chronological, with three to five achievement bullet points per recent role." },
          { title: "Skills", body: "Hard skills and tools that match the job. Soft skills are better shown through results." },
          { title: "Education", body: "Degree, school and year. Move it above experience only if you're a recent graduate." },
        ],
      },
      {
        heading: "From duties to achievements",
        paragraphs: [
          "Recruiters already know what a job title involves. What they don't know is how well you did it. A good bullet point follows a simple pattern: action verb + what you did + measurable result or impact.",
        ],
        example: {
          beforeLabel: "Before",
          before: "Responsible for social media accounts.",
          afterLabel: "After",
          after: "Planned and published content for 3 social media accounts, growing combined followers from 4,000 to 11,000 in 12 months.",
        },
        bullets: [
          "The numbers must be yours. If you don't have exact figures, describe scope (team size, budget, number of clients) instead of inventing results.",
          "With Premium, Cvixeo's AI bullet-point tool suggests achievement-style rewrites for each role.",
        ],
      },
      {
        heading: "One resume per job, not one resume for every job",
        paragraphs: [
          "Sending the same resume everywhere is the most common reason qualified candidates are overlooked. Before each application, compare your resume with the posting using [job description matching](/job-description-matching), add the missing skills you genuinely have, and reorder your bullet points so the most relevant ones come first.",
        ],
      },
    ],
    faq: [
      { q: "How long should my resume be?", a: "One page is usually enough with under about ten years of experience; two pages are fine for senior profiles when every line is relevant. Our article on [one-page vs two-page resumes](/careers/one-page-vs-two-page-resume) goes into detail." },
      { q: "Should I add a photo to my resume?", a: "In the US, UK and Canada, photos are generally left off to reduce bias. In some European countries photos are common but optional. Follow the norm of the country you're applying in." },
      { q: "Can the AI write my bullet points from scratch?", a: "It can draft them from the information you enter about each role. The more concrete your input — tools, scope, results — the more specific and credible the result." },
      { q: "Do I need a cover letter as well?", a: "Often, yes — especially when the posting asks for one or when you're changing careers. The [cover letter generator](/cover-letter-generator) drafts one from your resume and the job description." },
    ],
    related: ["resume-optimizer", "job-description-matching", "ats-cv-builder", "cover-letter-generator"],
    articles: ["how-to-tailor-resume-to-job-posting", "one-page-vs-two-page-resume"],
    closing: { heading: "Turn your experience into results", body: "Draft your resume with AI for free, and tailor it to every job you apply for." },
  },

  "resume-optimizer": {
    metaTitle: "AI Resume Optimizer – Improve Your Existing Resume",
    metaDescription:
      "Already have a resume? Import it as PDF, DOCX or TXT and let AI restructure and rewrite it: sharper summary, stronger bullet points, clearer skills.",
    eyebrow: "AI Resume Optimizer",
    h1: "Improve Your Existing Resume with an AI Resume Optimizer",
    intro:
      "You don't need to start over. Import the resume you already have, and Cvixeo extracts its content into an editable structure, improves the wording, and helps you bring it up to date for the jobs you want now.",
    highlights: ["Import PDF, DOCX or TXT", "AI rewrite of summary and experience", "Structured, editable result", "Ready for any template"],
    primaryCta: { label: "Optimize my resume", href: "/signup" },
    secondaryCta: { label: "How job matching works", href: "/job-description-matching" },
    sections: [
      {
        heading: "How the resume optimizer works",
        steps: [
          { title: "Import your file", body: "Upload your current resume as PDF, DOCX or TXT." },
          { title: "Automatic extraction", body: "The AI reads the text and fills in a structured profile: contact details, experience, education, skills and languages." },
          { title: "Improved wording", body: "Your summary and experience descriptions are rewritten to be clearer and more professional." },
          { title: "Review everything", body: "Check each section, correct anything that was misread, and add details only you know." },
          { title: "Choose a new design", body: "Apply any template — your content isn't tied to the old layout anymore." },
        ],
      },
      {
        heading: "What gets optimized",
        cards: [
          { title: "Summary", body: "A focused introduction that matches your current goal, not the job you had five years ago." },
          { title: "Bullet points", body: "Duties turned into achievements with action verbs. With Premium, regenerate bullets for any role." },
          { title: "Skills", body: "A clean list of relevant hard skills instead of a long, mixed paragraph." },
          { title: "Structure", body: "Standard sections in a logical order that recruiters and ATS software expect." },
          { title: "Consistency", body: "Uniform tense, date formats and punctuation across the whole document." },
        ],
      },
      {
        heading: "An example rewrite",
        example: {
          beforeLabel: "Original",
          before: "Worked on the company website and fixed bugs. Helped the marketing team.",
          afterLabel: "Optimized",
          after: "Maintained the company website (Next.js), resolving reported bugs and shipping landing pages for marketing campaigns.",
        },
        outro: [
          "Notice what the optimizer did not do: it didn't add numbers or achievements that weren't in the original. If you have results to add — traffic, conversion, time saved — put them in yourself.",
        ],
      },
      {
        heading: "Optimizer, builder or checker?",
        bullets: [
          "Use the **resume optimizer** when you have a resume that needs rewriting.",
          "Use the [AI CV builder](/ai-cv-builder) when you're starting from nothing.",
          "Use the [CV optimizer and checker](/cv-optimizer) to get an ATS score and a list of weak spots.",
          "Use [job description matching](/job-description-matching) before each application.",
        ],
      },
    ],
    faq: [
      { q: "Which file formats can I import?", a: "PDF, DOCX and TXT. The PDF needs to contain selectable text; a scanned image of a resume can't be read reliably." },
      { q: "Will I lose my original resume?", a: "No. Your file is only used to create a new, editable CV in your account. Your original file on your computer is unchanged." },
      { q: "Is importing free?", a: "Yes, importing and the initial AI improvement are available on the free plan within its daily AI limit. Additional AI tools such as bullet regeneration, the ATS score and job matching are part of Premium." },
      { q: "Can it translate my resume?", a: "You can generate content in English, French or Dutch. Always review a translated resume carefully — job titles and degree names don't always translate literally." },
    ],
    related: ["cv-optimizer", "job-description-matching", "ai-resume-builder", "ats-cv-builder"],
    articles: ["10-resume-mistakes-that-prevent-interview", "best-practices-career-change"],
    closing: { heading: "Give your current resume a second life", body: "Import it now and see the improved version in your editor." },
  },

  "cv-optimizer": {
    metaTitle: "CV Optimizer & Checker – ATS Score and CV Review",
    metaDescription:
      "Check your CV section by section: ATS score from 0 to 100, concrete suggestions, and a checklist of the weak spots recruiters notice first.",
    eyebrow: "CV Checker & Optimizer",
    h1: "Check Your CV and Fix What Holds It Back",
    intro:
      "Before you rewrite anything, find out what actually needs fixing. Cvixeo's CV optimizer gives your CV an ATS score with targeted suggestions, and this page gives you the checklist recruiters effectively use.",
    highlights: ["ATS score from 0 to 100", "3–5 targeted suggestions", "Section-by-section checklist", "Re-check after each edit"],
    primaryCta: { label: "Check my CV", href: "/signup" },
    secondaryCta: { label: "See Premium", href: "/pricing" },
    sections: [
      {
        heading: "What the CV check gives you",
        paragraphs: [
          "With Premium, Cvixeo analyzes your CV for ATS compatibility and returns a score from 0 to 100 together with three to five concrete improvement tips — for example a missing section, vague wording or skills that aren't stated explicitly.",
          "Edit, run the check again and see whether the score moves. It's a fast feedback loop, not a verdict: the score reflects readability and alignment, not your value as a candidate.",
        ],
      },
      {
        heading: "Section-by-section CV checklist",
        cards: [
          { title: "Header", body: "Professional email, phone, city, and a link to LinkedIn or a portfolio. No date of birth needed in most countries." },
          { title: "Summary", body: "Specific to your target role. If it could describe anyone, rewrite it." },
          { title: "Experience", body: "Reverse-chronological, consistent dates, achievement bullets rather than duty lists." },
          { title: "Skills", body: "Hard skills named exactly (tools, methods, certifications) and backed up somewhere in your experience." },
          { title: "Education", body: "Degree, institution, year. Add relevant coursework only if you're early in your career." },
          { title: "Languages", body: "State a level for each language (e.g. CEFR B2, native) — vague terms like \"good\" are hard to compare." },
        ],
      },
      {
        heading: "The weak spots recruiters notice first",
        bullets: [
          "Unexplained gaps or overlapping dates.",
          "Bullet points that start with \"Responsible for…\".",
          "Skills listed that appear nowhere in the experience section.",
          "Spelling mistakes, especially in company or tool names.",
          "A summary that names a different job than the one applied for.",
        ],
      },
      {
        heading: "General check vs. checking against a job",
        paragraphs: [
          "The CV check evaluates your CV on its own. To see how it fits one particular role, use [job description matching](/job-description-matching): it compares your CV with the posting and shows which skills and keywords are missing.",
          "Found a lot to fix? The [resume optimizer](/resume-optimizer) can rewrite sections for you, and our [ATS resume guide](/ats-cv-builder) explains the formatting rules behind the score.",
        ],
      },
    ],
    faq: [
      { q: "How is my CV scored?", a: "The AI evaluates your CV's content and structure for ATS compatibility and returns a 0–100 score plus improvement tips. Use it as a guide to prioritise edits." },
      { q: "Is a score of 100 necessary?", a: "No. Aim to fix the issues the suggestions point out. Beyond a certain point, the quality and relevance of your experience matter more than the number." },
      { q: "How often should I check my CV?", a: "After any significant edit, and before sending it for a new type of role." },
      { q: "Is the CV check free?", a: "The ATS score and suggestions are part of Premium (subscription or 7-day pass). Creating and editing your CV is free." },
    ],
    related: ["ats-cv-builder", "resume-optimizer", "job-description-matching", "ai-cv-builder"],
    articles: ["10-resume-mistakes-that-prevent-interview", "how-to-create-ats-friendly-resume-2026"],
    closing: { heading: "Know exactly what to improve", body: "Create your CV for free, then run the check whenever you need it." },
  },

  "job-description-matching": {
    metaTitle: "Match Your Resume to a Job Description – CV Job Matching",
    metaDescription:
      "Paste a job posting and compare it with your CV: missing skills, missing keywords, a match score by category and recommendations to tailor your CV.",
    eyebrow: "Job Description Matching",
    h1: "Match Your Resume to a Job Description",
    intro:
      "Every job posting is a checklist. Cvixeo reads the posting, compares it with your CV and shows you exactly which skills and keywords match, which are missing, and what to change before you apply.",
    highlights: ["Missing skills and keywords", "Match score by category", "Recommendations you can act on", "Works across English, French and Dutch"],
    primaryCta: { label: "Match my CV to a job", href: "/job-match" },
    secondaryCta: { label: "Create a CV first", href: "/signup" },
    sections: [
      {
        heading: "How CV job matching works",
        steps: [
          { title: "Copy the job posting", body: "Paste the full job description — responsibilities, requirements and nice-to-haves." },
          { title: "The posting is analyzed", body: "AI extracts required and nice-to-have skills, minimum years of experience, education, languages and key terms." },
          { title: "Your CV is compared", body: "Those requirements are compared with the skills, experience, education and languages actually stored in your CV." },
          { title: "Missing skills and keywords", body: "You see what matched, what's missing, and which keywords from the posting weren't found." },
          { title: "Score and recommendations", body: "You get an overall score, a breakdown by category, and recommendations based only on what was detected." },
          { title: "Improve and re-run", body: "Edit your CV and run the analysis again. Past analyses are saved so you can compare." },
        ],
      },
      {
        heading: "What the match score is made of",
        paragraphs: [
          "The score is calculated with fixed, documented weights — the same input always produces the same number:",
        ],
        matchWeights: true,
      },
      {
        heading: "Why this approach is different",
        cards: [
          { title: "No invented experience", body: "Your side of the comparison comes from the data in your CV, and recommendations are written only from detected matches and gaps. The tool won't suggest claiming a degree or job you don't have." },
          { title: "Cross-language matching", body: "Apply to a Dutch posting with a French CV, or an English posting with a Dutch CV: skills are matched by meaning, not just by identical spelling." },
          { title: "An honest score", body: "The score measures alignment between your CV and the posting. It is not a hiring probability and doesn't guarantee passing any ATS." },
        ],
      },
      {
        heading: "Turning results into a tailored CV",
        bullets: [
          "**Missing skill you have?** Add it explicitly to your skills section and show it in an experience bullet.",
          "**Missing skill you don't have?** Leave it out. Address it in your [cover letter](/cover-letter-generator) if it's a gap you're actively closing.",
          "**Missing keywords?** Use the posting's wording where it truthfully describes your work (e.g. \"stakeholder management\" instead of \"working with other teams\").",
          "**Low experience score?** Make sure dates are complete and that relevant roles appear first.",
        ],
        outro: [
          "Then re-run the analysis. The goal isn't 100% — it's making sure everything you genuinely offer is visible.",
        ],
      },
    ],
    faq: [
      { q: "Why is a skill marked as missing when I have it?", a: "It wasn't detected in your CV. \"Missing\" means \"not found\", not \"you don't have it\". Add the skill explicitly, using the same term as the posting where accurate." },
      { q: "Does it work with job postings in French or Dutch?", a: "Yes. Postings in English, French and Dutch are supported, and your CV can be in a different language from the posting." },
      { q: "Is the match score a hiring probability?", a: "No. It measures how well your CV's content aligns with the posting's requirements. Hiring decisions depend on many other factors." },
      { q: "How is this different from the ATS score?", a: "The [ATS score](/cv-optimizer) evaluates your CV in general. Job description matching compares it with one specific posting, so it's the step to run before each application." },
      { q: "Is job matching free?", a: "Job matching is a Premium feature, available with a subscription or a 7-day pass. You can create your CV for free first." },
    ],
    related: ["cover-letter-generator", "cv-optimizer", "ats-cv-builder", "resume-optimizer"],
    articles: ["how-to-tailor-resume-to-job-posting", "skills-most-sought-after-by-recruiters-2026"],
    closing: { heading: "Tailor your CV to the next job you apply for", body: "Paste the posting, see what's missing, fix it — then run it again." },
  },

  "cover-letter-generator": {
    metaTitle: "AI Cover Letter Generator – Tailored to the Job",
    metaDescription:
      "Generate a cover letter from your CV, the job description and the company name. Learn the structure that works and how to personalize the draft.",
    eyebrow: "Cover Letter Generator",
    h1: "Generate a Cover Letter Tailored to the Job and the Company",
    intro:
      "A good cover letter connects your experience to one specific job. Cvixeo's AI cover letter generator starts from your CV and the job description, so the first draft is already about this role — not a generic template.",
    highlights: ["Based on your CV", "Uses the job description", "Personalized for the company", "Editable before you send it"],
    primaryCta: { label: "Generate my cover letter", href: "/signup" },
    secondaryCta: { label: "See pricing", href: "/pricing" },
    sections: [
      {
        heading: "What makes a cover letter work",
        cards: [
          { title: "A specific opening", body: "Name the role and give one reason you're a strong fit. Skip \"I am writing to apply for…\"." },
          { title: "The match", body: "Two or three requirements from the posting, each backed by evidence from your experience." },
          { title: "Why this company", body: "One genuine, specific reason — a product, a project, a value — that shows you did your research." },
          { title: "A clear close", body: "Restate your interest and invite the next step. Keep it short." },
        ],
      },
      {
        heading: "How the generator builds your letter",
        steps: [
          { title: "Select your CV", body: "Your experience and skills become the evidence in the letter." },
          { title: "Paste the job description", body: "The letter focuses on the requirements this employer cares about." },
          { title: "Add the company name", body: "The draft addresses the company directly." },
          { title: "Edit and personalize", body: "Adjust the tone, add your motivation in your own words, and check every claim." },
        ],
      },
      {
        heading: "Personalize the draft before sending",
        bullets: [
          "Add one detail only you could write: why this team, product or mission matters to you.",
          "Replace any sentence that could appear in anyone's letter.",
          "Check that every achievement mentioned is also on your CV.",
          "Keep it under one page — around 250 to 400 words is usually enough.",
        ],
        outro: [
          "For best results, tailor your CV first with [job description matching](/job-description-matching): the letter can only be as relevant as the CV it's based on.",
        ],
      },
    ],
    faq: [
      { q: "Can I use the same cover letter for several jobs?", a: "Generate a new one for each posting. The value of a cover letter comes from being specific to the role and the company." },
      { q: "Which languages are supported?", a: "English, French and Dutch." },
      { q: "Is the cover letter generator free?", a: "It's part of Premium, available with a subscription or a 7-day pass." },
      { q: "Is a cover letter still necessary?", a: "When a posting asks for one, yes. It's also valuable when you're changing careers or your CV alone doesn't explain your motivation. Read our [guide to writing a cover letter](/careers/how-to-write-effective-cover-letter)." },
    ],
    related: ["job-description-matching", "ai-cv-builder", "resume-optimizer", "ai-resume-builder"],
    articles: ["how-to-write-effective-cover-letter", "best-practices-career-change"],
    closing: { heading: "Write a relevant cover letter in minutes", body: "Start from your CV and the job description, then make it yours." },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FRENCH
  // ═══════════════════════════════════════════════════════════════════════════

  "creer-cv": {
    metaTitle: "Créer un CV en ligne – Guide étape par étape",
    metaDescription:
      "Comment créer un CV professionnel : les rubriques indispensables, le bon ordre, la longueur idéale et les étapes pour faire votre CV en ligne avec un créateur de CV.",
    eyebrow: "Créateur de CV",
    h1: "Créer un CV professionnel en ligne, étape par étape",
    intro:
      "Que ce soit votre premier CV ou une reprise complète, un CV efficace suit des règles simples. Ce guide vous donne la structure, les rubriques et la méthode — et le créateur de CV Cvixeo vous accompagne à chaque étape.",
    highlights: ["Rubriques indispensables", "Ordre et longueur", "15 modèles professionnels", "Export PDF"],
    primaryCta: { label: "Créer mon CV gratuitement", href: "/signup" },
    secondaryCta: { label: "Voir les tarifs", href: "/fr/pricing" },
    sections: [
      {
        heading: "Les rubriques indispensables d'un CV",
        cards: [
          { title: "État civil et contact", body: "Nom, titre du poste visé, e-mail professionnel, téléphone, ville. L'âge et la situation familiale ne sont pas nécessaires." },
          { title: "Accroche ou profil", body: "Deux à trois lignes qui résument votre profil et ce que vous apportez au poste." },
          { title: "Expériences professionnelles", body: "De la plus récente à la plus ancienne, avec vos réalisations concrètes pour chaque poste." },
          { title: "Formation", body: "Diplômes, établissements et années. En début de carrière, placez-la avant les expériences." },
          { title: "Compétences", body: "Compétences techniques, logiciels et certifications, formulés avec précision." },
          { title: "Langues", body: "Avec un niveau clair (langue maternelle, C1, B2…) plutôt que « bon niveau »." },
        ],
      },
      {
        heading: "Longueur, photo et mise en page",
        paragraphs: [
          "Une page suffit généralement pour un profil junior ; deux pages sont acceptables avec une expérience riche, à condition que chaque ligne soit utile.",
          "En France comme en Belgique, la photo reste fréquente mais elle est facultative. Si vous en mettez une, choisissez une photo sobre et professionnelle ; pour une candidature internationale, il est souvent préférable de s'en passer.",
          "Côté mise en page, privilégiez la lisibilité : titres de rubriques clairs, dates alignées, informations en texte (pas en images). Ces règles rendent aussi votre CV [compatible avec les logiciels ATS](/fr/cv-ats).",
        ],
      },
      {
        heading: "Faire son CV avec Cvixeo en 5 étapes",
        steps: [
          { title: "Renseignez votre parcours", body: "Remplissez le formulaire guidé ou importez un ancien CV (PDF, DOCX ou TXT)." },
          { title: "Laissez l'IA rédiger", body: "Le [générateur de CV IA](/fr/generateur-cv-ia) propose une formulation professionnelle de votre profil et de vos expériences." },
          { title: "Choisissez un modèle", body: "15 modèles, du classique au créatif ; 2 sont inclus dans l'offre gratuite." },
          { title: "Relisez et adaptez", body: "Vérifiez chaque information, puis [adaptez votre CV à l'offre](/fr/cv-offre-emploi) visée." },
          { title: "Téléchargez en PDF", body: "Un PDF propre, prêt à envoyer (filigrane retiré avec Premium)." },
        ],
      },
      {
        heading: "Les erreurs qui coûtent un entretien",
        dosDonts: {
          doTitle: "À faire",
          dontTitle: "À éviter",
          dos: [
            "Un titre de CV qui reprend le poste visé",
            "Des verbes d'action et des résultats chiffrés quand c'est possible",
            "Une adresse e-mail professionnelle",
            "Un CV adapté à chaque candidature",
          ],
          donts: [
            "Les fautes d'orthographe, surtout dans les noms d'entreprises",
            "Des listes de tâches sans résultats",
            "Des trous inexpliqués dans les dates",
            "Le même CV envoyé partout",
          ],
        },
      },
    ],
    faq: [
      { q: "Créer un CV sur Cvixeo est-il gratuit ?", a: "Oui : l'offre gratuite permet de créer 1 CV avec 2 modèles et un export PDF avec filigrane. Premium débloque tous les modèles, le score ATS, l'analyse d'offre et la lettre de motivation." },
      { q: "Quelle est la différence avec un générateur de CV IA ?", a: "Créer un CV, c'est construire le document ; le [générateur de CV IA](/fr/generateur-cv-ia) rédige les contenus pour vous à partir de vos informations. Sur Cvixeo, les deux se font dans le même éditeur." },
      { q: "Faut-il un CV différent pour chaque offre ?", a: "Idéalement oui. Gardez une base commune, puis ajustez l'accroche, les compétences et l'ordre des réalisations pour chaque poste." },
      { q: "Puis-je créer mon CV en néerlandais ou en anglais ?", a: "Oui, Cvixeo fonctionne en français, en anglais et en néerlandais — pratique pour postuler en Belgique ou à l'international." },
    ],
    related: ["generateur-cv-ia", "cv-ats", "cv-offre-emploi", "lettre-motivation"],
    articles: ["cv-professionnel-belgique-guide-2026", "15-erreurs-a-eviter-cv-professionnel"],
    closing: { heading: "Votre CV commence ici", body: "Créez votre CV gratuitement et téléchargez-le en PDF." },
  },

  "generateur-cv-ia": {
    metaTitle: "Générateur de CV IA – Créer et optimiser son CV",
    metaDescription:
      "Générateur de CV IA : créez votre CV, améliorez vos contenus, optimisez-le pour les ATS et adaptez-le à chaque offre d'emploi. Gratuit pour commencer.",
    eyebrow: "Générateur de CV IA",
    h1: "Le générateur de CV IA pour créer, améliorer et adapter votre CV",
    intro:
      "L'intelligence artificielle ne remplace pas votre parcours : elle vous aide à le présenter. Avec Cvixeo, l'IA rédige, reformule, vérifie la compatibilité ATS et compare votre CV aux offres qui vous intéressent.",
    highlights: ["Rédaction par l'IA", "Amélioration d'un CV existant", "Optimisation ATS", "Adaptation à une offre d'emploi"],
    primaryCta: { label: "Générer mon CV", href: "/signup" },
    secondaryCta: { label: "Voir les tarifs", href: "/fr/pricing" },
    sections: [
      {
        heading: "1. Créer un CV avec l'IA",
        paragraphs: [
          "Renseignez vos expériences, votre formation et vos compétences : l'IA transforme ces informations en un CV structuré, avec une accroche professionnelle et des descriptions de postes claires. Vous gardez la main sur chaque ligne.",
          "Vous débutez ? Notre guide pour [créer un CV](/fr/creer-cv) détaille les rubriques et l'ordre à respecter.",
        ],
      },
      {
        heading: "2. Améliorer votre CV existant",
        paragraphs: [
          "Importez votre ancien CV en PDF, DOCX ou TXT. L'IA en extrait le contenu, le range dans les bonnes rubriques et reformule vos expériences pour les rendre plus percutantes. Détails et exemple sur la page [optimiser son CV](/fr/optimiser-cv).",
        ],
      },
      {
        heading: "3. Optimiser votre CV pour les ATS",
        paragraphs: [
          "Les logiciels de recrutement (ATS) lisent votre CV avant le recruteur. Avec Premium, Cvixeo attribue à votre CV un score ATS de 0 à 100 accompagné de suggestions concrètes. Pour comprendre les règles, lisez notre guide du [CV compatible ATS](/fr/cv-ats).",
        ],
      },
      {
        heading: "4. Adapter votre CV à une offre d'emploi",
        paragraphs: [
          "Collez une offre : Cvixeo identifie les compétences et mots-clés attendus, les compare à votre CV et calcule un score de correspondance. Vous savez exactement quoi ajouter ou clarifier. C'est la fonctionnalité qui fait la différence : voir [adapter son CV à une offre](/fr/cv-offre-emploi).",
        ],
      },
      {
        heading: "Ce que l'IA fait — et ne fait pas",
        dosDonts: {
          doTitle: "L'IA vous aide à",
          dontTitle: "Restez vigilant sur",
          dos: [
            "Trouver une formulation professionnelle",
            "Transformer des tâches en réalisations",
            "Structurer et harmoniser votre CV",
            "Repérer les compétences absentes par rapport à une offre",
          ],
          donts: [
            "Les chiffres et résultats : ils doivent être les vôtres",
            "Les tournures trop génériques, à personnaliser",
            "Les intitulés de postes et de diplômes traduits",
            "La relecture finale, toujours indispensable",
          ],
        },
      },
      {
        heading: "Générateur de CV IA ou ChatGPT ?",
        paragraphs: [
          "Un assistant conversationnel peut rédiger du texte, mais il ne gère ni la mise en page, ni les modèles, ni l'export PDF, et il n'a pas accès à la structure de votre CV pour le comparer à une offre. Un générateur de CV IA réunit tout dans un seul outil. Pour aller plus loin : [ChatGPT peut-il créer un bon CV ?](/fr/careers/chatgpt-peut-il-creer-bon-cv)",
        ],
      },
    ],
    faq: [
      { q: "Le générateur de CV IA est-il gratuit ?", a: "La création de CV et la génération par l'IA sont disponibles gratuitement (jusqu'à 5 requêtes IA par jour). Le score ATS, l'analyse d'offre, les outils d'accroche et de puces et la lettre de motivation font partie de Premium." },
      { q: "Les recruteurs voient-ils que le CV a été écrit par une IA ?", a: "Un texte générique se repère facilement. Ajoutez des détails concrets — projets, outils, résultats — et retouchez le texte avec vos propres mots." },
      { q: "L'IA peut-elle écrire mon CV en néerlandais ?", a: "Oui, en français, en anglais ou en néerlandais. Relisez toujours les intitulés traduits." },
      { q: "Mes données sont-elles conservées ?", a: "Vos CV sont enregistrés dans votre compte. Vous pouvez supprimer votre compte et vos CV à tout moment depuis vos paramètres." },
    ],
    related: ["cv-offre-emploi", "cv-ats", "optimiser-cv", "lettre-motivation"],
    articles: ["cv-intelligence-artificielle-optimiser-candidature", "chatgpt-peut-il-creer-bon-cv"],
    closing: { heading: "Laissez l'IA faire le premier jet", body: "Créez votre CV gratuitement, puis adaptez-le à chaque offre." },
  },

  "cv-ats": {
    metaTitle: "CV compatible ATS – Guide complet et checklist",
    metaDescription:
      "Qu'est-ce qu'un ATS, comment lit-il votre CV et comment rendre votre CV compatible ATS : mots-clés, structure, format, erreurs à éviter et checklist.",
    eyebrow: "CV ATS",
    h1: "CV compatible ATS : comprendre les logiciels de recrutement",
    intro:
      "Un ATS (Applicant Tracking System) est le logiciel qu'utilisent de nombreuses entreprises pour recevoir, trier et rechercher les candidatures. Un CV compatible ATS est un CV que ce logiciel lit correctement — et qui reste convaincant pour le recruteur.",
    highlights: ["Fonctionnement d'un ATS", "Mots-clés et structure", "PDF ou Word", "Checklist finale"],
    primaryCta: { label: "Créer un CV compatible ATS", href: "/signup" },
    secondaryCta: { label: "Analyser mon CV", href: "/fr/analyser-cv" },
    sections: [
      {
        heading: "Comment un ATS lit votre CV",
        paragraphs: [
          "Lorsque vous postulez en ligne, l'ATS extrait le texte de votre CV et le découpe en champs : identité, coordonnées, postes, employeurs, dates, diplômes, compétences. Le recruteur interroge ensuite cette base par mots-clés, filtre et classe les candidats.",
          "Si une rubrique est mal lue, l'information disparaît des recherches. Et si votre CV n'emploie pas les termes recherchés, vous risquez d'être mal classé, même avec le bon profil.",
        ],
      },
      {
        heading: "Idées reçues sur les ATS",
        cards: [
          { title: "« L'ATS rejette automatiquement les CV »", body: "Pas systématiquement. Certains filtres et questions éliminatoires existent, mais la plupart des décisions restent humaines. L'enjeu est d'être trouvé et bien lu." },
          { title: "« Il faut bourrer son CV de mots-clés »", body: "Non. Le recruteur lit aussi votre CV. Les mots-clés doivent apparaître naturellement, dans un contexte crédible." },
          { title: "« Un PDF n'est pas lisible »", body: "Un PDF texte (dont on peut sélectionner le texte) est bien lu par la plupart des ATS récents. Un PDF scanné, non." },
        ],
      },
      {
        heading: "Les mots-clés : reprendre le vocabulaire de l'offre",
        bullets: [
          "Reprenez l'intitulé exact du poste s'il correspond à votre expérience.",
          "Nommez précisément les logiciels, méthodes et certifications (SAP, Lean, PMP…).",
          "Écrivez les sigles en toutes lettres au moins une fois : « gestion de la relation client (CRM) ».",
          "Placez les mots-clés dans l'accroche, les compétences et les expériences.",
        ],
        outro: [
          "Pour savoir quels mots-clés manquent face à une offre précise, utilisez l'[analyse CV / offre d'emploi](/fr/cv-offre-emploi).",
        ],
      },
      {
        heading: "Structure et format d'un CV ATS",
        dosDonts: {
          doTitle: "À privilégier",
          dontTitle: "À éviter",
          dos: [
            "Des titres standards : Expérience, Formation, Compétences",
            "Un ordre de lecture clair, de haut en bas",
            "Un format de date unique (03/2022 – 06/2024)",
            "Un PDF texte, ou Word si l'offre le demande",
          ],
          donts: [
            "Des informations clés dans des images ou zones de texte",
            "Des jauges ou étoiles comme seul niveau de compétence",
            "Des intitulés de rubriques fantaisistes",
            "Les coordonnées uniquement en en-tête ou pied de page",
          ],
        },
      },
      {
        heading: "Checklist avant d'envoyer votre CV",
        bullets: [
          "Le titre du CV correspond au poste visé.",
          "Chaque compétence clé de l'offre que vous possédez apparaît en toutes lettres.",
          "Les dates sont complètes et cohérentes.",
          "Aucun texte important n'est contenu dans une image.",
          "Le fichier est un PDF texte, nommé clairement (prenom-nom-cv.pdf).",
          "Votre score ATS a été vérifié et les suggestions traitées — voir [analyser son CV](/fr/analyser-cv).",
        ],
      },
    ],
    faq: [
      { q: "Qu'est-ce qu'un score ATS ?", a: "C'est une estimation de la lisibilité de votre CV et de l'alignement de ses mots-clés pour un logiciel de recrutement. Chez Cvixeo, il va de 0 à 100 et s'accompagne de suggestions. Ce n'est pas une probabilité d'embauche." },
      { q: "Les modèles Cvixeo sont-ils compatibles ATS ?", a: "Ils utilisent des rubriques standards et du texte réel, ce qui facilite la lecture par les ATS. La compatibilité dépend aussi du contenu : mots-clés, dates et intitulés." },
      { q: "Toutes les entreprises utilisent-elles un ATS ?", a: "Non, surtout parmi les petites structures. Mais un CV compatible ATS est aussi plus clair pour un humain : les mêmes règles valent partout." },
      { q: "Faut-il un CV différent pour la France et la Belgique ?", a: "Les règles ATS sont les mêmes ; les usages varient (photo, langues). Notre article [CV compatible ATS en France](/fr/careers/cv-ats-compatible-france) détaille les spécificités françaises." },
    ],
    related: ["analyser-cv", "cv-offre-emploi", "generateur-cv-ia", "creer-cv"],
    articles: ["cv-ats-compatible-france", "regles-cv-belge"],
    closing: { heading: "Un CV lisible par les logiciels et les recruteurs", body: "Partez d'un modèle compatible ATS, gratuitement." },
  },

  "optimiser-cv": {
    metaTitle: "Optimiser son CV avec l'IA – Améliorer un CV existant",
    metaDescription:
      "Optimisez votre CV existant : importez-le en PDF ou Word, l'IA reformule votre accroche et vos expériences, structure vos compétences et le rend plus percutant.",
    eyebrow: "Optimiser son CV",
    h1: "Optimiser votre CV existant avec l'IA",
    intro:
      "Vous avez déjà un CV, mais il ne décroche pas d'entretiens ? Inutile de repartir de zéro. Importez-le, et Cvixeo le restructure et le reformule pour qu'il mette réellement en valeur votre parcours.",
    highlights: ["Import PDF, DOCX ou TXT", "Reformulation par l'IA", "Rubriques structurées", "Nouveau modèle en un clic"],
    primaryCta: { label: "Optimiser mon CV", href: "/signup" },
    secondaryCta: { label: "Analyser mon CV d'abord", href: "/fr/analyser-cv" },
    sections: [
      {
        heading: "Comment optimiser son CV avec Cvixeo",
        steps: [
          { title: "Importez votre CV", body: "Au format PDF, DOCX ou TXT." },
          { title: "Extraction automatique", body: "L'IA lit votre CV et remplit les rubriques : coordonnées, expériences, formation, compétences, langues." },
          { title: "Reformulation", body: "Votre accroche et vos descriptions d'expérience sont réécrites de façon plus claire et professionnelle." },
          { title: "Vérification", body: "Relisez chaque rubrique, corrigez ce qui a été mal interprété et complétez avec vos résultats." },
          { title: "Nouveau design", body: "Appliquez l'un des 15 modèles : votre contenu n'est plus prisonnier de l'ancienne mise en page." },
        ],
      },
      {
        heading: "Les 5 leviers d'un CV optimisé",
        cards: [
          { title: "Une accroche ciblée", body: "Elle doit parler du poste que vous visez aujourd'hui, pas de votre parcours en général." },
          { title: "Des verbes d'action", body: "Piloter, concevoir, négocier, réduire… plutôt que « en charge de »." },
          { title: "Des résultats", body: "Chiffres, périmètre, impact : ce qui distingue votre expérience de celle d'un autre candidat au même poste." },
          { title: "Des compétences précises", body: "Logiciels, méthodes et certifications nommés exactement, comme dans les offres." },
          { title: "Une cohérence d'ensemble", body: "Mêmes formats de dates, même temps de conjugaison, même ponctuation partout." },
        ],
      },
      {
        heading: "Exemple de reformulation",
        example: {
          beforeLabel: "Avant",
          before: "Chargée de la gestion des commandes et du suivi des clients.",
          afterLabel: "Après",
          after: "Gestion du cycle de commande de bout en bout pour un portefeuille de clients B2B, du devis à la facturation, en lien avec la logistique.",
        },
        outro: [
          "L'IA clarifie et structure, mais n'ajoute pas de chiffres que vous n'avez pas donnés. Si vous connaissez vos résultats (nombre de clients, délais réduits, chiffre d'affaires), ajoutez-les vous-même : ce sont eux qui font la différence.",
        ],
      },
      {
        heading: "Et ensuite ?",
        bullets: [
          "Vérifiez la compatibilité ATS avec l'[analyse de CV](/fr/analyser-cv).",
          "Avant chaque candidature, [adaptez votre CV à l'offre](/fr/cv-offre-emploi).",
          "Complétez votre dossier avec une [lettre de motivation IA](/fr/lettre-motivation).",
        ],
      },
    ],
    faq: [
      { q: "Quels formats puis-je importer ?", a: "PDF, DOCX et TXT. Le PDF doit contenir du texte sélectionnable : un CV scanné en image ne peut pas être lu de façon fiable." },
      { q: "L'import est-il gratuit ?", a: "Oui, l'import et la première amélioration par l'IA sont inclus dans l'offre gratuite, dans la limite quotidienne d'utilisation de l'IA." },
      { q: "Mon fichier d'origine est-il modifié ?", a: "Non. Il sert uniquement à créer un nouveau CV modifiable dans votre compte." },
      { q: "Optimiser ou analyser son CV : par quoi commencer ?", a: "Si vous ne savez pas ce qui cloche, commencez par [analyser votre CV](/fr/analyser-cv) pour obtenir un score et des pistes. Si vous savez qu'il doit être réécrit, importez-le directement." },
    ],
    related: ["analyser-cv", "cv-offre-emploi", "generateur-cv-ia", "cv-ats"],
    articles: ["mettre-en-valeur-competences-cv", "15-erreurs-a-eviter-cv-professionnel"],
    closing: { heading: "Donnez une seconde vie à votre CV", body: "Importez-le maintenant et découvrez la version améliorée." },
  },

  "analyser-cv": {
    metaTitle: "Analyser son CV – Score ATS et diagnostic complet",
    metaDescription:
      "Analysez votre CV : score ATS de 0 à 100, suggestions concrètes et grille de diagnostic rubrique par rubrique pour savoir exactement quoi améliorer.",
    eyebrow: "Analyse de CV",
    h1: "Analyser votre CV pour savoir exactement quoi améliorer",
    intro:
      "Avant de réécrire, diagnostiquez. L'analyse de CV Cvixeo vous donne un score ATS et des suggestions ciblées ; cette page vous fournit la grille de lecture qu'utilisent, de fait, les recruteurs.",
    highlights: ["Score ATS de 0 à 100", "3 à 5 suggestions concrètes", "Grille rubrique par rubrique", "Nouvelle analyse après chaque modification"],
    primaryCta: { label: "Analyser mon CV", href: "/signup" },
    secondaryCta: { label: "Voir Premium", href: "/fr/pricing" },
    sections: [
      {
        heading: "Ce que vous apporte l'analyse",
        paragraphs: [
          "Avec Premium, Cvixeo évalue la compatibilité ATS de votre CV et renvoie un score de 0 à 100 accompagné de trois à cinq conseils concrets : rubrique manquante, formulation trop vague, compétence non explicitée…",
          "Modifiez, relancez l'analyse, observez l'évolution. Le score mesure la lisibilité et l'alignement de votre CV, pas votre valeur en tant que candidat.",
        ],
      },
      {
        heading: "Grille d'analyse rubrique par rubrique",
        cards: [
          { title: "En-tête", body: "Titre du poste visé, e-mail professionnel, téléphone, ville, lien LinkedIn. Rien de superflu." },
          { title: "Accroche", body: "Spécifique au poste. Si elle pourrait décrire n'importe qui, elle est à réécrire." },
          { title: "Expériences", body: "Ordre antichronologique, dates complètes, réalisations plutôt que tâches." },
          { title: "Compétences", body: "Termes précis, et chaque compétence clé illustrée dans au moins une expérience." },
          { title: "Formation", body: "Diplôme, établissement, année. Les détails seulement en début de carrière." },
          { title: "Langues", body: "Un niveau explicite pour chaque langue — crucial en Belgique (FR/NL/EN)." },
        ],
      },
      {
        heading: "Interpréter vos résultats",
        bullets: [
          "**Score faible et suggestions sur la structure** : reprenez la mise en forme (titres standards, dates, texte réel) — voir le guide du [CV compatible ATS](/fr/cv-ats).",
          "**Suggestions sur la formulation** : passez par l'[optimisation de CV](/fr/optimiser-cv) pour reformuler vos expériences.",
          "**Bon score mais pas d'entretien** : votre CV est lisible, mais peut-être pas adapté aux postes visés. Comparez-le à une offre précise.",
        ],
      },
      {
        heading: "Score ATS ou score de correspondance ?",
        paragraphs: [
          "Le score ATS évalue votre CV dans l'absolu. Le score de correspondance le compare à une offre d'emploi précise et liste les compétences et mots-clés manquants : c'est l'étape à faire avant chaque candidature, détaillée sur la page [adapter son CV à une offre](/fr/cv-offre-emploi).",
        ],
      },
    ],
    faq: [
      { q: "L'analyse de CV est-elle gratuite ?", a: "Le score ATS et les suggestions font partie de Premium (abonnement ou pass 7 jours). La création et la modification de votre CV sont gratuites." },
      { q: "Faut-il viser 100/100 ?", a: "Non. Traitez les points signalés ; au-delà, la pertinence de votre expérience compte davantage que le chiffre." },
      { q: "Mon CV est-il analysé par un humain ?", a: "Non, l'analyse est réalisée par l'IA. Elle est immédiate et peut être relancée autant que nécessaire avec Premium." },
      { q: "L'analyse fonctionne-t-elle pour un CV en néerlandais ?", a: "Oui, l'analyse fonctionne en français, en anglais et en néerlandais." },
    ],
    related: ["cv-ats", "optimiser-cv", "cv-offre-emploi", "creer-cv"],
    articles: ["15-erreurs-a-eviter-cv-professionnel", "cv-ats-compatible-france"],
    closing: { heading: "Un diagnostic clair en quelques secondes", body: "Créez votre CV gratuitement, puis lancez l'analyse quand vous le souhaitez." },
  },

  "cv-offre-emploi": {
    metaTitle: "Adapter son CV à une offre d'emploi – Analyse et score",
    metaDescription:
      "Adaptez votre CV à une offre d'emploi : collez l'annonce, repérez les compétences et mots-clés manquants, obtenez un score et des recommandations.",
    eyebrow: "CV et offre d'emploi",
    h1: "Adapter votre CV à une offre d'emploi, compétence par compétence",
    intro:
      "Chaque offre d'emploi est une liste d'attentes. Cvixeo analyse l'annonce, la compare à votre CV et vous montre précisément ce qui correspond, ce qui manque et ce qu'il faut modifier avant de postuler.",
    highlights: ["Compétences et mots-clés manquants", "Score détaillé par catégorie", "Recommandations concrètes", "Offres en FR, NL ou EN"],
    primaryCta: { label: "Comparer mon CV à une offre", href: "/fr/job-match" },
    secondaryCta: { label: "Créer mon CV d'abord", href: "/signup" },
    sections: [
      {
        heading: "Pourquoi adapter son CV à chaque offre",
        paragraphs: [
          "Un CV générique oblige le recruteur à deviner si vous correspondez au poste. Un CV adapté met en avant, dès la première lecture, les compétences et expériences que l'offre demande — et emploie le même vocabulaire, ce qui aide aussi les [logiciels ATS](/fr/cv-ats).",
          "Adapter ne veut pas dire inventer : il s'agit de rendre visible ce que vous possédez déjà, dans l'ordre qui compte pour ce poste.",
        ],
      },
      {
        heading: "Comment fonctionne l'analyse CV / offre",
        steps: [
          { title: "Collez l'offre", body: "Copiez l'annonce complète : missions, profil recherché, atouts." },
          { title: "Analyse de l'annonce", body: "L'IA identifie les compétences obligatoires et souhaitées, l'expérience minimale, la formation, les langues et les mots-clés." },
          { title: "Comparaison avec votre CV", body: "Ces exigences sont comparées aux compétences, expériences, diplômes et langues réellement présents dans votre CV." },
          { title: "Ce qui manque", body: "Vous voyez les compétences et mots-clés trouvés, et ceux qui n'apparaissent pas." },
          { title: "Score et recommandations", body: "Un score global, un détail par catégorie et des recommandations fondées uniquement sur ce qui a été détecté." },
          { title: "Améliorez et relancez", body: "Modifiez votre CV et relancez l'analyse. L'historique vous permet de comparer." },
        ],
      },
      {
        heading: "De quoi se compose le score de correspondance",
        paragraphs: [
          "Le score repose sur des pondérations fixes et documentées : une même entrée donne toujours le même résultat.",
        ],
        matchWeights: true,
      },
      {
        heading: "Un atout pour postuler en Belgique",
        paragraphs: [
          "Offre en néerlandais, CV en français ? Annonce en anglais, CV en néerlandais ? Les compétences sont comparées selon leur sens, pas seulement leur orthographe. « Gestion de projet » et « projectmanagement » sont reconnus comme la même compétence.",
        ],
      },
      {
        heading: "Mettre en pratique les résultats",
        dosDonts: {
          doTitle: "À faire",
          dontTitle: "À ne pas faire",
          dos: [
            "Ajouter explicitement une compétence que vous possédez mais qui n'était pas détectée",
            "Reprendre les termes de l'offre quand ils décrivent fidèlement votre travail",
            "Placer les expériences les plus pertinentes en premier",
            "Relancer l'analyse après modification",
          ],
          donts: [
            "Ajouter une compétence que vous n'avez pas",
            "Copier-coller des phrases entières de l'annonce",
            "Viser 100 % à tout prix",
            "Oublier d'adapter aussi la [lettre de motivation](/fr/lettre-motivation)",
          ],
        },
      },
    ],
    faq: [
      { q: "Pourquoi une compétence est-elle « manquante » alors que je l'ai ?", a: "Elle n'a pas été détectée dans votre CV. « Manquante » signifie « non trouvée ». Ajoutez-la explicitement, avec le terme de l'offre s'il est exact." },
      { q: "Le score de correspondance est-il une probabilité d'embauche ?", a: "Non. Il mesure l'alignement entre le contenu de votre CV et les exigences de l'offre. Ce n'est ni une probabilité d'entretien, ni une garantie de passage d'un ATS." },
      { q: "L'analyse peut-elle inventer des expériences ?", a: "Non. Votre profil est construit à partir des données de votre CV, et les recommandations ne s'appuient que sur les correspondances et manques détectés." },
      { q: "Cette fonctionnalité est-elle gratuite ?", a: "L'analyse CV / offre fait partie de Premium (abonnement ou pass 7 jours à 3,99 €). La création du CV est gratuite." },
      { q: "Quelle différence avec l'outil Job Match ?", a: "Cette page explique la méthode ; l'[outil Job Match](/fr/job-match) est l'endroit où vous lancez l'analyse sur votre propre CV." },
    ],
    related: ["lettre-motivation", "analyser-cv", "cv-ats", "optimiser-cv"],
    articles: ["ia-adapter-cv-offre-emploi", "adapter-cv-offre-emploi-belgique"],
    closing: { heading: "Votre prochaine candidature, mieux ciblée", body: "Collez l'offre, voyez ce qui manque, corrigez — puis relancez." },
  },

  "lettre-motivation": {
    metaTitle: "Lettre de motivation IA – Adaptée à chaque offre",
    metaDescription:
      "Générez une lettre de motivation avec l'IA à partir de votre CV, de l'offre d'emploi et du nom de l'entreprise. Structure, personnalisation et erreurs à éviter.",
    eyebrow: "Lettre de motivation IA",
    h1: "Une lettre de motivation IA adaptée à l'offre et à l'entreprise",
    intro:
      "Une bonne lettre de motivation relie votre parcours à un poste précis. Le générateur de Cvixeo part de votre CV et de l'annonce : le premier jet parle déjà de ce poste, pas d'un modèle générique.",
    highlights: ["Basée sur votre CV", "Construite à partir de l'offre", "Personnalisée pour l'entreprise", "Modifiable avant envoi"],
    primaryCta: { label: "Générer ma lettre", href: "/signup" },
    secondaryCta: { label: "Voir les tarifs", href: "/fr/pricing" },
    sections: [
      {
        heading: "La structure qui fonctionne : vous, moi, nous",
        cards: [
          { title: "Vous", body: "Ce que vous savez de l'entreprise et pourquoi elle vous intéresse — une raison précise, pas une généralité." },
          { title: "Moi", body: "Deux ou trois exigences de l'offre, chacune illustrée par une réalisation de votre parcours." },
          { title: "Nous", body: "Ce que vous apporterez ensemble, et une proposition d'entretien en conclusion." },
        ],
      },
      {
        heading: "Comment le générateur rédige votre lettre",
        steps: [
          { title: "Choisissez votre CV", body: "Vos expériences et compétences servent de preuves." },
          { title: "Collez l'offre d'emploi", body: "La lettre cible les attentes de cet employeur." },
          { title: "Indiquez l'entreprise", body: "Le texte s'adresse directement à elle." },
          { title: "Personnalisez", body: "Ajustez le ton, ajoutez votre motivation avec vos mots, vérifiez chaque affirmation." },
        ],
      },
      {
        heading: "Personnaliser le premier jet",
        bullets: [
          "Ajoutez un élément que vous seul pouvez écrire : un projet de l'entreprise, une valeur, une rencontre.",
          "Supprimez toute phrase qui pourrait figurer dans la lettre de n'importe qui.",
          "Vérifiez que chaque réalisation citée figure aussi sur votre CV.",
          "Restez sur une page : 250 à 400 mots suffisent généralement.",
        ],
        outro: [
          "Pour une lettre vraiment pertinente, [adaptez d'abord votre CV à l'offre](/fr/cv-offre-emploi) : la lettre s'appuie sur votre CV.",
        ],
      },
      {
        heading: "Erreurs fréquentes",
        dosDonts: {
          doTitle: "À faire",
          dontTitle: "À éviter",
          dos: [
            "Une accroche qui cite le poste et un atout",
            "Des exemples concrets et vérifiables",
            "Une formule de politesse sobre",
          ],
          donts: [
            "« Suite à votre annonce parue sur… » en première phrase",
            "Répéter le CV ligne par ligne",
            "Envoyer la même lettre à plusieurs entreprises",
          ],
        },
      },
    ],
    faq: [
      { q: "La lettre de motivation IA est-elle gratuite ?", a: "Elle fait partie de Premium (abonnement ou pass 7 jours)." },
      { q: "Dans quelles langues ?", a: "Français, anglais et néerlandais — utile pour les candidatures en Belgique." },
      { q: "Peut-on reconnaître une lettre écrite par une IA ?", a: "Un texte générique, oui. C'est pourquoi le générateur part de votre CV et de l'offre, et pourquoi votre relecture personnelle reste indispensable." },
      { q: "La lettre de motivation est-elle encore utile ?", a: "Quand l'offre la demande, toujours. Elle est aussi précieuse en reconversion ou lorsque votre CV n'explique pas seul votre motivation. Voir notre article [lettre de motivation en France](/fr/careers/lettre-motivation-france)." },
    ],
    related: ["cv-offre-emploi", "generateur-cv-ia", "optimiser-cv", "creer-cv"],
    articles: ["lettre-motivation-france", "lettre-motivation-emploi-belgique"],
    closing: { heading: "Une lettre pertinente, en quelques minutes", body: "Partez de votre CV et de l'offre, puis faites-la vôtre." },
  },
};
