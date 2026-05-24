"use client";

import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { useAnimationMode } from "@/hooks/useAnimationMode";

/** Canvas-confetti full screen burst for course completion. Uses brand colors. */
export function ConfettiBlast({ trigger }: { trigger: boolean }) {
  const mode = useAnimationMode();

  const fire = useCallback(() => {
    if (mode === "lite") return;

    const brandColors = ["#6C3CE1", "#C8F135", "#F7C948", "#2DD4BF"];
    const count = 200;
    const defaults = { origin: { y: 0.7 }, colors: brandColors };

    confetti({ ...defaults, particleCount: Math.floor(count * 0.25), spread: 26, startVelocity: 55 });
    confetti({ ...defaults, particleCount: Math.floor(count * 0.2), spread: 60 });
    confetti({ ...defaults, particleCount: Math.floor(count * 0.35), spread: 100, decay: 0.91, scalar: 0.8 });
    confetti({ ...defaults, particleCount: Math.floor(count * 0.1), spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    confetti({ ...defaults, particleCount: Math.floor(count * 0.1), spread: 120, startVelocity: 45 });
  }, [mode]);

  useEffect(() => {
    if (trigger) fire();
  }, [trigger, fire]);

  return null;
}
