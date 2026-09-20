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

/**
 * Website is an optional CV field, but when a value is present it's very common
 * for users (or AI-imported resume data) to supply a bare domain ("example.com")
 * without a protocol — which strict URL validation rejects. Trim whitespace and
 * auto-prefix "https://" so ordinary input validates correctly instead of
 * surfacing a confusing error on a field that was, in fact, filled in.
 *
 * Shared by the CV form (client-side validation) and the CV API routes
 * (server-side, so the stored value is normalized regardless of which client
 * path produced it — typed by hand, AI-imported, or posted directly to the API).
 */
export function normalizeWebsite(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (trimmed === "") return "";
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
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
