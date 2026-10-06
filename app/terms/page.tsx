import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { TermsClient } from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms and conditions that govern your use of Cvixeo's AI-powered CV builder and related services.",
  alternates: {
    canonical: "https://www.cvixeo.com/terms",
    languages: {
      en: "https://www.cvixeo.com/terms",
      fr: "https://www.cvixeo.com/fr/terms",
      nl: "https://www.cvixeo.com/nl/terms",
      "x-default": "https://www.cvixeo.com/terms",
    },
  },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <TermsClient />
      </main>
      <LandingFooter />
    </div>
  );
}
