/* ============================================================
   Animation Variants
   Motion variant definitions for FULL and LITE animation modes.
   Used by components in components/ux/ to determine which
   animation properties to apply.

   FULL mode: uses these variants with framer-motion or motion
   LITE mode: falls back to simplified CSS-only transitions
   ============================================================ */

import type { MotionVariant } from '@/types';

/* ============================================================
   Page Transitions
   Used by AnimatedPage wrapper on every page.
   ============================================================ */

export const pageTransition: MotionVariant = {
  initial: { opacity: 0, transform: 'translateY(8px)' },
  animate: { opacity: 1, transform: 'translateY(0px)' },
  exit: { opacity: 0, transform: 'translateY(-8px)' },
  transition: {
    duration: 0.3,
    ease: [0.25, 1, 0.5, 1],
  },
};

/* ============================================================
   Fade In
   Used by FadeIn wrapper with optional direction.
   ============================================================ */

export const fadeInUp: MotionVariant = {
  initial: { opacity: 0, transform: 'translateY(16px)' },
  animate: { opacity: 1, transform: 'translateY(0px)' },
  transition: {
    duration: 0.4,
    ease: [0.25, 1, 0.5, 1],
  },
};

export const fadeInDown: MotionVariant = {
  initial: { opacity: 0, transform: 'translateY(-16px)' },
  animate: { opacity: 1, transform: 'translateY(0px)' },
  transition: {
    duration: 0.4,
    ease: [0.25, 1, 0.5, 1],
  },
};

export const fadeInLeft: MotionVariant = {
  initial: { opacity: 0, transform: 'translateX(-16px)' },
  animate: { opacity: 1, transform: 'translateX(0px)' },
  transition: {
    duration: 0.4,
    ease: [0.25, 1, 0.5, 1],
  },
};

export const fadeInRight: MotionVariant = {
  initial: { opacity: 0, transform: 'translateX(16px)' },
  animate: { opacity: 1, transform: 'translateX(0px)' },
  transition: {
    duration: 0.4,
    ease: [0.25, 1, 0.5, 1],
  },
};

/* ============================================================
   Scale Animations
   Used by modals, level-up, and scale-on-press interactions.
   ============================================================ */

export const scaleIn: MotionVariant = {
  initial: { opacity: 0, transform: 'scale(0.95)' },
  animate: { opacity: 1, transform: 'scale(1)' },
  exit: { opacity: 0, transform: 'scale(0.95)' },
  transition: {
    duration: 0.2,
    ease: [0.25, 1, 0.5, 1],
  },
};

export const scaleInBounce: MotionVariant = {
  initial: { opacity: 0, transform: 'scale(0.8)' },
  animate: { opacity: 1, transform: 'scale(1)' },
  exit: { opacity: 0, transform: 'scale(0.8)' },
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  },
};

/* ============================================================
   Stagger Configuration
   Used by StaggerChildren wrapper for list/grid entrances.
   Delay between items: 50ms (within Emil's 30–80ms range).
   ============================================================ */

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: MotionVariant = {
  initial: { opacity: 0, transform: 'translateY(12px)' },
  animate: { opacity: 1, transform: 'translateY(0px)' },
  transition: {
    duration: 0.3,
    ease: [0.25, 1, 0.5, 1],
  },
};

/* ============================================================
   Drawer / Sheet Animations
   Used by Drawer component — bottom sheet on mobile,
   side panel on desktop.
   ============================================================ */

export const drawerBottom: MotionVariant = {
  initial: { transform: 'translateY(100%)' },
  animate: { transform: 'translateY(0%)' },
  exit: { transform: 'translateY(100%)' },
  transition: {
    duration: 0.4,
    ease: [0.32, 0.72, 0, 1],
  },
};

export const drawerRight: MotionVariant = {
  initial: { transform: 'translateX(100%)' },
  animate: { transform: 'translateX(0%)' },
  exit: { transform: 'translateX(100%)' },
  transition: {
    duration: 0.3,
    ease: [0.32, 0.72, 0, 1],
  },
};

/* ============================================================
   Swipe Spring Configuration
   Used by SwipeContainer for learning page navigation.
   Emil's recommended values for satisfying snap behavior.
   ============================================================ */

export const swipeSpring = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

/* ============================================================
   Float Up Animation
   Used by XPToast — number floats up 40px and fades out.
   ============================================================ */

export const floatUp: MotionVariant = {
  initial: { opacity: 1, transform: 'translateY(0px)' },
  animate: { opacity: 0, transform: 'translateY(-40px)' },
  transition: {
    duration: 0.8,
    ease: [0.4, 0, 0.2, 1],
  },
};
