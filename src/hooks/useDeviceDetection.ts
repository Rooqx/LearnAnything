"use client";

import { useEffect, useState } from "react";
import { detectDeviceCapability } from "@/lib/deviceDetection";
import type { AnimationMode } from "@/types";

/* ============================================================
   useDeviceDetection Hook
   
   Runs device performance check on mount using browser APIs.
   Returns the recommended animation mode based on hardware.
   
   Used during onboarding to suggest full/lite animations.
   Does NOT auto-set the animation store — onboarding handles
   that based on user choice.
   ============================================================ */

interface DeviceDetectionResult {
  /** Recommended animation mode based on hardware */
  recommended: AnimationMode;
  /** Whether the device is considered low-end */
  isLowEnd: boolean;
  /** Whether detection has completed */
  isDetected: boolean;
}

export function useDeviceDetection(): DeviceDetectionResult {
  const [result, setResult] = useState<DeviceDetectionResult>({
    recommended: "full",
    isLowEnd: false,
    isDetected: false,
  });

  useEffect(() => {
    /* Detection runs client-side only — uses navigator APIs */
    const capability = detectDeviceCapability();
    setResult({
      recommended: capability,
      isLowEnd: capability === "lite",
      isDetected: true,
    });
  }, []);

  return result;
}
