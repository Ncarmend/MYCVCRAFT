"use client";

import { Check, AlertTriangle } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

interface Props {
  matchingSkills: string[];
  missingSkills: string[];
  matchingKeywords: string[];
  missingKeywords: string[];
}

function ChipGroup({ title, items, tone }: { title: string; items: string[]; tone: "match" | "missing" }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={
              tone === "match"
                ? "inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-100"
                : "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100"
            }
          >
            {tone === "match" ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function JobMatchMissingSkills({ matchingSkills, missingSkills, matchingKeywords, missingKeywords }: Props) {
  const { lang } = useLanguage();
  const T = translations[lang].jobMatch;

  return (
    <div className="space-y-4">
      <ChipGroup title={T.matchingSkillsTitle} items={matchingSkills} tone="match" />
      <ChipGroup title={T.missingSkillsTitle} items={missingSkills} tone="missing" />
      <ChipGroup title={T.matchingKeywordsTitle} items={matchingKeywords} tone="match" />
      <ChipGroup title={T.missingKeywordsTitle} items={missingKeywords} tone="missing" />
    </div>
  );
}
