"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { Card, Badge, ProgressBar, Chip, Button, Drawer, EmptyState } from "@/components/ui";
import { AnimatedPage, LumiAnimated, StaggerChildren } from "@/components/ux";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { useCourseStore } from "@/store/useCourseStore";
import { MODE_COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type Filter = "all" | "in-progress" | "completed";

export default function CoursesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const courseList = useCourseStore((s) => s.courseList);

  const filtered = courseList.filter((c) => {
    if (filter === "in-progress") return !c.isCompleted;
    if (filter === "completed") return c.isCompleted;
    return true;
  });

  return (
    <AnimatedPage>
      <div className="flex h-[calc(100dvh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-[280px] md:flex-col md:border-r md:border-[var(--color-border)] md:bg-[var(--color-surface)]/50">
          <div className="p-4"><Link href="/chat"><Button variant="primary" fullWidth leftIcon={<Plus size={18} />}>New Course</Button></Link></div>
          <div className="flex-1 overflow-y-auto px-2"><ChatHistory courses={courseList} onSelect={() => {}} /></div>
        </aside>

        {/* Mobile Drawer */}
        <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Courses">
          <div className="p-4"><Link href="/chat"><Button variant="primary" fullWidth leftIcon={<Plus size={18} />}>New Course</Button></Link></div>
          <div className="px-2"><ChatHistory courses={courseList} onSelect={() => setDrawerOpen(false)} /></div>
        </Drawer>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <PageWrapper>
            <div className="flex items-center gap-3 mb-6 md:hidden">
              <button onClick={() => setDrawerOpen(true)} className="cursor-pointer text-[var(--color-muted)]"><Menu size={22} /></button>
              <h1 className="font-heading text-2xl font-bold">My Courses</h1>
            </div>
            <h1 className="hidden md:block font-heading text-2xl font-bold mb-6">My Courses</h1>

            {/* Filter chips */}
            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hidden">
              {(["all", "in-progress", "completed"] as Filter[]).map((f) => (
                <Chip key={f} label={f === "all" ? "All" : f === "in-progress" ? "In Progress" : "Completed"} isSelected={filter === f} onClick={() => setFilter(f)} />
              ))}
            </div>

            {filtered.length === 0 ? (
              <EmptyState title={filter === "all" ? "No courses yet" : `No ${filter} courses`} description="Start a new course from the chat." ctaLabel="Start a Course" ctaOnClick={() => window.location.href = "/chat"} icon={<LumiAnimated state="idle" size={80} />} />
            ) : (
              <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((course) => (
                  <Link key={course.id} href={`/learn/${course.id}`}>
                    <Card hoverable clickable>
                      <h3 className="font-heading text-base font-semibold line-clamp-2">{course.title}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="custom" customColor={MODE_COLORS[course.mode]} size="sm">{course.mode}</Badge>
                        <span className="text-xs text-[var(--color-muted)]">{course.totalModules} modules</span>
                      </div>
                      <ProgressBar value={course.progress} height="sm" className="mt-3" color={MODE_COLORS[course.mode]} />
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-[var(--color-muted)]">{formatDate(course.lastAccessedAt)}</span>
                        <Button variant="ghost" size="sm">{course.isCompleted ? "Review" : "Continue"}</Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </StaggerChildren>
            )}
          </PageWrapper>
        </div>
      </div>
    </AnimatedPage>
  );
}
