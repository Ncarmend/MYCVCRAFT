/**
 * CV Preview panel — renders the correct template based on selection
 */
"use client";

import { BasicTemplate } from "./templates/BasicTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ExecutiveTemplate } from "./templates/Executivetemplate";
import { CreativeTemplate } from "./templates/Creativetemplate";
import { MinimalTemplate } from "./templates/Minimaltemplate";
import { ElegantTemplate } from "./templates/ElegantTemplate";
import { TechTemplate } from "./templates/TechTemplate";
import { CorporateTemplate } from "./templates/CorporateTemplate";
import type { CVFormData } from "@/types";

interface CVPreviewProps {
  data: Partial<CVFormData>;
  watermark?: boolean;
  /** Pass a ref if you want to print/export this element */
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

export function CVPreview({ data, watermark = false, previewRef }: CVPreviewProps) {
  const template = data.template ?? "BASIC";

  return (
    <div
      ref={previewRef as React.RefObject<HTMLDivElement>}
      className="overflow-hidden rounded-xl shadow-lg ring-1 ring-gray-200"
      style={{ transform: "scale(0.8)", transformOrigin: "top center", marginBottom: "-20%" }}
    >
      {template === "BASIC" && <BasicTemplate cv={data} watermark={watermark} />}
      {template === "MODERN" && <ModernTemplate cv={data} watermark={watermark} />}
      {template === "EXECUTIVE" && <ExecutiveTemplate cv={data} watermark={watermark} />}
      {template === "CREATIVE" && <CreativeTemplate cv={data} watermark={watermark} />}
      {template === "MINIMAL" && <MinimalTemplate cv={data} watermark={watermark} />}
      {template === "ELEGANT" && <ElegantTemplate cv={data} watermark={watermark} />}
      {template === "TECH" && <TechTemplate cv={data} watermark={watermark} />}
      {template === "CORPORATE" && <CorporateTemplate cv={data} watermark={watermark} />}
    </div>
  );
}
