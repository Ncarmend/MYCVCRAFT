/**
 * Subscription plan definitions — safe to import in Client Components.
 * Does NOT import the Paddle SDK or any server-only modules.
 */

export const PLANS = {
  FREE: {
    name: "Free",
    priceId: null,
    price: 0,
    cvLimit: 1,
    features: [
      "1 CV",
      "2 templates",
      "Watermarked PDF",
    ],
  },
  PASS: {
    name: "7-Day Premium Pass",
    // One-time Paddle price ID — resolved server-side only
    priceId: null,
    price: 3.99,
    durationDays: 7,
    features: [
      "PDF export (no watermark)",
      "All Premium templates",
      "ATS optimization",
      "AI suggestions",
      "Customize for job postings",
      "Cover letter generation",
      "Resume import & improvement",
    ],
  },
  PRO: {
    name: "Premium",
    // Monthly Paddle price ID
    priceId: process.env.PADDLE_MONTHLY_PRICE_ID ?? null,
    // Annual Paddle price ID
    priceIdAnnual: process.env.PADDLE_YEARLY_PRICE_ID ?? null,
    // Displayed prices
    price: 12,           // backward compat (monthly)
    priceMonthly: 12,
    priceAnnual: 9,      // per month, billed annually
    priceAnnualTotal: 108,
    cvLimit: Infinity,
    features: [
      "Unlimited CVs",
      "All templates",
      "AI summary generation",
      "AI bullet point generation",
      "ATS score + suggestions",
      "Job description matching",
      "Cover letter generator",
      "PDF export (no watermark)",
      "Priority support",
    ],
  },
} as const;

/**
 * Resolve which UI plan tier a stored Paddle price ID corresponds to.
 * Centralizes the MONTHLY-vs-ANNUAL inference so it isn't duplicated
 * across API routes and server components.
 */
export function getPlanTypeFromPriceId(
  priceId: string | null | undefined
): "MONTHLY" | "ANNUAL" | null {
  if (!priceId) return null;
  if (priceId === process.env.PADDLE_YEARLY_PRICE_ID) return "ANNUAL";
  if (priceId === process.env.PADDLE_MONTHLY_PRICE_ID) return "MONTHLY";
  return null;
}
