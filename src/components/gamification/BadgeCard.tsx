"use client";

import { Lock } from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import type { Badge } from "@/types";

interface BadgeCardProps {
  badge: Badge;
  onClick?: () => void;
  className?: string;
}

/** Individual badge display card — earned shows full color, locked shows greyscale */
export function BadgeCard({ badge, onClick, className }: BadgeCardProps) {
  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[badge.icon] || LucideIcons.Award;

  return (
    <Card
      clickable={!!onClick}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 py-5 text-center",
        !badge.isEarned && "opacity-50 grayscale",
        badge.isEarned && badge.earnedAt && "animate-pulse-glow",
        className
      )}
    >
      <div className={cn(
        "flex h-14 w-14 items-center justify-center rounded-full",
        badge.isEarned ? "bg-[var(--color-primary)]/15" : "bg-[var(--color-muted)]/15"
      )}>
        {badge.isEarned ? (
          <Icon size={28} className="text-[var(--color-primary)]" />
        ) : (
          <Lock size={24} className="text-[var(--color-muted)]" />
        )}
      </div>
      <h4 className="font-heading text-sm font-semibold">{badge.name}</h4>
      <p className="text-xs text-[var(--color-muted)] line-clamp-2">
        {badge.isEarned ? badge.description : "???"}
      </p>
    </Card>
  );
}
