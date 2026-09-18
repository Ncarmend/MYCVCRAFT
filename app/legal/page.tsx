import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LegalClient } from "./LegalClient";

export const metadata: Metadata = {
  title: "Legal Notice — Cvixeo",
  description: "Legal notice (mentions légales) for Cvixeo — publisher information, hosting details, and intellectual property notice.",
  alternates: {
    canonical: "https://cvixeo.com/legal",
    languages: {
      en: "https://cvixeo.com/legal",
      fr: "https://cvixeo.com/fr/legal",
      nl: "https://cvixeo.com/nl/legal",
      "x-default": "https://cvixeo.com/legal",
    },
  },
};

export default function LegalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1 bg-slate-50">
        <LegalClient />
      </main>
      <LandingFooter />
    </div>
  );
}
