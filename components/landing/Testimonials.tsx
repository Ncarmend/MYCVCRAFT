"use client";

import { ShieldCheck } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

// Transparency / trust section. Kept under the historical "Testimonials" name to
// avoid churn in imports. Deliberately no star ratings or quotes: there are no
// verified reviews yet, and star icons next to non-review content are misleading.
export function Testimonials() {
  const { lang } = useLanguage();
  const T = translations[lang].testimonials;

  return (
    <section className="bg-white py-12 sm:py-16" id="transparency">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-semibold text-indigo-600 uppercase tracking-widest">
            {T.sectionLabel}
          </p>
          <h2 className="mt-2 text-base font-bold tracking-tight text-gray-900 sm:text-xl">
            {T.headline}
          </h2>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {T.items.map((t) => (
            <div
              key={t.title}
              className="flex flex-col rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                <h3 className="text-sm font-semibold text-gray-900">{t.title}</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">{t.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
