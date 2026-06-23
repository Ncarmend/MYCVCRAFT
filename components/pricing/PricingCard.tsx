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
  highlighted?: boolean;
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
  highlighted = false,
  currentPlan = false,
  ctaLabel,
  onSelect,
  loading = false,
}: PricingCardProps) {
  // Non-highlighted cards with a badge get a slightly stronger border
  const hasFeaturedBorder = badge && !highlighted;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-xl p-4",
        highlighted
          ? "bg-slate-700 text-white shadow-lg ring-1 ring-slate-600"
          : hasFeaturedBorder
          ? "bg-white shadow-md ring-2 ring-slate-300"
          : "bg-white shadow-sm ring-1 ring-slate-200"
      )}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-0.5 text-xs font-semibold",
              badgeVariant === "green"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-400 text-amber-900"
            )}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-3">
        <h3
          className={cn(
            "text-sm font-semibold tracking-tight",
            highlighted ? "text-white" : "text-slate-800"
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            "mt-0.5 text-xs",
            highlighted ? "text-slate-300" : "text-slate-500"
          )}
        >
          {description}
        </p>

        {/* Price */}
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "text-2xl font-bold tracking-tight",
                highlighted ? "text-white" : "text-slate-800"
              )}
            >
              {price === 0 ? "€0" : `€${price}`}
            </span>
            {price > 0 && (
              <span
                className={cn(
                  "text-xs",
                  highlighted ? "text-slate-300" : "text-slate-400"
                )}
              >
                {perMonth}
              </span>
            )}
          </div>
          {billingNote && (
            <p
              className={cn(
                "mt-0.5 text-xs",
                highlighted ? "text-slate-300" : "text-slate-400"
              )}
            >
              {billingNote}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        className={cn(
          "mb-3 border-t",
          highlighted ? "border-slate-600" : "border-slate-100"
        )}
      />

      {/* Features */}
      <ul className="mb-4 flex-1 space-y-1.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <div
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                highlighted ? "bg-slate-600" : "bg-slate-100"
              )}
            >
              <Check
                className={cn(
                  "h-2.5 w-2.5",
                  highlighted ? "text-white" : "text-slate-600"
                )}
              />
            </div>
            <span
              className={cn(
                "text-xs leading-relaxed",
                highlighted ? "text-slate-200" : "text-slate-600"
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        onClick={onSelect}
        loading={loading}
        disabled={currentPlan}
        size="sm"
        className={cn(
          "mt-auto w-full text-xs font-semibold",
          highlighted
            ? "bg-white text-slate-700 hover:bg-slate-50"
            : "bg-slate-600 text-white hover:bg-slate-700"
        )}
      >
        {currentPlan ? "Current plan" : ctaLabel}
      </Button>
    </div>
  );
}
