"use client";

import { BasicTemplate } from "./templates/BasicTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ExecutiveTemplate } from "./templates/Executivetemplate";
import { CreativeTemplate } from "./templates/Creativetemplate";
import { MinimalTemplate } from "./templates/Minimaltemplate";
import { ElegantTemplate } from "./templates/ElegantTemplate";
import { TechTemplate } from "./templates/TechTemplate";
import { CorporateTemplate } from "./templates/CorporateTemplate";
import { SlateTemplate } from "./templates/SlateTemplate";
import { WarmTemplate } from "./templates/WarmTemplate";
import { SoftTemplate } from "./templates/SoftTemplate";
import { PhotoTemplate } from "./templates/PhotoTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { CrispTemplate } from "./templates/CrispTemplate";
import type { CVFormData } from "@/types";

interface CVPreviewProps {
  data: Partial<CVFormData>;
  watermark?: boolean;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

/** Renders the correct template component for given data — no outer wrapper. */
export function TemplateRenderer({ data, watermark = false }: { data: Partial<CVFormData>; watermark?: boolean }) {
  const t = data.template ?? "BASIC";
  if (t === "BASIC")     return <BasicTemplate     cv={data} watermark={watermark} />;
  if (t === "MODERN")    return <ModernTemplate    cv={data} watermark={watermark} />;
  if (t === "EXECUTIVE") return <ExecutiveTemplate cv={data} watermark={watermark} />;
  if (t === "CREATIVE")  return <CreativeTemplate  cv={data} watermark={watermark} />;
  if (t === "MINIMAL")   return <MinimalTemplate   cv={data} watermark={watermark} />;
  if (t === "ELEGANT")   return <ElegantTemplate   cv={data} watermark={watermark} />;
  if (t === "TECH")      return <TechTemplate      cv={data} watermark={watermark} />;
  if (t === "CORPORATE") return <CorporateTemplate cv={data} watermark={watermark} />;
  if (t === "SLATE")     return <SlateTemplate     cv={data} watermark={watermark} />;
  if (t === "WARM")      return <WarmTemplate      cv={data} watermark={watermark} />;
  if (t === "SOFT")      return <SoftTemplate      cv={data} watermark={watermark} />;
  if (t === "PHOTO")     return <PhotoTemplate     cv={data} watermark={watermark} />;
  if (t === "CLASSIC")   return <ClassicTemplate   cv={data} watermark={watermark} />;
  if (t === "CRISP")     return <CrispTemplate     cv={data} watermark={watermark} />;
  return <BasicTemplate cv={data} watermark={watermark} />;
}

export function CVPreview({ data, watermark = false, previewRef }: CVPreviewProps) {
  return (
    <div
      ref={previewRef as React.RefObject<HTMLDivElement>}
      className="overflow-hidden rounded-xl shadow-lg ring-1 ring-gray-200"
      style={{ transform: "scale(0.8)", transformOrigin: "top center", marginBottom: "-20%" }}
    >
      <TemplateRenderer data={data} watermark={watermark} />
    </div>
  );
}
