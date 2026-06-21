"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: number;
  priceLabel?: string;       // e.g. "€12" or "€9"
  perMonth?: string;         // "/month" | "/mois"
  billingNote?: string;      // "billed as €108/year"
  description: string;
  features: string[];
  badge?: string;            // "Most Popular" | "Best Value"
  badgeVariant?: "amber" | "green";
  highlighted?: boolean;     // indigo background
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
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl p-6",
        highlighted
          ? "bg-indigo-600 text-white shadow-xl ring-1 ring-indigo-500"
          : "bg-white ring-1 ring-gray-200 shadow-sm"
      )}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className={cn(
              "rounded-full px-4 py-1 text-xs font-semibold whitespace-nowrap",
              badgeVariant === "green"
                ? "bg-green-100 text-green-800"
                : "bg-amber-400 text-amber-900"
            )}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <h3
          className={cn(
            "text-lg font-bold",
            highlighted ? "text-white" : "text-gray-900"
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            "mt-1 text-sm",
            highlighted ? "text-indigo-200" : "text-gray-500"
          )}
        >
          {description}
        </p>

        {/* Price */}
        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "text-4xl font-extrabold",
                highlighted ? "text-white" : "text-gray-900"
              )}
            >
              {price === 0 ? "€0" : `€${price}`}
            </span>
            {price > 0 && (
              <span
                className={cn(
                  "text-sm font-medium",
                  highlighted ? "text-indigo-200" : "text-gray-400"
                )}
              >
                {perMonth}
              </span>
            )}
          </div>
          {billingNote && (
            <p
              className={cn(
                "mt-1 text-xs",
                highlighted ? "text-indigo-200" : "text-gray-400"
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
          "mb-5 border-t",
          highlighted ? "border-indigo-500" : "border-gray-100"
        )}
      />

      {/* Features */}
      <ul className="mb-6 flex-1 space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <div
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                highlighted ? "bg-indigo-500" : "bg-indigo-50"
              )}
            >
              <Check
                className={cn(
                  "h-3 w-3",
                  highlighted ? "text-white" : "text-indigo-600"
                )}
              />
            </div>
            <span
              className={cn(
                "text-sm",
                highlighted ? "text-indigo-100" : "text-gray-600"
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
        size="lg"
        className={cn(
          "mt-auto w-full font-semibold",
          highlighted
            ? "bg-white text-indigo-700 hover:bg-indigo-50"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        )}
      >
        {currentPlan ? "Current plan" : ctaLabel}
      </Button>
    </div>
  );
}
