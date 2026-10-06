import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";

// Client page: metadata lives in this layout. Utility page, kept out of search results.
export const metadata: Metadata = {
  title: "Waitlist",
  robots: NOINDEX,
};

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
