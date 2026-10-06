"use client";

import Link from "next/link";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { Logo } from "@/components/ui/Logo";
import { localePath } from "@/lib/seo";

export function LandingFooter() {
  const { lang } = useLanguage();
  const T = translations[lang].footer;
  const href = (path: string) => localePath(lang, path);

  return (
    <footer className="border-t border-slate-500 bg-slate-700">
      {/* ── Top: columns ── */}
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">

          {/* Brand */}
          <div>
            <Link href={href("/")} className="flex items-center">
              <Logo variant="dark" height={22} />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              {T.tagline}
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              {T.product}
            </p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-slate-300">
              <Link href={href("/#features")}  className="transition-colors duration-150 hover:text-white">{T.features}</Link>
              <Link href={href("/job-match")}  className="transition-colors duration-150 hover:text-white">{T.jobMatch}</Link>
              <Link href={href("/pricing")}    className="transition-colors duration-150 hover:text-white">{T.pricing}</Link>
              <Link href={href("/careers")}    className="transition-colors duration-150 hover:text-white">{T.careers}</Link>
              <Link href="/login"     className="transition-colors duration-150 hover:text-white">{T.signIn}</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              {T.legal}
            </p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-slate-300">
              <Link href={href("/about")} className="transition-colors duration-150 hover:text-white">{T.about}</Link>
              <Link href={href("/privacy")} className="transition-colors duration-150 hover:text-white">{T.privacy}</Link>
              <Link href={href("/terms")} className="transition-colors duration-150 hover:text-white">{T.terms}</Link>
              <Link href={href("/cookies")} className="transition-colors duration-150 hover:text-white">{T.cookies}</Link>
              <Link href={href("/legal")} className="transition-colors duration-150 hover:text-white">{T.legalNotice}</Link>
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
