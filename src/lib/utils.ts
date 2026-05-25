/* ============================================================
   Utility Functions
   General-purpose helpers used across the entire app.
   ============================================================ */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge
 * to resolve conflicting utility classes (e.g., p-4 and p-2).
 *
 * Usage: cn('base-class', conditional && 'added-class', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format an XP number with comma separators.
 * Example: 12500 → "12,500"
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString('en-US');
}

/**
 * Format a date string relative to now.
 * Returns: "Today", "Yesterday", "3 days ago", "Jan 15"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get a time-of-day greeting for the dashboard welcome banner.
 * Returns: "Good morning", "Good afternoon", or "Good evening"
 */
export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Format minutes into a human-readable duration string.
 * Example: 90 → "1h 30m", 30 → "30m", 120 → "2h"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Calculate completion percentage.
 * Returns a number between 0 and 100, clamped.
 */
export function getCompletionPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((completed / total) * 100));
}

/**
 * Generate a simple unique ID.
 * Not cryptographically secure — for UI keys only.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 1)}…`;
}

/**
 * Delay execution for a specified number of milliseconds.
 * Used in loading screens and staggered animations.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
