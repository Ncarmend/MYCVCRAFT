/**
 * GET /api/subscription/status
 * Returns the current user's subscription state in a single verified response.
 * All fields are read directly from the DB (not from Stripe, not from the JWT).
 *
 * Fields returned:
 *   plan                — "FREE" | "PRO"
 *   subscription_status — "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE"
 *   trial_active        — true when plan=PRO and trial has not yet expired
 *   trial_end           — ISO string | null
 *   customer_id         — Stripe customer ID | null
 *   subscription_id     — Stripe subscription ID | null
 *   current_period_end  — ISO string | null
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { subscription: true },
  });

  const sub = dbUser?.subscription;
  const now = new Date();
  const trialActive =
    sub?.plan === "PRO" &&
    sub?.trialEnd !== null &&
    sub?.trialEnd !== undefined &&
    sub.trialEnd > now;

  const payload = {
    plan: sub?.plan ?? "FREE",
    subscription_status: sub?.status ?? "ACTIVE",
    trial_active: trialActive,
    trial_end: sub?.trialEnd?.toISOString() ?? null,
    customer_id: sub?.stripeCustomerId ?? null,
    subscription_id: sub?.stripeSubscriptionId ?? null,
    current_period_end: sub?.stripeCurrentPeriodEnd?.toISOString() ?? null,
  };

  console.log("[subscription:status]", { userId: user.id, ...payload });

  return NextResponse.json(payload);
}
