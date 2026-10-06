import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PrivacyClient } from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CVixeo collects, uses, and protects your personal data. GDPR-compliant privacy policy for European users.",
  alternates: {
    canonical: "https://www.cvixeo.com/privacy",
    languages: {
      en: "https://www.cvixeo.com/privacy",
      fr: "https://www.cvixeo.com/fr/privacy",
      nl: "https://www.cvixeo.com/nl/privacy",
      "x-default": "https://www.cvixeo.com/privacy",
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
