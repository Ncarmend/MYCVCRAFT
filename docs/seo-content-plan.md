# CVixeo — SEO content plan

Last updated: 2026-10-07. Owner: CVixeo team.

This document is the editorial source of truth. The code side lives in:

- `lib/content-clusters.ts`: assigns every article to a cluster and sets its pillar page and conversion CTA.
- `lib/articles.ts`: article content. The optional `seoTitle`, `summary` and `faq` fields are rendered by the article templates.
- `lib/landing-pages.ts` / `lib/landing-routes.ts`: tool pages and guide pillars.

## Editorial rules

1. **One article answers one question.** Before writing, check this plan and `lib/content-clusters.ts` for an existing page with the same intent. If one exists, improve it instead of writing a new one.
2. **Never present a rule as country-specific unless it's verified.** Examples of verified facts: Belgium's three official languages, the bilingual Brussels region, and the regional employment services (Actiris, Forem, VDAB, ADG). Practices such as photos, length or a driving licence are *usages*, not Belgian or French rules.
3. **No unsourced statistics.** Cite a named, linkable source (a specific report, not a homepage) or rephrase without a number. Never make claims about CVixeo user outcomes.
4. **CTAs must match the product.** The ATS score, job matching and cover letters are Premium. Creating, importing and AI drafting are free. Don't write "analyze your CV for free".
5. **Every article needs:** an H1, a key-takeaways summary, H2/H3 sections, at least one concrete example (marked *illustrative* when invented), a link to the relevant CVixeo feature page, links to 1–2 related articles, a FAQ where useful, a unique `seoTitle` (≤ 51 characters + " | CVixeo") and a description of 110–160 characters.

## Content architecture

The pillar is the commercial page that every article in the cluster links to; the CTA is defined in `lib/content-clusters.ts`.

| Cluster | Pillar (EN / FR) | CTA |
|---|---|---|
| AI resumes | /ai-cv-builder · /fr/generateur-cv-ia | Build your CV with AI (free) |
| ATS | /ats-cv-builder · /fr/cv-ats | Check ATS readiness (/cv-optimizer, /fr/analyser-cv) |
| Job matching | /job-description-matching · /fr/cv-offre-emploi | Compare your resume to a job posting |
| Application | — | Build your CV, or a per-article override (cover letter, improve) |
| France | — (planned: /fr/cv-france) | Build your CV |
| Belgium | /fr/cv-belgique | Build your CV |
| Job search | — | Build your CV |

### Cluster 1 — AI resumes

| Topic | Status | Page |
|---|---|---|
| AI resume generator / AI CV builder | ✅ tool page | /ai-cv-builder, /ai-resume-builder, /fr/generateur-cv-ia |
| How to create / improve a resume with AI | ✅ new | /careers/how-to-use-ai-to-write-resume |
| IA et CV (FR) | ✅ existing | cv-intelligence-artificielle-optimiser-candidature, chatgpt-peut-il-creer-bon-cv |
| Utiliser l'IA pour améliorer son CV (FR) | ⏳ planned | FR counterpart of how-to-use-ai-to-write-resume |

### Cluster 2 — ATS

| Topic | Status | Page |
|---|---|---|
| What is an ATS? | ✅ new | /careers/what-is-an-ats |
| How to create an ATS-compatible resume | ✅ existing (claims fixed) | /careers/how-to-create-ats-friendly-resume-2026 |
| Does my resume pass an ATS? + ATS score | ✅ new | /careers/does-my-resume-pass-ats |
| ATS keywords | ✅ new (shared with cluster 3) | /careers/resume-keywords |
| Mistakes that block an ATS | ✅ covered | section of does-my-resume-pass-ats (no separate article, to avoid cannibalization) |
| CV compatible ATS (FR) | ✅ tool + article | /fr/cv-ats, cv-ats-compatible-france |

### Cluster 3 — Job matching

| Topic | Status | Page |
|---|---|---|
| Tailor your resume to a job posting | ✅ existing | /careers/how-to-tailor-resume-to-job-posting |
| How to analyze a job posting + identify the required skills | ✅ new (EN + FR) | /careers/how-to-analyze-job-posting, /fr/careers/analyser-offre-emploi |
| Which keywords to use | ✅ new | /careers/resume-keywords |
| Improve your resume/job match | ✅ tool page | /job-description-matching, /fr/cv-offre-emploi |

### Cluster 4 — Application

| Topic | Status | Page |
|---|---|---|
| Cover letter | ✅ existing | how-to-write-effective-cover-letter, lettre-motivation-france, lettre-motivation-emploi-belgique |
| Resume with no experience / student / first job | ✅ new (EN + FR) | one article per language on purpose (same intent): resume-no-experience, cv-sans-experience |
| Career change resume | 🔧 improve | best-practices-career-change: add a resume section with a before/after example |
| Freelance resume | ⏳ planned | |
| Developer resume | ⏳ planned | |
| Sales resume | ⏳ planned | |
| Administrative resume | ⏳ planned | |

### France (gradual)

| Topic | Status |
|---|---|
| CV en France (pillar /fr/cv-france) | ⏳ planned: structure it like /fr/cv-belgique, with verified facts only |
| CV ATS en France | ✅ cv-ats-compatible-france |
| CV sans expérience / étudiant / premier emploi | ✅ cv-sans-experience (FR + BE) |
| CV reconversion | ⏳ planned |
| Lettre de motivation en France | ✅ lettre-motivation-france |

