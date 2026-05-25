/* ============================================================
   Achievements Page
   Badge grid with earned/locked states.
   ============================================================ */

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Award, Lock, Loader2 } from 'lucide-react';
import { Card, Badge, Modal, Button, Chip } from '@/components/ui';
import { AnimatedPage, FadeIn, StaggerChildren } from '@/components/ux';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useUserStore } from '@/store/useUserStore';
import { fetchAchievements } from '@/lib/api';
import type { Badge as BadgeType, BadgeRarity } from '@/types';

const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: 'var(--color-muted)',
  rare: 'var(--color-success)',
  epic: 'var(--color-primary)',
  legendary: 'var(--color-accent)',
};

export default function AchievementsPage() {
  const user = useUserStore((state) => state.user);
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  // React Query handles fetching, caching, and loading states automatically
  const { data: dbBadges = [], isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: fetchAchievements,
    enabled: !!user, // Only fetch if user is defined
  });

  if (!user) return null;

  // Use dbBadges if loaded, otherwise fallback to the mocked ones from store
  const currentBadges: BadgeType[] = dbBadges.length > 0 ? dbBadges : user.badges;

  const filteredBadges = filter === 'all'
    ? currentBadges
    : filter === 'earned'
      ? currentBadges.filter((b: BadgeType) => b.earned)
      : currentBadges.filter((b: BadgeType) => !b.earned);

  const earnedCount = currentBadges.filter((b: BadgeType) => b.earned).length;

  return (
    <AnimatedPage>
      <PageWrapper maxWidth="md">
        <div className="space-y-6">
          <FadeIn>
            <div className="text-center">
              <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl tracking-[-0.02em] text-[var(--color-text)]">
                Achievements
              </h1>
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)] mt-1">
                {earnedCount} of {currentBadges.length} badges earned
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="flex gap-2 justify-center">
              {(['all', 'earned', 'locked'] as const).map((f) => (
                <Chip key={f} selected={filter === f} onClick={() => setFilter(f)} size="sm">
                  {f === 'all' ? 'All' : f === 'earned' ? 'Earned' : 'Locked'}
                </Chip>
              ))}
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredBadges.map((badge) => (
              <Card
                key={badge.id}
                variant="glass"
                padding="md"
                interactive
                onClick={() => setSelectedBadge(badge)}
                className={!badge.earned ? 'opacity-50 grayscale' : ''}
              >
                <div className="text-center space-y-2">
                  <div
                    className="w-14 h-14 mx-auto rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${RARITY_COLORS[badge.rarity]}15`,
                      color: RARITY_COLORS[badge.rarity],
                    }}
                  >
                    {badge.earned ? <Award size={24} /> : <Lock size={20} />}
                  </div>
                  <p className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)]">
                    {badge.name}
                  </p>
                  <Badge
                    variant="custom"
                    customColor={RARITY_COLORS[badge.rarity]}
                    size="sm"
                  >
                    {badge.rarity}
                  </Badge>
                </div>
              </Card>
            ))}
          </StaggerChildren>
        </div>

        {/* Badge detail modal */}
        <Modal
          isOpen={!!selectedBadge}
          onClose={() => setSelectedBadge(null)}
          title={selectedBadge?.name}
          size="sm"
        >
          {selectedBadge && (
            <div className="text-center space-y-4">
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${RARITY_COLORS[selectedBadge.rarity]}15`,
                  color: RARITY_COLORS[selectedBadge.rarity],
                }}
              >
                {selectedBadge.earned ? <Award size={36} /> : <Lock size={28} />}
              </div>
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text)]">
                {selectedBadge.earned ? selectedBadge.description : selectedBadge.lockedDescription}
              </p>
              <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-muted)]">
                {selectedBadge.criteria}
              </p>
              <Badge variant="custom" customColor={RARITY_COLORS[selectedBadge.rarity]}>
                {selectedBadge.rarity}
              </Badge>
              {selectedBadge.earnedAt && (
                <p className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
                  Earned {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </Modal>
      </PageWrapper>
    </AnimatedPage>
  );
}
