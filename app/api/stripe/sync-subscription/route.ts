/**
 * POST /api/stripe/sync-subscription
 * Fetches the user's live Stripe subscription and writes it to the DB.
 * Called client-side when the user returns from Stripe checkout (?success=true)
 * to handle the race window before webhooks are processed.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

function stripePlan(status: string): "PRO" | "FREE" {
  return status === "active" || status === "trialing" ? "PRO" : "FREE";
}

function stripeDbStatus(
  status: string
): "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE" {
  if (status === "active" || status === "trialing") return "ACTIVE";
  if (status === "canceled") return "CANCELED";
  if (status === "past_due") return "PAST_DUE";
  return "INCOMPLETE";
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { subscription: true },
  });

  let stripeSubscription: Stripe.Subscription | null = null;

  // Try subscription ID first (fastest path, already in DB after checkout.session.completed)
  if (dbUser?.subscription?.stripeSubscriptionId) {
    stripeSubscription = await stripe.subscriptions
      .retrieve(dbUser.subscription.stripeSubscriptionId)
      .catch(() => null);
  }

  // Fall back to listing by customer ID
  if (!stripeSubscription && dbUser?.subscription?.stripeCustomerId) {
    const list = await stripe.subscriptions
      .list({ customer: dbUser.subscription.stripeCustomerId, limit: 1, status: "all" })
      .catch(() => null);
    stripeSubscription = list?.data[0] ?? null;
  }

  // Last resort: search Stripe by email (handles the case where webhook hasn't
  // fired yet and no stripeCustomerId is stored in DB)
  if (!stripeSubscription && user.email) {
    const customers = await stripe.customers
      .list({ email: user.email, limit: 1 })
      .catch(() => null);
    const customer = customers?.data[0];
    if (customer) {
      const list = await stripe.subscriptions
        .list({ customer: customer.id, limit: 1, status: "all" })
        .catch(() => null);
      stripeSubscription = list?.data[0] ?? null;

      // If we found a subscription but the DB record has no customer ID, upsert it now
      if (stripeSubscription && dbUser) {
        await prisma.subscription.upsert({
          where: { userId: dbUser.id },
          create: {
            userId: dbUser.id,
            stripeCustomerId: customer.id,
            stripeSubscriptionId: stripeSubscription.id,
            plan: stripePlan(stripeSubscription.status),
            status: stripeDbStatus(stripeSubscription.status),
          },
          update: {
            stripeCustomerId: customer.id,
          },
        });
      }
    }
  }

  if (!stripeSubscription) {
    return NextResponse.json({ synced: false, reason: "no_stripe_subscription" });
  }

  const plan = stripePlan(stripeSubscription.status);
  const status = stripeDbStatus(stripeSubscription.status);

  await prisma.subscription.update({
    where: { userId: dbUser!.id },
    data: {
      plan,
      status,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0]?.price.id,
      stripeCurrentPeriodEnd: new Date(
        (stripeSubscription as unknown as { current_period_end: number })
          .current_period_end * 1000
      ),
    },
  });

  return NextResponse.json({ synced: true, plan, status });
}
