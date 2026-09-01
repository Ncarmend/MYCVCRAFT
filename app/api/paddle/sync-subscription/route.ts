/**
 * POST /api/paddle/sync-subscription
 * Syncs the user's Premium access state from Paddle to the DB.
 * Called client-side the moment Paddle.js reports checkout.completed, passing
 * the transaction ID — this reconciles immediately rather than waiting on the
 * webhook, since Paddle checkout is an in-page overlay (no redirect round-trip).
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { getPaddle, subscriptionFields } from "@/lib/paddle";
import { getPassState } from "@/lib/isPro";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({})) as { transactionId?: string };
  if (!body.transactionId) {
    return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { subscription: true },
  });
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  console.log("[paddle:sync] Starting for user", user.id, "transaction", body.transactionId);

  // If the pass is already active in DB (webhook already processed), return immediately.
  const passState = getPassState(dbUser.subscription);
  if (passState.active) {
    console.log("[paddle:sync] Pass already active in DB, passEnd=", passState.end);
    return NextResponse.json({ synced: true, plan: "PASS", passEnd: passState.end?.toISOString() });
  }

  const paddle = getPaddle();
  const transaction = await paddle.transactions.get(body.transactionId).catch((err) => {
    console.warn("[paddle:sync] transaction fetch failed:", err.message);
    return null;
  });

  if (!transaction) {
    return NextResponse.json({ synced: false, reason: "transaction_not_found" });
  }

  const isPass = transaction.customData?.productType === "PREMIUM_PASS";

  if (isPass) {
    const passEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.subscription.upsert({
      where: { userId: dbUser.id },
      create: {
        userId: dbUser.id,
        paddleCustomerId: transaction.customerId ?? undefined,
        premiumPassEnd: passEnd,
        plan: "FREE",
        status: "ACTIVE",
      },
      update: {
        paddleCustomerId: transaction.customerId ?? undefined,
        premiumPassEnd: passEnd,
      },
    });
    console.log("[paddle:sync] Pass synced, passEnd=", passEnd);
    return NextResponse.json({ synced: true, plan: "PASS", passEnd: passEnd.toISOString() });
  }

  if (!transaction.subscriptionId) {
    console.warn("[paddle:sync] Transaction has no subscriptionId and is not a Pass", transaction.id);
    return NextResponse.json({ synced: false, reason: "no_subscription" });
  }

  const subscription = await paddle.subscriptions.get(transaction.subscriptionId).catch((err) => {
    console.warn("[paddle:sync] subscription fetch failed:", err.message);
    return null;
  });

  if (!subscription) {
    return NextResponse.json({ synced: false, reason: "subscription_not_found" });
  }

  const fields = subscriptionFields(subscription);
  await prisma.subscription.upsert({
    where: { userId: dbUser.id },
    create: { userId: dbUser.id, ...fields },
    update: fields,
  });

  console.log("[paddle:sync] Subscription synced →", { userId: dbUser.id, ...fields });
  return NextResponse.json({ synced: true, plan: fields.plan, status: fields.status });
}
