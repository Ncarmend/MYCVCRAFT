"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

export function LandingFooter() {
  const { lang } = useLanguage();
  const T = translations[lang].footer;

  return (
    <footer className="border-t border-slate-500 bg-slate-600 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-500 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            Cvixeo
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <Link href="/pricing" className="transition-colors duration-200 hover:text-white">
              {T.pricing}
            </Link>
            <Link href="#features" className="transition-colors duration-200 hover:text-white">
              {T.features}
            </Link>
            <Link href="/login" className="transition-colors duration-200 hover:text-white">
              {T.signIn}
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-300">
            © {new Date().getFullYear()} Cvixeo. {T.rights}
          </p>

        </div>
      </div>
    </footer>
  );
}
