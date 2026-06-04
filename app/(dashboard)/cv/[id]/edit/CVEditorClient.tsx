"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { CVForm } from "@/components/cv/CVForm";
import { CVPreview } from "@/components/cv/CVPreview";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { FileDown, Eye, EyeOff, Check, Loader2, AlertCircle } from "lucide-react";
import type { CV, CVFormData } from "@/types";

const AUTOSAVE_MS = 2000;

interface Props { cv: CV; isPro: boolean; }

export function CVEditorClient({ cv, isPro }: Props) {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [previewData, setPreviewData] = useState<Partial<CVFormData>>(cv as unknown as CVFormData);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<Partial<CVFormData> | null>(null);
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
      toast.error(err instanceof Error ? err.message : "Auto-save failed — check your connection.");
    }
  }, [cv.id]);

  const scheduleAutoSave = useCallback((data: Partial<CVFormData>) => {
    pendingRef.current = data;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (pendingRef.current) persist(pendingRef.current);
    }, AUTOSAVE_MS);
  }, [persist]);

  // Flush pending save on unmount so no edits are lost on navigation
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

  async function handleDownloadPDF() {
    if (!isPro) toast.info("Free plan includes a watermark. Upgrade to remove it.");
    try {
      toast.loading("Preparing PDF…", { id: "pdf" });
      const template = (previewData.template as string) || "BASIC";
      const res = await fetch(`/api/pdf?cvId=${cv.id}&template=${template}`);
      if (!res.ok) throw new Error("PDF generation failed");
      const html = await res.text();
      const win = window.open("", "_blank");
      if (!win) throw new Error("Popup blocked — allow pop-ups for this site.");
      win.document.write(html);
      win.document.close();
      win.onload = () => { win.focus(); win.print(); };
      toast.success("Use 'Save as PDF' in the print dialog.", { id: "pdf", duration: 5000 });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate PDF", { id: "pdf" });
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header
        title={cv.title || cv.name}
        subtitle={`Editing · ${(previewData.template ?? cv.template)} template`}
        actions={
          <div className="flex items-center gap-3">
            {/* Auto-save status indicator */}
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-xs text-green-600">
                <Check className="h-3.5 w-3.5" />
                Saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                Save failed
              </span>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPreview((v) => !v)}
              title={showPreview ? "Hide preview" : "Show preview"}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="secondary" size="sm" className="gap-2" onClick={handleDownloadPDF}>
              <FileDown className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <div className={`overflow-y-auto border-r border-gray-100 p-8 ${showPreview ? "flex-1" : "w-full"}`}>
          <CVForm
            defaultValues={cv as unknown as CVFormData}
            cvId={cv.id}
            onSave={persist as unknown as (data: CVFormData) => Promise<void>}
            onChange={handleChange}
            isPro={isPro}
            hideSaveButton
          />
        </div>

        {showPreview && (
          <div className="hidden w-[480px] overflow-y-auto bg-gray-100 p-8 xl:block">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-400">Live Preview</p>
            <CVPreview data={previewData} watermark={!isPro} previewRef={previewRef} />
          </div>
        )}
      </div>
    </div>
  );
}
