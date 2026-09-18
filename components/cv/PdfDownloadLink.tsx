"use client";

import { trackCvDownloaded } from "@/lib/analytics";

interface Props {
  href: string;
  cvId: string;
  template?: string;
  className?: string;
  children: React.ReactNode;
}

/** Plain download anchor that also fires the cv_downloaded GTM event on click. */
export function PdfDownloadLink({ href, cvId, template, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackCvDownloaded({ cvId, template })}
    >
      {children}
    </a>
  );
}
