/* ============================================================
   StaggerChildren — Staggered list/grid entrance animation
   Each child enters with a delay after the previous one.
   Delay: 50ms between items (within Emil's 30-80ms range).
   ============================================================ */

'use client';

import { Children, type ReactNode } from 'react';
import { useAnimationMode } from '@/hooks/useAnimationMode';
import { cn } from '@/lib/utils';

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

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <div
          key={index}
          className={cn(!isLite && 'opacity-0')}
          style={
            isLite
              ? undefined
              : {
                  animation: `fadeInUp ${duration}ms cubic-bezier(0.25, 1, 0.5, 1) ${baseDelay + index * staggerDelay}ms both`,
                }
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
}
