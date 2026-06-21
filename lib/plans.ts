/**
 * Subscription plan definitions — safe to import in Client Components.
 * Does NOT import the Stripe SDK or any server-only modules.
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
  PRO: {
    name: "Premium",
    // Monthly Stripe price ID
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    // Annual Stripe price ID
    priceIdAnnual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? null,
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
