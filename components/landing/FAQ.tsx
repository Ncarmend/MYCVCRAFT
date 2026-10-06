"use client";

import { ChevronDown } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

// Native <details> keeps every answer in the server-rendered HTML, so the
// content is crawlable and matches the FAQPage JSON-LD emitted by HomePage.
export function FAQ() {
  const { lang } = useLanguage();
  const T = translations[lang].faq;

  return (
    <section className="bg-gray-50 py-12 sm:py-16" id="faq">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-base font-semibold text-emerald-900 uppercase tracking-widest">
            {T.sectionLabel}
          </p>
          <h2 className="mt-2 text-base font-bold tracking-tight text-gray-900 sm:text-xl">
            {T.headline}
          </h2>
        </div>

        <div className="mt-8 divide-y divide-gray-200 rounded-2xl bg-white ring-1 ring-gray-100">
          {T.items.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
                <h3>{item.q}</h3>
                <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
