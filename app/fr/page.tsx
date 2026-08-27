import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Cvixeo — Générateur de CV propulsé par l'IA",
  description:
    "Créez des CV professionnels et optimisés ATS en quelques minutes grâce à l'IA. Démarquez-vous avec de beaux modèles et des recommandations de carrière intelligentes.",
  alternates: {
    canonical: "https://cvixeo.com/fr",
    languages: {
      en: "https://cvixeo.com",
      fr: "https://cvixeo.com/fr",
      "x-default": "https://cvixeo.com",
    },
  },
  openGraph: {
    title: "Cvixeo — Générateur de CV propulsé par l'IA",
    description: "Créez des CV professionnels et optimisés ATS en quelques minutes grâce à l'IA.",
    url: "https://cvixeo.com/fr",
    locale: "fr_FR",
  },
};

export default function LandingPageFr() {
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
