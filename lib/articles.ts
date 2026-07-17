export type Category = "Resume" | "ATS" | "Cover Letter" | "Interview" | "LinkedIn" | "Career";

export const CATEGORIES: Category[] = ["Resume", "ATS", "Cover Letter", "Interview", "LinkedIn", "Career"];

export const categoryStyle: Record<Category, { gradient: string; badge: string }> = {
  "Resume":       { gradient: "from-slate-600 to-slate-900",   badge: "bg-slate-100 text-slate-700"   },
  "ATS":          { gradient: "from-green-700 to-emerald-900", badge: "bg-green-100 text-green-700"   },
  "Cover Letter": { gradient: "from-blue-600 to-indigo-900",   badge: "bg-blue-100 text-blue-700"     },
  "Interview":    { gradient: "from-amber-500 to-orange-800",  badge: "bg-amber-100 text-amber-700"   },
  "LinkedIn":     { gradient: "from-sky-500 to-blue-800",      badge: "bg-sky-100 text-sky-700"       },
  "Career":       { gradient: "from-violet-600 to-purple-900", badge: "bg-violet-100 text-violet-700" },
};

export interface ArticleSection {
  heading: string;
  content: string; // safe static HTML
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: Category;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  featured?: boolean;
  sections: ArticleSection[];
}

