/* ============================================================
   Learning Plan Page
   Course overview with module accordion, mode badge,
   and "Start Learning" button.
   ============================================================ */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useNavigation } from '@/hooks/useNavigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  BookOpen,
  Play,
  CheckCircle2,
  Code,
  Calculator,
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';
import { AnimatedPage, FadeIn, StaggerChildren, LumiAnimated } from '@/components/ux';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useCourseStore } from '@/store/useCourseStore';
import { MODE_CONFIG } from '@/lib/constants';
import { formatDuration, getCompletionPercentage } from '@/lib/utils';

export default function LearningPlanPage() {
  const router = useNavigation();
  const params = useParams();
  const courseId = params.courseId as string;
  const courses = useCourseStore((state) => state.courses);
  const setActiveCourse = useCourseStore((state) => state.setActiveCourse);
  const upsertCourse = useCourseStore((state) => state.upsertCourse);
  const course = courses.find((c) => c.id === courseId);

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const { data: fetchedCourse, isLoading: isFetching } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const res = await axios.get(`/api/courses/${courseId}`);
      const data = res.data;
      if (!data.success || !data.data?.course) {
        throw new Error('Failed to fetch course');
      }
      return data.data.course;
    },
  });

  useEffect(() => {
    if (fetchedCourse) {
      upsertCourse(fetchedCourse);
    }
  }, [fetchedCourse, upsertCourse]);

  if (isFetching && !course) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <LumiAnimated size={80} state="thinking" />
          <p className="mt-4 font-[family-name:var(--font-body)] text-[var(--color-muted)]">
            Loading course...
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (!course) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <LumiAnimated size={80} state="idle" />
          <p className="mt-4 font-[family-name:var(--font-body)] text-[var(--color-muted)]">
            Course not found
          </p>
          <Button variant="secondary" onClick={() => router.push('/courses')} className="mt-4">
            Back to courses
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const modeConfig = MODE_CONFIG[course.mode];
  const progress = getCompletionPercentage(course.completedPages, course.totalPages);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleStartLearning = () => {
    setActiveCourse(courseId);
    router.push(`/learn/${courseId}`);
  };

  return (
    <AnimatedPage>
      <PageWrapper maxWidth="md">
        <div className="space-y-6">
          {/* Course header */}
          <FadeIn>
            <Card variant="elevated" padding="lg" gradientBorder>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge
                      variant={
                        course.mode === 'beginner'
                          ? 'primary'
                          : course.mode === 'simplified'
                            ? 'accent'
                            : 'success'
                      }
                      className="mb-2"
                    >
                      {modeConfig.name}
                    </Badge>
                    <h1 className="font-[family-name:var(--font-heading)] font-bold text-2xl tracking-[-0.02em] text-[var(--color-text)]">
                      {course.title}
                    </h1>
                    <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)] mt-1">
                      {course.description}
                    </p>
                  </div>
                  <LumiAnimated size={48} state="excited" />
                </div>

                {/* Course stats */}
                <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)] font-[family-name:var(--font-body)]">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {formatDuration(course.totalEstimatedMinutes)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} />
                    {course.modules.length} modules
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} />
                    {course.totalPages} pages
                  </span>
                </div>

                {/* Progress */}
                {course.completedPages > 0 && (
                  <div>
                    <ProgressBar value={progress} variant="primary" size="md" showLabel />
                  </div>
                )}

                <Button onClick={handleStartLearning} fullWidth leftIcon={<Play size={18} />}>
                  {course.completedPages > 0 ? 'Continue learning' : 'Start learning'}
                </Button>
              </div>
            </Card>
          </FadeIn>

          {/* Module accordion */}
          <StaggerChildren className="space-y-2">
            {course.modules.map((module, moduleIndex) => {
              const isExpanded = expandedModules.has(module.id);
              const pagesCompleted = Math.min(module.pages.length, Math.max(0, course.completedPages - course.modules.slice(0, moduleIndex).reduce((sum, m) => sum + m.pages.length, 0)));
              const isModuleComplete = course.completedModuleIds?.length > 0
                ? course.completedModuleIds.includes(module.id)
                : pagesCompleted >= module.pages.length;

              return (
                <Card key={module.id} variant="glass" padding="none">
                  {/* Module header — clickable to expand */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center gap-3 p-4 text-left cursor-pointer hover:bg-[var(--color-surface)]/30 transition-colors duration-150"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isModuleComplete ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]' : 'bg-[var(--color-surface-elevated)] text-[var(--color-muted)]'}`}>
                      {isModuleComplete ? <CheckCircle2 size={16} /> : <span className="text-xs font-semibold font-[family-name:var(--font-heading)]">{moduleIndex + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)] truncate">
                        {module.title}
                      </h3>
                      <p className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
                        {module.pages.length} pages · {formatDuration(module.estimatedMinutes)}
                      </p>
                    </div>
                    {/* Content type indicators */}
                    <div className="flex gap-1">
                      {module.contentTypes.includes('code') && <Code size={12} className="text-[var(--color-accent)]" />}
                      {module.hasQuiz && <Calculator size={12} className="text-[var(--color-success)]" />}
                    </div>
                    {isExpanded ? <ChevronDown size={16} className="text-[var(--color-muted)]" /> : <ChevronRight size={16} className="text-[var(--color-muted)]" />}
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-[var(--color-border)]">
                      <p className="text-sm text-[var(--color-muted)] font-[family-name:var(--font-body)] py-3">
                        {module.description}
                      </p>
                      <div className="space-y-1.5">
                        {module.pages.map((page, pageIndex) => {
                          const isPageComplete = course.completedChapterIds?.length > 0
                            ? course.completedChapterIds.includes(page.id)
                            : pageIndex < pagesCompleted;

                          return (
                            <div
                              key={page.id}
                              className="flex items-center gap-2 text-sm py-1.5"
                            >
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${isPageComplete ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]' : 'bg-[var(--color-surface-elevated)] text-[var(--color-muted)]'}`}>
                                {isPageComplete ? '✓' : pageIndex + 1}
                              </div>
                              <span className={`font-[family-name:var(--font-body)] ${isPageComplete ? 'text-[var(--color-muted)] line-through' : 'text-[var(--color-text)]'}`}>
                                {page.title}
                              </span>
                              <span className="ml-auto text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
                                {page.estimatedMinutes}m
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {module.hasQuiz && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-accent)] font-[family-name:var(--font-body)]">
                          <Calculator size={12} />
                          Quiz after this module
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </StaggerChildren>
        </div>
      </PageWrapper>
    </AnimatedPage>
  );
}
