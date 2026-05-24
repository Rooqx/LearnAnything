"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full bg-[var(--color-reward)]/15 px-3 py-1.5", className)}>
      <Flame size={18} className={cn("text-[var(--color-reward)]", streak > 0 && "animate-flame-pulse")} />
      <span className="text-sm font-semibold text-[var(--color-reward)]">{streak} day streak</span>
    </div>
  );
}
