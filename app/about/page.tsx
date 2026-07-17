import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Target, Eye, Zap, Shield, Layers, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "About Cvixeo — Our Mission, Vision & Values",
  description:
    "Cvixeo's mission is to help every job seeker land more interviews using AI. Learn about our product vision, core values, and the team behind the platform.",
};

const VALUES = [
  {
    icon: Layers,
    title: "Simplicity",
    description:
      "Complexity is the enemy of action. We strip every feature down to its essential value so you can focus on your job search, not on learning a tool.",
  },
  {
    icon: Zap,
    title: "Efficiency",
    description:
      "Your time is precious. We help you produce a professional, ATS-optimised resume in minutes — not hours — without compromising quality.",
  },
  {
    icon: Shield,
    title: "Professionalism",
    description:
      "Every template, AI suggestion, and exported document is crafted to make you look your professional best in front of any recruiter or hiring manager.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "We stay at the frontier of AI so you always have access to the most effective tools available. Standing still is not an option in a market that moves this fast.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-slate-800">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative mx-auto max-w-4xl px-6 py-20 text-center text-white">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-700 ring-1 ring-white/10">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Built for the job seekers<br className="hidden sm:block" /> who deserve more interviews
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-300">
              Cvixeo was founded on a simple belief: the only barrier to landing your dream job should be your qualifications — not your ability to articulate them on paper.
            </p>
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                  <Target className="h-3 w-3" />
                  Our Mission
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Democratise access to professional career tools
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  For decades, crafting a compelling resume required either expensive career coaches, design software expertise, or hours of painful writing. The result was a system where job-search success correlated too strongly with resources rather than talent.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Cvixeo's mission is to level the playing field. We combine AI, professional templates, and an ATS-optimisation engine to give every candidate — whether they are a recent graduate, a mid-career professional, or someone changing direction — the same quality of career tools that were previously available only to the few.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-100">
                <blockquote className="text-sm font-medium leading-relaxed text-slate-700">
                  "Every qualified candidate who doesn't get an interview because of a poorly formatted or keyword-missing resume represents a failure of the system — not a failure of the person. We exist to fix that."
                </blockquote>
                <p className="mt-4 text-xs font-semibold text-slate-400">— Cvixeo Founding Team</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Vision ── */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 lg:order-last">
                <div className="space-y-4">
                  {[
                    { stat: "10,000+", label: "CVs created on the platform" },
                    { stat: "94%",     label: "ATS pass rate for optimised resumes" },
                    { stat: "3×",      label: "More interview callbacks vs. unoptimised" },
                    { stat: "< 5 min", label: "Average time to a complete, polished CV" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <span className="text-xl font-extrabold text-slate-900">{item.stat}</span>
                      <span className="text-xs text-slate-500">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                  <Eye className="h-3 w-3" />
                  Our Vision
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  A world where the best candidate always gets the interview
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  We envision a future where Applicant Tracking Systems filter for genuine fit rather than formatting accidents. Where every professional can present their best self to employers clearly and confidently. Where the first interview is about the person — not the paper.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Getting there requires continuously improving the AI, the templates, and the guidance that candidates receive — so that Cvixeo users are always among the best-prepared applicants in any pool.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Goal ── */}
        <section className="border-y border-gray-100 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              One clear goal
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500">
              Help candidates land more interviews using AI.
            </p>
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-green-50 p-8 ring-1 ring-green-100">
              <p className="text-sm leading-relaxed text-slate-700">
                Every feature we build is evaluated against a single question: <strong className="text-slate-900">does this help a candidate get an interview they would not have gotten otherwise?</strong> If yes, we build it and refine it. If no, it does not belong in Cvixeo.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                This means ATS optimisation is not a bolt-on feature — it is the backbone of everything. It means AI suggestions are not cosmetic — they are trained on what actually moves applications forward. And it means we obsess over the PDF export, the templates, and every word of guidance we provide, because the candidate's result depends on all of it.
              </p>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Our values</h2>
              <p className="mt-2 text-sm text-slate-500">
                Four principles that guide every decision we make.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                    <v.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{v.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-slate-800">
          <div className="mx-auto max-w-4xl px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-white">
              Ready to land more interviews?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
              Build a professional, ATS-optimised resume in minutes — free to start.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:bg-green-600 hover:text-white active:bg-green-700"
              >
                Build your CV free
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
