import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PrivacyClient } from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy — Cvixeo",
  description: "How Cvixeo collects, uses, and protects your personal data. GDPR-compliant privacy policy for European users.",
  alternates: {
    canonical: "https://cvixeo.com/privacy",
    languages: {
      en: "https://cvixeo.com/privacy",
      fr: "https://cvixeo.com/fr/privacy",
      "x-default": "https://cvixeo.com/privacy",
    },
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <PrivacyClient />
      </main>
      <LandingFooter />
    </div>
  );
}
