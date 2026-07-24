"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PLANS } from "@/lib/plans";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

const mockStatColors = [
  { bg: "bg-indigo-50 border border-indigo-100", valueColor: "text-indigo-700" },
  { bg: "bg-green-50 border border-green-100",   valueColor: "text-green-700" },
  { bg: "bg-amber-50 border border-amber-100",   valueColor: "text-amber-700" },
  { bg: "bg-purple-50 border border-purple-100", valueColor: "text-purple-700" },
];

export default function PricingPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { lang } = useLanguage();
  const T = translations[lang].pricing;
  const TM = translations[lang].hero.mock;

  async function handleCheckout(planType: "MONTHLY" | "ANNUAL" | "PASS") {
    setLoadingPlan(planType);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
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
    <main className="min-h-screen bg-slate-50">

      {/* ── Back ── */}
      <div className="mx-auto max-w-5xl px-6 pt-5">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {T.back}
        </button>
      </div>

      {/* ── 1. Product overview ── */}
      <div className="mx-auto max-w-5xl px-6 pb-6 pt-6 text-center">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {T.headline}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-xs text-slate-500">{T.subtext}</p>
      </div>

      {/* ── 2. "Your CVs" product preview ── */}
      <div className="mx-auto max-w-5xl px-6 pb-8">
        <div className="mb-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            {TM.yourCVs}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{T.previewTitle}</p>
        </div>

        {/* Browser mockup */}
        <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:overflow-x-visible sm:px-0">
          <div className="min-w-105 sm:min-w-0">
            <div className="relative mx-auto max-w-5xl rounded-2xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-3xl lg:p-4">
              <div className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10">

                {/* Browser chrome */}
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <div className="mx-auto max-w-xs flex-1 rounded-md border border-gray-200 bg-white px-3 py-1 text-center text-xs text-gray-600">
                    app.cvixeo.com/dashboard
                  </div>
                </div>

                {/* Dashboard shell */}
                <div className="grid grid-cols-12" style={{ minHeight: "380px" }}>

                  {/* Sidebar */}
                  <div className="col-span-2 flex flex-col border-r border-gray-100 bg-white/70 p-2">
                    <div className="mb-6 flex items-center gap-2">
                      <div className="h-5 w-5 rounded-lg bg-emerald-900" />
                      <span className="h-3 w-20 rounded bg-gray-300" />
                    </div>
                    <div className="space-y-1.5 text-gray-600">
                      {TM.nav.map((label, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 rounded-md px-3 py-2 ${
                            i === 0
                              ? "bg-emerald-100 text-emerald-700 shadow-sm"
                              : "text-gray-500"
                          }`}
                        >
                          <div className={`h-3 w-3 rounded ${i === 0 ? "bg-emerald-500" : "bg-gray-300"}`} />
                          <span className="text-xs font-medium">{label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center gap-2 border-t border-gray-200 pt-4">
                      <div className="h-5 w-5 rounded-full bg-emerald-200" />
                      <div className="space-y-1">
                        <div className="h-2.5 w-16 rounded bg-gray-300" />
                        <div className="h-2 w-12 rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="col-span-10 bg-gray-50/40 p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <div className="mb-1 h-4 w-24 rounded-md bg-gray-800 opacity-70" />
                        <div className="h-2.5 w-36 rounded bg-gray-300" />
                      </div>
                      <div className="flex h-6 items-center gap-1.5 rounded-lg bg-emerald-600 px-2">
                        <div className="h-2 w-2 rounded-full bg-white opacity-80" />
                        <div className="h-2 w-8 rounded bg-white opacity-70" />
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="mb-5 grid grid-cols-4 gap-3">
                      {TM.stats.map((s, i) => (
                        <div key={i} className={`rounded-xl ${mockStatColors[i].bg} px-3 py-2.5`}>
                          <p className="mb-1 text-[8px] text-gray-400">{s.label}</p>
                          <p className={`text-sm font-bold ${mockStatColors[i].valueColor}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* CV cards */}
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      {TM.yourCVs}
                    </p>
                    <div className="grid grid-cols-3 gap-3">

                      {/* CV 1 */}
                      <div className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm">
                        <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 to-indigo-400" />
                        <div className="p-3">
                          <p className="mb-0.5 text-xs font-bold text-gray-800">Software Engineer</p>
                          <p className="mb-2.5 text-[10px] text-gray-400">Google · Paris</p>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[9px] text-gray-400">{TM.atsScore}</span>
                            <span className="text-[9px] font-semibold text-green-600">94%</span>
                          </div>
                          <div className="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full w-[94%] rounded-full bg-green-400" />
                          </div>
                          <div className="flex gap-1.5">
                            <span className="rounded-md bg-green-100 px-1.5 py-0.5 text-[9px] font-semibold text-green-700">
                              {TM.published}
                            </span>
                            <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-700">
                              BASIC
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CV 2 */}
                      <div className="overflow-hidden rounded-xl border border-purple-100 bg-white shadow-sm">
                        <div className="h-1.5 w-full bg-linear-to-r from-purple-500 to-purple-400" />
                        <div className="p-3">
                          <p className="mb-0.5 text-xs font-bold text-gray-800">Product Manager</p>
                          <p className="mb-2.5 text-[10px] text-gray-400">Meta · London</p>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[9px] text-gray-400">{TM.atsScore}</span>
                            <span className="text-[9px] font-semibold text-green-600">81%</span>
                          </div>
                          <div className="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full w-[81%] rounded-full bg-green-400" />
                          </div>
                          <div className="flex gap-1.5">
                            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                              {TM.draft}
                            </span>
                            <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[9px] font-semibold text-purple-700">
                              MODERN
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* New CV slot */}
                      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
                        <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                          <span className="text-sm font-bold leading-none text-emerald-900">+</span>
                        </div>
                        <p className="text-[10px] font-medium text-gray-500">{TM.newCV}</p>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Pricing table ── */}
      <div className="mx-auto max-w-5xl px-6 pb-10">

        {/* Section label */}
        <div className="mb-5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            {T.plansLabel}
          </p>
        </div>

        {/* Unified dark wrapper — matches card bg */}
        <div className="rounded-xl bg-slate-700 px-4 pb-6 pt-8 shadow-lg ring-1 ring-slate-600">
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Free */}
            <PricingCard
              name={T.freeName}
              price={0}
              description={T.freeDescription}
              features={T.freeFeatures as unknown as string[]}
              perMonth={T.perMonth}
              ctaLabel={T.freeCtaLabel}
              onSelect={() => router.push("/signup")}
            />

            {/* 7-Day Premium Pass */}
            <PricingCard
              name={T.passName}
              price={PLANS.PASS.price}
              description={T.passDescription}
              features={T.passFeatures as unknown as string[]}
              perMonth={T.passOnce}
              badge={T.passNew}
              badgeVariant="amber"
              ctaLabel={T.passCtaLabel}
              onSelect={() => handleCheckout("PASS")}
              loading={loadingPlan === "PASS"}
            />

            {/* Monthly Premium */}
            <PricingCard
              name={T.monthlyName}
              price={PLANS.PRO.priceMonthly}
              description={T.monthlyDescription}
              features={T.monthlyFeatures as unknown as string[]}
              perMonth={T.perMonth}
              ctaLabel={T.monthlyCtaLabel}
              onSelect={() => handleCheckout("MONTHLY")}
              loading={loadingPlan === "MONTHLY"}
            />

            {/* Annual Premium */}
            <PricingCard
              name={T.annualName}
              price={PLANS.PRO.priceAnnual}
              description={T.annualDescription}
              features={T.annualFeatures as unknown as string[]}
              perMonth={T.perMonth}
              billingNote={T.annualBilledAs}
              badge={T.bestValue}
              badgeVariant="green"
              ctaLabel={T.annualCtaLabel}
              onSelect={() => handleCheckout("ANNUAL")}
              loading={loadingPlan === "ANNUAL"}
            />

          </div>

          <p className="mt-6 text-center text-xs text-slate-400">{T.moneyBack}</p>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="border-t border-slate-100 bg-white py-10">
        <div className="mx-auto max-w-2xl px-6">
          <div className="mb-6 flex items-center justify-center gap-2">
            <HelpCircle className="h-4 w-4 text-slate-500" />
            <h2 className="text-base font-bold text-slate-900">{T.faqTitle}</h2>
          </div>
          <div className="space-y-2">
            {T.faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-lg bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
              >
                <h3 className="text-xs font-semibold text-slate-800">{faq.q}</h3>
                <p className="mt-1 text-xs text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
