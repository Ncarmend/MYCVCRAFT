"use client";

import { useLanguage, translations } from "@/components/landing/LanguageContext";
import type { JobMatchHistoryItem } from "./types";

interface Props {
  history: JobMatchHistoryItem[];
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-500";
}

export function JobMatchHistory({ history }: Props) {
  const { lang } = useLanguage();
  const T = translations[lang].jobMatch;
  const dateLocale = lang === "fr" ? "fr-FR" : lang === "nl" ? "nl-BE" : "en-US";

  if (history.length === 0) {
    return <p className="text-sm text-slate-400">{T.historyEmpty}</p>;
  }

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{T.historyTitle}</p>
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {item.jobTitle || "—"}
                {item.companyName ? ` · ${item.companyName}` : ""}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(item.createdAt).toLocaleDateString(dateLocale, { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </div>
            <span className={`shrink-0 text-sm font-bold ${scoreColor(item.score)}`}>{item.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
