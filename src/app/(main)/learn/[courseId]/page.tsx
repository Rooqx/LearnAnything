/* ============================================================
   Learning Page
   The core swipe-based learning interface.
   Content renderer + progress bar + navigation.
   ============================================================ */

'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button, Card, ProgressBar, Badge, Drawer } from '@/components/ui';
import { AnimatedPage, SwipeContainer, LumiAnimated, ConfettiBlast } from '@/components/ux';
import { useCourseStore } from '@/store/useCourseStore';
import { useXP } from '@/hooks/useXP';
import { remarkPlugins, rehypePlugins } from '@/lib/markdownConfig';
import { getCompletionPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { ContentBlock, LumiState } from '@/types';

export default function LearningPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const activeCourse = useCourseStore((state) => state.activeCourse);
  const currentPageIndex = useCourseStore((state) => state.currentPageIndex);
  const nextPage = useCourseStore((state) => state.nextPage);
  const prevPage = useCourseStore((state) => state.prevPage);
  const completePage = useCourseStore((state) => state.completePage);
  const setActiveCourse = useCourseStore((state) => state.setActiveCourse);
  const completeCourse = useCourseStore((state) => state.completeCourse);

  const { earnPageXP, lastXPEarned } = useXP();
  const [showXP, setShowXP] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [lumiState, setLumiState] = useState<LumiState>('idle');

  const upsertCourse = useCourseStore((state) => state.upsertCourse);

  const { data: fetchedCourse, isLoading: isFetching } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${courseId}`);
      const json = await res.json();
      if (!json.success || !json.data?.course) {
        throw new Error('Failed to fetch course');
      }
      return json.data.course;
    },
  });

  useEffect(() => {
    if (fetchedCourse) {
      upsertCourse(fetchedCourse);
    }
  }, [fetchedCourse, upsertCourse]);

  /* Calculate current page from flat index safely */
  const allPages = activeCourse?.modules.flatMap((m) => m.pages) || [];
  const currentPage = allPages[currentPageIndex];
  const totalPages = allPages.length || 1;
  const isLastPage = currentPageIndex >= totalPages - 1;
  const isFirstPage = currentPageIndex === 0;
  const progress = getCompletionPercentage(currentPageIndex + 1, totalPages);

  const handleNext = useCallback(() => {
    if (isLastPage) {
      /* Course complete */
      completeCourse(courseId);
      setShowCompletion(true);
      setLumiState('celebrating');
      return;
    }

    completePage();
    earnPageXP();
    setShowXP(true);
    setTimeout(() => setShowXP(false), 1000);
    nextPage();
  }, [isLastPage, completePage, earnPageXP, nextPage, courseId, completeCourse]);

  const handlePrev = useCallback(() => {
    if (!isFirstPage) prevPage();
  }, [isFirstPage, prevPage]);

  const handleExit = () => {
    router.push(`/learn/${courseId}/plan`);
  };

  if (!activeCourse || isFetching) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--color-bg)]">
        <LumiAnimated size={80} state="thinking" />
      </div>
    );
  }

  /* Course completion overlay */
  if (showCompletion) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--color-bg)] p-6">
        <ConfettiBlast trigger />
        <AnimatedPage>
          <Card variant="elevated" padding="lg" className="max-w-md text-center">
            <LumiAnimated size={100} state="celebrating" className="mx-auto mb-6" />
            <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl text-[var(--color-text)] mb-2">
              Course complete
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)] mb-6">
              You finished {activeCourse.title}
            </p>
            <Badge variant="reward" size="md" className="mb-6">
              +{activeCourse.totalPages * 10 + 200} XP earned
            </Badge>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => router.push('/dashboard')} fullWidth>
                Dashboard
              </Button>
              <Button onClick={() => router.push('/chat')} fullWidth>
                Learn more
              </Button>
            </div>
          </Card>
        </AnimatedPage>
      </div>
    );
  }

  if (!currentPage) return null;

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--color-bg)]">
      {/* Top bar — progress + close */}
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <button onClick={handleExit} className="p-2 text-[var(--color-muted)] hover:text-[var(--color-text)] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Exit learning">
            <X size={20} />
          </button>
          <div className="flex-1">
            <ProgressBar value={progress} variant="primary" size="sm" />
          </div>
          <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] shrink-0">
            {currentPageIndex + 1}/{totalPages}
          </span>
        </div>
      </div>

      {/* Content area */}
      <SwipeContainer onNext={handleNext} onPrev={handlePrev} className="flex-1">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
          {/* Page title */}
          <h2 className="font-[family-name:var(--font-heading)] font-bold text-2xl tracking-[-0.02em] text-[var(--color-text)] mb-6">
            {currentPage.title}
          </h2>

          {/* Content blocks */}
          <div className="space-y-6">
            {currentPage.blocks.map((block) => (
              <ContentBlockRenderer key={block.id} block={block} />
            ))}
          </div>
        </div>
      </SwipeContainer>

      {/* XP float notification */}
      {showXP && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-float-up">
          <Badge variant="reward" size="md">
            +{lastXPEarned} XP
          </Badge>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="sticky bottom-0 bg-[var(--color-bg)]/80 backdrop-blur-md border-t border-[var(--color-border)] px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={isFirstPage}
            leftIcon={<ChevronLeft size={18} />}
          >
            Back
          </Button>

          <button
            onClick={() => setShowHelp(true)}
            className="p-2.5 rounded-full text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Get AI help"
          >
            <HelpCircle size={20} />
          </button>

          <Button
            onClick={handleNext}
            rightIcon={isLastPage ? undefined : <ChevronRight size={18} />}
          >
            {isLastPage ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>

      {/* AI Help Drawer */}
      <Drawer isOpen={showHelp} onClose={() => setShowHelp(false)} title="AI Help">
        <div className="space-y-4">
          <div className="flex justify-center">
            <LumiAnimated size={64} state="thinking" />
          </div>
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)] text-center">
            AI Help will be available once the n8n webhook is configured. For now, try re-reading the current page or checking the previous pages for context.
          </p>
          <Button variant="secondary" fullWidth onClick={() => setShowHelp(false)}>
            Got it
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

/* ============================================================
   Content Block Renderer
   Renders individual content blocks based on their type.
   ============================================================ */

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="prose-custom font-[family-name:var(--font-body)] text-[var(--color-text)] leading-relaxed">
          <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
            {block.content}
          </ReactMarkdown>
        </div>
      );

    case 'bullet_list':
      return (
        <div className="font-[family-name:var(--font-body)] text-[var(--color-text)] leading-relaxed">
          <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
            {block.content}
          </ReactMarkdown>
        </div>
      );

    case 'code':
      return (
        <Card variant="solid" padding="none" className="overflow-hidden">
          {block.meta?.language && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-mono)]">
                {block.meta.language}
              </span>
            </div>
          )}
          <pre className="p-4 overflow-x-auto bg-[#0a0a0a] text-sm leading-relaxed">
            <code className="font-[family-name:var(--font-mono)] text-[var(--color-text)]">
              {block.content}
            </code>
          </pre>
        </Card>
      );

    case 'math':
      return (
        <Card variant="glass" padding="md" className="text-center">
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
          >
            {`$$${block.content}$$`}
          </ReactMarkdown>
        </Card>
      );

    case 'image':
      return (
        <Card variant="glass" padding="none" className="overflow-hidden">
          <div className="aspect-video bg-[var(--color-surface-elevated)] flex items-center justify-center">
            <span className="text-[var(--color-muted)] text-sm font-[family-name:var(--font-body)]">
              {block.meta?.alt || 'Image'}
            </span>
          </div>
        </Card>
      );

    case 'video':
      return (
        <Card variant="glass" padding="none" className="overflow-hidden">
          <div className="aspect-video bg-[var(--color-surface-elevated)] flex items-center justify-center">
            <span className="text-[var(--color-muted)] text-sm font-[family-name:var(--font-body)]">
              {block.meta?.title || 'Video'}
            </span>
          </div>
        </Card>
      );

    default:
      return null;
  }
}
