"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

interface Props {
  score: number;
  previousScore?: number | null;
}

function useCountUp(target: number, durationMs = 700): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-500";
}

function ringColor(score: number): string {
  if (score >= 75) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#ef4444";
}

export function JobMatchScore({ score, previousScore }: Props) {
  const { lang } = useLanguage();
  const T = translations[lang].jobMatch;
  const animated = useCountUp(score);
  const showImprovement = previousScore !== null && previousScore !== undefined && previousScore !== score;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{T.scoreLabel}</p>

      <div className="relative mt-4 h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={ringColor(score)} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.7s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-extrabold ${scoreColor(score)}`}>{animated}%</span>
        </div>
      </div>

      {showImprovement && (
        <div className="mt-3 flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
          <TrendingUp className="h-3.5 w-3.5" />
          {T.scoreImprovedLabel}: {previousScore}% → {score}%
        </div>
      )}

      <p className="mt-3 max-w-xs text-xs text-slate-400">{T.scoreCaption}</p>
    </div>
  );
}
