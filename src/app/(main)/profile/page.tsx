/* ============================================================
   Profile Page
   Profile hero, stats, badges, and activity.
   ============================================================ */

'use client';

import { useRouter } from 'next/navigation';
import { Flame, Zap, BookOpen, Target, Trophy, Award, Settings } from 'lucide-react';
import { Card, Badge, Avatar, Button, ProgressBar } from '@/components/ui';
import { AnimatedPage, FadeIn, StaggerChildren, LumiAnimated } from '@/components/ux';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useUserStore } from '@/store/useUserStore';
import { formatXP, getCompletionPercentage } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  if (!user) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <LumiAnimated size={80} state="idle" />
          <Button onClick={() => router.push('/sign-in')} className="mt-4">Sign in</Button>
        </div>
      </PageWrapper>
    );
  }

  const earnedBadges = user.badges.filter((b) => b.earned);
  const xpProgress = getCompletionPercentage(user.xp.xpInCurrentLevel, user.xp.xpInCurrentLevel + user.xp.xpToNextLevel);

  return (
    <AnimatedPage>
      <PageWrapper maxWidth="md">
        <div className="space-y-6">
          {/* Profile hero */}
          <FadeIn>
            <Card variant="elevated" padding="lg" gradientBorder>
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar name={user.displayName} src={user.avatarUrl} alt={user.displayName} size="xl" />
                <div>
                  <h1 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)]">
                    {user.displayName}
                  </h1>
                  {user.bio && (
                    <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)] mt-1">
                      {user.bio}
                    </p>
                  )}
                  <Badge variant="reward" size="md" className="mt-2">
                    Level {user.xp.currentLevel} · {formatXP(user.xp.totalXP)} XP
                  </Badge>
                </div>
                <ProgressBar value={xpProgress} variant="reward" size="sm" className="max-w-xs w-full" />
                <Button variant="ghost" size="sm" onClick={() => router.push('/settings')} leftIcon={<Settings size={16} />}>
                  Edit profile
                </Button>
              </div>
            </Card>
          </FadeIn>

          {/* Stats grid */}
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-1">
                <Flame size={14} className="text-[var(--color-primary)]" />
                <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">Streak</span>
              </div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-xl text-[var(--color-text)]">
                {user.streak.currentStreak} days
              </p>
            </Card>
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={14} className="text-[var(--color-success)]" />
                <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">Completed</span>
              </div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-xl text-[var(--color-text)]">
                {user.totalCoursesCompleted} courses
              </p>
            </Card>
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={14} className="text-[var(--color-accent)]" />
                <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">Badges</span>
              </div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-xl text-[var(--color-text)]">
                {earnedBadges.length}/{user.badges.length}
              </p>
            </Card>
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-1">
                <Target size={14} className="text-[var(--color-reward)]" />
                <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">Best streak</span>
              </div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-xl text-[var(--color-text)]">
                {user.streak.longestStreak} days
              </p>
            </Card>
          </StaggerChildren>

          {/* Badges section */}
          <FadeIn delay={200}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-[family-name:var(--font-heading)] font-semibold text-xl text-[var(--color-text)]">Badges</h2>
                <button onClick={() => router.push('/achievements')} className="text-sm text-[var(--color-primary)] font-[family-name:var(--font-body)] hover:underline cursor-pointer">
                  View all
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {user.badges.slice(0, 10).map((badge) => (
                  <Card key={badge.id} variant="glass" padding="sm" className={`text-center ${!badge.earned ? 'opacity-40 grayscale' : ''}`}>
                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1.5 ${
                      badge.rarity === 'legendary' ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                        : badge.rarity === 'epic' ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                          : badge.rarity === 'rare' ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
                            : 'bg-[var(--color-muted)]/15 text-[var(--color-muted)]'
                    }`}>
                      <Award size={18} />
                    </div>
                    <p className="font-[family-name:var(--font-body)] text-[10px] text-[var(--color-text)] truncate">{badge.name}</p>
                  </Card>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Interests */}
          <FadeIn delay={300}>
            <Card variant="glass" padding="md">
              <h3 className="font-[family-name:var(--font-heading)] font-semibold text-base text-[var(--color-text)] mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <Badge key={interest} variant="muted" size="md">{interest}</Badge>
                ))}
                {user.interests.length === 0 && (
                  <p className="text-sm text-[var(--color-muted)] font-[family-name:var(--font-body)]">No interests selected yet</p>
                )}
              </div>
            </Card>
          </FadeIn>
        </div>
      </PageWrapper>
    </AnimatedPage>
  );
}
