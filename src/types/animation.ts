/* ============================================================
   Type Definitions — Animation System
   Types for the two-tier animation system and Lumi mascot states.
   ============================================================ */

/** Two-tier animation mode determined during onboarding */
export type AnimationMode = "full" | "lite";

/**
 * Lumi mascot emotion states.
 * Each state maps to a different CSS animation class.
 * - idle: gentle floating bob, used in empty states
 * - thinking: rotating spin, used during loading
 * - excited: energetic bounce, used on selections
 * - celebrating: sparkle bounce, used on completion
 */
export type LumiEmotion = "idle" | "thinking" | "excited" | "celebrating";

/** Size presets for Lumi mascot appearances */
export type LumiSize = "sm" | "md" | "lg" | "xl";

/** Lumi size map in pixels */
export const LUMI_SIZES: Record<LumiSize, number> = {
  sm: 36,
  md: 64,
  lg: 120,
  xl: 160,
};

/** Motion variant definition for framer-motion */
export interface MotionVariant {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  exit: Record<string, number | string>;
  transition?: Record<string, number | string>;
}
