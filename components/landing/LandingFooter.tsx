"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

export function LandingFooter() {
  const { lang } = useLanguage();
  const T = translations[lang].footer;

  return (
    <footer className="border-t border-slate-500 bg-slate-700">
      {/* ── Top: columns ── */}
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-500">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              Cvixeo
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              AI-powered CV builder for ambitious professionals. Create ATS-optimised resumes in minutes.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              {T.product}
            </p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-slate-300">
              <Link href="/pricing"   className="transition-colors duration-150 hover:text-white">{T.pricing}</Link>
              <Link href="#features"  className="transition-colors duration-150 hover:text-white">{T.features}</Link>
              <Link href="/careers"   className="transition-colors duration-150 hover:text-white">{T.careers}</Link>
              <Link href="/login"     className="transition-colors duration-150 hover:text-white">{T.signIn}</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              {T.legal}
            </p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-slate-300">
              <Link href="/about"    className="transition-colors duration-150 hover:text-white">{T.about}</Link>
              <Link href="/privacy"  className="transition-colors duration-150 hover:text-white">{T.privacy}</Link>
              <Link href="/terms"    className="transition-colors duration-150 hover:text-white">{T.terms}</Link>
              <Link href="/cookies"  className="transition-colors duration-150 hover:text-white">{T.cookies}</Link>
              <Link href="/legal"    className="transition-colors duration-150 hover:text-white">{T.legalNotice}</Link>
            </div>
          </div>

        </div>

        {/* ── Bottom: copyright ── */}
        <div className="mt-10 border-t border-slate-600 pt-6 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Cvixeo. {T.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
