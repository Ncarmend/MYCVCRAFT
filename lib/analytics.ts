"use client";

/**
 * Thin, typed wrappers around GTM's dataLayer push (sendGTMEvent).
 * Each function pushes one `event` name to window.dataLayer — in GTM,
 * create a "Custom Event" trigger matching that name, then attach a GA4
 * Event tag (or any other tag) to it. Params below become dataLayer
 * variables you can reference in GTM as {{DLV - <key>}}.
 */
import { sendGTMEvent } from "@next/third-parties/google";

export function trackSignUp(method: "email" | "google" | "github") {
  sendGTMEvent({ event: "sign_up", method });
}

export function trackBeginCheckout(params: {
  planType: "PASS" | "MONTHLY" | "ANNUAL";
  value: number;
  currency?: string;
}) {
  sendGTMEvent({
    event: "checkout",
    plan_type: params.planType,
    value: params.value,
    currency: params.currency ?? "EUR",
  });
}

export function trackPurchase(params: {
  transactionId: string;
  value: number;
  currency: string;
  planType: "PASS" | "MONTHLY" | "ANNUAL";
}) {
  sendGTMEvent({
    event: "purchase",
    transaction_id: params.transactionId,
    value: params.value,
    currency: params.currency,
    plan_type: params.planType,
  });
}

export function trackCvDownloaded(params: { cvId: string; template?: string }) {
  sendGTMEvent({ event: "cv_downloaded", cv_id: params.cvId, template: params.template });
}

export function trackCoverLetterCreated(params: { cvId?: string }) {
  sendGTMEvent({ event: "cover_letter_created", cv_id: params.cvId });
}
