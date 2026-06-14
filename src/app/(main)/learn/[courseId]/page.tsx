/* ============================================================
   Learning Page
   The core swipe-based learning interface.
   Content renderer + progress bar + navigation.
   ============================================================ */

'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useNavigation } from '@/hooks/useNavigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  HelpCircle,
  MessageSquareShare,
  Send,
  Sparkles
} from 'lucide-react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Button, Card, ProgressBar, Badge, Drawer } from '@/components/ui';
import { AnimatedPage, SwipeContainer, LumiAnimated, ConfettiBlast, ReadAloudButton, VoiceChatButton, LineChartViewer, MermaidViewer } from '@/components/ux';
import { useCourseStore } from '@/store/useCourseStore';
import { useXP } from '@/hooks/useXP';
import { remarkPlugins, rehypePlugins } from '@/lib/markdownConfig';
import { getCompletionPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { ContentBlock, LumiState } from '@/types';
import { completeCourseInDB, markChapterCompleteInDB } from '@/lib/api';

export default function LearningPage() {
  const router = useNavigation();
  const params = useParams();
  const courseId = params.courseId as string;

  const activeCourse = useCourseStore((state) => state.activeCourse);
  const currentPageIndex = useCourseStore((state) => state.currentPageIndex);
  const currentModuleIndex = useCourseStore((state) => state.currentModuleIndex);
  const nextPage = useCourseStore((state) => state.nextPage);
  const prevPage = useCourseStore((state) => state.prevPage);
  const completePage = useCourseStore((state) => state.completePage);
  const completeChapter = useCourseStore((state) => state.completeChapter);
  const setActiveCourse = useCourseStore((state) => state.setActiveCourse);
  const completeCourse = useCourseStore((state) => state.completeCourse);

  const { earnPageXP, lastXPEarned } = useXP();
  const [showXP, setShowXP] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [lumiState, setLumiState] = useState<LumiState>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Tooltip State
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState(0);
  const tooltips = ['Ask a question', 'Don\'t understand?', 'Highlight text to ask'];

  // Text Selection State
  const [textSelection, setTextSelection] = useState<{ text: string, x: number, y: number } | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "I'm your AI tutor. Ask me anything about this course!" }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Idle Timer for Tooltip
  useEffect(() => {
    if (isChatOpen || showHelp) {
      setShowTooltip(false);
      return;
    }
    const timer = setTimeout(() => setShowTooltip(true), 60000);
    return () => clearTimeout(timer);
  }, [isChatOpen, showHelp]);

  // Tooltip Cycling
  useEffect(() => {
    if (!showTooltip) return;
    const interval = setInterval(() => {
      setTooltipIndex(prev => (prev + 1) % tooltips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [showTooltip]);

  // Text Selection Listener
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (!text) {
        setTextSelection(null);
        return;
      }
      
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setTextSelection({ text, x: rect.left + rect.width / 2, y: rect.top - 40 });
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, []);


  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: newMessage }]);
    setNewMessage('');
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: 'This is a mocked response. My webhook will be integrated soon!' }]);
    }, 1000);
  };

  const upsertCourse = useCourseStore((state) => state.upsertCourse);

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



  /* Calculate current page from flat index safely */
  const allPages = activeCourse?.modules.flatMap((m) => m.pages) || [];
  const currentPage = allPages[currentPageIndex];
  const totalPages = allPages.length || 1;
  const isLastPage = currentPageIndex >= totalPages - 1;
  const isFirstPage = currentPageIndex === 0;
  const progress = getCompletionPercentage(currentPageIndex + 1, totalPages);

  const handleNext = useCallback(() => {
    // Current module to track completion
    const currentModule = activeCourse?.modules[currentModuleIndex];
    const chapterId = currentPage?.id;
    const moduleId = currentModule?.id;

    if (chapterId && activeCourse) {
      completeChapter(activeCourse.id, chapterId, moduleId);
      markChapterCompleteInDB(activeCourse.id, chapterId, moduleId).catch(console.error);
    }

    if (isLastPage) {
      /* Course complete */
      completeCourse(courseId);
      completeCourseInDB(courseId).catch(console.error);
      setShowCompletion(true);
      setLumiState('celebrating');
      return;
    }

    completePage();
    earnPageXP(courseId);
    setShowXP(true);
    setTimeout(() => setShowXP(false), 1000);
    nextPage();
    
    // Imperative scroll reset
    const container = document.getElementById('swipe-scroll-container');
    if (container) container.scrollTop = 0;
    window.scrollTo(0, 0);
    setTimeout(() => {
      const el = document.getElementById('swipe-scroll-container');
      if (el) el.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 50);
  }, [isLastPage, completePage, earnPageXP, nextPage, courseId, completeCourse, activeCourse, currentModuleIndex, currentPage, completeChapter]);

  const handlePrev = useCallback(() => {
    if (!isFirstPage) {
      prevPage();
      
      // Imperative scroll reset
      const container = document.getElementById('swipe-scroll-container');
      if (container) container.scrollTop = 0;
      window.scrollTo(0, 0);
      setTimeout(() => {
        const el = document.getElementById('swipe-scroll-container');
        if (el) el.scrollTop = 0;
        window.scrollTo(0, 0);
      }, 50);
    }
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
          <Card variant="elevated" padding="lg" className="max-w-md w-full mx-auto flex flex-col items-center text-center">
            <LumiAnimated size={100} state="celebrating" className="mb-6" />
            <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl text-[var(--color-text)] mb-2">
              Course complete
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)] mb-6">
              You finished {activeCourse.title}
            </p>
            <Badge variant="reward" size="md" className="mb-8">
              +{activeCourse.totalPages * 10 + 200} XP earned
            </Badge>
            <div className="flex w-full gap-3">
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
    <div ref={scrollRef} className="fixed inset-0 z-50 overflow-y-auto flex flex-col bg-[var(--color-bg)]">
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
        <article key={currentPageIndex} className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
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
        </article>
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

          <div className="flex items-center gap-1">
            {/* Read current page content aloud */}
            <ReadAloudButton blocks={currentPage.blocks} />

            <button
              onClick={() => setShowHelp(true)}
              className="p-2.5 rounded-full text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Get AI help"
            >
              <HelpCircle size={20} />
            </button>

            {/* Voice chat with AI tutor (placeholder) */}
            <VoiceChatButton
              courseId={courseId}
              currentPageContent={currentPage}
            />
          </div>

          <Button
            onClick={handleNext}
            rightIcon={isLastPage ? undefined : <ChevronRight size={18} />}
          >
            {isLastPage ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>

      {/* Contextual Text Selection Pop-up */}
      <AnimatePresence>
        {textSelection && !isChatOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{ top: textSelection.y, left: textSelection.x }}
            className="fixed z-[60] -translate-x-1/2 -translate-y-full px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform whitespace-nowrap"
            onClick={() => {
              setIsChatOpen(true);
              setNewMessage(`Explain this: "${textSelection.text}"`);
              setTextSelection(null);
              window.getSelection()?.removeAllRanges();
            }}
          >
            <Sparkles size={14} />
            Ask AI about this
          </motion.button>
        )}
      </AnimatePresence>

      {/* Ask Question Chat UI (Framer Motion) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            drag
            dragListener={false}
            dragControls={dragControls}
            dragMomentum={false}
            className="fixed bottom-24 right-4 z-[60] w-[calc(100vw-32px)] md:w-[380px] origin-bottom-right"
          >
            <Card variant="glass" padding="none" className="flex flex-col h-[500px] max-h-[70vh] border border-[var(--color-primary)]/20 shadow-2xl overflow-hidden">
              <div 
                className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="flex items-center gap-2 pointer-events-none">
                  <Sparkles size={18} className="text-[var(--color-primary)]" />
                  <span className="font-semibold text-sm">AI Tutor</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-1.5 hover:bg-[var(--color-bg)] rounded-full transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("max-w-[85%] rounded-2xl p-3 text-sm", msg.role === 'user' ? "ml-auto bg-[var(--color-primary)] text-white rounded-br-sm" : "bg-[var(--color-surface-elevated)] text-[var(--color-text)] rounded-bl-sm")}>
                    {msg.content}
                  </div>
                ))}
              </div>
              
              <div className="p-3 bg-[var(--color-surface-elevated)]/30 border-t border-[var(--color-border)]">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask about this topic..."
                    className="flex-1 bg-[var(--color-bg)] rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none border border-[var(--color-border)] focus:border-[var(--color-primary)]/50 transition-colors shadow-inner"
                  />
                  <button type="submit" disabled={!newMessage.trim()} className="absolute right-1 top-1 bottom-1 aspect-square flex items-center justify-center bg-[var(--color-primary)] text-white rounded-full disabled:opacity-50 transition-transform hover:scale-105 active:scale-95">
                    <Send size={14} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => { setIsChatOpen(true); setShowTooltip(false); }}
        className={cn("fixed bottom-20 right-4 z-[50] rounded-full bg-[var(--color-primary)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 overflow-hidden", isChatOpen ? "scale-0 opacity-0 pointer-events-none" : "flex items-center")}
        aria-label="Ask AI Tutor"
      >
        <div className="p-4 relative z-10 flex items-center justify-center shrink-0">
          <MessageSquareShare size={24} />
        </div>
        <AnimatePresence mode="popLayout">
          {showTooltip && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              className="overflow-hidden whitespace-nowrap pr-5 pl-1"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={tooltipIndex}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block text-sm font-semibold"
                >
                  {tooltips[tooltipIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

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
const markdownComponents = {
  code(props: any) {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');

    // If it's a block of code (triple backticks)
    if (match) {
      const language = match[1];
      const codeString = String(children).replace(/\n$/, "");

      if (language === "svg") {
        return (
          <div
            className="my-8 flex justify-center p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: codeString }}
          />
        );
      }

      if (language === "chart") {
        try {
          const chartData = JSON.parse(codeString);
          return <LineChartViewer payload={chartData} />;
        } catch (e) {
          return (
            <div className="text-red-500 text-sm my-4 text-center bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)]">
              Failed to parse chart data.
            </div>
          );
        }
      }

      if (language === "mermaid") {
        return <MermaidViewer chart={codeString} />;
      }

      return (
        <Card variant="solid" padding="none" className="overflow-hidden my-4 border border-[#222]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#222] bg-[#111]">
            <span className="text-xs text-gray-400 font-[family-name:var(--font-mono)]">
              {match[1]}
            </span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
            </div>
          </div>
          <pre className="p-4 overflow-x-auto bg-[#0a0a0a] text-sm leading-relaxed scrollbar-hidden">
            <code className="font-[family-name:var(--font-mono)] text-gray-300" {...rest}>
              {children}
            </code>
          </pre>
        </Card>
      );
    }
    
    // Inline code
    return (
      <code className="bg-[var(--color-surface-elevated)] text-[var(--color-primary)] px-1.5 py-0.5 rounded-md text-sm font-[family-name:var(--font-mono)] whitespace-nowrap" {...rest}>
        {children}
      </code>
    );
  },
  
  // Intercept block math divs (standard remark-math output)
  div(props: any) {
    const { className, ...rest } = props;
    if (className && (className.includes('math-display') || className.includes('katex-display'))) {
      return (
        <Card variant="glass" padding="md" className="text-center my-6 overflow-x-auto border-dashed border-2 border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5">
          <div className={className} {...rest} />
        </Card>
      );
    }
    return <div className={className} {...rest} />;
  },

  // Intercept block math spans (rehype-katex output)
  span(props: any) {
    const { className, ...rest } = props;
    if (className && className.includes('katex-display')) {
      return (
        <Card variant="glass" padding="md" className="text-center my-6 overflow-x-auto border-dashed border-2 border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5">
          <span className={className} {...rest} />
        </Card>
      );
    }
    return <span className={className} {...rest} />;
  },

  // Premium Typography & Spacing Overrides
  p({ node, ...props }: any) {
    return <p className="mb-6 leading-[1.8] text-[var(--color-text-secondary)] text-lg" {...props} />;
  },
  h1({ node, ...props }: any) {
    return <h1 className="mt-16 mb-8 text-4xl font-bold tracking-tight text-[var(--color-text)] leading-tight" {...props} />;
  },
  h2({ node, ...props }: any) {
    return <h2 className="mt-14 mb-6 text-2xl font-bold tracking-tight text-[var(--color-text)] leading-snug" {...props} />;
  },
  h3({ node, ...props }: any) {
    return <h3 className="mt-10 mb-4 text-xl font-semibold tracking-tight text-[var(--color-text)] leading-snug" {...props} />;
  },
  ul({ node, ...props }: any) {
    return <ul className="mb-8 ml-6 list-disc marker:text-[var(--color-primary)] space-y-3" {...props} />;
  },
  ol({ node, ...props }: any) {
    return <ol className="mb-8 ml-6 list-decimal marker:text-[var(--color-primary)] marker:font-medium space-y-3" {...props} />;
  },
  li({ node, ...props }: any) {
    return <li className="text-[var(--color-text-secondary)] leading-[1.8] text-lg pl-2" {...props} />;
  },
  blockquote({ node, ...props }: any) {
    return (
      <blockquote 
        className="my-8 pl-6 border-l-4 border-[var(--color-primary)]/40 italic text-[var(--color-text-secondary)] bg-[var(--color-surface-elevated)]/30 py-4 pr-4 rounded-r-2xl" 
        {...props} 
      />
    );
  },
  strong({ node, ...props }: any) {
    return <strong className="font-semibold text-[var(--color-text)]" {...props} />;
  }
};

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  // Preprocess markdown to fix AI formatting quirks:
  // remark-math requires $$ equations to be multiline to parse them as block math.
  // If the AI outputs $$\text{...}$$ on a single line, it gets parsed as inline math.
  const processedContent = block.content
    ? block.content.replace(/\$\$([\s\S]*?)\$\$/g, (match, p1) => {
        return `\n\n$$\n${p1.trim()}\n$$\n\n`;
      })
    : '';

  switch (block.type) {
    case 'text':
      return (
        <div className="prose-custom font-[family-name:var(--font-body)] text-[var(--color-text)] leading-relaxed">
          <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={markdownComponents}>
            {processedContent}
          </ReactMarkdown>
        </div>
      );

    case 'bullet_list':
      return (
        <div className="font-[family-name:var(--font-body)] text-[var(--color-text)] leading-relaxed">
          <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={markdownComponents}>
            {processedContent}
          </ReactMarkdown>
        </div>
      );

    case 'code':
      return (
        <Card variant="solid" padding="none" className="overflow-hidden my-4 border border-[#222]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#222] bg-[#111]">
            <span className="text-xs text-gray-400 font-[family-name:var(--font-mono)]">
              {block.meta?.language || 'code'}
            </span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
            </div>
          </div>
          <pre className="p-4 overflow-x-auto bg-[#0a0a0a] text-sm leading-relaxed scrollbar-hidden">
            <code className="font-[family-name:var(--font-mono)] text-gray-300">
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
