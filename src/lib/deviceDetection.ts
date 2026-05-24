import type { AnimationMode } from "@/types";

/* ============================================================
   Device Detection
   
   Pure function that checks device hardware capability using
   browser APIs. Used once during onboarding to recommend
   animation mode.
   
   Detection logic:
   - hardwareConcurrency: number of logical CPU cores
   - deviceMemory: approximate RAM in GB (Chrome-only API)
   
   Low-end threshold: ≤4 CPU cores OR ≤4GB RAM
   These thresholds cover most budget phones and older laptops.
   ============================================================ */

/** Extended Navigator interface for deviceMemory (Chrome-only API) */
interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

export function detectDeviceCapability(): AnimationMode {
  /* Fallback values if APIs are unavailable (assume capable) */
  const nav = typeof navigator !== "undefined"
    ? (navigator as NavigatorWithMemory)
    : null;

  const cores = nav?.hardwareConcurrency ?? 8;
  const memory = nav?.deviceMemory ?? 8;

  /* Low-end: 4 or fewer cores OR 4GB or less RAM */
  const isLowEnd = cores <= 4 || memory <= 4;

  return isLowEnd ? "lite" : "full";
}
