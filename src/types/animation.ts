/* ============================================================
   Animation Types
   Defines animation mode tiers and Lumi mascot state types.
   Used by useAnimationStore, useAnimationMode hook, and
   all components in components/ux/.
   ============================================================ */

/**
 * Two-tier animation system determined during onboarding.
 *
 * FULL: framer-motion (lazy-loaded) for complex gestures + motion
 *       package for medium transitions + CSS for simple states.
 *
 * LITE: CSS transitions only. framer-motion is NEVER imported.
 *       Optimized for low-end devices (≤4 cores or ≤4GB RAM).
 */
export type AnimationMode = 'full' | 'lite';

/**
 * Lumi mascot emotion states.
 * Each state maps to a distinct SVG animation in LumiAnimated.
 *
 * IDLE:        Slow floating bob, soft glow pulse.
 * THINKING:    Rotating softly, eyes looking upward.
 * EXCITED:     Energetic bounce, wide eyes, glow intensifies.
 * CELEBRATING: Full bounce, sparkle particles, star eyes.
 */
export type LumiState = 'idle' | 'thinking' | 'excited' | 'celebrating';

/**
 * Motion variant definition for the animation library.
 * Used in lib/animations.ts to define enter/exit/hover variants
 * for both FULL and LITE modes.
 */
export interface MotionVariant {
  /** Initial/hidden state properties */
  initial: Record<string, string | number>;
  /** Visible/animate state properties */
  animate: Record<string, string | number>;
  /** Exit state properties */
  exit?: Record<string, string | number>;
  /** Transition configuration */
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string | number[];
    type?: 'tween' | 'spring';
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

/**
 * Swipe direction for the learning page SwipeContainer.
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Swipe gesture event data passed to handlers.
 */
export interface SwipeEvent {
  /** Direction of the swipe */
  direction: SwipeDirection;
  /** Distance swiped in pixels */
  distance: number;
  /** Velocity of the swipe (pixels per millisecond) */
  velocity: number;
}
