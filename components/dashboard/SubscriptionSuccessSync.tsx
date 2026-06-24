"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Invisible component rendered on /dashboard?success=true.
 * Calls the sync-subscription endpoint (which reads live Stripe state) then
 * refreshes the server components so Premium features unlock immediately,
 * without waiting for webhooks to be processed.
 */
export function SubscriptionSuccessSync() {
  const router = useRouter();

  useEffect(() => {
    const toastId = toast.loading("Activating your Premium account…");

    fetch("/api/stripe/sync-subscription", { method: "POST" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (data.synced && data.plan === "PRO") {
          toast.success("Premium active! All features are now unlocked.", { id: toastId });
        } else {
          toast.dismiss(toastId);
        }
      })
      .catch(() => {
        toast.error("Could not confirm subscription status. Please refresh.", { id: toastId });
      })
      .finally(() => {
        router.refresh();
        router.replace("/dashboard");
      });
  }, [router]);

  return null;
}
