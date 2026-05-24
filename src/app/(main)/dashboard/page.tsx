"use client";

import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { AnimatedPage, LumiAnimated, StaggerChildren, FadeIn } from "@/components/ux";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { StatCard } from "@/components/dashboard/StatCard";
import { DailyGoalRing } from "@/components/dashboard/DailyGoalRing";
import { StreakBadge } from "@/components/dashboard/StreakBadge";
import { XPLevelBar } from "@/components/dashboard/XPLevelBar";
import { RecentCourses } from "@/components/dashboard/RecentCourses";
import { useUserStore } from "@/store/useUserStore";
import { useCourseStore } from "@/store/useCourseStore";
import { getTimeOfDayGreeting, formatXP } from "@/lib/utils";

export default function DashboardPage() {
  const displayName = useUserStore((s) => s.profile.displayName);
  const streak = useUserStore((s) => s.streak.currentStreak);
  const stats = useUserStore((s) => s.stats);
  const courseList = useCourseStore((s) => s.courseList);
  const greeting = getTimeOfDayGreeting();

  const hasAnyCourses = courseList.length > 0;

  return (
    <AnimatedPage>
      <PageWrapper>
        {/* Welcome + Streak */}
        <FadeIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <LumiAnimated state="idle" size={48} />
              <div>
                <h1 className="font-heading text-2xl font-bold md:text-3xl">
                  Good {greeting}, {displayName || "Learner"}
                </h1>
                <p className="text-sm text-[var(--color-muted)]">Ready to learn something new?</p>
              </div>
            </div>
            <StreakBadge streak={streak} />
          </div>
        </FadeIn>

        {hasAnyCourses ? (
          <>
            {/* Stat Cards */}
            <StaggerChildren className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard label="Courses Created" value={stats.totalCoursesCreated} icon="BookPlus" />
              <StatCard label="Completed" value={stats.coursesCompleted} icon="CheckCircle" />
              <StatCard label="In Progress" value={stats.coursesInProgress} icon="Clock" />
              <StatCard label="Total XP" value={formatXP(stats.totalXP)} icon="Sparkles" />
            </StaggerChildren>

            {/* Two column on desktop */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
              <div className="space-y-6">
                <XPLevelBar />
                <RecentCourses />
              </div>
              <div className="flex flex-col items-center gap-6">
                <DailyGoalRing />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex gap-3">
              <Link href="/chat"><Button variant="primary" leftIcon={<Plus size={18} />}>New Course</Button></Link>
              <Link href="/courses"><Button variant="secondary" leftIcon={<BookOpen size={18} />}>Browse Courses</Button></Link>
            </div>
          </>
        ) : (
          <div className="mt-12">
            <EmptyState
              title="Start your first course!"
              description="Tell our AI what you want to learn, and we'll build you a personalized course in seconds."
              ctaLabel="Create Your First Course"
              ctaOnClick={() => window.location.href = "/chat"}
              icon={<LumiAnimated state="idle" size={80} />}
            />
          </div>
        )}
      </PageWrapper>
    </AnimatedPage>
  );
}
