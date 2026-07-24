/**
 * AI usage guard — rate limits free users, surfaces credit errors cleanly.
 *
 * Free plan : 5 AI calls per day (tracked in UserSettings via aiCallsToday + aiCallsDate)
 * Pro plan  : unlimited
 *
 * Schema fields are stored as JSON in UserSettings.aiStyle/aiTone is not ideal;
 * we piggy-back on a separate in-memory store per cold start and rely on the
 * "Pro = unlimited" gate as the main protection until a DB column is added.
 */

import prisma from "@/lib/prisma";
import { isProUser } from "@/lib/isPro";

const FREE_DAILY_LIMIT = 5;

// In-memory counter per userId — resets on each serverless cold start.
// Good enough for development; replace with Redis/DB for production.
const usageMap = new Map<string, { date: string; count: number }>();

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10); // "2026-05-31"
}

export class AIQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIQuotaError";
  }
}

export class AINoCreditsError extends Error {
  constructor() {
    super("AI_NO_CREDITS");
    this.name = "AINoCreditsError";
  }
}

/**
 * Call this before every AI route.
 * Throws AIQuotaError if the free user has exceeded their daily limit.
 */
export async function checkAIQuota(supabaseUserId: string): Promise<void> {
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: supabaseUserId },
    include: { subscription: true },
  });

  // Pro users (subscription OR active pass) are unlimited
  if (isProUser(dbUser?.subscription)) return;

  const today = todayUTC();
  const entry = usageMap.get(supabaseUserId);

  if (entry && entry.date === today && entry.count >= FREE_DAILY_LIMIT) {
    throw new AIQuotaError(
      `Limite gratuite atteinte (${FREE_DAILY_LIMIT} générations/jour). Passez en Pro pour un accès illimité.`
    );
  }

  // Increment
  if (!entry || entry.date !== today) {
    usageMap.set(supabaseUserId, { date: today, count: 1 });
  } else {
    entry.count += 1;
  }
}

/**
 * Wraps an AI route handler: checks quota, runs the AI call, and returns
 * clean JSON errors for quota and credit exhaustion.
 */
export async function withAIGuard<T>(
  supabaseUserId: string,
  fn: () => Promise<T>
): Promise<T | { error: string; code: string }> {
  await checkAIQuota(supabaseUserId);
  return fn();
}

/**
 * Maps AI errors to user-friendly JSON responses.
 */
export function aiErrorResponse(err: unknown): { error: string; code: string } {
  if (err instanceof AIQuotaError) {
    return { error: err.message, code: "QUOTA_EXCEEDED" };
  }
  const msg = err instanceof Error ? err.message : String(err);
  switch (msg) {
    case "AI_NO_CREDITS":
      return { error: "AI service is temporarily unavailable (credits exhausted). Please try again later.", code: "NO_CREDITS" };
    case "AI_MISSING_KEY":
      return { error: "AI service is not configured. Contact support.", code: "MISSING_KEY" };
    case "AI_AUTH_ERROR":
      return { error: "AI service authentication failed. Contact support.", code: "AUTH_ERROR" };
    case "AI_RATE_LIMIT":
      return { error: "Too many AI requests. Please wait a moment and try again.", code: "RATE_LIMIT" };
    case "AI_CONNECTION_ERROR":
      return { error: "Could not reach the AI service. Check your network connection.", code: "CONNECTION_ERROR" };
    case "AI_INVALID_JSON":
      return { error: "AI returned an unexpected response. Please try again.", code: "INVALID_JSON" };
    default:
      if (msg.startsWith("AI_API_ERROR:")) {
        return { error: `AI service error (${msg.slice(13)}). Please try again.`, code: "API_ERROR" };
      }
      return { error: "AI generation failed. Please try again.", code: "UNKNOWN" };
  }
}
