import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CareersClient } from "./CareersClient";

export const metadata: Metadata = {
  title: "Career Advice & Resources",
  description:
    "Expert career tips, CV writing guides, and job search advice to help you land your dream job faster.",
  alternates: {
    canonical: "https://cvixeo.com/careers",
    languages: {
      en: "https://cvixeo.com/careers",
      fr: "https://cvixeo.com/fr/careers",
      "x-default": "https://cvixeo.com/careers",
    },
  },
  openGraph: {
    title: "Career Advice & Resources | Cvixeo",
    description: "Expert CV writing guides and job search advice from the Cvixeo team.",
    url: "https://cvixeo.com/careers",
  },
};

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <CareersClient />
      <LandingFooter />
    </div>
  );
}
