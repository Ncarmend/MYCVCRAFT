/**
 * Pricing page — shows Free vs Pro plans
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PLANS } from "@/lib/plans";
import { HelpCircle, ArrowLeft } from "lucide-react";

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel your Pro subscription any time from your account settings. You retain Pro access until the end of your billing period.",
  },
  {
    q: "What happens to my CVs if I downgrade?",
    a: "Your CVs are always saved. On the Free plan, you can only actively edit 1 CV, but your others remain accessible in read-only mode.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — Pro comes with a 7-day free trial. No credit card required to sign up for the Free plan.",
  },
  {
    q: "What AI model powers the CV generation?",
    a: "We use OpenAI's GPT-4o for all AI features — the same model behind ChatGPT's most advanced responses.",
  },
  {
    q: "Are my CVs private?",
    a: "Absolutely. Your CVs are private by default. You can choose to generate a shareable link, but nothing is public unless you explicitly share it.",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleSelectPro() {
    setLoadingPlan("PRO");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: PLANS.PRO.priceId }),
      });

      if (res.status === 401) {
        // Not logged in — redirect to signup with returnTo
        router.push("/signup?returnTo=/pricing");
        return;
      }

      if (!res.ok) throw new Error(await res.text());
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch {
      toast.error("Something went wrong. Please try again.");
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
          Back
        </button>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
          Start free. Upgrade when you need more power. No hidden fees.
        </p>
      </div>

      {/* Plans */}
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 items-center">
          <PricingCard
            name={PLANS.FREE.name}
            price={PLANS.FREE.price}
            description="Perfect for getting started"
            features={PLANS.FREE.features as unknown as string[]}
            onSelect={() => router.push("/signup")}
          />
          <PricingCard
            name={PLANS.PRO.name}
            price={PLANS.PRO.price}
            description="For serious job seekers"
            features={PLANS.PRO.features as unknown as string[]}
            highlighted
            priceId={PLANS.PRO.priceId}
            onSelect={handleSelectPro}
            loading={loadingPlan === "PRO"}
          />
        </div>

        {/* Money back guarantee */}
        <p className="mt-8 text-center text-sm text-gray-500">
          All plans include a 14-day money-back guarantee. No questions asked.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 flex items-center gap-3 text-center justify-center">
            <HelpCircle className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
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
