/* ============================================================
   Chat Page
   The course generation interface.
   Empty state → active chat → mode selection → loading →
   navigate to learning plan.
   ============================================================ */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send,
  Sprout,
  Zap,
  Timer,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button, Card, Chip, Badge } from '@/components/ui';
import { AnimatedPage, FadeIn, LumiAnimated, StaggerChildren } from '@/components/ux';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useCourseStore } from '@/store/useCourseStore';
import { useUserStore } from '@/store/useUserStore';
import { generateCourse } from '@/lib/api';
import { SUGGESTION_CHIPS, MODE_CONFIG, LOADING_MESSAGES, LOADING_MESSAGE_INTERVAL } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import type { LearningMode, LumiState } from '@/types';

/** Icon mapping for learning modes */
const MODE_ICONS = {
  beginner: Sprout,
  simplified: Zap,
  quick: Timer,
} as const;

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const addCourse = useCourseStore((state) => state.addCourse);
  const isLoading = useCourseStore((state) => state.isLoading);
  const setLoading = useCourseStore((state) => state.setLoading);
  const setError = useCourseStore((state) => state.setError);
  const error = useCourseStore((state) => state.error);
  const startCourse = useUserStore((state) => state.startCourse);
  const incrementCoursesCreated = useUserStore((state) => state.incrementCoursesCreated);
  const user = useUserStore((state) => state.user);

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedMode, setSelectedMode] = useState<LearningMode | null>(null);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [lumiState, setLumiState] = useState<LumiState>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showModeSelector]);

  /* Rotate loading messages */
  useEffect(() => {
    if (!isLoading) return;
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[index]);
    }, LOADING_MESSAGE_INTERVAL);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentTopic(trimmed);
    setInputValue('');
    setLumiState('thinking');

    /* Show assistant response and mode selector */
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `Great choice! I can create a course on "${trimmed}" for you. How would you like to learn it?`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setShowModeSelector(true);
      setLumiState('excited');
    }, 800);
  }, [inputValue, isLoading]);

  const handleModeSelect = async (mode: LearningMode) => {
    setSelectedMode(mode);
    setShowModeSelector(false);
    setLumiState('thinking');
    setLoading(true);
    setError(null);

    const modeMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: `${MODE_CONFIG[mode].name} mode`,
    };
    setMessages((prev) => [...prev, modeMessage]);

    /* Generate course via API */
    const result = await generateCourse({
      topic: currentTopic,
      mode,
      userId: user?.id || 'anonymous',
    });

    setLoading(false);

    if (result.success && result.course) {
      setLumiState('celebrating');
      addCourse(result.course);
      incrementCoursesCreated();
      startCourse();

      /* Navigate to learning plan after brief celebration */
      setTimeout(() => {
        router.push(`/learn/${result.course!.id}/plan`);
      }, 1000);
    } else {
      setLumiState('idle');
      setError(result.error || 'Something went wrong');
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: result.error || 'Something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <AnimatedPage>
      <PageWrapper maxWidth="md" className="flex flex-col h-[calc(100dvh-5rem)]">
        <div className="flex-1 overflow-y-auto pb-4">
          {/* Empty state */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
              <FadeIn>
                <LumiAnimated size={100} state="idle" />
              </FadeIn>

              <FadeIn delay={100}>
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)] mb-2">
                    What do you want to learn?
                  </h2>
                  <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)] max-w-sm">
                    Tell me any topic and I will create a personalized course for you
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {SUGGESTION_CHIPS.map((chip) => (
                    <Chip
                      key={chip}
                      onClick={() => handleSuggestionClick(chip)}
                      size="sm"
                    >
                      {chip}
                    </Chip>
                  ))}
                </div>
              </FadeIn>
            </div>
          )}

          {/* Messages */}
          {!isEmpty && (
            <div className="space-y-4 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-[var(--radius-lg)] font-[family-name:var(--font-body)] text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[var(--color-primary)] text-white rounded-br-sm'
                        : 'bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] text-[var(--color-text)] rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Mode selector */}
              {showModeSelector && !isLoading && (
                <FadeIn>
                  <Card variant="glass" padding="md">
                    <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)] mb-4">
                      Choose your learning style:
                    </p>
                    <div className="space-y-2">
                      {(Object.keys(MODE_CONFIG) as LearningMode[]).map((mode) => {
                        const config = MODE_CONFIG[mode];
                        const IconComponent = MODE_ICONS[mode];
                        return (
                          <button
                            key={mode}
                            onClick={() => handleModeSelect(mode)}
                            className="w-full flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--glass-bg)] hover:border-[var(--color-primary)]/40 transition-all duration-200 cursor-pointer active:scale-[0.98] text-left"
                          >
                            <div
                              className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${config.color}20`, color: config.color }}
                            >
                              <IconComponent size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)]">
                                {config.name}
                              </p>
                              <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-muted)] truncate">
                                {config.description}
                              </p>
                            </div>
                            <Badge variant="muted" size="sm">
                              {config.estimatedTime}
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                </FadeIn>
              )}

              {/* Loading state */}
              {isLoading && (
                <FadeIn>
                  <Card variant="elevated" padding="lg">
                    <div className="flex flex-col items-center gap-4 py-4">
                      <LumiAnimated size={64} state="thinking" />
                      <div className="flex items-center gap-2 text-[var(--color-primary)]">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="font-[family-name:var(--font-body)] text-sm">
                          {loadingMessage}
                        </span>
                      </div>
                    </div>
                  </Card>
                </FadeIn>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input bar — fixed at bottom */}
        <div className="shrink-0 pt-3 pb-2 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full px-4 py-2.5 focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_3px_rgba(255,48,8,0.15)] transition-all duration-200">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What do you want to learn?"
                disabled={isLoading}
                className="flex-1 bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-muted)] font-[family-name:var(--font-body)] text-sm outline-none"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              size="md"
              className="shrink-0 w-11 h-11 p-0"
              aria-label="Send message"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </PageWrapper>
    </AnimatedPage>
  );
}
