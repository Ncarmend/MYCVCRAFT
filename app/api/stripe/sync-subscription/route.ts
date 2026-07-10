/**
 * POST /api/stripe/sync-subscription
 * Syncs the user's Premium access state from Stripe to the DB.
 * Called client-side when the user returns from checkout (?success=true)
 * to bridge the race window before webhooks are processed.
 *
 * Handles both subscription purchases (monthly/annual) and one-time pass purchases.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { isProUser, getPassState } from "@/lib/isPro";

interface StripeSubRaw {
  current_period_end: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

function stripePlan(status: string): "PRO" | "FREE" {
  return status === "active" ? "PRO" : "FREE";
}

function stripeDbStatus(status: string): "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE" {
  if (status === "active") return "ACTIVE";
  if (status === "canceled") return "CANCELED";
  if (status === "past_due") return "PAST_DUE";
  return "INCOMPLETE";
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("[stripe:sync] Starting for user", user.id, user.email);

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { subscription: true },
  });

  const sub = dbUser?.subscription;
  console.log("[stripe:sync] DB before sync", {
    plan: sub?.plan,
    status: sub?.status,
    customerId: sub?.stripeCustomerId,
    premiumPassEnd: sub?.premiumPassEnd,
  });

  // If the pass is already active in DB (webhook already processed), return immediately.
  const passState = getPassState(sub);
  if (passState.active) {
    console.log("[stripe:sync] Pass already active in DB, passEnd=", passState.end);
    return NextResponse.json({ synced: true, plan: "PASS", passEnd: passState.end?.toISOString() });
  }

  // Check if a recent pass checkout session exists in Stripe (webhook race fallback)
  if (user.email) {
    const customers = await stripe.customers.list({ email: user.email, limit: 1 }).catch(() => null);
    const customer = customers?.data[0];
    if (customer) {
      const sessions = await stripe.checkout.sessions.list({
        customer: customer.id,
        limit: 5,
      }).catch(() => null);

      const passSession = sessions?.data.find(
        (s) => s.mode === "payment" &&
               s.payment_status === "paid" &&
               s.metadata?.productType === "PREMIUM_PASS"
      );

      if (passSession) {
        const passEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await prisma.subscription.upsert({
          where: { userId: dbUser!.id },
          create: {
            userId: dbUser!.id,
            stripeCustomerId: customer.id,
            premiumPassEnd: passEnd,
            plan: "FREE",
            status: "ACTIVE",
          },
          update: {
            stripeCustomerId: customer.id,
            premiumPassEnd: passEnd,
          },
        });
        console.log("[stripe:sync] Pass set via session fallback, passEnd=", passEnd);
        return NextResponse.json({ synced: true, plan: "PASS", passEnd: passEnd.toISOString() });
      }
    }
  }

  // Subscription sync path (monthly / annual)
  let stripeSubscription: Stripe.Subscription | null = null;

  if (sub?.stripeSubscriptionId) {
    stripeSubscription = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId)
      .catch((err) => { console.warn("[stripe:sync] retrieve by sub ID failed:", err.message); return null; });
  }

  if (!stripeSubscription && sub?.stripeCustomerId) {
    const list = await stripe.subscriptions.list({ customer: sub.stripeCustomerId, limit: 1, status: "all" }).catch(() => null);
    stripeSubscription = list?.data[0] ?? null;
    if (stripeSubscription) console.log("[stripe:sync] Found via customer ID");
  }

  if (!stripeSubscription && user.email) {
    const customers = await stripe.customers.list({ email: user.email, limit: 1 }).catch(() => null);
    const customer = customers?.data[0];
    if (customer) {
      console.log("[stripe:sync] Found customer by email", customer.id);
      const list = await stripe.subscriptions.list({ customer: customer.id, limit: 1, status: "all" }).catch(() => null);
      stripeSubscription = list?.data[0] ?? null;
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
          update: { stripeCustomerId: customer.id },
        });
      }
    }
  }

  if (!stripeSubscription) {
    console.warn("[stripe:sync] No Stripe subscription or pass found for user", user.id);
    return NextResponse.json({ synced: false, reason: "no_stripe_data" });
  }

  const raw = stripeSubscription as unknown as StripeSubRaw;
  const plan = stripePlan(stripeSubscription.status);
  const status = stripeDbStatus(stripeSubscription.status);

  console.log("[stripe:sync] Subscription found", { id: stripeSubscription.id, stripeStatus: stripeSubscription.status, plan });

  await prisma.subscription.update({
    where: { userId: dbUser!.id },
    data: {
      plan,
      status,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0]?.price.id,
      stripeCurrentPeriodEnd: new Date(raw.current_period_end * 1000),
    },
  });

  console.log("[stripe:sync] DB updated →", { userId: dbUser!.id, plan, status });
  return NextResponse.json({ synced: true, plan, status });
}
