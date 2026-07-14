"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

export function CTA() {
  const { lang } = useLanguage();
  const T = translations[lang].cta;

  return (
    <section className="relative overflow-hidden bg-slate-700 py-14">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-base font-bold tracking-tight text-white sm:text-xl">
          {T.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-slate-300">{T.subtext}</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/signup">
            <Button
              size="md"
              className="bg-white text-slate-700 hover:bg-green-600 hover:text-white active:bg-green-700 active:text-white gap-2 px-8 shadow-lg transition-colors duration-200"
            >
              <Sparkles className="h-5 w-5" />
              {T.primary}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              size="md"
              variant="ghost"
              className="text-white hover:bg-white/10 border border-white/20"
            >
              {T.secondary}
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-400">{T.footnote}</p>
      </div>
    </section>
  );
}
