"use client";

import { Star } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

export function Testimonials() {
  const { lang } = useLanguage();
  const T = translations[lang].testimonials;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-widest">
            {T.sectionLabel}
          </h2>
          <p className="mt-2 text-xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {T.headline}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {T.items.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-100"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="flex-1 text-xs leading-relaxed text-gray-600">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
