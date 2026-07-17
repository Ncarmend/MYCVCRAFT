"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

const langActive = "bg-emerald-950 text-white";
const langInactive = "text-slate-600 hover:bg-green-700 hover:text-white";
const langBase = "rounded-md px-2.5 py-1 transition-all duration-200 ease-in-out";

const langActiveMobile = "bg-emerald-950 text-white";
const langInactiveMobile = "text-slate-600 hover:bg-green-700 hover:text-white";
const langBaseMobile = "rounded-md px-2 py-1 transition-all duration-200 ease-in-out";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const T = translations[lang].nav;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Cvixeo"
            className="h-9 w-auto"
            style={{ mixBlendMode: "multiply" }}
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 sm:flex">
          <Link
            href="#features"
            className="text-sm font-semibold text-slate-900 transition-all duration-200 ease-in-out hover:text-green-800"
          >
            {T.features}
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold text-slate-900 transition-all duration-200 ease-in-out hover:text-green-800"
          >
            {T.pricing}
          </Link>
          <Link
            href="/careers"
            className="text-sm font-semibold text-slate-900 transition-all duration-200 ease-in-out hover:text-green-800"
          >
            {T.careers}
          </Link>
        </div>

        {/* Desktop right: lang toggle + auth */}
        <div className="hidden items-center gap-3 sm:flex">
          {/* Language toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLang("en")}
              className={`${langBase} ${lang === "en" ? langActive : langInactive}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("fr")}
              className={`${langBase} ${lang === "fr" ? langActive : langInactive}`}
            >
              FR
            </button>
          </div>

          <Link
            href="/contact"
            className="text-sm font-medium text-slate-900 transition-all duration-200 ease-in-out hover:text-green-700"
          >
            {T.contact}
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-900 transition-all duration-200 ease-in-out hover:text-green-700"
          >
            {T.signIn}
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-green-700 active:bg-green-700"
          >
            {T.getStarted}
          </Link>
        </div>

        {/* Mobile: lang toggle + get started + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <div className="flex items-center rounded-lg border border-gray-200 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLang("en")}
              className={`${langBaseMobile} ${lang === "en" ? langActiveMobile : langInactiveMobile}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("fr")}
              className={`${langBaseMobile} ${lang === "fr" ? langActiveMobile : langInactiveMobile}`}
            >
              FR
            </button>
          </div>
          <Link
            href="/signup"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-800 px-3 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:bg-green-700 active:bg-green-700"
          >
            {T.getStarted}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-600 transition-all duration-200 ease-in-out hover:bg-gray-100"
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
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-200 ease-in-out hover:text-green-800"
            >
              {T.features}
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-200 ease-in-out hover:text-green-800"
            >
              {T.pricing}
            </Link>
            <Link
              href="/careers"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-200 ease-in-out hover:text-green-800"
            >
              {T.careers}
            </Link>
            <div className="my-2 border-t border-gray-200" />
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 transition-all duration-200 ease-in-out hover:text-green-700"
            >
              {T.contact}
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 transition-all duration-200 ease-in-out hover:text-green-700"
            >
              {T.signIn}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
