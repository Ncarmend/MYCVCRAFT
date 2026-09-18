import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Cvixeo — AI-gestuurde cv-generator",
  description:
    "Maak professionele, ATS-geoptimaliseerde cv's in enkele minuten met AI. Val op met mooie sjablonen en slimme carrière-aanbevelingen.",
  alternates: {
    canonical: "https://cvixeo.com/nl",
    languages: {
      en: "https://cvixeo.com",
      fr: "https://cvixeo.com/fr",
      nl: "https://cvixeo.com/nl",
      "x-default": "https://cvixeo.com",
    },
  },
  openGraph: {
    title: "Cvixeo — AI-gestuurde cv-generator",
    description: "Maak professionele, ATS-geoptimaliseerde cv's in enkele minuten met AI.",
    url: "https://cvixeo.com/nl",
    locale: "nl_BE",
  },
};

export default function LandingPageNl() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <LandingFooter />
    </div>
  );
}
