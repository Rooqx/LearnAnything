/* ============================================================
   useSwipe Hook
   Touch swipe gesture detection for learning page navigation.
   Detects horizontal swipe direction and velocity for
   momentum-based page transitions.

   Uses the momentum-based dismissal pattern from Emil's
   design engineering skill — velocity threshold matters
   more than distance for a natural feel.
   ============================================================ */

'use client';

import { useRef, useCallback } from 'react';
import type { SwipeDirection, SwipeEvent } from '@/types';

/** Minimum swipe distance in pixels to register as a swipe */
const SWIPE_THRESHOLD = 50;

/** Velocity threshold for momentum-based dismissal (px/ms) */
const VELOCITY_THRESHOLD = 0.11;

interface SwipeHandlers {
  /** Attach to the element's onTouchStart */
  onTouchStart: (e: React.TouchEvent) => void;
  /** Attach to the element's onTouchMove */
  onTouchMove: (e: React.TouchEvent) => void;
  /** Attach to the element's onTouchEnd */
  onTouchEnd: (e: React.TouchEvent) => void;
}

interface UseSwipeOptions {
  /** Callback fired when a valid swipe is detected */
  onSwipe: (event: SwipeEvent) => void;
  /** Whether swipe detection is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Hook for detecting touch swipe gestures.
 *
 * Uses momentum-based dismissal: a quick flick (velocity > 0.11 px/ms)
 * triggers a swipe even if the distance is below the threshold.
 * This follows Emil Kowalski's principle that gestures should
 * feel natural — users expect quick flicks to work.
 *
 * Usage:
 * ```tsx
 * const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
 *   onSwipe: ({ direction }) => {
 *     if (direction === 'left') nextPage();
 *     if (direction === 'right') prevPage();
 *   },
 * });
 *
 * return <div {...{ onTouchStart, onTouchMove, onTouchEnd }}>...</div>;
 * ```
 */
export function useSwipe({ onSwipe, enabled = true }: UseSwipeOptions): SwipeHandlers {
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const isDragging = useRef(false);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      /* Multi-touch protection: ignore additional touch points
         after the initial drag begins (Emil's principle) */
      if (isDragging.current) return;

      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      startTime.current = Date.now();
      isDragging.current = true;
    },
    [enabled]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !isDragging.current) return;

      /* Prevent default only if horizontal movement exceeds vertical
         to avoid blocking vertical scrolling */
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startX.current);
      const deltaY = Math.abs(touch.clientY - startY.current);

      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    },
    [enabled]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !isDragging.current) return;

      isDragging.current = false;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;
      const distance = Math.abs(deltaX);
      const elapsed = Date.now() - startTime.current;
      const velocity = distance / elapsed;

      /* Determine if this qualifies as a swipe:
         Either distance exceeds threshold OR velocity exceeds threshold
         (momentum-based dismissal — quick flicks always work) */
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      const meetsThreshold = distance >= SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD;

      if (isHorizontalSwipe && meetsThreshold) {
        const direction: SwipeDirection = deltaX > 0 ? 'right' : 'left';

        onSwipe({
          direction,
          distance,
          velocity,
        });
      }
    },
    [enabled, onSwipe]
  );

  return { onTouchStart, onTouchMove, onTouchEnd };
}
