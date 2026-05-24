"use client";

import { useState } from "react";
import { Chip, EmptyState } from "@/components/ui";
import { AnimatedPage, LumiAnimated, StaggerChildren } from "@/components/ux";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BadgeCard } from "@/components/gamification/BadgeCard";
import { useUserStore } from "@/store/useUserStore";
import { DEFAULT_BADGES } from "@/lib/constants";

type BadgeFilter = "all" | "earned" | "locked";

export default function AchievementsPage() {
  const [filter, setFilter] = useState<BadgeFilter>("all");
  const badges = useUserStore((s) => s.badges);

  /* Use default badges if store is empty (first visit) */
  const allBadges = badges.length > 0 ? badges : DEFAULT_BADGES;
  const earnedCount = allBadges.filter((b) => b.isEarned).length;
  const lockedCount = allBadges.filter((b) => !b.isEarned).length;

  const filtered = allBadges.filter((b) => {
    if (filter === "earned") return b.isEarned;
    if (filter === "locked") return !b.isEarned;
    return true;
  });

  return (
    <AnimatedPage>
      <PageWrapper>
        <h1 className="font-heading text-2xl font-bold md:text-3xl">Achievements</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{earnedCount} earned · {lockedCount} to unlock</p>

        <div className="mt-4 flex gap-2">
          {(["all", "earned", "locked"] as BadgeFilter[]).map((f) => (
            <Chip key={f} label={f.charAt(0).toUpperCase() + f.slice(1)} isSelected={filter === f} onClick={() => setFilter(f)} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No badges yet" description="Complete your first course to earn your first badge!" icon={<LumiAnimated state="idle" size={80} />} />
        ) : (
          <StaggerChildren className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((badge) => <BadgeCard key={badge.id} badge={badge} />)}
          </StaggerChildren>
        )}
      </PageWrapper>
    </AnimatedPage>
  );
}
