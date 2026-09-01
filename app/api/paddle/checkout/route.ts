/**
 * POST /api/paddle/checkout
 * Pre-creates a Paddle transaction for the selected plan.
 *
 * Accepts { planType: "MONTHLY" | "ANNUAL" | "PASS" } in the request body.
 * All price IDs are resolved server-side — never exposed to the browser.
 * Paddle Billing checkout is a client-side overlay (Paddle.js), so this route
 * returns { transactionId } rather than a redirect URL — the client opens
 * Paddle.Checkout.open({ transactionId }).
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutTransaction } from "@/lib/paddle";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { subscription: true },
    });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await request.json().catch(() => ({})) as { planType?: string };
    const customerId = dbUser.subscription?.paddleCustomerId || undefined;

    console.log("[paddle:checkout] Creating transaction", { userId: dbUser.id, planType: body.planType });

    if (body.planType === "PASS") {
      const priceId = process.env.PADDLE_PASS_PRICE_ID;
      if (!priceId) return NextResponse.json({ error: "Pass price not configured" }, { status: 500 });
      const transaction = await createCheckoutTransaction({
        priceId,
        userId: dbUser.id,
        customerId,
        isPass: true,
      });
      console.log("[paddle:checkout] Pass transaction created", { transactionId: transaction.id });
      return NextResponse.json({ transactionId: transaction.id });
    }

    // Monthly or Annual subscription
    const isAnnual = body.planType === "ANNUAL";
    const priceId = isAnnual
      ? process.env.PADDLE_YEARLY_PRICE_ID
      : process.env.PADDLE_MONTHLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: `Paddle price not configured for plan: ${body.planType ?? "MONTHLY"}` },
        { status: 500 }
      );
    }

    const transaction = await createCheckoutTransaction({
      priceId,
      userId: dbUser.id,
      customerId,
    });

    console.log("[paddle:checkout] Subscription transaction created", { transactionId: transaction.id });
    return NextResponse.json({ transactionId: transaction.id });
  } catch (err) {
    console.error("[paddle:checkout] Error", err);
    return NextResponse.json({ error: "Checkout transaction creation failed" }, { status: 500 });
  }
}
