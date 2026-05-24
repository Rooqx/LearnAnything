"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Avatar, Badge, Button } from "@/components/ui";
import { AnimatedPage, FadeIn, LumiAnimated } from "@/components/ux";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { StatCard } from "@/components/dashboard/StatCard";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { BadgeCard } from "@/components/gamification/BadgeCard";
import { XPLevelBar } from "@/components/dashboard/XPLevelBar";
import { useUserStore } from "@/store/useUserStore";
import { formatXP } from "@/lib/utils";

export default function ProfilePage() {
  const profile = useUserStore((s) => s.profile);
  const stats = useUserStore((s) => s.stats);
  const streak = useUserStore((s) => s.streak);
  const badges = useUserStore((s) => s.badges);
  const earnedBadges = badges.filter((b) => b.isEarned).slice(0, 4);

  return (
    <AnimatedPage>
      <PageWrapper>
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Hero */}
            <FadeIn>
              <div className="glass rounded-[var(--radius-xl)] p-6 flex items-center gap-5">
                <Avatar name={profile.displayName} size="xl" />
                <div className="flex-1 min-w-0">
                  <h1 className="font-heading text-2xl font-bold truncate">{profile.displayName || "Learner"}</h1>
                  <p className="text-sm text-[var(--color-muted)]">{profile.bio || "Learning enthusiast"}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="primary">Level {useUserStore.getState().xp.currentLevel}</Badge>
                    <Badge variant="reward">{formatXP(stats.totalXP)} XP</Badge>
                  </div>
                </div>
                <Link href="/settings"><Button variant="ghost" size="sm" leftIcon={<Pencil size={16} />}>Edit</Button></Link>
              </div>
            </FadeIn>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Total XP" value={formatXP(stats.totalXP)} icon="Sparkles" />
              <StatCard label="Streak" value={`${streak.currentStreak}d`} icon="Flame" />
              <StatCard label="Completed" value={stats.coursesCompleted} icon="CheckCircle" />
              <StatCard label="Level" value={useUserStore.getState().xp.currentLevel} icon="TrendingUp" />
            </div>

            <XPLevelBar />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <StreakCounter />

            {/* Badges preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-lg font-semibold">Recent Badges</h3>
                <Link href="/achievements" className="text-sm text-[var(--color-primary)] cursor-pointer hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {earnedBadges.length > 0 ? earnedBadges.map((badge) => <BadgeCard key={badge.id} badge={badge} />) : (
                  <div className="col-span-2 flex flex-col items-center py-8 text-center">
                    <LumiAnimated state="idle" size={48} />
                    <p className="mt-2 text-sm text-[var(--color-muted)]">Complete courses to earn badges!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </AnimatedPage>
  );
}
