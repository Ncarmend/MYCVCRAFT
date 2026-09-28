"use client";

import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { Button } from "@/components/ui/button";
import type { CvOption } from "./types";

interface Props {
  loggedIn: boolean;
  isPro: boolean;
  cvs: CvOption[];
  loadingCvs: boolean;
  selectedCvId: string | null;
  onSelectCv: (id: string) => void;
  jobTitle: string;
  onJobTitle: (v: string) => void;
  companyName: string;
  onCompanyName: (v: string) => void;
  jobDescription: string;
  onJobDescription: (v: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  hasResult: boolean;
}

export function JobMatchForm({
  loggedIn, isPro, cvs, loadingCvs, selectedCvId, onSelectCv,
  jobTitle, onJobTitle, companyName, onCompanyName,
  jobDescription, onJobDescription, onSubmit, submitting, hasResult,
}: Props) {
  const { lang } = useLanguage();
  const T = translations[lang].jobMatch;

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400";

  return (
    <div className="space-y-6">
      {/* Step 1 — CV picker */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">{T.step1Title}</p>
        {!loggedIn ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
            <p className="text-sm text-slate-600">{T.noCvTitle}</p>
            <Link href="/login" className="mt-3 inline-block">
              <Button size="sm">{T.noCvCta}</Button>
            </Link>
          </div>
        ) : loadingCvs ? (
          <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
        ) : cvs.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
            <p className="text-sm text-slate-600">{T.noCvTitle}</p>
            <Link href="/cv/new" className="mt-3 inline-block">
              <Button size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                {T.noCvCta}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {cvs.map((cv) => (
              <button
                key={cv.id}
                type="button"
                onClick={() => onSelectCv(cv.id)}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  selectedCvId === cv.id
                    ? "border-slate-800 bg-slate-50 ring-1 ring-slate-800"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-800">{cv.title}</span>
                  <span className="block truncate text-xs text-slate-400">{cv.jobTitle}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 2 — job offer */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">{T.step2Title}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => onJobTitle(e.target.value)}
            placeholder={T.jobTitlePlaceholder}
            className={inputClass}
          />
          <input
            type="text"
            value={companyName}
            onChange={(e) => onCompanyName(e.target.value)}
            placeholder={T.companyPlaceholder}
            className={inputClass}
          />
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescription(e.target.value)}
          placeholder={T.jobDescriptionPlaceholder}
          rows={8}
          className={`mt-2 resize-y ${inputClass}`}
        />
      </div>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <Button
          onClick={onSubmit}
          loading={submitting}
          disabled={!selectedCvId || jobDescription.trim().length < 40}
          className="w-full gap-2 sm:w-auto"
        >
          <Sparkles className="h-4 w-4" />
          {hasResult ? T.rerunButton : T.analyzeButton}
        </Button>
        {loggedIn && !isPro && (
          <span className="text-xs text-slate-400">{T.upgrade.title}</span>
        )}
      </div>
    </div>
  );
}
