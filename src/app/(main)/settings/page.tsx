"use client";

import { useState } from "react";
import { Sun, Moon, Bell, Palette, Sparkles, LogOut, User } from "lucide-react";
import { Input, Button, Toggle, Card, Chip } from "@/components/ui";
import { AnimatedPage, FadeIn } from "@/components/ux";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useThemeStore } from "@/store/useThemeStore";
import { useAnimationStore } from "@/store/useAnimationStore";
import { useUserStore } from "@/store/useUserStore";
import { DAILY_GOAL_OPTIONS, MAX_DISPLAY_NAME_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const { animationMode, setAnimationMode } = useAnimationStore();
  const profile = useUserStore((s) => s.profile);
  const notifications = useUserStore((s) => s.notifications);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const updateNotifications = useUserStore((s) => s.updateNotifications);
  const setDailyGoalMinutes = useUserStore((s) => s.setDailyGoalMinutes);

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio || "");
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({ displayName, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AnimatedPage>
      <PageWrapper className="max-w-2xl mx-auto">
        <h1 className="font-heading text-2xl font-bold md:text-3xl">Settings</h1>

        <div className="mt-6 space-y-8">
          {/* Profile Section */}
          <FadeIn>
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-[var(--color-primary)]" />
                <h2 className="font-heading text-lg font-semibold">Profile</h2>
              </div>
              <div className="space-y-4">
                <Input id="settingsName" label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME_LENGTH))} placeholder="Your name" />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="bio">Bio</label>
                  <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself" rows={3} className="w-full rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:shadow-[0_0_0_3px_rgba(108,60,225,0.15)] resize-none" />
                </div>
                <Button onClick={handleSaveProfile}>{saved ? "Saved!" : "Save Changes"}</Button>
              </div>
            </Card>
          </FadeIn>

          {/* Appearance */}
          <FadeIn delay={80}>
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Palette size={20} className="text-[var(--color-primary)]" />
                <h2 className="font-heading text-lg font-semibold">Appearance</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                    <span className="text-sm">Dark Mode</span>
                  </div>
                  <Toggle isOn={theme === "dark"} onToggle={toggleTheme} />
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Animation */}
          <FadeIn delay={160}>
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-[var(--color-primary)]" />
                <h2 className="font-heading text-lg font-semibold">Animations</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Full Animations</p>
                  <p className="text-xs text-[var(--color-muted)]">Richer experience, more GPU usage</p>
                </div>
                <Toggle isOn={animationMode === "full"} onToggle={() => setAnimationMode(animationMode === "full" ? "lite" : "full")} />
              </div>
            </Card>
          </FadeIn>

          {/* Daily Goal */}
          <FadeIn delay={240}>
            <Card padding="lg">
              <h2 className="font-heading text-lg font-semibold mb-4">Daily Goal</h2>
              <div className="flex flex-wrap gap-2">
                {DAILY_GOAL_OPTIONS.map((g) => (
                  <Chip key={g.minutes} label={g.label} isSelected={profile.dailyGoalMinutes === g.minutes} onClick={() => { setDailyGoalMinutes(g.minutes); updateProfile({ dailyGoalMinutes: g.minutes }); }} />
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Notifications */}
          <FadeIn delay={320}>
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={20} className="text-[var(--color-primary)]" />
                <h2 className="font-heading text-lg font-semibold">Notifications</h2>
              </div>
              <div className="space-y-4">
                {([
                  { key: "dailyStreakReminder" as const, label: "Daily Streak Reminder" },
                  { key: "courseCompletionCelebration" as const, label: "Course Completion Celebration" },
                  { key: "leaderboardUpdates" as const, label: "Leaderboard Updates" },
                  { key: "newBadgeEarned" as const, label: "New Badge Earned" },
                ]).map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{label}</span>
                    <Toggle isOn={notifications[key]} onToggle={() => updateNotifications({ [key]: !notifications[key] })} />
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Sign Out */}
          <FadeIn delay={400}>
            <Button variant="danger" leftIcon={<LogOut size={18} />}>Sign Out</Button>
          </FadeIn>
        </div>
      </PageWrapper>
    </AnimatedPage>
  );
}
