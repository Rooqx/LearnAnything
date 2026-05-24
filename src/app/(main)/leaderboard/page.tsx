/* ============================================================
   Leaderboard Page
   Weekly XP rankings with podium top 3 + scrollable list.
   ============================================================ */

'use client';

import { Trophy, Medal, Crown, ChevronUp } from 'lucide-react';
import { Card, Avatar, Badge } from '@/components/ui';
import { AnimatedPage, FadeIn, StaggerChildren } from '@/components/ux';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useUserStore } from '@/store/useUserStore';
import { MOCK_LEADERBOARD } from '@/lib/api';
import { formatXP } from '@/lib/utils';

export default function LeaderboardPage() {
  const user = useUserStore((state) => state.user);

  /* Create full leaderboard including current user */
  const leaderboard = [...MOCK_LEADERBOARD];
  if (user) {
    leaderboard.push({
      userId: user.id,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      weeklyXP: user.xp.totalXP > 0 ? Math.floor(user.xp.totalXP * 0.3) : 247,
      rank: 11,
      isCurrentUser: true,
    });
    leaderboard.sort((a, b) => b.weeklyXP - a.weeklyXP);
    leaderboard.forEach((entry, i) => (entry.rank = i + 1));
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const podiumColors = ['var(--color-accent)', 'var(--color-muted)', 'var(--color-reward)'];
  const podiumIcons = [Crown, Medal, Medal];

  return (
    <AnimatedPage>
      <PageWrapper maxWidth="md">
        <div className="space-y-6">
          <FadeIn>
            <div className="text-center">
              <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl tracking-[-0.02em] text-[var(--color-text)]">
                Leaderboard
              </h1>
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)] mt-1">
                Weekly XP rankings
              </p>
            </div>
          </FadeIn>

          {/* Podium — top 3 */}
          <FadeIn delay={100}>
            <div className="flex items-end justify-center gap-3 py-6">
              {/* 2nd place */}
              {top3[1] && (
                <div className="flex flex-col items-center w-24">
                  <Avatar name={top3[1].displayName} size="lg" alt={top3[1].displayName} />
                  <p className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)] mt-2 truncate w-full text-center">
                    {top3[1].displayName.split(' ')[0]}
                  </p>
                  <Badge variant="muted" size="sm" className="mt-1">{formatXP(top3[1].weeklyXP)}</Badge>
                  <div className="w-full h-16 bg-[var(--color-surface-elevated)] rounded-t-lg mt-2 flex items-center justify-center">
                    <span className="font-[family-name:var(--font-heading)] font-bold text-lg text-[var(--color-muted)]">2</span>
                  </div>
                </div>
              )}
              {/* 1st place */}
              {top3[0] && (
                <div className="flex flex-col items-center w-28">
                  <Crown size={24} style={{ color: 'var(--color-accent)' }} />
                  <Avatar name={top3[0].displayName} size="xl" alt={top3[0].displayName} className="mt-1" />
                  <p className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)] mt-2 truncate w-full text-center">
                    {top3[0].displayName.split(' ')[0]}
                  </p>
                  <Badge variant="accent" size="sm" className="mt-1">{formatXP(top3[0].weeklyXP)}</Badge>
                  <div className="w-full h-24 bg-gradient-to-t from-[var(--color-primary)]/20 to-[var(--color-accent)]/10 rounded-t-lg mt-2 flex items-center justify-center border border-[var(--color-accent)]/20">
                    <span className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-accent)]">1</span>
                  </div>
                </div>
              )}
              {/* 3rd place */}
              {top3[2] && (
                <div className="flex flex-col items-center w-24">
                  <Avatar name={top3[2].displayName} size="lg" alt={top3[2].displayName} />
                  <p className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)] mt-2 truncate w-full text-center">
                    {top3[2].displayName.split(' ')[0]}
                  </p>
                  <Badge variant="reward" size="sm" className="mt-1">{formatXP(top3[2].weeklyXP)}</Badge>
                  <div className="w-full h-12 bg-[var(--color-surface-elevated)] rounded-t-lg mt-2 flex items-center justify-center">
                    <span className="font-[family-name:var(--font-heading)] font-bold text-lg text-[var(--color-muted)]">3</span>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Rest of leaderboard */}
          <StaggerChildren className="space-y-2">
            {rest.map((entry) => (
              <Card
                key={entry.userId}
                variant={entry.isCurrentUser ? 'elevated' : 'glass'}
                padding="sm"
                className={entry.isCurrentUser ? 'border-[var(--color-primary)]/30' : ''}
              >
                <div className="flex items-center gap-3 px-2">
                  <span className="w-6 text-center font-[family-name:var(--font-heading)] font-bold text-sm text-[var(--color-muted)]">
                    {entry.rank}
                  </span>
                  <Avatar name={entry.displayName} size="sm" alt={entry.displayName} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-[family-name:var(--font-body)] text-sm truncate ${entry.isCurrentUser ? 'text-[var(--color-primary)] font-semibold' : 'text-[var(--color-text)]'}`}>
                      {entry.displayName} {entry.isCurrentUser && '(you)'}
                    </p>
                  </div>
                  <span className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-reward)]">
                    {formatXP(entry.weeklyXP)}
                  </span>
                </div>
              </Card>
            ))}
          </StaggerChildren>
        </div>
      </PageWrapper>
    </AnimatedPage>
  );
}
