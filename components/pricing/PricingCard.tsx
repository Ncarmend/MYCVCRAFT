/**
 * Individual pricing plan card
 */
"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  priceId?: string | null;
  currentPlan?: boolean;
  onSelect: () => void;
  loading?: boolean;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
  currentPlan = false,
  onSelect,
  loading = false,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-8",
        highlighted
          ? "bg-indigo-600 text-white shadow-2xl ring-1 ring-indigo-500 scale-105"
          : "bg-white ring-1 ring-gray-200 shadow-sm"
      )}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-amber-400 px-4 py-1 text-xs font-semibold text-amber-900">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3
          className={cn(
            "text-lg font-semibold",
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
        <div className="mt-4 flex items-baseline gap-1">
          <span
            className={cn(
              "text-4xl font-bold",
              highlighted ? "text-white" : "text-gray-900"
            )}
          >
            ${price}
          </span>
          {price > 0 && (
            <span
              className={cn(
                "text-sm",
                highlighted ? "text-indigo-200" : "text-gray-400"
              )}
            >
              /month
            </span>
          )}
        </div>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full",
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

      <Button
        onClick={onSelect}
        loading={loading}
        disabled={currentPlan}
        variant={highlighted ? "secondary" : "primary"}
        size="lg"
        className={cn(
          "w-full",
          highlighted &&
            "bg-white text-indigo-700 hover:bg-indigo-50 border-0"
        )}
      >
        {currentPlan ? "Current plan" : price === 0 ? "Get started free" : "Start 7-day trial"}
      </Button>
    </div>
  );
}
