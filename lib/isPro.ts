/**
 * Shared helper for checking if a user has active Premium access.
 *
 * Two paths to Premium:
 *   1. Subscription — plan === "PRO" (monthly / annual)
 *   2. Premium Pass — one-time €3.99 purchase that grants 7 days of access
 *
 * Safe to import in server components and API routes.
 * Never import from client components (use the plan prop passed from the server).
 */

type SubscriptionLike = {
  plan: string;
  premiumPassEnd?: Date | null;
} | null | undefined;

/** Returns true if the user has active Premium access via subscription OR pass. */
export function isProUser(subscription: SubscriptionLike): boolean {
  if (!subscription) return false;
  if (subscription.plan === "PRO") return true;
  if (subscription.premiumPassEnd && subscription.premiumPassEnd > new Date()) return true;
  return false;
}

/** Returns true (and the expiry date) if the user's access comes from the 7-day pass. */
export function getPassState(subscription: SubscriptionLike): { active: boolean; end: Date | null; daysLeft: number } {
  const end = subscription?.premiumPassEnd ?? null;
  const active = !!(end && end > new Date());
  const daysLeft = active ? Math.max(1, Math.ceil((end!.getTime() - Date.now()) / 86_400_000)) : 0;
  return { active, end, daysLeft };
}
