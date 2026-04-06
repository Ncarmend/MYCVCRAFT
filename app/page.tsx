/**
 * Landing page — public home page with SEO metadata
 */
import Link from "next/link";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-gray-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            CVCraft
          </Link>

          <div className="hidden items-center gap-8 sm:flex">
            <Link
              href="#features"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

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
