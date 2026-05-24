import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* ============================================================
   General Utility Functions
   Shared across the entire app. Pure functions only.
   ============================================================ */

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Uses clsx for conditional classes and tailwind-merge
 * to handle conflicting utility classes.
 * 
 * @example cn("px-4 py-2", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format XP number with commas for display.
 * @example formatXP(12500) → "12,500"
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString("en-US");
}

/**
 * Format a date string into a human-readable relative format.
 * @example formatDate("2026-05-20T10:00:00Z") → "3 days ago"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Get time-of-day greeting based on current hour.
 * @returns "morning" | "afternoon" | "evening"
 */
export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

/**
 * Generate a unique ID. Uses crypto.randomUUID if available,
 * falls back to timestamp + random.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Truncate a string to a maximum length with ellipsis.
 * @example truncate("Hello World", 8) → "Hello..."
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Calculate progress percentage between two values.
 * Clamps result between 0 and 100.
 */
export function calculateProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
}

/**
 * Format minutes into a human-readable duration string.
 * @example formatDuration(95) → "1h 35min"
 * @example formatDuration(30) → "30 min"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}
