"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: number;
  perMonth?: string;
  billingNote?: string;
  description: string;
  features: string[];
  badge?: string;
  badgeVariant?: "amber" | "green";
  currentPlan?: boolean;
  ctaLabel: string;
  onSelect: () => void;
  loading?: boolean;
}

export function PricingCard({
  name,
  price,
  perMonth = "/month",
  billingNote,
  description,
  features,
  badge,
  badgeVariant = "amber",
  currentPlan = false,
  ctaLabel,
  onSelect,
  loading = false,
}: PricingCardProps) {
  return (
    <div className="relative flex h-full flex-col rounded-xl bg-slate-600 p-5 shadow-lg ring-1 ring-slate-500">

      {/* Badge */}
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-0.5 text-xs font-semibold",
              badgeVariant === "green"
                ? "bg-emerald-400 text-emerald-900"
                : "bg-amber-400 text-amber-900"
            )}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight text-white">{name}</h3>
        <p className="mt-0.5 text-xs text-slate-300">{description}</p>

        {/* Price */}
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-white">
              {price === 0 ? "€0" : `€${price}`}
            </span>
            {price > 0 && (
              <span className="text-xs text-slate-300">{perMonth}</span>
            )}
          </div>
          {billingNote && (
            <p className="mt-0.5 text-xs text-slate-300">{billingNote}</p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mb-4 border-t border-slate-500" />

      {/* Features */}
      <ul className="mb-5 flex-1 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-500">
              <Check className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="text-xs leading-relaxed text-slate-200">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA — white on dark card, turns green on hover */}
      <Button
        onClick={onSelect}
        loading={loading}
        disabled={currentPlan}
        size="sm"
        className="mt-auto w-full bg-white text-xs font-semibold text-slate-700 hover:bg-green-600 hover:text-white active:bg-green-700 active:text-white transition-colors duration-200"
      >
        {currentPlan ? "Current plan" : ctaLabel}
      </Button>
    </div>
  );
}
