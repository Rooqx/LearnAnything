/* ============================================================
   Courses Page
   Course list with filter chips and grid layout.
   ============================================================ */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, ChevronRight, Plus } from 'lucide-react';
import { Card, Badge, Chip, Button, ProgressBar, EmptyState } from '@/components/ui';
import { AnimatedPage, FadeIn, StaggerChildren, LumiAnimated } from '@/components/ux';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useCourseStore } from '@/store/useCourseStore';
import { formatDuration, formatDate, getCompletionPercentage } from '@/lib/utils';
import type { CourseStatus } from '@/types';

type FilterOption = 'all' | CourseStatus;

export default function CoursesPage() {
  const router = useRouter();
  const courses = useCourseStore((state) => state.courses);
  const [filter, setFilter] = useState<FilterOption>('all');

  const filteredCourses = filter === 'all'
    ? courses
    : courses.filter((c) => c.status === filter);

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'ready', label: 'Not started' },
  ];

  return (
    <AnimatedPage>
      <PageWrapper>
        <div className="space-y-6">
          {/* Header */}
          <FadeIn>
            <div className="flex items-center justify-between">
              <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl tracking-[-0.02em] text-[var(--color-text)]">
                My courses
              </h1>
              <Button onClick={() => router.push('/chat')} leftIcon={<Plus size={18} />} size="sm">
                New course
              </Button>
            </div>
          </FadeIn>

          {/* Filter chips */}
          <FadeIn delay={100}>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {filterOptions.map((option) => (
                <Chip
                  key={option.value}
                  selected={filter === option.value}
                  onClick={() => setFilter(option.value)}
                  size="sm"
                >
                  {option.label}
                </Chip>
              ))}
            </div>
          </FadeIn>

          {/* Course grid */}
          {filteredCourses.length === 0 ? (
            <EmptyState
              icon={<LumiAnimated size={80} state="idle" />}
              title={filter === 'all' ? 'No courses yet' : `No ${filter.replace('_', ' ')} courses`}
              description="Start a conversation to create your first course"
              actionLabel="Create course"
              onAction={() => router.push('/chat')}
            />
          ) : (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((course) => {
                const progress = getCompletionPercentage(course.completedPages, course.totalPages);
                return (
                  <Card
                    key={course.id}
                    variant="glass"
                    padding="md"
                    interactive
                    onClick={() => router.push(`/learn/${course.id}/plan`)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-[family-name:var(--font-heading)] font-semibold text-base text-[var(--color-text)] truncate">
                            {course.title}
                          </h3>
                          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-muted)] mt-0.5 line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            course.mode === 'beginner' ? 'primary'
                              : course.mode === 'simplified' ? 'accent'
                                : 'success'
                          }
                        >
                          {course.mode}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
                        <span className="flex items-center gap-1"><Clock size={12} />{formatDuration(course.totalEstimatedMinutes)}</span>
                        <span className="flex items-center gap-1"><BookOpen size={12} />{course.modules.length} modules</span>
                        <span>{formatDate(course.lastAccessedAt)}</span>
                      </div>

                      <ProgressBar value={progress} variant="primary" size="sm" />

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
                          {course.completedPages}/{course.totalPages} pages
                        </span>
                        {course.status === 'completed' && (
                          <Badge variant="success" size="sm">Complete</Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </StaggerChildren>
          )}
        </div>
      </PageWrapper>
    </AnimatedPage>
  );
}
