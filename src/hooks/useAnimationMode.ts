/* ============================================================
   useAnimationMode Hook — MANDATORY
   Every animated component MUST call this hook before any
   animation logic. Components NEVER read from the animation
   store directly — always through this hook.

   Returns the current animation mode and convenience booleans
   for conditional rendering of animation tiers.
   ============================================================ */

'use client';

import { useAnimationStore } from '@/store/useAnimationStore';
import type { AnimationMode } from '@/types';

interface AnimationModeResult {
  /** Current animation mode: 'full' or 'lite' */
  mode: AnimationMode;
  /** Convenience: true when mode is 'full' */
  isFull: boolean;
  /** Convenience: true when mode is 'lite' */
  isLite: boolean;
}

/**
 * Mandatory hook for all animated components.
 *
 * Usage:
 * ```tsx
 * const { isFull, isLite } = useAnimationMode();
 *
 * // FULL mode: use framer-motion (lazy loaded) or motion package
 * // LITE mode: CSS transitions only, never import framer-motion
 * ```
 *
 * Why this hook exists:
 * - Enforces a single access pattern for animation mode
 * - Prevents components from importing useAnimationStore directly
 * - Provides a clear API surface for animation decisions
 * - Easy to extend with additional animation preferences later
 */
export function useAnimationMode(): AnimationModeResult {
  const mode = useAnimationStore((state) => state.animationMode);

  return {
    mode,
    isFull: mode === 'full',
    isLite: mode === 'lite',
  };
}
