"use client";

import { useAnimationMode } from "@/hooks/useAnimationMode";
import { useSwipe } from "@/hooks/useSwipe";
import { cn } from "@/lib/utils";

/** Swipeable container for learning pages. FULL: spring physics drag, LITE: CSS transform. */
interface SwipeContainerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export function SwipeContainer({ children, onSwipeLeft, onSwipeRight, className }: SwipeContainerProps) {
  const mode = useAnimationMode();
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight);

  return (
    <div
      className={cn("touch-pan-y", mode === "full" && "transition-transform duration-300 ease-out", className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
}