### Belgium (gradual)

| Topic | Status |
|---|---|
| CV en Belgique (pillar) | ✅ new: /fr/cv-belgique |
| CV à Bruxelles / travailler à Bruxelles | ✅ covered by the pillar plus trouver-emploi-bruxelles-guide-2026 and premier-emploi-bruxelles-cv-candidature |
| CV ATS en Belgique | ✅ covered (pillar + /fr/cv-ats). No separate article: ATS rules aren't country-specific |
| CV en néerlandais | ⏳ planned: section headings, CEFR levels, how to translate job titles |
| CV en anglais en Belgique | ⏳ planned |
| CV étudiant / sans expérience en Belgique | ✅ cv-sans-experience + premier-emploi-bruxelles. A Belgium-specific student-job article would need verified figures (student-work rules change often) |

## Blog audit (2026-10-07)

### Fixed in this pass

- **Fabricated claim about CVixeo removed** from how-to-create-ats-friendly-resume-2026: "users report a 3× increase in interview callbacks". It also described the ATS checker inaccurately.
- **Myths and unsourced statistics removed or rephrased** in 7 EN articles:
  - "ATS reject up to 75%", "70–98% of employers", and the "Harvard Business Review" citation that linked to the hbr.org homepage;
  - "3× interview rate" and "top 10%";
  - the LinkedIn "87%" and "+30%" figures;
  - the salary-negotiation figures;
  - referral rates, and prompt-engineering / certification salary figures.
- **Belgian "rules" reframed as usages** in regles-cv-belge and cv-professionnel-belgique-guide-2026. CEFR is now correctly described as a European standard, and the unverified comparisons (driving licence, photo vs UK/NL) are gone.
- **28 SEO titles shortened** with `seoTitle`; the H1s are unchanged.
- **7 descriptions brought into the 110–165 character range.**
- **Cluster-aware related articles, pillar links and a contextual CTA** in every article.

### Still to verify (data accuracy)

- chomage-belgique-2026-taux-statistiques-mesures, combien-chomeurs-belgique-2026, werkloosheid-belgie-cijfers-regels and chomage-france-2026-taux-statistiques-tendances contain precise 2026 figures (Statbel, ONEM, INSEE/DARES). **Check each figure against the official source before relying on it,** and add the publication date next to each one.
- 10-resume-mistakes-that-prevent-interview cites a CareerBuilder survey (77% of hiring managers disqualify for typos). That's a real but old survey (2013); add the year or remove it.
- skills-most-sought-after-by-recruiters-2026 cites the WEF "44% of core skills will change". Add the exact report name (*Future of Jobs Report 2023*).

### Merge candidates (not done; needs an editorial decision plus 301 redirects in next.config.ts)

| Keep | Merge into it | Why |
|---|---|---|
| mettre-en-valeur-competences-cv | presenter-competences-cv-france | Near-identical text, including duplicated sentences. Duplicate content. |
| cv-professionnel-belgique-guide-2026 | regles-cv-belge | Same subtopics (structure, languages, photo, length). Or reposition regles-cv-belge as a short checklist. |
| trouver-emploi-bruxelles-guide-2026 | travailler-bruxelles-reussir-recherche-emploi | Same intent (job search in Brussels); seoTitles now differentiate them as a stopgap. |
| chomage-belgique-2026-taux-statistiques-mesures | combien-chomeurs-belgique-2026 | Same statistics, two URLs. |

### Cannibalization watch

- "Adapter son CV à une offre": /fr/cv-offre-emploi (tool page), adapter-cv-offre-emploi-belgique (geo angle), ia-adapter-cv-offre-emploi (AI method and limits), analyser-offre-emploi (reading the posting). The angles are now separated by seoTitle. Watch Search Console for overlapping queries.
- "ATS-friendly resume": /ats-cv-builder (tool) vs how-to-create-ats-friendly-resume-2026 (how-to) vs does-my-resume-pass-ats (checking). They cross-link; keep their intents distinct.

### Internal-linking opportunities (next pass)

- Add inline links from existing EN articles to the new ones. For example, how-to-tailor-resume-to-job-posting → resume-keywords and how-to-analyze-job-posting; how-to-create-ats-friendly-resume-2026 → what-is-an-ats.
- Many FR/NL articles have no body links. Add 1–2 contextual links to related articles each.
- Add `summary` and `faq` fields to existing articles, starting with those that already have an HTML "FAQ" section: they'd then also get FAQPage schema.

## Roadmap (suggested order)

1. Data verification of the 4 statistics articles listed above.
2. Decide on and execute the 4 merges (with 301 redirects).
3. FR: utiliser l'IA pour améliorer son CV; CV en néerlandais; CV reconversion.
4. EN: career change resume (improve the existing article), developer resume, sales resume.
5. FR pillar /fr/cv-france (verified facts only).
6. NL: tool pages, then cluster articles (the NL blog has 10 articles but no NL tool pages).

Pace: 2–4 well-researched pieces per month beat a large batch. Measure in Search Console (impressions and clicks per cluster) before scaling a cluster.
