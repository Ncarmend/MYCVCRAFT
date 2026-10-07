import Link from "next/link";
import { ArrowRight, ListChecks } from "lucide-react";
import type { Article } from "@/lib/articles";
import { getArticleCta, getArticlePillar } from "@/lib/content-clusters";
import { FAQSection } from "@/components/landing/FAQSection";

type Lang = "en" | "fr" | "nl";

const COPY: Record<Lang, { summary: string; faqLabel: string; faqHeading: string; pillar: string }> = {
  en: { summary: "Key takeaways", faqLabel: "FAQ", faqHeading: "Frequently asked questions", pillar: "Full guide:" },
  fr: { summary: "L'essentiel en bref", faqLabel: "FAQ", faqHeading: "Questions fréquentes", pillar: "Le guide complet :" },
  nl: { summary: "Kort samengevat", faqLabel: "FAQ", faqHeading: "Veelgestelde vragen", pillar: "Volledige gids:" },
};

/** Link from an article to its cluster's pillar page (hub-and-spoke internal linking). */
export function ArticlePillarLink({ article, lang }: { article: Article; lang: Lang }) {
  const pillar = getArticlePillar(article);
  if (!pillar) return null;
  return (
    <p className="mb-8 text-sm text-slate-600">
      {COPY[lang].pillar}{" "}
      <Link href={pillar.path} className="font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-950">
        {pillar.label}
      </Link>
    </p>
  );
}

/** "Key takeaways" box — a direct answer before the long-form content. */
export function ArticleSummary({ article, lang }: { article: Article; lang: Lang }) {
  if (!article.summary?.length) return null;
  return (
    <aside className="mb-8 rounded-xl bg-emerald-50/60 px-6 py-5 ring-1 ring-emerald-100">
      <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <ListChecks className="h-4 w-4 text-emerald-700" />
        {COPY[lang].summary}
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">
        {article.summary.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </aside>
  );
}

/** Visible FAQ (mirrored as FAQPage JSON-LD by the article route). */
export function ArticleFaq({ article, lang }: { article: Article; lang: Lang }) {
  if (!article.faq?.length) return null;
  return (
    <div className="-mx-6 mt-10">
      <FAQSection
        sectionLabel={COPY[lang].faqLabel}
        headline={COPY[lang].faqHeading}
        items={article.faq}
        className="bg-white"
      />
    </div>
  );
}

/** Conversion CTA chosen from the article's topic cluster (lib/content-clusters.ts). */
export function ArticleCta({ article }: { article: Article }) {
  const cta = getArticleCta(article);
  return (
    <div className="mt-10 rounded-2xl bg-slate-800 px-8 py-8 text-center text-white">
      <p className="text-base font-bold">{cta.heading}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">{cta.body}</p>
      <Link
        href={cta.href}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:bg-green-600 hover:text-white active:bg-green-700"
      >
        {cta.button}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
