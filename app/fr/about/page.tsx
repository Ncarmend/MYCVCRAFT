import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { AboutClient } from "../../about/AboutClient";

export const metadata: Metadata = {
  title: "À propos de Cvixeo — Notre mission, vision et valeurs",
  description:
    "La mission de Cvixeo est d'aider chaque candidat à décrocher plus d'entretiens grâce à l'IA. Découvrez notre vision produit, nos valeurs fondamentales et l'équipe derrière la plateforme.",
  alternates: {
    canonical: "https://cvixeo.com/fr/about",
    languages: {
      en: "https://cvixeo.com/about",
      fr: "https://cvixeo.com/fr/about",
      "x-default": "https://cvixeo.com/about",
    },
  },
  openGraph: {
    title: "À propos de Cvixeo",
    description: "La mission de Cvixeo est d'aider chaque candidat à décrocher plus d'entretiens grâce à l'IA.",
    url: "https://cvixeo.com/fr/about",
    locale: "fr_FR",
  },
};

export default function AboutPageFr() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <AboutClient />
      <LandingFooter />
    </div>
  );
}
