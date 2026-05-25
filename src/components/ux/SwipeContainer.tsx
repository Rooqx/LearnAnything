/* ============================================================
   SwipeContainer — Spring physics swipe for learning pages
   FULL mode: uses CSS transitions with snap behavior
   LITE mode: instant page transition (no animation)

   Note: framer-motion spring physics for gesture-based swipe
   should be lazy-loaded via next/dynamic in the learning page.
   This base container handles the CSS-only approach.
   ============================================================ */

'use client';

import { useAnimationMode } from '@/hooks/useAnimationMode';
import { useSwipe } from '@/hooks/useSwipe';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface SwipeContainerProps {
  children: ReactNode;
  /** Callback when user swipes to the next page */
  onNext?: () => void;
  /** Callback when user swipes to the previous page */
  onPrev?: () => void;
  /** Whether swipe gestures are enabled */
  enabled?: boolean;
  className?: string;
}

/**
 * Swipe container for learning page navigation.
 *
 * Provides touch swipe detection via useSwipe hook.
 * The actual page transition effect is handled by CSS —
 * for FULL mode with spring physics, the learning page
 * should lazy-load framer-motion and use AnimatePresence.
 */
export function SwipeContainer({
  children,
  onNext,
  onPrev,
  enabled = true,
  className,
}: SwipeContainerProps) {
  const { isLite } = useAnimationMode();

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
    enabled,
    onSwipe: ({ direction }) => {
      if (direction === 'left') onNext?.();
      if (direction === 'right') onPrev?.();
    },
  });

  return (
    <div
      className={cn(
        'w-full overflow-hidden',
        !isLite && 'transition-transform duration-300',
        className
      )}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
}
