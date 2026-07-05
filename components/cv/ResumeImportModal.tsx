"use client";

import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import type { CVFormData } from "@/types";

type Status = "idle" | "processing" | "success" | "error";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: Partial<CVFormData>) => void;
}

const ACCEPTED = ".pdf,.docx,.txt";

export function ResumeImportModal({ open, onOpenChange, onImport }: Props) {
  const { lang } = useLanguage();
  const T = translations[lang].cvForm.import;

  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Partial<CVFormData> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimers() {
    if (t1Ref.current) clearTimeout(t1Ref.current);
    if (t2Ref.current) clearTimeout(t2Ref.current);
  }

  function reset() {
    clearTimers();
    setStatus("idle");
    setStep(0);
    setResult(null);
    setError(null);
    setFileName(null);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const processFile = useCallback(async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["pdf", "docx", "txt"].includes(ext)) {
      setError(T.unsupportedType);
      setStatus("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(T.fileTooLarge);
      setStatus("error");
      return;
    }

    setFileName(file.name);
    setStatus("processing");
    setStep(0);

    // Simulate progress steps while waiting for the API
    t1Ref.current = setTimeout(() => setStep(1), 2200);
    t2Ref.current = setTimeout(() => setStep(2), 5000);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("lang", lang);

      const res = await fetch("/api/resume/import", { method: "POST", body: fd });
      clearTimers();

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Import failed");
      }

      const { data } = await res.json();
      setResult(data);
      setStatus("success");
    } catch (err) {
      clearTimers();
      setError(err instanceof Error ? err.message : "Import failed. Please try again.");
      setStatus("error");
    }
  }, [T, lang]);

  // ── Drag handlers ───────────────────────────────────────────────────────────
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  // ── Apply ───────────────────────────────────────────────────────────────────
  function handleApply() {
    if (result) {
      onImport(result);
      onOpenChange(false);
      reset();
    }
  }

  function handleClose(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  // ── Stats for success screen ────────────────────────────────────────────────
  function statChips() {
    if (!result) return [];
    const chips: { label: string; count: number }[] = [];
    const expCount = result.experience?.length ?? 0;
    if (expCount) chips.push({ count: expCount, label: expCount === 1 ? T.statExperience : T.statExperiences });
    const sk = result.skills?.length ?? 0;
    if (sk) chips.push({ count: sk, label: T.statSkills });
    const edu = result.education?.length ?? 0;
    if (edu) chips.push({ count: edu, label: T.statEducation });
    const lng = result.languages?.length ?? 0;
    if (lng) chips.push({ count: lng, label: T.statLanguages });
    const cert = result.certifications?.length ?? 0;
    if (cert) chips.push({ count: cert, label: T.statCerts });
    return chips;
  }

  const steps = [T.step1, T.step2, T.step3];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md overflow-hidden p-0">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white">
          <div className="flex items-center gap-2.5 mb-1">
            <Sparkles className="h-5 w-5 opacity-90" />
            <DialogTitle className="text-base font-semibold">
              {status === "processing" ? T.processingTitle : T.modalTitle}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-indigo-100">
            {status === "idle"    && T.modalSubtitle}
            {status === "processing" && fileName}
            {status === "success" && T.successTitle}
            {status === "error"   && T.errorTitle}
          </DialogDescription>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────────── */}
        <div className="px-6 py-6">

          {/* ── IDLE: drop zone ── */}
          {status === "idle" && (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-10 text-center transition-colors cursor-pointer ${
                isDragging
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={`mb-2 flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                isDragging ? "bg-indigo-100" : "bg-gray-100"
              }`}>
                <Upload className={`h-7 w-7 transition-colors ${isDragging ? "text-indigo-600" : "text-gray-400"}`} />
              </div>
              <p className="text-sm font-medium text-gray-800">{T.dropzoneTitle}</p>
              <p className="mt-1 text-xs text-gray-400">
                {T.dropzoneOr}{" "}
                <span className="font-medium text-indigo-600 hover:text-indigo-700">
                  {T.dropzoneBrowse}
                </span>
              </p>
              <p className="mt-3 text-xs text-gray-400">{T.dropzoneHint}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED}
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          )}

          {/* ── PROCESSING: 3-step progress ── */}
          {status === "processing" && (
            <div className="space-y-2">
              {steps.map((label, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500"
                      style={{
                        borderColor: done ? "#22c55e" : active ? "#6366f1" : "#e5e7eb",
                        backgroundColor: done ? "#f0fdf4" : active ? "#eef2ff" : "white",
                      }}
                    >
                      {done  && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {active && <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />}
                      {!done && !active && <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium transition-colors ${
                        done ? "text-green-700" : active ? "text-indigo-700" : "text-gray-400"
                      }`}>
                        {label}
                      </p>
                      {active && (
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-indigo-100">
                          <div className="h-full animate-pulse rounded-full bg-indigo-400" style={{ width: "60%" }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── SUCCESS ── */}
          {status === "success" && (
            <div className="space-y-5">
              {/* Stats */}
              <div className="flex flex-wrap gap-2">
                {statChips().map(({ count, label }) => (
                  <span key={label} className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-indigo-100">
                    <span className="mr-1 font-bold">{count}</span> {label}
                  </span>
                ))}
              </div>

              {/* Improvements list */}
              <div className="rounded-xl border border-green-100 bg-green-50 p-4 space-y-2">
                {[T.successBullet1, T.successBullet2, T.successBullet3].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                    {b}
                  </div>
                ))}
              </div>

              {/* Name preview */}
              {result?.name && (
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <FileText className="h-5 w-5 shrink-0 text-indigo-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{result.name}</p>
                    {result.jobTitle && <p className="text-xs text-gray-500">{result.jobTitle}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ERROR ── */}
          {status === "error" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-7 w-7 text-red-400" />
              </div>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          )}
        </div>

        {/* ── Footer actions ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          {status === "idle" && (
            <Button variant="ghost" size="sm" onClick={() => handleClose(false)}>
              {T.cancel}
            </Button>
          )}

          {status === "processing" && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {T.processingTitle}
            </span>
          )}

          {status === "error" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => handleClose(false)}>
                {T.cancel}
              </Button>
              <Button variant="secondary" size="sm" onClick={reset}>
                {T.tryAgain}
              </Button>
            </>
          )}

          {status === "success" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => handleClose(false)}>
                {T.cancel}
              </Button>
              <Button size="sm" className="gap-2" onClick={handleApply}>
                {T.applyButton}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}
