/**
 * GET /api/subscription/status
 * Returns the current user's subscription state in a single verified response.
 * All fields are read directly from the DB (not from Paddle, not from the JWT).
 *
 * Fields returned:
 *   plan                — "FREE" | "PRO"
 *   subscription_status — "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE" | "PAUSED"
 *   pass_active         — true when premiumPassEnd is in the future
 *   pass_end            — ISO string | null
 *   customer_id         — Paddle customer ID | null
 *   subscription_id     — Paddle subscription ID | null
 *   current_period_end  — ISO string | null
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isProUser, getPassState } from "@/lib/isPro";
import { getPlanTypeFromPriceId } from "@/lib/plans";
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
  const { active: passActive, end: passEnd } = getPassState(sub);

  // Determine which specific plan tier is active for UI display
  let planType: "FREE" | "PASS" | "MONTHLY" | "ANNUAL" = "FREE";
  if (passActive) {
    planType = "PASS";
  } else if (sub?.plan === "PRO") {
    planType = getPlanTypeFromPriceId(sub.paddlePriceId) ?? "MONTHLY";
  }

  const payload = {
    plan: sub?.plan ?? "FREE",
    plan_type: planType,
    subscription_status: sub?.status ?? "ACTIVE",
    is_pro: isProUser(sub),
    pass_active: passActive,
    pass_end: passEnd?.toISOString() ?? null,
    customer_id: sub?.paddleCustomerId ?? null,
    subscription_id: sub?.paddleSubscriptionId ?? null,
    current_period_end: sub?.paddleCurrentPeriodEnd?.toISOString() ?? null,
  };

  console.log("[subscription:status]", { userId: user.id, ...payload });

  return NextResponse.json(payload);
}
