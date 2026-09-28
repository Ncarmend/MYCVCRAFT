"use client";

import { Check, AlertTriangle, X, ArrowDown } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

const STAGES_EN = ["Job Offer", "CVIXEO Analysis", "Match Score", "Recommendations", "Improved CV"];
const STAGES_FR = ["Offre d'emploi", "Analyse CVIXEO", "Score de correspondance", "Recommandations", "CV amélioré"];
const STAGES_NL = ["Vacature", "CVIXEO-analyse", "Matchingsscore", "Aanbevelingen", "Verbeterd cv"];

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
  const stages = lang === "fr" ? STAGES_FR : lang === "nl" ? STAGES_NL : STAGES_EN;

  return (
    <section className="bg-slate-50/60 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{T.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-xs text-slate-400">{T.illustrativeNote}</p>

        {/* Workflow */}
        <div className="mx-auto mt-8 flex max-w-xs flex-col items-center gap-1.5">
          {stages.map((stage, i) => (
            <div key={stage} className="flex w-full flex-col items-center">
              <div className="w-full rounded-lg bg-slate-800 px-4 py-2 text-center text-xs font-semibold text-white">
                {stage}
              </div>
              {i < stages.length - 1 && <ArrowDown className="my-1 h-3.5 w-3.5 text-slate-300" />}
            </div>
          ))}
        </div>

        {/* Illustrative example card */}
        <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
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
      </div>
    </section>
  );
}
