"use client";

import { Crown } from "lucide-react";
import { Avatar } from "@/components/ui";
import { cn, formatXP } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  className?: string;
}

/** Single leaderboard entry row */
export function LeaderboardRow({ entry, className }: LeaderboardRowProps) {
  const isTop3 = entry.rank <= 3;
  const rankColors: Record<number, string> = { 1: "var(--color-reward)", 2: "#C0C0C0", 3: "#CD7F32" };

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3",
      "transition-colors duration-200",
      entry.isCurrentUser && "bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/20",
      !entry.isCurrentUser && "hover:bg-[var(--color-surface-elevated)]",
      className
    )}>
      {/* Rank */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        {entry.rank === 1 ? (
          <Crown size={22} style={{ color: rankColors[1] }} />
        ) : (
          <span className={cn("font-heading text-lg font-bold", isTop3 ? "" : "text-[var(--color-muted)]")} style={isTop3 ? { color: rankColors[entry.rank] } : undefined}>
            {entry.rank}
          </span>
        )}
      </div>

      {/* Avatar + Name */}
      <Avatar name={entry.displayName} src={entry.avatarUrl} size="sm" />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", entry.isCurrentUser && "text-[var(--color-primary)]")}>
          {entry.displayName} {entry.isCurrentUser && "(You)"}
        </p>
      </div>

      {/* XP */}
      <span className="text-sm font-semibold text-[var(--color-reward)]">{formatXP(entry.xpThisWeek)} XP</span>
    </div>
  );
}
