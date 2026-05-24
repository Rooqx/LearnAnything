"use client";

import { useRef, useCallback, useState } from "react";

/* ============================================================
   useSwipe Hook
   
   Touch swipe gesture detection for the learning page interface.
   Detects horizontal swipe direction and velocity.
   
   Returns:
   - onTouchStart / onTouchEnd handlers to attach to the container
   - swipeDirection: 'left' | 'right' | null after a swipe
   - resetSwipe: function to clear the swipe state
   
   Thresholds:
   - Minimum distance: 50px to count as a swipe
   - Minimum velocity: 0.3px/ms to prevent slow drags
   ============================================================ */

type SwipeDirection = "left" | "right" | null;

interface SwipeState {
  swipeDirection: SwipeDirection;
  isSwiping: boolean;
}

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

interface UseSwipeReturn extends SwipeState, SwipeHandlers {
  resetSwipe: () => void;
}

const SWIPE_MIN_DISTANCE = 50;
const SWIPE_MIN_VELOCITY = 0.3;

export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void
): UseSwipeReturn {
  const [state, setState] = useState<SwipeState>({
    swipeDirection: null,
    isSwiping: false,
  });

  /* Store touch start data in a ref to avoid re-renders during drag */
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(
    null
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    setState({ swipeDirection: null, isSwiping: true });
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    /* Prevent vertical scroll when horizontal swiping */
    if (!touchStart.current) return;
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.current.x);
    const deltaY = Math.abs(touch.clientY - touchStart.current.y);

    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaTime = Date.now() - touchStart.current.time;
      const velocity = Math.abs(deltaX) / deltaTime;

      let direction: SwipeDirection = null;

      /* Check if swipe meets minimum distance and velocity thresholds */
      if (
        Math.abs(deltaX) >= SWIPE_MIN_DISTANCE &&
        velocity >= SWIPE_MIN_VELOCITY
      ) {
        direction = deltaX < 0 ? "left" : "right";

        /* Trigger callbacks */
        if (direction === "left" && onSwipeLeft) onSwipeLeft();
        if (direction === "right" && onSwipeRight) onSwipeRight();
      }

      setState({ swipeDirection: direction, isSwiping: false });
      touchStart.current = null;
    },
    [onSwipeLeft, onSwipeRight]
  );

  const resetSwipe = useCallback(() => {
    setState({ swipeDirection: null, isSwiping: false });
  }, []);

  return {
    ...state,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    resetSwipe,
  };
}
