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
      "AI generation",
      "Watermarked PDF",
      "Basic ATS check",
    ],
  },
  PRO: {
    name: "Pro",
    // Read at runtime server-side via the API; safe to be undefined on client
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    price: 12,
    cvLimit: Infinity,
    features: [
      "Unlimited CVs",
      "All templates",
      "Advanced AI optimization",
      "PDF export (no watermark)",
      "Job description matching",
      "Cover letter generator",
      "ATS score + suggestions",
      "Priority support",
    ],
  },
} as const;
