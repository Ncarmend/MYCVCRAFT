/**
 * Shared utility functions
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date to a readable string */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Truncate text to a max length */
export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

/** Get user initials from a name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Check if a subscription is active/valid */
export function isSubscriptionActive(
  status: string,
  periodEnd?: Date | null
): boolean {
  if (status === "ACTIVE") return true;
  if (periodEnd && new Date(periodEnd) > new Date()) return true;
  return false;
}

/** Generate a random gradient for CV card placeholders */
export function getGradient(index: number): string {
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-sky-500 to-blue-600",
  ];
  return gradients[index % gradients.length];
}

/** Safely parse JSON, returning fallback on error */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
