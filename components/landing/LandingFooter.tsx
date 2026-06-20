"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

export function LandingFooter() {
  const { lang } = useLanguage();
  const T = translations[lang].footer;

  return (
    <footer className="border-t border-gray-100 bg-white py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            Cvixeo
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/pricing" className="hover:text-gray-600 transition-colors">
              {T.pricing}
            </Link>
            <Link href="#features" className="hover:text-gray-600 transition-colors">
              {T.features}
            </Link>
            <Link href="/login" className="hover:text-gray-600 transition-colors">
              {T.signIn}
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Cvixeo. {T.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
