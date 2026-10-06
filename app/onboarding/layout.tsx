import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";

// Client page: metadata lives in this layout. Utility page, kept out of search results.
export const metadata: Metadata = {
  title: "Get started",
  robots: NOINDEX,
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
