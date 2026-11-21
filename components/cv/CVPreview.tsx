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
import { AdministrativeDigitalTemplate } from "./templates/AdministrativeDigitalTemplate";
import { sortCvSections } from "@/lib/cvSort";
import { resolveCvFooterName } from "@/lib/cvFooterName";
import type { CVFormData } from "@/types";
import { parseCvLanguage } from "@/lib/cv-language";
import { CvDocumentLanguageProvider } from "@/components/cv/CvDocumentLanguage";

// All templates are designed at this pixel width (US Letter at 96 dpi).
const TEMPLATE_NATIVE_WIDTH = 816;

interface CVPreviewProps {
  data: Partial<CVFormData>;
  /** Free plan: show the "CV créé avec CVixeo.com" line. Callers pass !isPro, computed on the server. */
  attribution?: boolean;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

/** Renders the correct template component for given data — no outer wrapper. */
export function TemplateRenderer({ data: rawData, attribution = false }: { data: Partial<CVFormData>; attribution?: boolean }) {
  // Sorted once here, so every template — and both the live preview and the
  // print-only render — get chronological order for free. The caller's data
  // (and whatever's in the editor/database) is never mutated.
  const data = sortCvSections(rawData);
  const t = data.template ?? "BASIC";
  const template =
    t === "MODERN"    ? <ModernTemplate    cv={data} attribution={attribution} /> :
    t === "EXECUTIVE" ? <ExecutiveTemplate cv={data} attribution={attribution} /> :
    t === "CREATIVE"  ? <CreativeTemplate  cv={data} attribution={attribution} /> :
    t === "MINIMAL"   ? <MinimalTemplate   cv={data} attribution={attribution} /> :
    t === "ELEGANT"   ? <ElegantTemplate   cv={data} attribution={attribution} /> :
    t === "TECH"      ? <TechTemplate      cv={data} attribution={attribution} /> :
    t === "CORPORATE" ? <CorporateTemplate cv={data} attribution={attribution} /> :
    t === "SLATE"     ? <SlateTemplate     cv={data} attribution={attribution} /> :
    t === "WARM"      ? <WarmTemplate      cv={data} attribution={attribution} /> :
    t === "SOFT"      ? <SoftTemplate      cv={data} attribution={attribution} /> :
    t === "PHOTO"     ? <PhotoTemplate     cv={data} attribution={attribution} /> :
    t === "CLASSIC"   ? <ClassicTemplate   cv={data} attribution={attribution} /> :
    t === "CRISP"     ? <CrispTemplate     cv={data} attribution={attribution} /> :
    t === "ADMINISTRATIVE_DIGITAL" ? <AdministrativeDigitalTemplate cv={data} attribution={attribution} /> :
    <BasicTemplate cv={data} attribution={attribution} />;

  // Priority: CV's own name field, never an email/ID/blob URL. The
  // authenticated user's profile-name fallback is applied server-side
  // (see resolveCvFooterName in the PDF route) — here there's always a
  // required, non-empty `data.name` for any CV that reached the editor.
  const footerName = resolveCvFooterName(data.name);

  // Headings follow the CV's own language (data.language), not the interface
  // language. Legacy CVs without one fall back to the interface language.
  const language = parseCvLanguage(data.language);
  const body = (
    <>
      {template}
      {footerName && <div className="cv-footer">{footerName}</div>}
    </>
  );
  return language ? <CvDocumentLanguageProvider language={language}>{body}</CvDocumentLanguageProvider> : body;
}

export function CVPreview({ data, attribution = false, previewRef }: CVPreviewProps) {
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
        <TemplateRenderer data={data} attribution={attribution} />
      </div>
    </div>
  );
}
