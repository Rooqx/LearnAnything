/* ============================================================
   ConfettiBlast — canvas-confetti burst with brand colors
   Used on course completion celebration screen.
   ============================================================ */

'use client';

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useAnimationMode } from '@/hooks/useAnimationMode';

export interface ConfettiBlastProps {
  /** Whether to trigger the confetti burst */
  trigger?: boolean;
}

/**
 * Fires a canvas-confetti burst using Molten brand colors.
 * Only fires in FULL animation mode.
 * Fires once on mount when trigger is true.
 */
export function ConfettiBlast({ trigger = true }: ConfettiBlastProps) {
  const { isLite } = useAnimationMode();

  const fireConfetti = useCallback(() => {
    if (isLite) return;

    /* Brand colors for confetti particles */
    const colors = ['#FF3008', '#FFE500', '#FF8C00', '#00F593'];

    /* Fire from two sides for a satisfying spread */
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.3, y: 0.6 },
      colors,
      disableForReducedMotion: true,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.7, y: 0.6 },
      colors,
      disableForReducedMotion: true,
    });
  }, [isLite]);

  useEffect(() => {
    if (trigger) fireConfetti();
  }, [trigger, fireConfetti]);

  /* This component renders nothing — confetti is a canvas overlay */
  return null;
}
