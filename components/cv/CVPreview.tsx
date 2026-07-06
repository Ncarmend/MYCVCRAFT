"use client";

import { useRef, useState, useEffect } from "react";
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

// All templates are designed at this pixel width (US Letter at 96 dpi).
const TEMPLATE_NATIVE_WIDTH = 816;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / TEMPLATE_NATIVE_WIDTH);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (previewRef) (previewRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className="rounded-xl shadow-lg ring-1 ring-gray-200 overflow-hidden"
    >
      {/* zoom scales both visual size and layout dimensions, so the full
          template width is visible without overflow-clipping. */}
      <div style={{ zoom: scale }}>
        <TemplateRenderer data={data} watermark={watermark} />
      </div>
    </div>
  );
}
