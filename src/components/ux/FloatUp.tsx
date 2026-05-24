"use client";

import { cn } from "@/lib/utils";
import { formatXP } from "@/lib/utils";

/** XP float-up number animation — shows earned XP floating upward and fading out */
export function FloatUp({ xp, className }: { xp: number; className?: string }) {
  return (
    <div className={cn("pointer-events-none animate-float-up text-lg font-bold text-[var(--color-reward)]", className)}>
      +{formatXP(xp)} XP
    </div>
  );
}
