"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Invisible component rendered on /dashboard?success=true&transaction_id=...
 *
 * Flow:
 * 1. Call /api/paddle/sync-subscription with the transaction ID from the Paddle.js
 *    checkout.completed event → fetches the live Paddle transaction/subscription
 *    state → writes to DB. This is a fast-path reconciliation; the webhook is the
 *    source of truth and will also process the same purchase independently.
 * 2. Show feedback toast
 * 3. Hard-redirect to /dashboard (window.location, not router.replace) so the
 *    browser loads a completely fresh page — bypasses the Next.js router cache
 *    and guarantees all server components re-read the updated plan from the DB.
 *
 * Why hard redirect instead of router.refresh() + router.replace()?
 * router.refresh() and router.replace() are both async tasks queued in the same
 * tick. The navigation can complete before the cache invalidation settles, which
 * causes the dashboard to render the old "Free" plan for an extra render cycle.
 * window.location.replace() is a guaranteed full-page reload — no stale cache.
 */
export function SubscriptionSuccessSync({ transactionId }: { transactionId?: string }) {
  useEffect(() => {
    const toastId = toast.loading("Activating your Premium account…");

    fetch("/api/paddle/sync-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({})) as {
          synced?: boolean;
          plan?: string;
          reason?: string;
        };
        console.log("[sync] response", data);
        if (data.synced && (data.plan === "PRO" || data.plan === "PASS")) {
          toast.success("Premium active — all features are now unlocked!", { id: toastId, duration: 3000 });
        } else {
          toast.info("Account updated — setting up your Premium access…", { id: toastId, duration: 2000 });
        }
      })
      .catch((err) => {
        console.error("[sync] failed", err);
        toast.error("Could not confirm subscription. Please refresh the page.", { id: toastId });
      })
      .finally(() => {
        // Wait for the toast to be visible before redirecting
        setTimeout(() => {
          window.location.replace("/dashboard");
        }, 1600);
      });
  }, [transactionId]);

  return null;
}
