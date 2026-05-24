"use client";

import { Sparkles } from "lucide-react";
import { ProgressBar, Badge } from "@/components/ui";
import { useUserStore } from "@/store/useUserStore";
import { formatXP } from "@/lib/utils";

export function XPLevelBar({ className }: { className?: string }) {
  const { currentLevel, currentLevelXP, xpForNextLevel, totalXP } = useUserStore((s) => s.xp);
  const progress = xpForNextLevel > 0 ? (currentLevelXP / xpForNextLevel) * 100 : 0;

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <Badge variant="primary" icon={<Sparkles size={12} />}>Level {currentLevel}</Badge>
        <span className="text-xs text-[var(--color-muted)]">{formatXP(currentLevelXP)} / {formatXP(xpForNextLevel)} XP</span>
      </div>
      <ProgressBar value={progress} height="sm" />
    </div>
  );
}
