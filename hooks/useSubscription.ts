/**
 * useSubscription — check if user has an active Pro subscription
 */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PLANS } from "@/lib/plans";

export function useSubscription(currentPlan: "FREE" | "PRO" = "FREE") {
  const [loading, setLoading] = useState(false);

  const isPro = currentPlan === "PRO";

  async function upgradeToPro() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: PLANS.PRO.priceId }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch {
      toast.error("Failed to open billing portal. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return { isPro, loading, upgradeToPro, openPortal };
}
