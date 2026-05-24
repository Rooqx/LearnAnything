"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button, ProgressBar } from "@/components/ui";
import { AnimatedPage, SwipeContainer } from "@/components/ux";
import { LearningPage } from "@/components/learning/LearningPage";
import { AIHelpButton } from "@/components/learning/AIHelpButton";
import { AIHelpDrawer } from "@/components/learning/AIHelpDrawer";
import { QuizPopup } from "@/components/learning/QuizPopup";
import { useCourseStore } from "@/store/useCourseStore";
import { useXP } from "@/hooks/useXP";
import { LumiAnimated, ConfettiBlast } from "@/components/ux";
import { EmptyState } from "@/components/ui";
import { XP_REWARDS } from "@/lib/constants";
import { cn, truncate, calculateProgress } from "@/lib/utils";

export default function LearningInterfacePage() {
  const router = useRouter();
  const activeCourse = useCourseStore((s) => s.activeCourse);
  const updateProgress = useCourseStore((s) => s.updateProgress);
  const completeCourse = useCourseStore((s) => s.completeCourse);
  const { earnXP } = useXP();

  const [helpOpen, setHelpOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  if (!activeCourse) {
    return (
      <AnimatedPage>
        <div className="flex min-h-dvh items-center justify-center px-4">
          <EmptyState title="No course loaded" description="Start a course from the chat." ctaLabel="Go to Chat" ctaOnClick={() => router.push("/chat")} icon={<LumiAnimated state="idle" size={80} />} />
        </div>
      </AnimatedPage>
    );
  }

  const { currentModuleIndex, currentPageIndex, modules } = activeCourse;
  const currentModule = modules[currentModuleIndex];
  const currentPage = currentModule?.pages[currentPageIndex];
  const totalPages = modules.reduce((sum, m) => sum + m.pages.length, 0);
  const completedPages = modules.slice(0, currentModuleIndex).reduce((sum, m) => sum + m.pages.length, 0) + currentPageIndex;
  const progress = calculateProgress(completedPages, totalPages);

  const goNext = () => {
    if (currentPageIndex < currentModule.pages.length - 1) {
      updateProgress(currentModuleIndex, currentPageIndex + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      /* Module completed — check for quiz */
      earnXP(XP_REWARDS.MODULE_COMPLETE);
      if (currentModule.quiz && currentModule.quiz.length > 0) {
        setQuizOpen(true);
      } else {
        updateProgress(currentModuleIndex + 1, 0);
      }
    } else {
      /* Course completed */
      earnXP(XP_REWARDS.COURSE_COMPLETE);
      completeCourse();
      setShowCompletion(true);
    }
  };

  const goPrev = () => {
    if (currentPageIndex > 0) {
      updateProgress(currentModuleIndex, currentPageIndex - 1);
    } else if (currentModuleIndex > 0) {
      const prevModule = modules[currentModuleIndex - 1];
      updateProgress(currentModuleIndex - 1, prevModule.pages.length - 1);
    }
  };

  const isFirstPage = currentModuleIndex === 0 && currentPageIndex === 0;

  return (
    <AnimatedPage>
      <div className="flex min-h-dvh flex-col">
        {/* Header bar */}
        <div className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl px-4 py-3">
          <div className="mx-auto flex max-w-[720px] items-center gap-3">
            <button onClick={() => router.push("/courses")} className="cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-text)]"><X size={22} /></button>
            <span className="flex-1 truncate text-center text-sm font-medium">{truncate(activeCourse.title, 30)}</span>
            <span className="text-xs text-[var(--color-muted)]">M{currentModuleIndex + 1}/{modules.length}</span>
          </div>
          <ProgressBar value={progress} height="sm" className="mx-auto mt-2 max-w-[720px]" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <SwipeContainer onSwipeLeft={goNext} onSwipeRight={isFirstPage ? undefined : goPrev}>
            {currentPage && <LearningPage page={currentPage} />}
          </SwipeContainer>
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 z-20 border-t border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-[720px] items-center justify-between">
            <Button variant="ghost" onClick={goPrev} disabled={isFirstPage} leftIcon={<ChevronLeft size={18} />}>Prev</Button>
            <span className="text-xs text-[var(--color-muted)]">{completedPages + 1} / {totalPages}</span>
            <Button variant="primary" onClick={goNext} rightIcon={<ChevronRight size={18} />}>Next</Button>
          </div>
        </div>

        {/* Desktop nav arrows */}
        <div className="hidden md:block">
          <button onClick={goPrev} disabled={isFirstPage} className={cn("fixed left-8 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full glass cursor-pointer transition-all hover:shadow-md", isFirstPage && "opacity-30 cursor-not-allowed")}><ChevronLeft size={24} /></button>
          <button onClick={goNext} className="fixed right-8 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full glass cursor-pointer transition-all hover:shadow-md"><ChevronRight size={24} /></button>
        </div>

        {/* Floating AI help */}
        <AIHelpButton onClick={() => setHelpOpen(true)} />
        <AIHelpDrawer isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

        {/* Quiz popup */}
        {currentModule?.quiz && (
          <QuizPopup isOpen={quizOpen} onClose={() => { setQuizOpen(false); updateProgress(currentModuleIndex + 1, 0); }} questions={currentModule.quiz} onComplete={(correct, xp) => { earnXP(xp); }} />
        )}

        {/* Course completion overlay */}
        {showCompletion && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-bg)]/95 backdrop-blur-md">
            <ConfettiBlast trigger={true} />
            <LumiAnimated state="celebrating" size={160} />
            <h1 className="mt-6 font-heading text-3xl font-bold">You crushed it!</h1>
            <p className="mt-2 text-[var(--color-muted)]">{activeCourse.title}</p>
            <div className="mt-6 flex gap-4">
              <Button variant="primary" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
