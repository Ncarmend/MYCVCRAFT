import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CookiesClient } from "./CookiesClient";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How CVixeo uses cookies and how to manage your preferences. GDPR-compliant cookie policy for European users.",
  alternates: {
    canonical: "https://www.cvixeo.com/cookies",
    languages: {
      en: "https://www.cvixeo.com/cookies",
      fr: "https://www.cvixeo.com/fr/cookies",
      nl: "https://www.cvixeo.com/nl/cookies",
      "x-default": "https://www.cvixeo.com/cookies",
    },
  },
};

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <CookiesClient />
      </main>
      <LandingFooter />
    </div>
  );
}
