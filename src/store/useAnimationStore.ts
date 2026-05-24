/* ============================================================
   Animation Store
   Manages the two-tier animation mode (full/lite) with
   localStorage persistence. Set during onboarding based on
   device detection, changeable in Settings > Appearance.
   ============================================================ */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnimationMode } from '@/types';

interface AnimationState {
  /** Current animation mode — determines which animation libraries are used */
  animationMode: AnimationMode;
  /** Whether the device detection has been run (prevents re-prompting) */
  detectionComplete: boolean;
  /** Set the animation mode directly */
  setAnimationMode: (mode: AnimationMode) => void;
  /** Mark device detection as complete */
  setDetectionComplete: () => void;
}

/**
 * Animation store with localStorage persistence.
 *
 * FULL mode: framer-motion (lazy) + motion package + CSS transitions
 * LITE mode: CSS transitions only — zero JS animation imports
 *
 * Default is 'full' — will be set to 'lite' if device detection
 * detects a low-end device (≤4 CPU cores or ≤4GB RAM) and
 * user chooses "Keep it smooth" during onboarding.
 *
 * Components NEVER read from this store directly.
 * They MUST use the useAnimationMode hook instead.
 */
export const useAnimationStore = create<AnimationState>()(
  persist(
    (set) => ({
      animationMode: 'full',
      detectionComplete: false,

      setAnimationMode: (mode) => set({ animationMode: mode }),

      setDetectionComplete: () => set({ detectionComplete: true }),
    }),
    {
      name: 'learn-anything-animation',
    }
  )
);
