/* ============================================================
   Framer Motion Animation Variants
   
   Centralized motion variant definitions used across the app.
   All animated components import from here — never define
   inline motion variants.
   
   Each variant has FULL and LITE versions.
   FULL: uses framer-motion spring/tween physics
   LITE: simplified or no-op variants (CSS handles it)
   ============================================================ */

/** Page entry/exit transition */
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const pageTransition = {
  type: "tween" as const,
  ease: "easeOut",
  duration: 0.3,
};

/** Fade in with optional direction */
export const fadeInVariants = {
  up: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  },
  down: {
    initial: { opacity: 0, y: -24 },
    animate: { opacity: 1, y: 0 },
  },
  left: {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
  },
  right: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
  },
  none: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
};

/** Stagger children container */
export const staggerContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Individual stagger child */
export const staggerChildVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

/** Modal scale-in entrance */
export const modalVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const modalTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

/** Drawer slide-in */
export const drawerVariants = {
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
};

export const drawerTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

/** Swipe between learning pages — spring physics */
export const swipeTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

/** Scale on press interaction */
export const scaleOnPressVariants = {
  idle: { scale: 1 },
  pressed: { scale: 0.96 },
};
