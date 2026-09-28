"use client";

import { useLanguage, translations } from "@/components/landing/LanguageContext";

interface Props {
  recommendations: string[];
}

export function JobMatchRecommendations({ recommendations }: Props) {
  const { lang } = useLanguage();
  const T = translations[lang].jobMatch;

  if (recommendations.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">{T.recommendationsTitle}</p>
      <ol className="space-y-2">
        {recommendations.map((rec, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-slate-700">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
              {i + 1}
            </span>
            <span className="leading-relaxed">{rec}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
