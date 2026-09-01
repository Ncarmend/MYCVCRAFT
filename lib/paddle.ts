/**
 * Paddle server-only client + helpers.
 * NEVER import this file in Client Components — use lib/plans.ts instead.
 */
import { Paddle, Environment, EventName, type EventEntity } from "@paddle/paddle-node-sdk";
import type { Subscription as PaddleSubscription, SubscriptionNotification } from "@paddle/paddle-node-sdk";

// Lazy singleton — only constructed when first called (server-side only)
let _paddle: Paddle | null = null;

function getPaddle(): Paddle {
  if (!_paddle) {
    if (!process.env.PADDLE_API_KEY) {
      throw new Error("PADDLE_API_KEY is not set");
    }
    _paddle = new Paddle(process.env.PADDLE_API_KEY, {
      environment:
        process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
          ? Environment.production
          : Environment.sandbox,
    });
  }
  return _paddle;
}

/**
 * Pre-create a Paddle transaction for a plan purchase (subscription or one-time pass).
 * The client opens Paddle.js checkout against the returned transaction ID —
 * Paddle Billing checkout is an in-page overlay, not a hosted-page redirect.
 */
export async function createCheckoutTransaction({
  priceId,
  userId,
  customerId,
  isPass,
}: {
  priceId: string;
  userId: string;
  customerId?: string;
  isPass?: boolean;
}) {
  return getPaddle().transactions.create({
    items: [{ priceId, quantity: 1 }],
    ...(customerId ? { customerId } : {}),
    customData: isPass ? { userId, productType: "PREMIUM_PASS" } : { userId },
  });
}

/**
 * Create a Paddle Customer Portal session for subscription management
 * (view invoices, update payment method, cancel).
 */
export async function createPortalSession({
  customerId,
  subscriptionIds,
}: {
  customerId: string;
  subscriptionIds?: string[];
}) {
  return getPaddle().customerPortalSessions.create(customerId, subscriptionIds ?? []);
}

/** Verify and parse a Paddle webhook event. Throws if the signature is invalid. */
export async function verifyWebhook(rawBody: string, signature: string): Promise<EventEntity> {
  return getPaddle().webhooks.unmarshal(
    rawBody,
    process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET!,
    signature
  );
}

// --- Shared status/plan mapping (used by both the webhook and the post-checkout sync route) ---

/** Map Paddle subscription status → DB plan. */
export function paddlePlan(status: string): "PRO" | "FREE" {
  return status === "active" || status === "trialing" ? "PRO" : "FREE";
}

/** Map Paddle subscription status → DB SubscriptionStatus enum. */
export function paddleDbStatus(
  status: string
): "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE" | "PAUSED" {
  if (status === "active" || status === "trialing") return "ACTIVE";
  if (status === "canceled") return "CANCELED";
  if (status === "past_due") return "PAST_DUE";
  if (status === "paused") return "PAUSED";
  return "INCOMPLETE";
}

/** Build the Subscription-row fields to write for a given Paddle subscription object. */
export function subscriptionFields(sub: PaddleSubscription | SubscriptionNotification) {
  return {
    paddleCustomerId: sub.customerId,
    paddleSubscriptionId: sub.id,
    paddlePriceId: sub.items[0]?.price?.id,
    paddleCurrentPeriodEnd: sub.currentBillingPeriod?.endsAt
      ? new Date(sub.currentBillingPeriod.endsAt)
      : null,
    status: paddleDbStatus(sub.status),
    plan: paddlePlan(sub.status),
  };
}

export { getPaddle, EventName };
