/* ============================================================
   Settings Page
   Sections: Account, Appearance, Learning, Notifications.
   ============================================================ */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Palette,
  BookOpen,
  Bell,
  ChevronRight,
  Sun,
  Moon,
  Zap,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { Card, Button, Input, Toggle, Badge } from '@/components/ui';
import { AnimatedPage, FadeIn } from '@/components/ux';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useUserStore } from '@/store/useUserStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useAnimationStore } from '@/store/useAnimationStore';
import { DAILY_GOAL_OPTIONS, MODE_CONFIG } from '@/lib/constants';
import type { LearningMode, DailyGoalMinutes } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const updateDisplayName = useUserStore((state) => state.updateDisplayName);
  const updateBio = useUserStore((state) => state.updateBio);
  const setDailyGoal = useUserStore((state) => state.setDailyGoal);
  const setDefaultMode = useUserStore((state) => state.setDefaultMode);
  const setNotifications = useUserStore((state) => state.setNotifications);
  const signOut = useUserStore((state) => state.signOut);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const animationMode = useAnimationStore((state) => state.animationMode);
  const setAnimationMode = useAnimationStore((state) => state.setAnimationMode);

  const [name, setName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');

  if (!user) {
    return (
      <PageWrapper>
        <Button onClick={() => router.push('/sign-in')}>Sign in</Button>
      </PageWrapper>
    );
  }

  const handleSaveName = () => {
    if (name.trim().length >= 2) updateDisplayName(name.trim());
  };

  const handleSaveBio = () => {
    updateBio(bio.trim());
  };

  const handleSignOut = () => {
    signOut();
    router.push('/sign-in');
  };

  return (
    <AnimatedPage>
      <PageWrapper maxWidth="md">
        <div className="space-y-6">
          <FadeIn>
            <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl tracking-[-0.02em] text-[var(--color-text)]">
              Settings
            </h1>
          </FadeIn>

          {/* Account */}
          <FadeIn delay={50}>
            <Card variant="glass" padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <User size={18} className="text-[var(--color-primary)]" />
                <h2 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)]">Account</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
                  <Button size="sm" variant="secondary" onClick={handleSaveName} disabled={name.trim().length < 2}>Save</Button>
                </div>
                <div className="flex items-end gap-3">
                  <Input label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself" className="flex-1" />
                  <Button size="sm" variant="secondary" onClick={handleSaveBio}>Save</Button>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-muted)] font-[family-name:var(--font-body)]">Email</p>
                  <p className="text-sm text-[var(--color-text)] font-[family-name:var(--font-body)]">{user.email}</p>
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Appearance */}
          <FadeIn delay={100}>
            <Card variant="glass" padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Palette size={18} className="text-[var(--color-accent)]" />
                <h2 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)]">Appearance</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? <Moon size={16} className="text-[var(--color-muted)]" /> : <Sun size={16} className="text-[var(--color-accent)]" />}
                    <span className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text)]">Dark mode</span>
                  </div>
                  <Toggle isOn={theme === 'dark'} onToggle={toggleTheme} label="Dark mode toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[var(--color-primary)]" />
                    <span className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text)]">Full animations</span>
                  </div>
                  <Toggle
                    isOn={animationMode === 'full'}
                    onToggle={(on) => setAnimationMode(on ? 'full' : 'lite')}
                    label="Animation mode toggle"
                  />
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Learning */}
          <FadeIn delay={150}>
            <Card variant="glass" padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-[var(--color-success)]" />
                <h2 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)]">Learning</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)] mb-2">Daily goal</p>
                  <div className="flex gap-2">
                    {DAILY_GOAL_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDailyGoal(option.value)}
                        className={`px-3 py-2 rounded-[var(--radius-md)] text-sm font-[family-name:var(--font-body)] font-medium transition-all cursor-pointer active:scale-[0.96] ${
                          user.dailyGoal.targetMinutes === option.value
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)] mb-2">Default learning mode</p>
                  <div className="flex gap-2">
                    {(Object.keys(MODE_CONFIG) as LearningMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setDefaultMode(mode)}
                        className={`px-3 py-2 rounded-[var(--radius-md)] text-sm font-[family-name:var(--font-body)] font-medium transition-all cursor-pointer active:scale-[0.96] ${
                          user.defaultMode === mode
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
                        }`}
                      >
                        {MODE_CONFIG[mode].name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Notifications */}
          <FadeIn delay={200}>
            <Card variant="glass" padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-[var(--color-reward)]" />
                <h2 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)]">Notifications</h2>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'streakReminder' as const, label: 'Streak reminders' },
                  { key: 'completionCelebration' as const, label: 'Completion celebrations' },
                  { key: 'leaderboardUpdates' as const, label: 'Leaderboard updates' },
                  { key: 'newBadge' as const, label: 'New badge earned' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text)]">{item.label}</span>
                    <Toggle
                      isOn={user.notifications[item.key]}
                      onToggle={(on) => setNotifications({ [item.key]: on })}
                      label={`Toggle ${item.label}`}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Sign out */}
          <FadeIn delay={250}>
            <Button variant="ghost" fullWidth onClick={handleSignOut} leftIcon={<LogOut size={18} />}>
              Sign out
            </Button>
          </FadeIn>
        </div>
      </PageWrapper>
    </AnimatedPage>
  );
}
