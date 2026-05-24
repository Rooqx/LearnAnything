import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnimationMode } from "@/types";

/* ============================================================
   Animation Store
   Manages the two-tier animation system (full vs lite).
   Set during onboarding based on device detection.
   User can change this in Settings.
   Persisted to localStorage so preference survives page reloads.
   ============================================================ */

interface AnimationStoreState {
  animationMode: AnimationMode;
  /** Whether the animation mode has been explicitly set by the user */
  isExplicitlySet: boolean;
}

interface AnimationStoreActions {
  setAnimationMode: (mode: AnimationMode) => void;
}

export const useAnimationStore = create<
  AnimationStoreState & AnimationStoreActions
>()(
  persist(
    (set) => ({
      /* Default to 'full' — updated during onboarding if device is low-end */
      animationMode: "full",
      isExplicitlySet: false,

      setAnimationMode: (mode) =>
        set({ animationMode: mode, isExplicitlySet: true }),
    }),
    {
      name: "la-animation-mode",
    }
  )
);
