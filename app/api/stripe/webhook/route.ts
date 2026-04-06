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

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
            status: sub.status === "active" ? "ACTIVE"
              : sub.status === "canceled" ? "CANCELED"
              : sub.status === "past_due" ? "PAST_DUE"
              : "INCOMPLETE",
            plan: sub.status === "active" ? "PRO" : "FREE",
          },
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
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error(`[Stripe Webhook] Error handling ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
