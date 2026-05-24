import { useAnimationStore } from "@/store/useAnimationStore";
import type { AnimationMode } from "@/types";

/* ============================================================
   useAnimationMode Hook
   
   MANDATORY hook — every component that renders animation logic
   MUST call this hook before rendering any animation.
   
   Returns the current animation mode ('full' | 'lite') so
   components can conditionally render framer-motion (FULL)
   or CSS-only transitions (LITE).
   
   No component should read from the Zustand animation store
   directly — always use this hook.
   ============================================================ */

export function useAnimationMode(): AnimationMode {
  return useAnimationStore((state) => state.animationMode);
}
