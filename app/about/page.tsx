import type { Metadata } from "next";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "About Cvixeo — Our Mission, Vision & Values",
  description:
    "Cvixeo's mission is to help every job seeker land more interviews using AI. Learn about our product vision, core values, and the team behind the platform.",
  alternates: {
    canonical: "https://www.cvixeo.com/about",
    languages: {
      en: "https://www.cvixeo.com/about",
      fr: "https://www.cvixeo.com/fr/about",
      nl: "https://www.cvixeo.com/nl/about",
      "x-default": "https://www.cvixeo.com/about",
    },
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <AboutClient />
      <LandingFooter />
    </div>
  );
}
