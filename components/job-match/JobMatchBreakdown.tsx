"use client";

import { useLanguage, translations } from "@/components/landing/LanguageContext";
import type { MatchBreakdown } from "./types";

interface Props {
  breakdown: MatchBreakdown;
}

function barColor(score: number): string {
  if (score >= 75) return "bg-green-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-400";
}

export function JobMatchBreakdown({ breakdown }: Props) {
  const { lang } = useLanguage();
  const T = translations[lang].jobMatch;

  const rows: { key: keyof MatchBreakdown; label: string }[] = [
    { key: "skills", label: T.categories.skills },
    { key: "experience", label: T.categories.experience },
    { key: "keywords", label: T.categories.keywords },
    { key: "education", label: T.categories.education },
    { key: "languages", label: T.categories.languages },
  ];

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{T.breakdownTitle}</p>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{row.label}</span>
              <span className="font-semibold text-slate-900">{breakdown[row.key]}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(breakdown[row.key])}`}
                style={{ width: `${breakdown[row.key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
