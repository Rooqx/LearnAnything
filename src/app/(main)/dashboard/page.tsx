/* ============================================================
   Dashboard Page
   The main hub page after login.
   Time-aware greeting, stat cards, daily goal ring, XP bar,
   recent courses, and quick actions.
   ============================================================ */

'use client';

import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Flame,
  Zap,
  Trophy,
  Target,
  MessageSquare,
  ChevronRight,
  Clock,
} from 'lucide-react';
import {
  Card,
  Badge,
  Button,
  ProgressBar,
  ProgressRing,
  EmptyState,
} from '@/components/ui';
import { AnimatedPage, FadeIn, StaggerChildren, LumiAnimated } from '@/components/ux';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useUserStore } from '@/store/useUserStore';
import { useCourseStore } from '@/store/useCourseStore';
import {
  getTimeOfDayGreeting,
  formatXP,
  getCompletionPercentage,
  formatDate,
  formatDuration,
} from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const courses = useCourseStore((state) => state.courses);

  /* Redirect to auth if no user */
  if (!user) {
    return (
      <PageWrapper>
        <EmptyState
          icon={<LumiAnimated size={100} state="idle" />}
          title="Welcome to LearnAnything"
          description="Sign in to start your learning journey"
          actionLabel="Sign in"
          onAction={() => router.push('/sign-in')}
        />
      </PageWrapper>
    );
  }

  const recentCourses = courses
    .filter((c) => c.status !== 'generating')
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
    .slice(0, 3);

  const greeting = getTimeOfDayGreeting();
  const dailyProgress = getCompletionPercentage(
    user.dailyGoal.completedMinutes,
    user.dailyGoal.targetMinutes
  );
  const xpProgress = getCompletionPercentage(
    user.xp.xpInCurrentLevel,
    user.xp.xpInCurrentLevel + user.xp.xpToNextLevel
  );

  return (
    <AnimatedPage>
      <PageWrapper>
        <div className="space-y-8">
          {/* Greeting */}
          <FadeIn>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)] text-sm mb-1">
                  {greeting}
                </p>
                <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl tracking-[-0.02em] text-[var(--color-text)]">
                  {user.displayName}
                </h1>
              </div>
              <LumiAnimated
                size={56}
                state={user.streak.todayCompleted ? 'celebrating' : 'idle'}
              />
            </div>
          </FadeIn>

          {/* Stat cards grid */}
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* XP Card */}
            <Card variant="glass" padding="md" gradientBorder>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-[var(--color-reward)]" />
                <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] uppercase tracking-wide">
                  Total XP
                </span>
              </div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)]">
                {formatXP(user.xp.totalXP)}
              </p>
              <p className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] mt-1">
                Level {user.xp.currentLevel}
              </p>
            </Card>

            {/* Streak Card */}
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={16} className="text-[var(--color-primary)]" />
                <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] uppercase tracking-wide">
                  Streak
                </span>
              </div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)]">
                {user.streak.currentStreak}
              </p>
              <p className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] mt-1">
                {user.streak.todayCompleted ? 'On track today' : 'Learn today to keep it'}
              </p>
            </Card>

            {/* Courses Card */}
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} className="text-[var(--color-success)]" />
                <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] uppercase tracking-wide">
                  Courses
                </span>
              </div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)]">
                {user.totalCoursesCompleted}
              </p>
              <p className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] mt-1">
                {user.coursesInProgress} in progress
              </p>
            </Card>

            {/* Leaderboard Card */}
            <Card variant="glass" padding="md" interactive onClick={() => router.push('/leaderboard')}>
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-[var(--color-accent)]" />
                <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] uppercase tracking-wide">
                  Rank
                </span>
              </div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)]">
                #12
              </p>
              <p className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] mt-1">
                This week
              </p>
            </Card>
          </StaggerChildren>

          {/* Daily Goal + XP Level */}
          <FadeIn delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Daily Goal Ring */}
              <Card variant="glass" padding="lg">
                <div className="flex items-center gap-6">
                  <ProgressRing
                    value={dailyProgress}
                    size={100}
                    text={`${user.dailyGoal.completedMinutes}m`}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Target size={16} className="text-[var(--color-primary)]" />
                      <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)]">
                        Daily goal
                      </h3>
                    </div>
                    <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)]">
                      {user.dailyGoal.isComplete
                        ? 'Goal reached — keep going'
                        : `${user.dailyGoal.targetMinutes - user.dailyGoal.completedMinutes}m remaining`}
                    </p>
                    {user.dailyGoal.isComplete && (
                      <Badge variant="success" size="sm" className="mt-2">
                        Complete
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>

              {/* XP Level Progress */}
              <Card variant="glass" padding="lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-[var(--color-reward)]" />
                      <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)]">
                        Level {user.xp.currentLevel}
                      </h3>
                    </div>
                    <span className="text-sm text-[var(--color-muted)] font-[family-name:var(--font-body)]">
                      {user.xp.xpToNextLevel} XP to next
                    </span>
                  </div>
                  <ProgressBar value={xpProgress} variant="reward" size="md" />
                </div>
              </Card>
            </div>
          </FadeIn>

          {/* Quick Actions */}
          <FadeIn delay={300}>
            <div className="flex gap-3">
              <Button
              className='text-nowrap text-sm md:text-base'
                onClick={() => router.push('/chat')}
                leftIcon={<MessageSquare size={18} />}
              >
                Learn something new
              </Button>
              <Button
                className='text-nowrap text-sm md:text-base'
                variant="secondary"
                onClick={() => router.push('/courses')}
                leftIcon={<BookOpen size={18} />}
              >
                My courses
              </Button>
            </div>
          </FadeIn>

          {/* Recent Courses */}
          <FadeIn delay={400}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-[family-name:var(--font-heading)] font-semibold text-xl text-[var(--color-text)]">
                  Recent courses
                </h2>
                {recentCourses.length > 0 && (
                  <button
                    onClick={() => router.push('/courses')}
                    className="text-sm text-[var(--color-primary)] font-[family-name:var(--font-body)] font-medium flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    View all <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {recentCourses.length === 0 ? (
                <Card variant="glass" padding="lg">
                  <EmptyState
                    icon={<LumiAnimated size={64} state="idle" />}
                    title="No courses yet"
                    description="Start a conversation with our AI to generate your first course"
                    actionLabel="Start learning"
                    onAction={() => router.push('/chat')}
                  />
                </Card>
              ) : (
                <div className="space-y-3">
                  {recentCourses.map((course) => (
                    <Card
                      key={course.id}
                      variant="glass"
                      padding="md"
                      interactive
                      onClick={() => router.push(`/learn/${course.id}/plan`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-[family-name:var(--font-heading)] font-semibold text-base text-[var(--color-text)] truncate">
                              {course.title}
                            </h3>
                            <Badge
                              variant={
                                course.mode === 'beginner'
                                  ? 'primary'
                                  : course.mode === 'simplified'
                                    ? 'accent'
                                    : 'success'
                              }
                            >
                              {course.mode}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatDuration(course.totalEstimatedMinutes)}
                            </span>
                            <span>{formatDate(course.lastAccessedAt)}</span>
                          </div>
                          <ProgressBar
                            value={getCompletionPercentage(course.completedPages, course.totalPages)}
                            variant="primary"
                            size="sm"
                            className="mt-2"
                          />
                        </div>
                        <ChevronRight size={20} className="text-[var(--color-muted)] shrink-0 ml-3" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </PageWrapper>
    </AnimatedPage>
  );
}