export const articles: Article[] = [
  // ── 1 ────────────────────────────────────────────────────────────────────────
  {
    slug: "how-to-create-ats-friendly-resume-2026",
    title: "How to Create a Resume That Passes ATS Screening in 2026",
    description: "Applicant Tracking Systems reject up to 75% of resumes before a human reads them. Learn the exact techniques to pass the filter and land in front of recruiters.",
    category: "ATS",
    publishedAt: "2026-07-01",
    readingTime: 7,
    featured: true,
    tags: ["ATS", "resume", "job search", "applicant tracking system", "2026"],
    sections: [
      {
        heading: "What Is an ATS and Why Does It Matter?",
        content: `<p>An Applicant Tracking System (ATS) is software used by over 98 % of Fortune 500 companies to manage job applications. When you submit your resume online, it is almost always processed by an ATS before a human recruiter ever sees it.</p><p>The ATS parses your resume, extracts skills, work history, and education, then scores your application against the job requirements. If your score falls below a threshold, your resume is automatically rejected — regardless of how qualified you actually are. Understanding how ATS works isn't optional anymore; it's a fundamental job-search skill.</p>`,
      },
      {
        heading: "Rule 1 — Use Standard Formatting",
        content: `<p>The most common reason resumes fail ATS screening isn't lack of qualifications — it's poor formatting. ATS parsers struggle with columns, graphics, tables, and text boxes.</p><p>Stick to a clean single-column layout. Use standard section headers: "Work Experience," "Education," "Skills," "Certifications." Submit as .docx or a text-based PDF (never a scanned image).</p><ul><li><strong>Do use:</strong> Standard fonts (Arial, Calibri, Times New Roman), clear headings, bullet points.</li><li><strong>Avoid:</strong> Tables, columns, text boxes, headers/footers, graphics, icons.</li></ul>`,
      },
      {
        heading: "Rule 2 — Keyword Optimisation",
        content: `<p>Every job posting is a roadmap to the keywords your resume needs. ATS systems compare your language to the job description. The closer the match, the higher your score.</p><p>Read the posting carefully and highlight recurring terms — both hard skills (Python, Salesforce, project management) and soft skills (collaboration, leadership). Incorporate these naturally into your experience bullets, skills section, and summary. Don't keyword-stuff — modern ATS uses semantic analysis and penalises unnatural repetition.</p>`,
      },
      {
        heading: "Rule 3 — Quantify Your Impact",
        content: `<p>ATS systems and recruiters alike prioritise measurable results. Instead of "responsible for managing social media," write "Grew Instagram following by 340 % in 6 months, driving €45 000 in attributed revenue."</p><p>Use the CAR framework — Challenge, Action, Result — for every bullet point. Even rough estimates beat vague descriptions: "Reduced support tickets by approximately 30 %" is stronger than "improved customer satisfaction."</p>`,
      },
      {
        heading: "Rule 4 — Test Before Submitting",
        content: `<p>Paste your resume text into a plain-text editor. If the structure holds — readable and logically ordered — your ATS parsing will likely succeed. If it looks scrambled, you have a formatting problem to fix.</p><p>Cvixeo's built-in ATS checker scores your resume against a specific job description and gives actionable suggestions. This step alone can increase your interview rate by 3× according to our user data.</p>`,
      },
      {
        heading: "Rule 5 — Tailor for Every Application",
        content: `<p>One resume for every application is a 2010 strategy. In 2026 you need targeted adjustments for each role — a revised summary, reordered skills, and swapped-in bullet points that match the posting. Create a master resume, then build tailored versions. With Cvixeo's job-matching feature the process takes under 10 minutes.</p>`,
      },
    ],
  },

  // ── 2 ────────────────────────────────────────────────────────────────────────
  {
    slug: "10-resume-mistakes-that-prevent-interview",
    title: "The 10 Mistakes That Prevent Your Resume from Landing an Interview",
    description: "Most resumes fail for the same predictable reasons. Discover the 10 critical mistakes recruiters see every day — and how to fix each one fast.",
    category: "Resume",
    publishedAt: "2026-06-20",
    readingTime: 6,
    featured: true,
    tags: ["resume mistakes", "job search", "resume tips", "interview"],
    sections: [
      {
        heading: "Mistake #1 — A Generic Objective Statement",
        content: `<p>"Seeking a challenging position where I can grow my skills" tells recruiters nothing about your value. Replace it with a 3-4 sentence professional summary that conveys your specialty, years of experience, and key achievement.</p><p><em>Instead of:</em> "Seeking a challenging role in marketing."<br/><em>Write:</em> "Digital Marketing Manager with 5 years driving B2B demand generation. Built paid acquisition programmes from €0 to €2 M ARR at two SaaS startups. Specialising in LinkedIn and Google Ads for technical audiences."</p>`,
      },
      {
        heading: "Mistake #2 — No Quantified Results",
        content: `<p>Listing job duties isn't a resume — it's a job description. Every bullet point should include a number where possible. If you managed a team, how many? If you increased sales, by what percentage? Numbers create credibility and make your achievements concrete.</p>`,
      },
      {
        heading: "Mistake #3 — An Unparseable PDF",
        content: `<p>A PDF created in design software (Canva, Illustrator) often exports as an image-based file that ATS systems cannot read. Your text becomes invisible to the parser. Always create your resume in a word processor and export to PDF, or submit .docx when applying through ATS portals.</p>`,
      },
      {
        heading: "Mistake #4 — Irrelevant Information",
        content: `<p>Remove work experience older than 15 years (unless directly relevant). Skip generic hobbies. Omit "references available upon request." Every line on your resume competes for the recruiter's 7 seconds of attention — make each one earn its place.</p>`,
      },
      {
        heading: "Mistake #5 — Inconsistent Formatting",
        content: `<p>Mixed fonts, random spacing, and inconsistent date formats signal carelessness. Recruiters notice. Use one font family, pick one date format and stick to it, and start every bullet with a strong action verb. Consistency communicates professionalism.</p>`,
      },
      {
        heading: "Mistake #6 — Spelling and Grammar Errors",
        content: `<p>77 % of hiring managers say they would automatically disqualify a candidate with a typo. Read your resume aloud. Read it backwards. Have someone else proofread it. A resume you've stared at for hours becomes invisible to your own eyes.</p>`,
      },
      {
        heading: "Mistake #7 — Missing Keywords",
        content: `<p>If the job description says "cross-functional collaboration" and your resume says "worked with other teams," an ATS may score you lower even though you have the skill. Mirror the job posting's language without copy-pasting wholesale.</p>`,
      },
      {
        heading: "Mistake #8 — Wrong Length",
        content: `<p>Entry to mid-level professionals should target one page. Senior professionals with 10+ years can use two pages. Three pages is almost always too long. If running long, cut oldest experience to 3-4 bullets, remove irrelevant roles, and tighten your language.</p>`,
      },
      {
        heading: "Mistake #9 — A Generic Skills Section",
        content: `<p>"Microsoft Office, communication, teamwork" adds no differentiating value. Your skills section should feature specific, demonstrable skills relevant to your target role. "Advanced Excel (pivot tables, VBA, Power Query)" is a skill. "Microsoft Office" is not.</p>`,
      },
      {
        heading: "Mistake #10 — Not Tailoring Per Application",
        content: `<p>Sending the same resume to 100 companies is significantly less effective than sending 20 tailored resumes. A resume optimised for a specific role consistently outperforms a generic version by 3-4× in callback rates. Use your master resume as a base and adjust the summary, skills, and top bullets for each application.</p>`,
      },
    ],
  },

  // ── 3 ────────────────────────────────────────────────────────────────────────
  {
    slug: "how-to-tailor-resume-to-job-posting",
    title: "How to Tailor Your Resume to a Job Posting",
    description: "Generic resumes get generic results. Learn the step-by-step process for customising your resume to any job description — and why it multiplies your interview rate by 3×.",
    category: "Resume",
    publishedAt: "2026-06-10",
    readingTime: 5,
    tags: ["resume tailoring", "job description matching", "keywords", "job search"],
    sections: [
      {
        heading: "Why Tailoring Matters More Than Ever",
        content: `<p>With AI-powered recruiting tools analysing hundreds of applications per role, the gap between a generic resume and a tailored one has never been wider. Research consistently shows that tailored resumes generate 40-60 % more interview callbacks than generic versions sent to the same roles.</p>`,
      },
      {
        heading: "Step 1 — Deconstruct the Job Description",
        content: `<p>Read the job description three times. On the first pass, identify must-have requirements. On the second, highlight keywords that appear multiple times — these are priorities. On the third, note the company's language and culture signals (formal/informal, growth/stability focus).</p><p>Make a list of the top 10 skills and experiences the role requires. This list becomes your tailoring checklist.</p>`,
      },
      {
        heading: "Step 2 — Mirror the Language",
        content: `<p>Companies use specific terminology. "Account executive" vs. "sales representative." "Product roadmap" vs. "product planning." Use the company's exact language when it describes your genuine experience — ATS systems and recruiters respond to familiar patterns.</p>`,
      },
      {
        heading: "Step 3 — Reorder and Highlight",
        content: `<p>Move your most relevant experience to the top. If you're applying for a data science role and that experience is buried below a retail job from 2018, restructure. In your skills section, lead with the skills explicitly mentioned in the job description.</p>`,
      },
      {
        heading: "Step 4 — Rewrite Your Professional Summary",
        content: `<p>Your summary should read like it was written specifically for this company and role — because it should be. Reference the specific role title, the company's industry or challenge, and your most relevant qualification. A tailored summary transforms reading from "does this person fit?" to "yes, this is exactly what we need."</p>`,
      },
      {
        heading: "Step 5 — Verify with an ATS Score",
        content: `<p>Before submitting, use Cvixeo's ATS matching tool to score your tailored resume against the specific job description. The tool identifies missing keywords, scores your match percentage, and suggests improvements. Aim for an 80 %+ match for roles where you meet the core requirements.</p>`,
      },
    ],
  },

  // ── 4 ────────────────────────────────────────────────────────────────────────
  {
    slug: "how-to-write-effective-cover-letter",
    title: "How to Write an Effective Cover Letter",
    description: "A great cover letter can open doors even when your resume has gaps. Learn the structure and techniques that get cover letters actually read — and remembered.",
    category: "Cover Letter",
    publishedAt: "2026-05-28",
    readingTime: 6,
    tags: ["cover letter", "job application", "writing", "job search"],
    sections: [
      {
        heading: "The Truth About Cover Letters in 2026",
        content: `<p>Cover letters are both more and less important than you think. Recruiters typically read them after deciding to shortlist based on the resume — but a great letter can push a borderline application over the threshold, and a poor one can eliminate a strong one.</p><p>Recruiters scan for three things: who you are, why you want <em>this</em> role at <em>this</em> company, and what makes you different. Your cover letter must answer these instantly.</p>`,
      },
      {
        heading: "The Structure That Works",
        content: `<p><strong>Opening (2-3 sentences):</strong> Hook with a specific achievement or connection to the company. Never open with "I am applying for the position of…" — every recruiter's eyes glaze over at that phrase.</p><p><strong>Body (2 paragraphs):</strong> Para 1 — your most relevant experience tied to the role's key requirement. Para 2 — why this specific company, backed by real research.</p><p><strong>Closing (2-3 sentences):</strong> Confident call to action. "I'd welcome the chance to discuss how my background in [X] aligns with your goals. Available for a call any time this week."</p>`,
      },
      {
        heading: "The Opening Hook",
        content: `<p>Lead with something that makes the reader lean forward. A striking number: "I've managed €8 M in paid media spend across 14 markets." A relevant observation: "Your expansion into Southeast Asia is exactly the challenge I've spent the last three years preparing for." A shared connection: "After speaking with [Name] at your Berlin event last month, I knew I had to reach out."</p>`,
      },
      {
        heading: "Showing Company Research",
        content: `<p>The fastest way to stand out is to demonstrate that you understand the company's current situation. Reference a recent product launch, a strategic priority from their annual report, or a challenge they've written about publicly.</p><p>"I noticed your Q4 earnings call mentioned scaling the enterprise segment" is worth more than a paragraph of generic enthusiasm.</p>`,
      },
      {
        heading: "Length, Format, and AI",
        content: `<p>One page maximum. Three to four paragraphs. PDF unless instructed otherwise. Match the font to your resume for a cohesive package.</p><p>AI cover-letter generators are everywhere — and so is AI-detection. Use Cvixeo's generator as a starting point, not a final product. Always inject a specific personal achievement, a genuine observation about the company, and your actual voice. AI can't generate these details from nothing; that's your job.</p>`,
      },
    ],
  },

  // ── 5 ────────────────────────────────────────────────────────────────────────
  {
    slug: "how-to-optimize-linkedin-profile",
    title: "How to Optimise Your LinkedIn Profile for Recruiters",
    description: "87 % of recruiters use LinkedIn to find candidates. Learn how to transform your profile from a digital resume into a job-search tool that works 24/7.",
    category: "LinkedIn",
    publishedAt: "2026-05-15",
    readingTime: 8,
    featured: true,
    tags: ["LinkedIn", "LinkedIn optimisation", "personal branding", "recruiter", "job search"],
    sections: [
      {
        heading: "Why LinkedIn Is Your Most Important Career Document",
        content: `<p>Over 87 % of recruiters use LinkedIn as their primary sourcing tool. Many roles are filled before they're ever publicly posted — through recruiters who proactively sourced candidates. A fully optimised profile gets 21× more views and 36× more recruiter messages than an incomplete one.</p>`,
      },
      {
        heading: "Profile Photo — Your First Impression",
        content: `<p>Profiles with photos get 21× more views than those without. Wear what you'd wear to work at your target company. Use a high-resolution headshot (at least 400 × 400 px). Look directly at the camera. Smile. Use a neutral background.</p><p>Avoid: vacation photos, group photos, anything more than 2-3 years old, sunglasses, or overly casual attire. Your photo should say "professional" before the recruiter reads a single word.</p>`,
      },
      {
        heading: "The Headline — Beyond Your Job Title",
        content: `<p>Your headline is the most-viewed, least-optimised element on most profiles. "Software Engineer at Google" is fine but misses the opportunity to communicate value and specialty.</p><p>Use the formula: <em>[Role] | [Specialty] | [Impact]</em>. Example: "Marketing Manager | B2B SaaS | Turning Product Data into Revenue." Pack in relevant keywords — LinkedIn search ranks profiles partly on headline content.</p>`,
      },
      {
        heading: "The About Section — Tell Your Story",
        content: `<p>Write in first person. Start with your strongest hook — a specific achievement, your professional philosophy, or the problem you solve. Structure: who you are → what you specialise in → what you've achieved → what you're open to. End with a call to action. Include keywords naturally throughout. Keep it to 3-5 paragraphs.</p>`,
      },
      {
        heading: "Experience — More Than a Resume Copy",
        content: `<p>LinkedIn experience can (and should) contain more than your resume does. Write 3-5 achievement-focused bullet points per role, then add 1-2 sentences of company context in the description. Attach PDFs, link to projects, and embed media. Recruiters who find you on LinkedIn often know less about your company than a recruiter who received your resume directly — give them context.</p>`,
      },
      {
        heading: "Skills, Endorsements, and Open to Work",
        content: `<p>Add up to 50 skills (LinkedIn's maximum) with your most important ones pinned at the top. Request endorsements from colleagues for your top 3-5 skills — endorsed skills carry significantly more weight in search ranking.</p><p>If you're actively searching, use LinkedIn's "Open to Work" feature. Set it to "Recruiters only" for a confidential search, or use the public banner to signal availability. The recruiter-only mode is typically the more effective choice.</p>`,
      },
    ],
  },

  // ── 6 ────────────────────────────────────────────────────────────────────────
  {
    slug: "skills-most-sought-after-by-recruiters-2026",
    title: "The Skills Most Sought After by Recruiters in 2026",
    description: "The job market has transformed. Discover which technical and soft skills are commanding the highest salaries and most interview requests in 2026.",
    category: "Career",
    publishedAt: "2026-05-01",
    readingTime: 7,
    tags: ["skills", "career", "recruiters", "2026", "in-demand skills", "job market"],
    sections: [
      {
        heading: "How the Skills Landscape Has Changed",
        content: `<p>The World Economic Forum's 2026 Future of Jobs report estimates that 44 % of workers' core skills will be disrupted in the next five years. AI automation is eliminating some roles while creating demand for others at an unprecedented rate.</p><p>Two themes dominate 2026 recruiter surveys: <strong>AI-adjacent skills</strong> (working with, managing, and building on top of AI) and <strong>uniquely human skills</strong> (the judgment, creativity, and interpersonal abilities AI cannot replicate).</p>`,
      },
      {
        heading: "The Most In-Demand Technical Skills",
        content: `<ul><li><strong>AI &amp; Machine Learning:</strong> Prompt engineering and AI-tool proficiency is now expected across marketing, operations, finance, and HR — not just engineering.</li><li><strong>Data Analysis:</strong> SQL, Python, and Excel remain fundamental. Tableau, Power BI, and Looker are increasingly required in non-technical roles.</li><li><strong>Cloud Platforms:</strong> AWS, Azure, and GCP certifications are among the fastest-growing requirements in technical job postings.</li><li><strong>Cybersecurity:</strong> Every major organisation is investing here. CompTIA Security+, CISSP, and CEH certifications command significant salary premiums.</li></ul>`,
      },
      {
        heading: "The Most In-Demand Soft Skills",
        content: `<ul><li><strong>Adaptability:</strong> The #1 soft skill in 2026 recruiter surveys. Demonstrate it with examples of mastering new tools or pivoting strategy under pressure.</li><li><strong>Critical Thinking:</strong> With AI handling routine analysis, humans are valued for judgment in ambiguous situations.</li><li><strong>Communication:</strong> Specifically: communicating complex ideas simply to both technical and non-technical audiences. Written communication has risen as remote and async work increases.</li><li><strong>Emotional Intelligence:</strong> Managing conflict, leading through uncertainty, building trust across remote teams — this is what commands leadership premiums.</li></ul>`,
      },
      {
        heading: "Industry-Specific Rising Skills",
        content: `<p><strong>Tech:</strong> Kubernetes, Rust, TypeScript, and system design for engineers. MLOps for data scientists.<br/><strong>Finance:</strong> ESG reporting, FP&amp;A modelling, and blockchain/DeFi literacy.<br/><strong>Marketing:</strong> AI content generation, first-party data strategy, and marketing-mix modelling as third-party cookies phase out.<br/><strong>Healthcare:</strong> Health informatics, telehealth technology, and regulatory knowledge (FDA, HIPAA).</p>`,
      },
      {
        heading: "Demonstrate Skills — Don't Just List Them",
        content: `<p>A skills section listing "communication, leadership, problem-solving" is a placeholder, not evidence. Instead of listing "data analysis," write in your experience: "Built an automated dashboard in Python that reduced monthly reporting from 2 days to 4 hours, enabling the team to identify a retention issue 3 weeks earlier than before."</p><p>On LinkedIn, use the Featured section to link to GitHub repositories, presentations, or articles you've written. Evidence always beats claims.</p>`,
      },
    ],
  },

  // ── 7 ────────────────────────────────────────────────────────────────────────
  {
    slug: "how-to-ace-job-interview",
    title: "How to Ace a Job Interview: The Complete 2026 Guide",
    description: "Interviews are performances, not conversations. Learn the preparation framework, answer structures, and follow-up tactics that top candidates use to turn interviews into offers.",
    category: "Interview",
    publishedAt: "2026-04-20",
    readingTime: 9,
    featured: true,
    tags: ["job interview", "interview tips", "STAR method", "interview preparation"],
    sections: [
      {
        heading: "The 72-Hour Preparation Framework",
        content: `<p><strong>72 hours before:</strong> Deep research. Read the company's website, recent news, and Glassdoor reviews. Understand their product, business model, and main competitors. Study the LinkedIn profiles of your interviewers.</p><p><strong>24 hours before:</strong> Story preparation. Identify 8-10 professional stories covering: your biggest achievement, a challenge you overcame, a failure you learned from, a time you led something, and a time you collaborated under pressure.</p><p><strong>The evening before:</strong> Practise out loud — not in your head. The gap between "I know what I'd say" and "I can say it clearly and confidently" is enormous.</p>`,
      },
      {
        heading: "The STAR Method",
        content: `<p>STAR (Situation, Task, Action, Result) is the gold standard for behavioural interview answers. For every "Tell me about a time when…" question:</p><ul><li><strong>Situation:</strong> Context in 2-3 sentences max.</li><li><strong>Task:</strong> Your specific responsibility.</li><li><strong>Action:</strong> What <em>you</em> specifically did (not the team, not your manager).</li><li><strong>Result:</strong> Quantified outcome and what you learned.</li></ul><p>The most common mistake: spending too long on Situation. Spend 10 % on S, 10 % on T, 60 % on A, 20 % on R.</p>`,
      },
      {
        heading: "Questions You Must Prepare For",
        content: `<p><strong>"Tell me about yourself":</strong> 60-90 second professional narrative. Present → Past → Future.</p><p><strong>"Why do you want to work here?":</strong> Be specific — a product you use and admire, a problem they're solving that you care about, a capability you want to develop.</p><p><strong>"What's your greatest weakness?":</strong> Choose a real weakness (not "I work too hard") that you are actively improving. Show self-awareness: "I used to struggle with delegating. I've been working on this by [specific example]."</p><p><strong>"Where do you see yourself in 5 years?":</strong> Show ambition aligned with the company's growth trajectory.</p>`,
      },
      {
        heading: "Questions to Ask Your Interviewer",
        content: `<p>Great questions demonstrate research and genuine interest. Prepare at least five; you'll use two or three.</p><ul><li>"What does success look like in this role after 6 months?"</li><li>"What are the biggest challenges the team is facing right now?"</li><li>"How has the team changed in the last year?"</li><li>"What do you personally enjoy most about working here?"</li></ul><p>Avoid questions answered on the website and anything implying you're already planning your next move beyond this role.</p>`,
      },
      {
        heading: "The Virtual Interview Advantage",
        content: `<p>With remote and hybrid work prevalent, virtual interviews require specific preparation. Test your technology the day before: camera angle (slightly above eye level), lighting (face a window or use a ring light), audio (headphones prevent echo), and background (clean, or use a subtle virtual background).</p><p>Look at the camera, not the screen. This feels counterintuitive but is critical — looking at the interviewer's face on-screen means you're looking slightly downward, which reads as disengaged. Tape a small arrow next to your camera as a reminder.</p>`,
      },
      {
        heading: "The Follow-Up That Gets Remembered",
        content: `<p>Send a thank-you email within 24 hours. Not a generic "thank you for your time" — reference something specific from the conversation: an insight they shared, a challenge you discussed, an idea you'd like to add to. This reinforces your candidacy and proves you were engaged.</p><p>If you haven't heard back by their stated timeline, one polite follow-up is appropriate. Many offers go to candidates who followed up and kept the conversation alive.</p>`,
      },
    ],
  },

  // ── 8 ────────────────────────────────────────────────────────────────────────
  {
    slug: "one-page-vs-two-page-resume",
    title: "One-Page or Two-Page Resume: Which Should You Choose?",
    description: "The one-page vs. two-page debate has a definitive answer — but it depends on who you are. Learn the exact criteria for deciding which format maximises your chances.",
    category: "Resume",
    publishedAt: "2026-04-05",
    readingTime: 4,
    tags: ["resume length", "one page resume", "two page resume", "resume format"],
    sections: [
      {
        heading: "The Definitive Answer (It's Not One-Size-Fits-All)",
        content: `<p>Career coaches who insist on one page for everyone are wrong. So are those who say two pages is always more professional. The right answer depends on your experience, career complexity, and target role. Your resume should be exactly as long as it needs to be to compellingly present your relevant qualifications — no longer and no shorter.</p>`,
      },
      {
        heading: "When to Use One Page",
        content: `<ul><li>Fewer than 5-7 years of relevant work experience</li><li>Recent graduate (within 3 years)</li><li>Significant career change — most experience isn't directly applicable</li><li>Entry-level or junior roles where high application volume means less reading time</li></ul><p>One-page resumes force discipline. If you can tell your story compellingly in one page, that's an advantage — you're respecting the recruiter's time.</p>`,
      },
      {
        heading: "When to Use Two Pages",
        content: `<ul><li>7+ years of relevant experience across multiple roles</li><li>Applying for senior, director, or C-suite positions</li><li>Multiple significant achievements all relevant to the target role</li><li>Academic, research, medical, or technical fields where comprehensive history is expected</li></ul><p>Two-page resumes for senior professionals are not just acceptable — they're often expected. A VP of Engineering who squeezes 15 years into one page is likely leaving out information that would strengthen their candidacy.</p>`,
      },
      {
        heading: "Rules If You Go to Two Pages",
        content: `<p>Never end on a half-empty second page. Either fill it or cut content to return to one page. A second page that is 30 % empty signals poor editing judgment.</p><p>Put your strongest content on page one. If a recruiter only reads the first page, they should still get a compelling picture. Page two is supporting evidence, not the main argument.</p>`,
      },
      {
        heading: "The Page-Count Non-Issue for ATS",
        content: `<p>For digital ATS submissions, page count is completely irrelevant. ATS systems process your content as text — there is no "page" concept. The debate applies primarily to PDF resumes sent directly to humans.</p><p>Optimise your ATS submission for keyword coverage and completeness. Then create a visually formatted version (one or two pages, as appropriate) for direct recruiter contact and in-person interviews.</p>`,
      },
    ],
  },

  // ── 9 ────────────────────────────────────────────────────────────────────────
  {
    slug: "how-to-negotiate-salary",
    title: "How to Negotiate Your Salary: Scripts and Strategies That Work",
    description: "85 % of hiring managers have room to negotiate — but most candidates never ask. Learn the research methods, timing tactics, and exact phrases that maximise your offer.",
    category: "Career",
    publishedAt: "2026-03-18",
    readingTime: 7,
    tags: ["salary negotiation", "compensation", "job offer", "career", "salary"],
    sections: [
      {
        heading: "The Data: Why Most People Leave Money on the Table",
        content: `<p>Only 37 % of workers always negotiate their salary, while 18 % never do. Yet 85 % of hiring managers report they had budget to increase an initial offer — they were simply waiting to be asked.</p><p>The compounding effect is enormous. A successful negotiation adding €5 000 to your first-year salary means €5 000 more every subsequent year (raises and future offers are anchored to this number). Over 10 years, one successful negotiation can mean €50 000-€100 000 in additional cumulative compensation.</p>`,
      },
      {
        heading: "Research First — Know Your Number",
        content: `<p>Never negotiate based on personal need. Negotiating based on market data is professional and compelling. Use multiple sources: LinkedIn Salary, Glassdoor, Levels.fyi (tech), Indeed Salary, and industry surveys. Ask trusted contacts in similar roles. Study job postings that list ranges.</p><p>Your target should be at the 75th percentile of the market range for your experience level and location. Asking at the top gives you room to "meet in the middle" and still land well.</p>`,
      },
      {
        heading: "Timing — When to Bring Up Compensation",
        content: `<p>Let the employer bring it up first whenever possible. When asked early in the process, deflect professionally: "I'm focused on learning whether this role is a great fit. Can you share the budgeted range?"</p><p>Many employers share their range at this point. If it's below your target, address it immediately rather than investing time in a process that won't lead to an acceptable offer.</p>`,
      },
      {
        heading: "The Negotiation Conversation",
        content: `<p>When you receive an offer, express genuine enthusiasm first. Then: "Thank you so much — I'm really excited about this opportunity. Could I have a few days to review the full package?"</p><p>Come back via phone or video, not email. Start your counter with appreciation: "I'm genuinely excited about joining the team. Based on my research and experience, I was hoping we could get closer to [X]. Is there flexibility there?"</p><p>Then stop talking. Whoever speaks first after the ask often loses ground. Be comfortable with the pause.</p>`,
      },
      {
        heading: "Beyond Base Salary — The Full Package",
        content: `<p>When base salary has a ceiling, negotiate the rest of the package. Signing bonus (often has separate budget). Remote-work flexibility. Additional vacation days. Professional development budget. Equity (stock options or RSUs). Earlier performance-review timeline.</p><p>A €3 000 signing bonus, one extra week of vacation, and a €2 000 annual development budget can exceed the value of a €4 000 base-salary increase depending on your tax situation and circumstances.</p>`,
      },
    ],
  },

  // ── 10 ───────────────────────────────────────────────────────────────────────
  {
    slug: "best-practices-career-change",
    title: "Best Practices for a Successful Career Change",
    description: "Changing careers is more achievable than ever — but it requires strategy. Learn how to leverage your transferable skills, build credibility fast, and land your first role in a new field.",
    category: "Career",
    publishedAt: "2026-03-01",
    readingTime: 8,
    tags: ["career change", "career transition", "transferable skills", "pivot", "career advice"],
    sections: [
      {
        heading: "The Career Change Reality in 2026",
        content: `<p>The average person changes careers (not just jobs) 5-7 times in their lifetime. Far from being a liability, strategic career changers are increasingly valued — diverse backgrounds create innovative thinking. Online learning, portfolio-based hiring, and skills-focused employers have also lowered the barriers significantly.</p>`,
      },
      {
        heading: "The Self-Assessment Phase",
        content: `<p>Before updating your resume, answer three questions honestly.</p><ol><li><strong>Why are you leaving your current career?</strong> If it's burnout from a specific environment rather than the work itself, a career change may not solve the problem.</li><li><strong>What do you want in your new career?</strong> Be specific — what type of work, industry, impact, and growth trajectory?</li><li><strong>What does success look like in 2 years?</strong> A specific target state leads to a focused job search.</li></ol>`,
      },
      {
        heading: "Identifying Transferable Skills",
        content: `<p>Every career builds skills that transfer. A teacher's skills: curriculum design (= content strategy), classroom management (= project management), differentiating instruction (= user personalisation), parent communication (= stakeholder management).</p><p>List your top 15 skills from your current career. For each, ask: "What does this look like in my target field? What's the equivalent terminology?" This translation exercise is the foundation of your career-change narrative.</p>`,
      },
      {
        heading: "Building Credibility in the New Field",
        content: `<p>Employers want evidence of commitment, not just enthusiasm.</p><ul><li><strong>Side projects:</strong> Build something, write something, analyse something. A marketer transitioning to data science should have 2-3 projects on GitHub before their first interview.</li><li><strong>Certifications:</strong> One high-signal certification signals serious commitment (AWS, Google Analytics, PMP, CFA).</li><li><strong>Network intentionally:</strong> Connect with 10-20 people in your target field. Comment thoughtfully on their posts. Ask for informational interviews. The goal is to get known before you start applying.</li></ul>`,
      },
      {
        heading: "Structuring Your Career-Change Resume",
        content: `<p>Lead with a hybrid format that puts transferable skills and new-field accomplishments before chronological work history. Your professional summary should directly position the transition as an asset: "Operations director with 8 years of process optimisation experience transitioning to product management. Proven track record of cross-functional leadership, data-driven decision making, and shipping complex projects on time and on budget."</p><p>Use Cvixeo's AI optimiser to identify which existing experience bullets are most relevant to your target role and suggest how to reframe them using the language and priorities of your new industry.</p>`,
      },
      {
        heading: "Targeting the Right Companies",
        content: `<p>Apply to companies known for valuing diverse backgrounds: startups, companies undergoing transformation, and organisations entering new markets are more likely to take bets on career changers than large, established companies with rigid credential requirements.</p><p>Target roles that are explicitly entry-to-mid level in the new field. Trying to join at your current seniority level is almost always too large a leap. Accepting a temporary step back in title — but not necessarily salary — is often the fastest path to exceeding your previous level in the new field within 2-3 years.</p>`,
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(current: Article, limit = 3): Article[] {
  return articles
    .filter((a) => a.slug !== current.slug)
    .sort((a, b) => {
      const sameCategory = (a.category === current.category ? 1 : 0) - (b.category === current.category ? 1 : 0);
      if (sameCategory !== 0) return -sameCategory;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, limit);
}
