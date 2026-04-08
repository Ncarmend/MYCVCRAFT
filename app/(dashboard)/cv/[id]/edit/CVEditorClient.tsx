/**
 * Client wrapper for the CV editor
 * Handles form state, save, and PDF export
 */
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CVForm } from "@/components/cv/CVForm";
import { CVPreview } from "@/components/cv/CVPreview";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { FileDown, Eye, EyeOff } from "lucide-react";
import type { CV, CVFormData } from "@/types";

interface Props {
  cv: CV;
  isPro: boolean;
}

export function CVEditorClient({ cv, isPro }: Props) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewData, setPreviewData] = useState<Partial<CVFormData>>(cv as unknown as CVFormData);

  async function handleSave(data: CVFormData) {
    setSaving(true);
    try {
      const res = await fetch(`/api/cv/${cv.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }
      toast.success("CV saved!");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDownloadPDF() {
    if (!isPro) {
      toast.info("Free plan includes a watermark. Upgrade to remove it.");
    }
    try {
      toast.loading("Preparing PDF...", { id: "pdf" });
      const res = await fetch(`/api/pdf?cvId=${cv.id}`);
      if (!res.ok) throw new Error("PDF generation failed");
      const html = await res.text();

      // Open in a new window and trigger browser print-to-PDF
      const win = window.open("", "_blank");
      if (!win) throw new Error("Popup blocked");
      win.document.write(html);
      win.document.close();
      win.onload = () => {
        win.focus();
        win.print();
      };
      toast.success("Use your browser's 'Save as PDF' option.", { id: "pdf", duration: 5000 });
    } catch {
      toast.error("Failed to generate PDF", { id: "pdf" });
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header
        title={cv.title || cv.name}
        subtitle={`Editing · ${cv.template} template`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? "Hide preview" : "Show preview"}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={handleDownloadPDF}
            >
              <FileDown className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <div className={`overflow-y-auto border-r border-gray-100 p-8 ${showPreview ? "flex-1" : "w-full"}`}>
          <CVForm
            defaultValues={cv as unknown as CVFormData}
            cvId={cv.id}
            onSave={handleSave}
            onChange={setPreviewData}
            isPro={isPro}
            saving={saving}
          />
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="hidden w-[480px] overflow-y-auto bg-gray-100 p-8 xl:block">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-400">
              Live Preview
            </p>
            <CVPreview
              data={previewData}
              watermark={!isPro}
              previewRef={previewRef}
            />
          </div>
        )}
      </div>
    </div>
  );
}
