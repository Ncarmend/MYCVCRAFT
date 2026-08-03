import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Cvixeo — AI-Powered CV Generator",
  description:
    "Create professional, ATS-optimized CVs in minutes with AI. Stand out from the crowd with beautiful templates and intelligent career insights.",
  alternates: { canonical: "https://cvixeo.com" },
  openGraph: {
    title: "Cvixeo — AI-Powered CV Generator",
    description: "Create professional, ATS-optimized CVs in minutes with AI.",
    url: "https://cvixeo.com",
  },
};

export default function LandingPage() {
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
