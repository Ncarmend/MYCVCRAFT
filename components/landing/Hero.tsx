/**
 * Landing page hero section
 */
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "10,000+", label: "CVs created" },
  { value: "94%", label: "ATS pass rate" },
  { value: "3×", label: "More interviews" },
];

const highlights = [
  "ATS-optimized in one click",
  "AI bullet point generation",
  "PDF export included",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-150 w-150 rounded-full bg-indigo-50 opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-125 w-125 rounded-full bg-purple-50 opacity-50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 text-center lg:pt-28">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
          <Sparkles className="h-3.5 w-3.5" />
          AI-powered CV builder — free to start
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
          Land your dream job{" "}
          <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            with AI
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl">
          Generate ATS-optimized, professionally crafted CVs in minutes. Match
          your CV to any job description and download beautiful PDFs instantly.
        </p>

        {/* Quick highlights */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {highlights.map((h) => (
            <span key={h} className="flex items-center gap-1.5 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-indigo-500" />
              {h}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/signup">
            <Button size="lg" className="gap-2 px-8">
              <Sparkles className="h-5 w-5" />
              Build your CV free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="secondary">
              View pricing
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          No credit card required · Free plan available
        </p>

        {/* Stats */}
        <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 sm:mt-16">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-gray-900 sm:text-3xl">{s.value}</span>
              <span className="text-xs text-gray-400 sm:text-sm">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Browser mockup */}
        <div className="mt-16 flow-root sm:mt-20 scale-[0.50] sm:scale-100 origin-top">

        
          <div className="relative mx-auto max-w-5xl rounded-2xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-3xl lg:p-4">
            <div className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10">

              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="mx-auto max-w-xs flex-1 rounded-md border border-gray-200 bg-white px-3 py-1 text-center text-xs text-gray-400">
                  app.cvcraft.io/dashboard 
                </div>
              </div>

              {/* Dashboard shell */}
              <div className="grid grid-cols-12" style={{ minHeight: "420px" }}>

                {/* ── Sidebar ── */}
                <div className="col-span-2 flex flex-col border-r border-gray-100 bg-gray-50 p-3">
                  {/* Logo */}
                  <div className="mb-5 flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-md bg-indigo-600" />
                    <div className="h-3 w-14 rounded bg-gray-300" />
                  </div>
                  {/* Nav items */}
                  {[
                    { w: "w-16", active: true },
                    { w: "w-14", active: false },
                    { w: "w-12", active: false },
                    { w: "w-16", active: false },
                    { w: "w-10", active: false },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`mb-1 flex items-center gap-1.5 rounded-md px-2 py-1.5 ${item.active ? "bg-indigo-100" : ""}`}
                    >
                      <div className={`h-3 w-3 rounded ${item.active ? "bg-indigo-500" : "bg-gray-300"}`} />
                      <div className={`h-2 rounded ${item.w} ${item.active ? "bg-indigo-400" : "bg-gray-200"}`} />
                    </div>
                  ))}
                  {/* User avatar at bottom */}
                  <div className="mt-auto flex items-center gap-1.5 border-t border-gray-200 pt-3">
                    <div className="h-6 w-6 rounded-full bg-indigo-200" />
                    <div className="space-y-1">
                      <div className="h-2 w-12 rounded bg-gray-300" />
                      <div className="h-1.5 w-10 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>

                {/* ── Main content ── */}
                <div className="col-span-10 bg-gray-50/40 p-5">

                  {/* Header row */}
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <div className="mb-1 h-4 w-24 rounded-md bg-gray-800 opacity-70" />
                      <div className="h-2.5 w-36 rounded bg-gray-300" />
                    </div>
                    <div className="flex h-8 items-center gap-1.5 rounded-lg bg-indigo-600 px-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-white opacity-80" />
                      <div className="h-2 w-10 rounded bg-white opacity-70" />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="mb-5 grid grid-cols-4 gap-3">
                    {[
                      { bg: "bg-indigo-50 border border-indigo-100", label: "Total CVs", value: "3", valueColor: "text-indigo-700" },
                      { bg: "bg-green-50 border border-green-100",   label: "Published", value: "2", valueColor: "text-green-700" },
                      { bg: "bg-amber-50 border border-amber-100",   label: "Avg ATS",   value: "91%", valueColor: "text-amber-700" },
                      { bg: "bg-purple-50 border border-purple-100", label: "Plan",      value: "Pro ✨", valueColor: "text-purple-700" },
                    ].map((s, i) => (
                      <div key={i} className={`rounded-xl ${s.bg} px-3 py-2.5`}>
                        <p className="mb-1 text-[10px] text-gray-400">{s.label}</p>
                        <p className={`text-sm font-bold ${s.valueColor}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* CV cards */}
                  <p className="mb-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Your CVs</p>
                  <div className="grid grid-cols-3 gap-3">

                    {/* Card 1 — Software Engineer */}
                    <div className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm">
                      <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 to-indigo-400" />
                      <div className="p-3">
                        <p className="mb-0.5 text-xs font-bold text-gray-800">Software Engineer</p>
                        <p className="mb-2.5 text-[10px] text-gray-400">Google · Paris</p>
                        {/* ATS bar */}
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[9px] text-gray-400">ATS Score</span>
                          <span className="text-[9px] font-semibold text-green-600">94%</span>
                        </div>
                        <div className="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full w-[94%] rounded-full bg-green-400" />
                        </div>
                        <div className="flex gap-1.5">
                          <span className="rounded-md bg-green-100 px-1.5 py-0.5 text-[9px] font-semibold text-green-700">Published</span>
                          <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-700">BASIC</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2 — Product Manager */}
                    <div className="overflow-hidden rounded-xl border border-purple-100 bg-white shadow-sm">
                      <div className="h-1.5 w-full bg-linear-to-r from-purple-500 to-purple-400" />
                      <div className="p-3">
                        <p className="mb-0.5 text-xs font-bold text-gray-800">Product Manager</p>
                        <p className="mb-2.5 text-[10px] text-gray-400">Meta · London</p>
                        {/* ATS bar */}
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[9px] text-gray-400">ATS Score</span>
                          <span className="text-[9px] font-semibold text-green-600">81%</span>
                        </div>
                        <div className="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full w-[81%] rounded-full bg-green-400" />
                        </div>
                        <div className="flex gap-1.5">
                          <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">Draft</span>
                          <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[9px] font-semibold text-purple-700">MODERN</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3 — New CV */}
                    <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white transition-colors hover:border-indigo-300 hover:bg-indigo-50/40">
                      <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100">
                        <div className="text-indigo-600 text-sm font-bold leading-none">+</div>
                      </div>
                      <p className="text-[10px] font-medium text-gray-500">New CV</p>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
