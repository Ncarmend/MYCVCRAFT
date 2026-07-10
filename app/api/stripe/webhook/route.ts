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

interface StripeSubRaw {
  current_period_end: number;
}

// Map Stripe subscription status → DB plan
function stripePlan(status: string): "PRO" | "FREE" {
  return status === "active" ? "PRO" : "FREE";
}

// Map Stripe subscription status → DB SubscriptionStatus enum
function stripeDbStatus(
  status: string
): "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE" {
  if (status === "active") return "ACTIVE";
  if (status === "canceled") return "CANCELED";
  if (status === "past_due") return "PAST_DUE";
  return "INCOMPLETE";
}

function subFields(sub: Stripe.Subscription) {
  const raw = sub as unknown as StripeSubRaw;
  const plan = stripePlan(sub.status);
  const status = stripeDbStatus(sub.status);

  console.log("[stripe:webhook:sub]", {
    id: sub.id,
    customer: sub.customer,
    stripeStatus: sub.status,
    plan,
    dbStatus: status,
  });

  return {
    stripeSubscriptionId: sub.id,
    stripePriceId: sub.items.data[0]?.price.id,
    stripeCurrentPeriodEnd: new Date(raw.current_period_end * 1000),
    status,
    plan,
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
    console.error("[stripe:webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  console.log("[stripe:webhook] Received:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        console.log("[stripe:webhook:checkout] session.completed", {
          userId,
          customer: session.customer,
          mode: session.mode,
          productType: session.metadata?.productType,
        });

        if (!userId) break;

        if (session.mode === "subscription") {
          // Monthly / Annual subscription purchase
          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
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
          console.log("[stripe:webhook:checkout] Subscription → plan=PRO userId=", userId);
        } else if (session.mode === "payment" && session.metadata?.productType === "PREMIUM_PASS") {
          // 7-Day Premium Pass one-time purchase
          const passEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeCustomerId: session.customer as string | undefined,
              premiumPassEnd: passEnd,
              plan: "FREE",
              status: "ACTIVE",
            },
            update: {
              stripeCustomerId: session.customer as string | undefined,
              premiumPassEnd: passEnd,
            },
          });
          console.log("[stripe:webhook:checkout] Pass → premiumPassEnd=", passEnd, "userId=", userId);
        }
        break;
      }

      // Fires when a new subscription is created (including trial start).
      // Must be handled so that a trialing subscription is correctly saved as PRO.
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const updated = await prisma.subscription.updateMany({
          where: { stripeCustomerId: sub.customer as string },
          data: subFields(sub),
        });
        console.log("[stripe:webhook:sub] DB updated", { count: updated.count, event: event.type });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        console.log("[stripe:webhook:sub.deleted]", { customer: sub.customer });
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: sub.customer as string },
          data: { plan: "FREE", status: "CANCELED", premiumPassEnd: null },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("[stripe:webhook:invoice.failed]", { customer: invoice.customer });
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
    console.error(`[stripe:webhook] Error handling ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
