/* ============================================================
   Device Detection
   Pure function to determine device performance capability.
   Run once during onboarding — result persisted to
   useAnimationStore. Uses native browser APIs only.
   ============================================================ */

import type { AnimationMode } from '@/types';

/**
 * Detect whether the device is low-end based on hardware specs.
 *
 * Uses two browser APIs:
 * - navigator.hardwareConcurrency: number of logical CPU cores
 * - navigator.deviceMemory: approximate RAM in GB (Chrome-only)
 *
 * Low-end threshold: ≤4 CPU cores OR ≤4GB RAM
 * Returns 'lite' for low-end, 'full' for capable devices.
 *
 * Both APIs may be undefined in some browsers — we default to
 * 4 cores and 4GB when unavailable, which means the device
 * detection notification will show and let the user decide.
 *
 * Edge case: SSR — returns 'full' when navigator is not available
 * (the check will run again on the client during onboarding).
 */
export function detectDeviceCapability(): AnimationMode {
  /* SSR guard — navigator is not available on the server */
  if (typeof navigator === 'undefined') {
    return 'full';
  }

  const cores = navigator.hardwareConcurrency ?? 4;

  /**
   * deviceMemory is a Chrome-only API (not in TypeScript's lib.dom.d.ts).
   * We access it via a type assertion to avoid TS errors while
   * still reading the value at runtime in supported browsers.
   */
  const memory = (navigator as Record<string, unknown>).deviceMemory as number | undefined;
  const ram = memory ?? 4;

  const isLowEnd = cores <= 4 || ram <= 4;

  return isLowEnd ? 'lite' : 'full';
}

/**
 * Check if the user prefers reduced motion.
 * Used as an additional check beyond the CSS media query
 * for programmatic animation decisions.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
