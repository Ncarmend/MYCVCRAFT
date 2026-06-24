"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Invisible component rendered on /dashboard?success=true.
 * Calls the sync-subscription endpoint (which reads live Stripe state) then
 * refreshes the server components so Premium features unlock immediately,
 * without waiting for webhooks to be processed.
 */
export function SubscriptionSuccessSync() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/stripe/sync-subscription", { method: "POST" }).finally(() => {
      router.refresh();
      router.replace("/dashboard");
    });
  }, [router]);

  return null;
}
