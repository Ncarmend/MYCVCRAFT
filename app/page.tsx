/**
 * Landing page — public home page with SEO metadata
 */
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { Navbar } from "@/components/landing/Navbar";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Main sections */}
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-gray-900"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              CVCraft
            </Link>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/pricing" className="hover:text-gray-600 transition-colors">
                Pricing
              </Link>
              <Link href="#features" className="hover:text-gray-600 transition-colors">
                Features
              </Link>
              <Link href="/login" className="hover:text-gray-600 transition-colors">
                Sign in
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} CVCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
