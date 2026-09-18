import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { TermsClient } from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms of Use — Cvixeo",
  description: "The terms and conditions that govern your use of Cvixeo's AI-powered CV builder and related services.",
  alternates: {
    canonical: "https://cvixeo.com/terms",
    languages: {
      en: "https://cvixeo.com/terms",
      fr: "https://cvixeo.com/fr/terms",
      nl: "https://cvixeo.com/nl/terms",
      "x-default": "https://cvixeo.com/terms",
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
