/* ============================================================
   StaggerChildren — Staggered list/grid entrance animation
   Each child enters with a delay after the previous one.
   Delay: 50ms between items (within Emil's 30-80ms range).
   ============================================================ */

'use client';

import { Children, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAnimationMode } from '@/hooks/useAnimationMode';
//import { cn } from '@/lib/utils';

export interface StaggerChildrenProps {
  children: ReactNode;
  /** Delay between each child in milliseconds */
  staggerDelay?: number;
  /** Base delay before the first child animates */
  baseDelay?: number;
  /** Animation duration for each child */
  duration?: number;
  className?: string;
}

/**
 * Wraps children with staggered fade-in-up entrance animation.
 * Uses CSS animation-delay cascade (no JS needed).
 * LITE mode: renders all children immediately without animation.
 */
export function StaggerChildren({
  children,
  staggerDelay = 50,
  baseDelay = 100,
  duration = 300,
  className,
}: StaggerChildrenProps) {
  const { isLite } = useAnimationMode();
  const childArray = Children.toArray(children);

  if (isLite) {
    return (
      <div className={className}>
        {childArray.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay / 1000,
            delayChildren: baseDelay / 1000,
          },
        },
      }}
    >
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                duration: 0.8,
                ease: [0.32, 0.72, 0, 1],
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
