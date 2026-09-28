"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { trackJobMatchStarted, trackJobMatchCompleted, trackJobMatchImproved } from "@/lib/analytics";
import { JobMatchForm } from "./JobMatchForm";
import { JobMatchScore } from "./JobMatchScore";
import { JobMatchBreakdown } from "./JobMatchBreakdown";
import { JobMatchMissingSkills } from "./JobMatchMissingSkills";
import { JobMatchRecommendations } from "./JobMatchRecommendations";
import { JobMatchHistory } from "./JobMatchHistory";
import { JobMatchCTA } from "./JobMatchCTA";
import { HowJobMatchWorks } from "@/components/landing/HowJobMatchWorks";
import { WhatJobMatchScoreMeans } from "@/components/landing/WhatJobMatchScoreMeans";
import type { CvOption, JobMatchHistoryItem, JobMatchResult } from "./types";

export function JobMatchClient() {
  const { lang } = useLanguage();
  const T = translations[lang].jobMatch;

  const [loggedIn, setLoggedIn] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [cvs, setCvs] = useState<CvOption[]>([]);
  const [loadingCvs, setLoadingCvs] = useState(true);
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null);

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [history, setHistory] = useState<JobMatchHistoryItem[]>([]);

  useEffect(() => {
    fetch("/api/subscription/status")
      .then((res) => {
        if (!res.ok) {
          setLoggedIn(false);
          return null;
        }
        setLoggedIn(true);
        return res.json();
      })
      .then((data) => {
        if (data) setIsPro(Boolean(data.is_pro));
      })
      .catch(() => setLoggedIn(false))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (!loggedIn) {
      setLoadingCvs(false);
      return;
    }
    fetch("/api/cv")
      .then((res) => (res.ok ? res.json() : { cvs: [] }))
      .then((data) => {
        const options: CvOption[] = (data.cvs ?? []).map((cv: { id: string; title: string; name: string; jobTitle: string }) => ({
          id: cv.id,
          title: cv.title,
          name: cv.name,
          jobTitle: cv.jobTitle,
        }));
        setCvs(options);
        if (options.length > 0) setSelectedCvId(options[0].id);
      })
      .catch(() => setCvs([]))
      .finally(() => setLoadingCvs(false));

    fetch("/api/job-match")
      .then((res) => (res.ok ? res.json() : { history: [] }))
      .then((data) => setHistory(data.history ?? []))
      .catch(() => setHistory([]));
  }, [authChecked, loggedIn]);

  const handleSubmit = useCallback(async () => {
    if (!selectedCvId || jobDescription.trim().length < 40) {
      toast.error(T.errors.empty);
      return;
    }

    setSubmitting(true);
    setShowUpgrade(false);
    trackJobMatchStarted({ cvId: selectedCvId });

    try {
      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId: selectedCvId, jobTitle, companyName, jobDescription, lang }),
      });

      if (res.status === 403) {
        const data = await res.json().catch(() => ({}));
        if (data.code === "UPGRADE_REQUIRED") {
          setShowUpgrade(true);
          return;
        }
        toast.error(data.error || T.errors.generic);
        return;
      }
      if (res.status === 429) {
        toast.error(T.errors.rateLimited);
        return;
      }
      if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || T.errors.empty);
        return;
      }
      if (!res.ok) {
        toast.error(T.errors.generic);
        return;
      }

      const data = (await res.json()) as JobMatchResult;

      setPreviousScore(result?.score ?? null);
      if (result && data.score > result.score) {
        trackJobMatchImproved({ cvId: selectedCvId, previousScore: result.score, newScore: data.score });
      }
      setResult(data);
      trackJobMatchCompleted({ cvId: selectedCvId, score: data.score });

      // Refresh history in the background
      fetch("/api/job-match")
        .then((r) => (r.ok ? r.json() : { history: [] }))
        .then((d) => setHistory(d.history ?? []))
        .catch(() => {});
    } catch {
      toast.error(T.errors.generic);
    } finally {
      setSubmitting(false);
    }
  }, [selectedCvId, jobTitle, companyName, jobDescription, lang, result, T]);

  return (
    <div>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{T.pageTitle}</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">{T.pageSubtitle}</p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <JobMatchForm
            loggedIn={loggedIn}
            isPro={isPro}
            cvs={cvs}
            loadingCvs={loadingCvs}
            selectedCvId={selectedCvId}
            onSelectCv={setSelectedCvId}
            jobTitle={jobTitle}
            onJobTitle={setJobTitle}
            companyName={companyName}
            onCompanyName={setCompanyName}
            jobDescription={jobDescription}
            onJobDescription={setJobDescription}
            onSubmit={handleSubmit}
            submitting={submitting}
            hasResult={result !== null}
          />

          {submitting && (
            <p className="mt-4 text-center text-xs font-medium text-slate-400">{T.analyzingLabel}</p>
          )}

          {showUpgrade && (
            <div className="mt-6">
              <JobMatchCTA />
            </div>
          )}

          {result && !showUpgrade && (
            <div className="mt-8 space-y-8 border-t border-gray-100 pt-8">
              <JobMatchScore score={result.score} previousScore={previousScore} />

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">{T.whyTitle}</p>
                <p className="text-sm leading-relaxed text-slate-600">{T.whyBody}</p>
              </div>

              <JobMatchBreakdown breakdown={result.breakdown} />

              <JobMatchMissingSkills
                matchingSkills={result.matchingSkills}
                missingSkills={result.missingSkills}
                matchingKeywords={result.matchingKeywords}
                missingKeywords={result.missingKeywords}
              />

              <JobMatchRecommendations recommendations={result.recommendations} />
            </div>
          )}
        </div>

        {loggedIn && history.length > 0 && (
          <div className="mt-8">
            <JobMatchHistory history={history} />
          </div>
        )}

      </div>

      <HowJobMatchWorks />
      <WhatJobMatchScoreMeans />
    </div>
  );
}
