/**
 * POST /api/paddle/webhook
 * Handles Paddle Billing webhook events to sync subscription state.
 *
 * Raw body access is required for signature verification — read via request.text().
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook, EventName, subscriptionFields } from "@/lib/paddle";
import prisma from "@/lib/prisma";
import type { SubscriptionNotification, TransactionNotification } from "@paddle/paddle-node-sdk";

/** Every subscription lifecycle event carries the original customData — use userId as the primary key. */
async function upsertSubscriptionEvent(sub: SubscriptionNotification) {
  const userId = sub.customData?.userId as string | undefined;
  const fields = subscriptionFields(sub);
  console.log("[paddle:webhook:sub]", { id: sub.id, customerId: sub.customerId, paddleStatus: sub.status, ...fields });

  if (userId) {
    await prisma.subscription.upsert({
      where: { userId },
      create: { userId, ...fields },
      update: fields,
    });
    return;
  }

  // Defensive fallback if customData is ever missing on an update event.
  const updated = await prisma.subscription.updateMany({
    where: { paddleCustomerId: sub.customerId },
    data: fields,
  });
  console.log("[paddle:webhook:sub] fallback update by customerId", { count: updated.count });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing paddle-signature" }, { status: 400 });
  }

  let event;
  try {
    event = await verifyWebhook(rawBody, signature);
  } catch (err) {
    console.error("[paddle:webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  console.log("[paddle:webhook] Received:", event.eventType);

  try {
    switch (event.eventType) {
      case EventName.TransactionCompleted: {
        const transaction = event.data as TransactionNotification;
        const userId = transaction.customData?.userId as string | undefined;
        const isPass = transaction.customData?.productType === "PREMIUM_PASS";

        console.log("[paddle:webhook:transaction] completed", {
          userId,
          customerId: transaction.customerId,
          subscriptionId: transaction.subscriptionId,
          isPass,
        });

        // Only the one-time Pass purchase is handled here — subscription
        // transactions are fully reconciled via the subscription.* events below.
        if (userId && isPass) {
          const passEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
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
          console.log("[paddle:webhook:transaction] Pass → premiumPassEnd=", passEnd, "userId=", userId);
        }
        break;
      }

      case EventName.TransactionPaymentFailed: {
        const transaction = event.data as TransactionNotification;
        console.log("[paddle:webhook:transaction] payment_failed", { customerId: transaction.customerId });
        if (transaction.customerId) {
          await prisma.subscription.updateMany({
            where: { paddleCustomerId: transaction.customerId },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }

      case EventName.SubscriptionCreated:
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionResumed:
      case EventName.SubscriptionTrialing: {
        const sub = event.data as SubscriptionNotification;
        await upsertSubscriptionEvent(sub);
        break;
      }

      case EventName.SubscriptionPastDue: {
        const sub = event.data as SubscriptionNotification;
        await upsertSubscriptionEvent(sub);
        break;
      }

      case EventName.SubscriptionPaused: {
        const sub = event.data as SubscriptionNotification;
        await upsertSubscriptionEvent(sub);
        break;
      }

      case EventName.SubscriptionCanceled: {
        const sub = event.data as SubscriptionNotification;
        const userId = sub.customData?.userId as string | undefined;
        console.log("[paddle:webhook:sub.canceled]", { customerId: sub.customerId, userId });
        const data = { plan: "FREE" as const, status: "CANCELED" as const, premiumPassEnd: null };
        if (userId) {
          await prisma.subscription.upsert({
            where: { userId },
            create: { userId, paddleCustomerId: sub.customerId, ...data },
            update: data,
          });
        } else {
          await prisma.subscription.updateMany({
            where: { paddleCustomerId: sub.customerId },
            data,
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`[paddle:webhook] Error handling ${event.eventType}:`, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
