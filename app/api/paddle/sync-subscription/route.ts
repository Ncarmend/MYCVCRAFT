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

  // SECURITY: the transaction ID comes from the browser and is not proof of
  // anything on its own. Every checkout is created server-side with
  // customData.userId (see createCheckoutTransaction), so require that it
  // belongs to the caller — otherwise any Paddle transaction ID (someone
  // else's, or an abandoned checkout) could be used to grant Premium.
  if (transaction.customData?.userId !== dbUser.id) {
    console.warn("[paddle:sync] Transaction does not belong to caller", { transactionId: transaction.id, userId: dbUser.id });
    return NextResponse.json({ synced: false, reason: "forbidden" }, { status: 403 });
  }

  // Only paid transactions grant access. A checkout that was opened but not
  // paid ("draft"/"ready") must not unlock anything; if payment is still being
  // processed, the signed transaction.completed webhook will finish the job.
  if (transaction.status !== "paid" && transaction.status !== "completed") {
    return NextResponse.json({ synced: false, reason: "not_paid" });
  }

  const isPass = transaction.customData?.productType === "PREMIUM_PASS";

  if (isPass) {
    // Date the 7 days from the payment, not from "now": otherwise the same
    // transaction ID could be re-submitted every week to extend the pass forever.
    const paidAt = new Date(transaction.billedAt ?? transaction.createdAt);
    const passEnd = new Date(paidAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (passEnd <= new Date()) {
      return NextResponse.json({ synced: false, reason: "pass_expired" });
    }
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

  // Subscriptions inherit customData from their checkout transaction; reject a
  // mismatch so a paid transaction can't be pointed at someone else's subscription.
  const subscriptionOwner = subscription.customData?.userId;
  if (subscriptionOwner && subscriptionOwner !== dbUser.id) {
    console.warn("[paddle:sync] Subscription does not belong to caller", { subscriptionId: subscription.id, userId: dbUser.id });
    return NextResponse.json({ synced: false, reason: "forbidden" }, { status: 403 });
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
