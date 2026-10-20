import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";

// Client page: metadata lives in this layout. Utility page, kept out of search results.
export const metadata: Metadata = {
  title: "Reset password",
  robots: NOINDEX,
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
