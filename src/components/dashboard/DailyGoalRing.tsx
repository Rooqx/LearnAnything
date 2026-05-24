"use client";

import { ProgressRing } from "@/components/ui";
import { useUserStore } from "@/store/useUserStore";

export function DailyGoalRing({ className }: { className?: string }) {
  const { minutesToday, goalMinutes } = useUserStore((s) => s.dailyGoal);
  return (
    <ProgressRing
      value={minutesToday}
      maxValue={goalMinutes}
      size={120}
      label={`${minutesToday} / ${goalMinutes} min`}
      sublabel="Daily Goal"
      color="var(--color-accent)"
      className={className}
    />
  );
}
