"use client";

import { Info } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

export function WhatJobMatchScoreMeans() {
  const { lang } = useLanguage();
  const T = translations[lang].jobMatch.scoreMeaning;

  return (
    <section className="border-t border-gray-100 bg-slate-50/60 py-10">
      <div className="mx-auto max-w-2xl px-6">
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <p className="text-sm font-semibold text-slate-800">{T.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{T.body}</p>
            <p className="mt-2 text-xs font-medium text-slate-500">{T.notLabel}</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-500">
              {T.notItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-slate-400">{T.beta}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
