"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { Button } from "@/components/ui/button";
import { trackPremiumClicked } from "@/lib/analytics";

export function JobMatchCTA() {
  const { lang } = useLanguage();
  const T = translations[lang].jobMatch.upgrade;
  const pricingHref = lang === "fr" ? "/fr/pricing" : lang === "nl" ? "/nl/pricing" : "/pricing";

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
      <p className="text-sm font-semibold text-amber-900">{T.title}</p>
      <p className="mt-1 text-xs text-amber-700">{T.subtitle}</p>
      <Link href={pricingHref} className="mt-4 inline-block" onClick={() => trackPremiumClicked({ source: "job_match" })}>
        <Button size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          {T.cta}
        </Button>
      </Link>
    </div>
  );
}
