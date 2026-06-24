/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events to sync subscription state
 *
 * IMPORTANT: This route must have raw body access.
 * Add to next.config.ts: api: { bodyParser: false }
 * Use `export const config = { api: { bodyParser: false } }` for Pages Router.
 * For App Router, we read the raw body via request.text().
 */
import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

// Map Stripe subscription status → DB plan (trialing counts as PRO access)
function stripePlan(status: string): "PRO" | "FREE" {
  return status === "active" || status === "trialing" ? "PRO" : "FREE";
}

// Map Stripe subscription status → DB SubscriptionStatus enum
function stripeDbStatus(
  status: string
): "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE" {
  if (status === "active" || status === "trialing") return "ACTIVE";
  if (status === "canceled") return "CANCELED";
  if (status === "past_due") return "PAST_DUE";
  return "INCOMPLETE";
}

function subFields(sub: Stripe.Subscription) {
  return {
    stripeSubscriptionId: sub.id,
    stripePriceId: sub.items.data[0]?.price.id,
    stripeCurrentPeriodEnd: new Date(
      (sub as unknown as { current_period_end: number }).current_period_end * 1000
    ),
    status: stripeDbStatus(sub.status),
    plan: stripePlan(sub.status),
  };
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(rawBody, signature);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Checkout completed — create or update the subscription record immediately.
      // Hardcode PRO/ACTIVE here; subscription.created / subscription.updated
      // events that follow will refine status via subFields().
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.metadata?.userId) {
          await prisma.subscription.upsert({
            where: { userId: session.metadata.userId },
            create: {
              userId: session.metadata.userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              plan: "PRO",
              status: "ACTIVE",
            },
            update: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              plan: "PRO",
              status: "ACTIVE",
            },
          });
        }
        break;
      }

      // Fires when a new subscription is created (including trial start).
      // Must be handled so that a trialing subscription is correctly saved as PRO.
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: sub.customer as string },
          data: subFields(sub),
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: sub.customer as string },
          data: { plan: "FREE", status: "CANCELED" },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: invoice.customer as string },
          data: { status: "PAST_DUE" },
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`[Stripe Webhook] Error handling ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
