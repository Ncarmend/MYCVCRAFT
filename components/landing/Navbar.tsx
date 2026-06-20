"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const T = translations[lang].nav;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          Cvixeo
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 sm:flex">
          <Link href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            {T.features}
          </Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            {T.pricing}
          </Link>
        </div>

        {/* Desktop right side: lang toggle + auth */}
        <div className="hidden items-center gap-3 sm:flex">
          {/* Language toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLang("en")}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                lang === "en" ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("fr")}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                lang === "fr" ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              FR
            </button>
          </div>

          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            {T.signIn}
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            {T.getStarted}
          </Link>
        </div>

        {/* Mobile: lang toggle + get started + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <div className="flex items-center rounded-lg border border-gray-200 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLang("en")}
              className={`rounded-md px-2 py-1 transition-colors ${
                lang === "en" ? "bg-indigo-600 text-white" : "text-gray-500"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("fr")}
              className={`rounded-md px-2 py-1 transition-colors ${
                lang === "fr" ? "bg-indigo-600 text-white" : "text-gray-500"
              }`}
            >
              FR
            </button>
          </div>
          <Link
            href="/signup"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            {T.getStarted}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 sm:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {T.features}
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {T.pricing}
            </Link>
            <div className="my-2 border-t border-gray-100" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {T.signIn}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
