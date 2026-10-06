"use client";

import Link from "next/link";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { LANDING_ROUTES } from "@/lib/landing-routes";

export function HowJobMatchWorks() {
  const { lang } = useLanguage();
  const T = translations[lang].jobMatch.howItWorks;
  // In-depth guide to the method (EN/FR only).
  const guide = lang === "fr" ? LANDING_ROUTES["cv-offre-emploi"] : lang === "en" ? LANDING_ROUTES["job-description-matching"] : null;

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{T.title}</h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {T.steps.map((step) => (
            <div key={step.n} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <span className="text-xs font-bold text-emerald-600">{step.n}</span>
              <p className="mt-1 text-sm font-semibold text-gray-900">{step.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{step.body}</p>
            </div>
          ))}
        </div>
        {guide && (
          <p className="mt-6 text-center">
            <Link href={guide.path} className="text-sm font-medium text-emerald-800 underline underline-offset-2 hover:text-emerald-950">
              {guide.label}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
