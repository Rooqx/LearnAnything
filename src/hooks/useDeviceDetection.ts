/* ============================================================
   useDeviceDetection Hook
   Runs device capability detection on mount and returns
   the recommended animation mode. Used during onboarding
   to determine if the low-end device notification should show.
   ============================================================ */

'use client';

import { useState, useEffect } from 'react';
import { detectDeviceCapability } from '@/lib/deviceDetection';
import type { AnimationMode } from '@/types';

interface DeviceDetectionResult {
  /** Recommended animation mode based on device capabilities */
  recommendedMode: AnimationMode;
  /** Whether the detection has finished running */
  isDetected: boolean;
  /** Whether the device is considered low-end */
  isLowEnd: boolean;
}

/**
 * Hook to detect device capabilities on mount.
 *
 * Runs detectDeviceCapability() once on mount (client-side only).
 * Returns the recommended animation mode and whether the device
 * is low-end (which triggers the onboarding notification).
 *
 * Usage in onboarding:
 * ```tsx
 * const { isLowEnd, recommendedMode, isDetected } = useDeviceDetection();
 *
 * // After step 3, if isLowEnd, show the animation mode selector
 * // If not low-end, silently set 'full' mode
 * ```
 */
export function useDeviceDetection(): DeviceDetectionResult {
  const [result, setResult] = useState<DeviceDetectionResult>({
    recommendedMode: 'full',
    isDetected: false,
    isLowEnd: false,
  });

  useEffect(() => {
    /* detectDeviceCapability() is a pure synchronous function
       but we run it in useEffect to ensure it only runs client-side */
    const mode = detectDeviceCapability();
    setResult({
      recommendedMode: mode,
      isDetected: true,
      isLowEnd: mode === 'lite',
    });
  }, []);

  return result;
}
