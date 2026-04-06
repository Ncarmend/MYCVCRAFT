/**
 * New CV page — creates a CV then redirects to edit
 */
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CVForm } from "@/components/cv/CVForm";
import { CVPreview } from "@/components/cv/CVPreview";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import type { CVFormData } from "@/types";

export default function NewCVPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<Partial<CVFormData>>({
    template: "BASIC",
    name: "Your Name",
    jobTitle: "Your Job Title",
  });
  const [saving, setSaving] = useState(false);
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
        const err = await res.json();
        throw new Error(err.error || "Failed to save CV");
      }

      const { cv } = await res.json();
      toast.success("CV created successfully!");
      router.push(`/cv/${cv.id}/edit`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Header
        title="New CV"
        subtitle="Fill in your details and watch your CV come to life"
        actions={
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => window.print()}
          >
            <FileDown className="h-4 w-4" />
            Preview PDF
          </Button>
        }
      />

      {/* Two-column layout: form left, preview right */}
      <div className="flex gap-0 min-h-screen">
        {/* Form panel */}
        <div className="flex-1 overflow-y-auto border-r border-gray-100 p-8">
          <CVForm
            onSave={handleSave}
            onChange={setPreviewData}
            isPro={false} // Will be fetched from session in production
            saving={saving}
          />
        </div>

        {/* Preview panel */}
        <div className="hidden w-[480px] overflow-y-auto bg-gray-100 p-8 xl:block">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-400">
            Live Preview
          </p>
          <CVPreview data={previewData} watermark={true} previewRef={previewRef} />
        </div>
      </div>
    </div>
  );
}
