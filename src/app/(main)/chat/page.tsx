/* ============================================================
   Chat Page
   The course generation interface.
   Empty state → active chat → mode selection → loading →
   navigate to learning plan.
   ============================================================ */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Send,
  Sprout,
  Zap,
  Timer,
  Loader2,
} from 'lucide-react';
import { Button, Card, Chip, Badge } from '@/components/ui';
import { AnimatedPage, FadeIn, LumiAnimated } from '@/components/ux';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useCourseStore } from '@/store/useCourseStore';
import { useUserStore } from '@/store/useUserStore';
import { useChatSessionStore } from '@/store/useChatSessionStore';
import { 
  getOrCreateChatSession, 
  getActiveChatSession, 
  sendChatMessage, 
  checkGenerationComplete,
  cancelChatSession
} from '@/lib/api';
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
  
  // Stores
  const addCourse = useCourseStore((state) => state.addCourse);
  const setError = useCourseStore((state) => state.setError);
  const startCourse = useUserStore((state) => state.startCourse);
  const incrementCoursesCreated = useUserStore((state) => state.incrementCoursesCreated);
  
  const { 
    sessionId, 
    status, 
    initFromStorage, 
    setGenerating, 
    clearSession, 
    syncFromDB 
  } = useChatSessionStore();

  // Local State
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [lumiState, setLumiState] = useState<LumiState>('idle');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === 'generating';

  /* 1. Init Storage speed cache on mount */
  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  /* 2. Source of Truth: Fetch active session from DB */
  useQuery({
    queryKey: ['activeChatSession'],
    queryFn: async () => {
      const data = await getActiveChatSession();
      syncFromDB(data.session);
      return data;
    },
    refetchOnWindowFocus: true,
  });

  /* 3. Auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showModeSelector, isLoading]);

  /* 4. Rotate loading messages */
  useEffect(() => {
    if (!isLoading) return;
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[index]);
    }, LOADING_MESSAGE_INTERVAL);
    return () => clearInterval(interval);
  }, [isLoading]);

  /* 5. Polling for generation complete */
  useQuery({
    queryKey: ['checkGeneration', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      try {
        const data = await checkGenerationComplete(sessionId);
        // Success (200) means course is ready
        setLumiState('celebrating');
        incrementCoursesCreated();
        startCourse();
        clearSession();
        
        // Navigate
        setTimeout(() => {
          router.push(`/learn/${data.courseId}/plan`);
        }, 1000);
        return data;
      } catch (error: any) {
        // If 404, it's just not ready yet, throw so React Query retries
        if (error?.response?.status === 404) {
          throw new Error('Not ready');
        }
        // For other hard errors, fail out
        await cancelChatSession(sessionId);
        clearSession();
        setLumiState('idle');
        setError('Generation failed. Please try again.');
        setMessages((prev) => [...prev, {
          id: generateId(),
          role: 'assistant',
          content: 'Something went wrong while generating the course. Please try again.',
        }]);
        throw error;
      }
    },
    enabled: isLoading && !!sessionId,
    refetchInterval: (query) => (query.state.status === 'error' ? false : 5000),
    retry: true,
  });

  /* 6. Mutations for Chat */
  const createSessionMutation = useMutation({
    mutationFn: getOrCreateChatSession,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (args: { sid: string; msg: string }) => sendChatMessage(args.sid, args.msg),
    onSuccess: (data, variables) => {
      if (data.status === 'generating') {
        setGenerating(variables.sid);
        setLumiState('thinking');
        setShowModeSelector(false);
      } else if (data.message) {
        // If n8n returns standard AI response
        setMessages((prev) => [...prev, {
          id: generateId(),
          role: 'assistant',
          content: data.message,
        }]);
        setLumiState('idle');
      }
    },
    onError: () => {
      setLumiState('idle');
      setMessages((prev) => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: 'Failed to communicate with AI. Please try again.',
      }]);
    }
  });

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    setInputValue('');
    setCurrentTopic(trimmed);
    setLumiState('thinking');

    // Optimistically add user message
    setMessages((prev) => [...prev, {
      id: generateId(),
      role: 'user',
      content: trimmed,
    }]);

    try {
      let activeSessionId = sessionId;
      
      // Ensure we have a session
      if (!activeSessionId) {
        const sessionData = await createSessionMutation.mutateAsync();
        activeSessionId = sessionData.sessionId;
        // The query above will eventually sync, but we proceed with this ID
      }

      // We simulate the mode selection locally for UX before sending the final trigger to n8n
      // If the user hasn't selected a mode yet, we pretend the AI is asking
      // In a fully dynamic n8n flow, n8n would ask this, but to preserve the beautiful UI:
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: generateId(),
          role: 'assistant',
          content: `Great choice! I can create a course on "${trimmed}" for you. How would you like to learn it?`,
        }]);
        setShowModeSelector(true);
        setLumiState('excited');
      }, 800);

    } catch (e) {
      setLumiState('idle');
    }
  };

  const handleModeSelect = async (mode: LearningMode) => {
    setShowModeSelector(false);
    setLumiState('thinking');
    setError(null);

    setMessages((prev) => [...prev, {
      id: generateId(),
      role: 'user',
      content: `${MODE_CONFIG[mode].name} mode`,
    }]);

    if (!sessionId) {
      // Fallback if session somehow missing
      const sessionData = await createSessionMutation.mutateAsync();
      syncFromDB({ id: sessionData.sessionId, status: sessionData.status });
      sendMessageMutation.mutate({ sid: sessionData.sessionId, msg: `Topic: ${currentTopic}. Mode: ${mode}` });
    } else {
      sendMessageMutation.mutate({ sid: sessionId, msg: `Topic: ${currentTopic}. Mode: ${mode}` });
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
          {isEmpty && !isLoading && (
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
          {(!isEmpty || isLoading) && (
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
