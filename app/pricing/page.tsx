"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PLANS } from "@/lib/plans";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

export default function PricingPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { lang } = useLanguage();
  const T = translations[lang].pricing;

  async function handleCheckout(priceId: string | null, planKey: string) {
    setLoadingPlan(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (res.status === 401) {
        router.push("/signup?returnTo=/pricing");
        return;
      }

      if (!res.ok) throw new Error(await res.text());
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch {
      toast.error(
        lang === "fr"
          ? "Une erreur est survenue. Veuillez réessayer."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Back */}
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {T.back}
        </button>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-10 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {T.headline}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">{T.subtext}</p>
      </div>

      {/* ── 3-card grid ── */}
      <div className="mx-auto max-w-6xl px-6 pb-14">
        {/* Outer wrapper: equal-height columns */}
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-3">

          {/* ── Card 1 · Free ── */}
          <PricingCard
            name={T.freeName}
            price={0}
            description={T.freeDescription}
            features={T.freeFeatures as unknown as string[]}
            perMonth={T.perMonth}
            ctaLabel={T.freeCtaLabel}
            onSelect={() => router.push("/signup")}
          />

          {/* ── Card 2 · Monthly Premium ── */}
          <PricingCard
            name={T.monthlyName}
            price={PLANS.PRO.priceMonthly}
            description={T.monthlyDescription}
            features={T.monthlyFeatures as unknown as string[]}
            perMonth={T.perMonth}
            badge={T.mostPopular}
            badgeVariant="amber"
            ctaLabel={T.monthlyCtaLabel}
            onSelect={() => handleCheckout(PLANS.PRO.priceId, "MONTHLY")}
            loading={loadingPlan === "MONTHLY"}
          />

          {/* ── Card 3 · Annual Premium ── */}
          <PricingCard
            name={T.annualName}
            price={PLANS.PRO.priceAnnual}
            description={T.annualDescription}
            features={T.annualFeatures as unknown as string[]}
            perMonth={T.perMonth}
            billingNote={T.annualBilledAs}
            badge={T.bestValue}
            badgeVariant="green"
            highlighted
            ctaLabel={T.annualCtaLabel}
            onSelect={() => handleCheckout(PLANS.PRO.priceIdAnnual, "ANNUAL")}
            loading={loadingPlan === "ANNUAL"}
          />
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">{T.moneyBack}</p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 py-14">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-8 flex items-center justify-center gap-3">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">{T.faqTitle}</h2>
          </div>
          <div className="space-y-4">
            {T.faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
              >
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
