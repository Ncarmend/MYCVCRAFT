"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CVForm } from "@/components/cv/CVForm";
import { CVPreview } from "@/components/cv/CVPreview";
import { ResumeImportModal } from "@/components/cv/ResumeImportModal";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { FileDown, Upload } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import type { CVFormData } from "@/types";

const BLANK: Partial<CVFormData> = { template: "BASIC", name: "Your Name", jobTitle: "Your Job Title" };

export default function NewCVPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const T = translations[lang].cvForm;

  const [previewData, setPreviewData] = useState<Partial<CVFormData>>(BLANK);
  const [formDefaults, setFormDefaults] = useState<Partial<CVFormData>>(BLANK);
  const [formKey, setFormKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  async function handleSave(data: CVFormData) {
    setSaving(true);
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        let msg = "Failed to save CV";
        try { msg = JSON.parse(text).error || msg; } catch { msg = text || msg; }
        throw new Error(msg);
      }

      const { cv } = await res.json();
      toast.success(lang === "fr" ? "CV créé avec succès !" : "CV created successfully!");
      router.push(`/cv/${cv.id}/edit`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function handleImport(data: Partial<CVFormData>) {
    const merged = { template: "BASIC" as CVFormData["template"], ...data };
    setFormDefaults(merged);
    setPreviewData(merged);
    setFormKey((k) => k + 1); // force CVForm remount with new defaults
    toast.success(lang === "fr" ? "CV importé et amélioré par l'IA !" : "Resume imported and improved by AI!");
  }

  return (
    <div>
      <Header
        title={lang === "fr" ? "Nouveau CV" : "New CV"}
        subtitle={lang === "fr" ? "Remplissez vos informations et regardez votre CV prendre vie" : "Fill in your details and watch your CV come to life"}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => setImportOpen(true)}
            >
              <Upload className="h-4 w-4" />
              {T.import.buttonLabel}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => window.print()}
            >
              <FileDown className="h-4 w-4" />
              {lang === "fr" ? "Aperçu PDF" : "Preview PDF"}
            </Button>
          </div>
        }
      />

      {/* Import banner — shown until user imports */}
      {formKey === 0 && (
        <div className="mx-6 mt-4 flex items-center justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-indigo-900">{T.import.bannerTitle}</p>
            <p className="text-xs text-indigo-600">{T.import.bannerSubtitle}</p>
          </div>
          <Button
            size="sm"
            className="shrink-0 gap-2"
            onClick={() => setImportOpen(true)}
          >
            <Upload className="h-4 w-4" />
            {T.import.buttonLabel}
          </Button>
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex gap-0 min-h-screen">
        <div className="flex-1 overflow-y-auto border-r border-gray-100 p-8">
          <CVForm
            key={formKey}
            defaultValues={formDefaults}
            onSave={handleSave}
            onChange={setPreviewData}
            isPro={false}
            saving={saving}
          />
        </div>

        <div className="hidden w-120 overflow-y-auto bg-gray-100 p-8 xl:block">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-400">
            {lang === "fr" ? "Aperçu en direct" : "Live Preview"}
          </p>
          <CVPreview data={previewData} watermark={true} previewRef={previewRef} />
        </div>
      </div>

      <ResumeImportModal
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImport}
      />
    </div>
  );
}
