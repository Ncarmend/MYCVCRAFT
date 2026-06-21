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
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const { lang } = useLanguage();
  const T = translations[lang].pricing;

  const proPrice = billingCycle === "monthly" ? PLANS.PRO.priceMonthly : PLANS.PRO.priceAnnual;
  const proPriceId = billingCycle === "monthly" ? PLANS.PRO.priceId : PLANS.PRO.priceIdAnnual;

  async function handleSelectPro() {
    setLoadingPlan("PRO");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: proPriceId }),
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
      toast.error(lang === "fr" ? "Une erreur est survenue. Veuillez réessayer." : "Something went wrong. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Back button */}
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
      <div className="mx-auto max-w-7xl px-6 py-10 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {T.headline}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">{T.subtext}</p>

        {/* Billing cycle toggle */}
        <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {T.billingMonthly}
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              billingCycle === "annual"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {T.billingAnnual}
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              {T.saveBadge}
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="mx-auto max-w-5xl px-6 pb-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
          <PricingCard
            name={PLANS.FREE.name}
            price={PLANS.FREE.price}
            description={T.freeDescription}
            features={PLANS.FREE.features as unknown as string[]}
            perMonth={T.perMonth}
            mostPopular={T.mostPopular}
            onSelect={() => router.push("/signup")}
          />
          <PricingCard
            name={PLANS.PRO.name}
            price={proPrice}
            description={T.proDescription}
            features={PLANS.PRO.features as unknown as string[]}
            highlighted
            priceId={proPriceId}
            onSelect={handleSelectPro}
            loading={loadingPlan === "PRO"}
            billingCycle={billingCycle}
            annualTotal={PLANS.PRO.priceAnnualTotal}
            annualBilledAs={T.annualBilledAs}
            perMonth={T.perMonth}
            mostPopular={T.mostPopular}
          />
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">{T.moneyBack}</p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 py-14">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-8 flex items-center gap-3 text-center justify-center">
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
