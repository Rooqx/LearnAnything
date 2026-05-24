"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";

/** Reusable streak counter with flame icon — used in dashboard and profile */
export function StreakCounter({ className }: { className?: string }) {
  const { currentStreak, longestStreak } = useUserStore((s) => s.streak);
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center gap-2">
        <Flame size={24} className={cn("text-[var(--color-reward)]", currentStreak > 0 && "animate-flame-pulse")} />
        <div>
          <p className="font-heading text-2xl font-bold text-[var(--color-reward)]">{currentStreak}</p>
          <p className="text-xs text-[var(--color-muted)]">Current Streak</p>
        </div>
      </div>
      <div className="h-8 w-px bg-[var(--color-border)]" />
      <div>
        <p className="font-heading text-lg font-bold">{longestStreak}</p>
        <p className="text-xs text-[var(--color-muted)]">Longest</p>
      </div>
    </div>
  );
}
