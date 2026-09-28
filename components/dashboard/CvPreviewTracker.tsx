"use client";

import { useEffect } from "react";
import { trackCvPreviewOpened } from "@/lib/analytics";

/** Invisible component that fires the cv_preview_opened analytics event once, on mount. */
export function CvPreviewTracker({ cvId }: { cvId: string }) {
  useEffect(() => {
    trackCvPreviewOpened({ cvId });
  }, [cvId]);

  return null;
}
