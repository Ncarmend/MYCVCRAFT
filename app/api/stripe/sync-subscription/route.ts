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

interface StripeSubRaw {
  current_period_end: number;
  trial_end: number | null;
}

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

  console.log("[stripe:sync] Starting for user", user.id, user.email);

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { subscription: true },
  });

  console.log("[stripe:sync] DB subscription before sync", {
    plan: dbUser?.subscription?.plan,
    status: dbUser?.subscription?.status,
    customerId: dbUser?.subscription?.stripeCustomerId,
    subscriptionId: dbUser?.subscription?.stripeSubscriptionId,
    trialEnd: dbUser?.subscription?.trialEnd,
  });

  let stripeSubscription: Stripe.Subscription | null = null;

  // Try subscription ID first (fastest path — already in DB after checkout.session.completed)
  if (dbUser?.subscription?.stripeSubscriptionId) {
    stripeSubscription = await stripe.subscriptions
      .retrieve(dbUser.subscription.stripeSubscriptionId)
      .catch((err) => {
        console.warn("[stripe:sync] retrieve by sub ID failed:", err.message);
        return null;
      });
  }

  // Fall back to listing by customer ID
  if (!stripeSubscription && dbUser?.subscription?.stripeCustomerId) {
    const list = await stripe.subscriptions
      .list({ customer: dbUser.subscription.stripeCustomerId, limit: 1, status: "all" })
      .catch(() => null);
    stripeSubscription = list?.data[0] ?? null;
    if (stripeSubscription) console.log("[stripe:sync] Found via customer ID");
  }

  // Last resort: search Stripe by email (handles webhook race condition where DB
  // has no stripeCustomerId yet — checkout.session.completed may not have arrived)
  if (!stripeSubscription && user.email) {
    const customers = await stripe.customers
      .list({ email: user.email, limit: 1 })
      .catch(() => null);
    const customer = customers?.data[0];
    if (customer) {
      console.log("[stripe:sync] Found customer by email", customer.id);
      const list = await stripe.subscriptions
        .list({ customer: customer.id, limit: 1, status: "all" })
        .catch(() => null);
      stripeSubscription = list?.data[0] ?? null;

      // Bootstrap the DB record if it doesn't yet have a customer ID
      if (stripeSubscription && dbUser) {
        const raw = stripeSubscription as unknown as StripeSubRaw;
        await prisma.subscription.upsert({
          where: { userId: dbUser.id },
          create: {
            userId: dbUser.id,
            stripeCustomerId: customer.id,
            stripeSubscriptionId: stripeSubscription.id,
            plan: stripePlan(stripeSubscription.status),
            status: stripeDbStatus(stripeSubscription.status),
            trialEnd: raw.trial_end ? new Date(raw.trial_end * 1000) : null,
          },
          update: { stripeCustomerId: customer.id },
        });
      }
    }
  }

  if (!stripeSubscription) {
    console.warn("[stripe:sync] No Stripe subscription found for user", user.id);
    return NextResponse.json({ synced: false, reason: "no_stripe_subscription" });
  }

  const raw = stripeSubscription as unknown as StripeSubRaw;
  const plan = stripePlan(stripeSubscription.status);
  const status = stripeDbStatus(stripeSubscription.status);

  console.log("[stripe:sync] Stripe subscription found", {
    id: stripeSubscription.id,
    stripeStatus: stripeSubscription.status,
    plan,
    dbStatus: status,
    trialEnd: raw.trial_end,
  });

  await prisma.subscription.update({
    where: { userId: dbUser!.id },
    data: {
      plan,
      status,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0]?.price.id,
      stripeCurrentPeriodEnd: new Date(raw.current_period_end * 1000),
      trialEnd: raw.trial_end ? new Date(raw.trial_end * 1000) : null,
    },
  });

  console.log("[stripe:sync] DB updated →", { userId: dbUser!.id, plan, status });

  return NextResponse.json({ synced: true, plan, status });
}
