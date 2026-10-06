"use client";

import Link from "next/link";
import {
  Check,
  AlertTriangle,
  X,
  ArrowRight,
  FileText,
  ClipboardList,
  BrainCircuit,
  SearchCheck,
  Gauge,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { localePath } from "@/lib/seo";

// Resume → Job Description → AI Analysis → Missing Keywords → ATS Score → Improve.
// Order matches translations[lang].jobMatch.demo.steps.
const STEP_ICONS = [FileText, ClipboardList, BrainCircuit, SearchCheck, Gauge, TrendingUp];

const SKILLS = [
  { label: "React", state: "match" as const },
  { label: "Next.js", state: "match" as const },
  { label: "TypeScript", state: "unclear" as const },
  { label: "Docker", state: "missing" as const },
];

function SkillRow({ label, state }: { label: string; state: "match" | "unclear" | "missing" }) {
  const icon =
    state === "match" ? <Check className="h-3.5 w-3.5 text-green-600" /> :
    state === "unclear" ? <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> :
    <X className="h-3.5 w-3.5 text-red-500" />;
  return (
    <div className="flex items-center justify-between rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-gray-100">
      {label}
      {icon}
    </div>
  );
}

export function JobMatchDemo() {
  const { lang } = useLanguage();
  const T = translations[lang].jobMatch.demo;

  return (
    <section className="bg-slate-50/60 py-12 sm:py-16" id="job-match">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{T.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{T.subtitle}</p>
        </div>

        {/* Workflow */}
        <ol className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {T.steps.map((step, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            return (
              <li
                key={step.title}
                className="relative flex flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.body}</p>
                {i < T.steps.length - 1 && (
                  <ArrowRight className="absolute -right-2.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-slate-300 lg:block" />
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex justify-center">
          <Link href={localePath(lang, "/job-match")}>
            <Button size="lg" className="gap-2 px-8">
              {T.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Illustrative example card */}
        <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-800">Frontend Developer</p>
          <div className="mt-2.5 space-y-1.5">
            {SKILLS.map((s) => <SkillRow key={s.label} {...s} />)}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs font-medium text-slate-500">{T.before}</span>
            <span className="text-lg font-extrabold text-amber-600">72%</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{T.after}</span>
            <span className="text-lg font-extrabold text-green-600">91%</span>
          </div>
        </div>
        <p className="mx-auto mt-2 max-w-md text-center text-xs text-slate-400">{T.illustrativeNote}</p>
      </div>
    </section>
  );
}
