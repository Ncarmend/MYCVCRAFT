"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { CVForm } from "@/components/cv/CVForm";
import { CVPreview } from "@/components/cv/CVPreview";
import { ResumeImportModal } from "@/components/cv/ResumeImportModal";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { FileDown, Eye, EyeOff, Check, Loader2, AlertCircle, Upload } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { trackCvDownloaded } from "@/lib/analytics";
import type { CV, CVFormData } from "@/types";

const AUTOSAVE_MS = 2000;

interface Props { cv: CV; isPro: boolean; }

export function CVEditorClient({ cv, isPro }: Props) {
  const { lang } = useLanguage();
  const U = translations[lang].ui;
  const T = translations[lang].cvForm;

  const previewRef = useRef<HTMLDivElement | null>(null);
  const [showPreview, setShowPreview]   = useState(true);
  const [importOpen, setImportOpen]     = useState(false);
  const [formKey, setFormKey]           = useState(0);
  const [formDefaults, setFormDefaults] = useState<Partial<CVFormData>>(cv as unknown as CVFormData);
  const [previewData, setPreviewData]   = useState<Partial<CVFormData>>(cv as unknown as CVFormData);
  const [saveStatus, setSaveStatus]     = useState<"idle" | "saving" | "saved" | "error">("idle");

  const timerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef     = useRef<Partial<CVFormData> | null>(null);
  const statusResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(async (data: Partial<CVFormData>) => {
    setSaveStatus("saving");
    if (statusResetRef.current) clearTimeout(statusResetRef.current);
    try {
      const res = await fetch(`/api/cv/${cv.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Save failed");
      }
      setSaveStatus("saved");
      statusResetRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      setSaveStatus("error");
      console.error("[CVEditor] save failed", err);
      toast.error(U.editor.autoSaveFailed);
    }
  }, [cv.id, U.editor.autoSaveFailed]);

  const scheduleAutoSave = useCallback((data: Partial<CVFormData>) => {
    pendingRef.current = data;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (pendingRef.current) persist(pendingRef.current);
    }, AUTOSAVE_MS);
  }, [persist]);

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (statusResetRef.current) clearTimeout(statusResetRef.current);
      if (pendingRef.current) persist(pendingRef.current);
    };
  }, [persist]);

  function handleChange(data: Partial<CVFormData>) {
    setPreviewData(data);
    scheduleAutoSave(data);
  }

  function handleImport(data: Partial<CVFormData>) {
    const merged = { template: "BASIC" as CVFormData["template"], ...data };
    setFormDefaults(merged);
    setPreviewData(merged);
    setFormKey((k) => k + 1);
    persist(merged);
    toast.success(U.editor.imported);
  }

  async function handleDownloadPDF() {
    if (!isPro) toast.info(U.editor.watermarkInfo);
    try {
      toast.loading(U.editor.preparingPdf, { id: "pdf" });
      const template = (previewData.template as string) || "BASIC";
      const res = await fetch(`/api/pdf?cvId=${cv.id}&template=${template}&lang=${lang}`);
      if (!res.ok) throw new Error("PDF generation failed");
      const html = await res.text();

      // Inject auto-print trigger into the HTML so the print dialog opens automatically
      const printable = html.replace(
        "</body>",
        "<script>window.addEventListener('load',function(){window.focus();window.print();});</script></body>",
      );
      const blob = new Blob([printable], { type: "text/html;charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      const win  = window.open(url, "_blank");
      if (!win) {
        URL.revokeObjectURL(url);
        throw new Error(U.editor.popupBlocked);
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      trackCvDownloaded({ cvId: cv.id, template });
      toast.success(
        U.editor.printHint,
        { id: "pdf", duration: 5000 },
      );
    } catch (err) {
      // Only our own (already localized) popup message is shown as-is.
      toast.error(err instanceof Error && err.message === U.editor.popupBlocked ? err.message : U.editor.pdfFailed, { id: "pdf" });
    }
  }

  const savingLabel  = U.editor.saving;
  const savedLabel   = U.editor.saved;
  const failedLabel  = U.editor.saveStatusFailed;
  const editingLabel = U.editor.editing;
  const previewLabel = U.editor.livePreview;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Header
        title={cv.title || cv.name}
        subtitle={`${editingLabel} · ${previewData.template ?? cv.template} template`}
        actions={
          <div className="flex items-center gap-3">
            {/* Auto-save status */}
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {savingLabel}
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-xs text-green-600">
                <Check className="h-3.5 w-3.5" />
                {savedLabel}
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {failedLabel}
              </span>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setImportOpen(true)}
              title={T.import.buttonLabel}
            >
              <Upload className="h-4 w-4" />
              {T.import.buttonLabel}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPreview((v) => !v)}
              title={showPreview ? (U.editor.hidePreview) : (U.editor.showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>

            <Button variant="secondary" size="sm" className="gap-2" onClick={handleDownloadPDF}>
              <FileDown className="h-4 w-4" />
              {U.editor.downloadPdf}
            </Button>
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <div className={`flex flex-col overflow-hidden border-r border-gray-100 ${showPreview ? "flex-1" : "w-full"}`}>
          <CVForm
            key={formKey}
            defaultValues={formDefaults}
            cvId={cv.id}
            onSave={persist as unknown as (data: CVFormData) => Promise<void>}
            onChange={handleChange}
            isPro={isPro}
            hideSaveButton
          />
        </div>

        {showPreview && (
          <div className="hidden w-120 overflow-y-auto bg-gray-100 p-8 xl:block">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-400">
              {previewLabel}
            </p>
            <CVPreview data={previewData} watermark={!isPro} previewRef={previewRef} />
          </div>
        )}
      </div>

      <ResumeImportModal
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImport}
      />
    </div>
  );
}
