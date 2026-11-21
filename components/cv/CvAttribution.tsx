import { CV_ATTRIBUTION_STYLE, CV_ATTRIBUTION_TEXT } from "@/lib/cvAttribution";

/**
 * Free-plan attribution line (see lib/cvAttribution.ts). Rendered by each
 * template as the last element of its main content column.
 * `offsetX` re-centres it on the page in two-column layouts.
 */
export function CvAttribution({ offsetX = 0 }: { offsetX?: number }) {
  return (
    <div
      className="cv-attribution"
      style={offsetX ? { ...CV_ATTRIBUTION_STYLE, transform: `translateX(${offsetX}px)` } : CV_ATTRIBUTION_STYLE}
    >
      {CV_ATTRIBUTION_TEXT}
    </div>
  );
}
