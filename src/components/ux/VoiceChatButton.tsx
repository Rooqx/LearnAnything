/* ============================================================
   Voice Chat Button Component
   Main voice interaction button with a state machine for the
   learning page. Implements the full voice conversation flow:

   IDLE → LISTENING → PROCESSING → SPEAKING → IDLE
            ↑                          |
            └──────── (interrupt) ──────┘

   Currently a functional placeholder — the AI tutor endpoint
   is not yet connected. Voice input captures speech and shows
   the transcript, but the "AI response" is a placeholder.

   Design: Lore design system tokens, Emil's principles:
   - Scale(0.96) on active for tactile press
   - Custom ease-out-quart curves for transitions
   - Pulsing red ring when listening (GPU-accelerated)
   - Sound wave animation bars when speaking
   - 44px minimum touch target
   ============================================================ */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2, X, AlertTriangle } from 'lucide-react';
import { Tooltip, Button } from '@/components/ui';
import { useVoiceInput, isSpeechRecognitionSupported, hasVoiceConsent, setVoiceConsent } from '@/hooks/useVoiceInput';
import { useVoiceOutput } from '@/hooks/useVoiceOutput';
import { cn } from '@/lib/utils';
import type { ContentBlock } from '@/types';

/* ── Voice chat states ── */

type VoiceChatState = 'idle' | 'listening' | 'processing' | 'speaking';

export interface VoiceChatButtonProps {
  /** Course ID for context */
  courseId: string;
  /** Current page content blocks (for AI context) */
  currentPageContent?: { title: string; blocks: ContentBlock[] };
  /** Callback when AI responds (for showing in drawer) */
  onAIResponse?: (response: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * VoiceChatButton — the main voice interaction control.
 *
 * Implements a state machine that transitions through:
 * IDLE → LISTENING → PROCESSING → SPEAKING → IDLE
 *
 * The user can interrupt at any point by clicking the button.
 * Push-to-talk (hold Space) is supported when no text input is focused.
 */
export function VoiceChatButton({
  courseId,
  currentPageContent,
  onAIResponse,
  className,
}: VoiceChatButtonProps) {
  /* ── State ── */
  const [chatState, setChatState] = useState<VoiceChatState>('idle');
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [showTranscriptOverlay, setShowTranscriptOverlay] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');

  /* ── Refs ── */
  const pendingActionRef = useRef<'start' | null>(null);
  const chatStateRef = useRef(chatState);

  /* Keep ref in sync with state */
  useEffect(() => {
    chatStateRef.current = chatState;
  }, [chatState]);

  /* ── Hooks ── */
  const voiceInput = useVoiceInput({
    lang: 'en-US',
    continuous: false,
    interimResults: true,
    onTranscript: handleTranscriptReceived,
    onError: handleVoiceError,
  });

  const voiceOutput = useVoiceOutput();

  const sttSupported = isSpeechRecognitionSupported();
  const ttsSupported = voiceOutput.isSupported;

  /* If STT is not supported, don't render */
  if (!sttSupported) return null;

  /**
   * Handle a completed transcript from the SpeechRecognition API.
   * This fires when the user stops speaking and the final result is ready.
   */
  function handleTranscriptReceived(transcript: string) {
    if (!transcript.trim()) {
      setChatState('idle');
      setShowTranscriptOverlay(false);
      return;
    }

    setLastTranscript(transcript);
    setChatState('processing');
    setShowTranscriptOverlay(false);

    /* Simulate AI processing (placeholder — real endpoint not connected yet) */
    simulateAIResponse(transcript);
  }

  /**
   * Handle voice input errors.
   */
  function handleVoiceError(error: string) {
    setChatState('idle');
    setShowTranscriptOverlay(false);
    console.warn('[VoiceChat] Error:', error);
  }

  /**
   * Placeholder: simulate an AI tutor response.
   * Replace this with the real `/api/chat/message` call once the
   * AI Help endpoint is fully connected.
   */
  function simulateAIResponse(userMessage: string) {
    /* Simulate network delay */
    setTimeout(() => {
      if (chatStateRef.current !== 'processing') return;

      const response = `I heard you say: "${userMessage}". The AI tutor integration is coming soon! Once connected, I'll be able to help you understand this topic better.`;

      onAIResponse?.(response);

      /* Auto-speak the response */
      if (ttsSupported) {
        setChatState('speaking');
        voiceOutput.speak(response, { stripMarkdown: false });

        /* Watch for speech to finish */
        const checkDone = setInterval(() => {
          if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
            clearInterval(checkDone);
            if (chatStateRef.current === 'speaking') {
              setChatState('idle');
            }
          }
        }, 200);
      } else {
        setChatState('idle');
      }
    }, 1500);
  }

  /**
   * Main button click handler — transitions through the state machine.
   */
  const handleClick = useCallback(() => {
    switch (chatStateRef.current) {
      case 'idle':
        /* Check for consent before first use */
        if (!hasVoiceConsent()) {
          setShowConsentDialog(true);
          pendingActionRef.current = 'start';
          return;
        }
        startListening();
        break;

      case 'listening':
        /* Stop listening and cancel */
        voiceInput.stopListening();
        setChatState('idle');
        setShowTranscriptOverlay(false);
        break;

      case 'processing':
        /* Cancel processing */
        setChatState('idle');
        break;

      case 'speaking':
        /* Interrupt TTS and start listening again (conversation flow) */
        voiceOutput.stop();
        if (!hasVoiceConsent()) {
          setShowConsentDialog(true);
          pendingActionRef.current = 'start';
          return;
        }
        startListening();
        break;
    }
  }, [voiceInput, voiceOutput]);

  /**
   * Start the SpeechRecognition listener.
   */
  function startListening() {
    voiceInput.resetTranscript();
    voiceInput.startListening();
    setChatState('listening');
    setShowTranscriptOverlay(true);
  }

  /**
   * Handle consent dialog approval.
   */
  const handleConsentApprove = useCallback(() => {
    setVoiceConsent();
    setShowConsentDialog(false);
    if (pendingActionRef.current === 'start') {
      pendingActionRef.current = null;
      startListening();
    }
  }, []);

  const handleConsentDeny = useCallback(() => {
    setShowConsentDialog(false);
    pendingActionRef.current = null;
  }, []);

  /* ── Push-to-talk: Hold Space key ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      /* Only activate if no text input is focused */
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (e.code === 'Space' && !e.repeat && chatStateRef.current === 'idle') {
        e.preventDefault();
        if (!hasVoiceConsent()) {
          setShowConsentDialog(true);
          pendingActionRef.current = 'start';
          return;
        }
        startListening();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && chatStateRef.current === 'listening') {
        e.preventDefault();
        voiceInput.stopListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [voiceInput]);

  /* ── Determine visual state ── */
  const currentIcon = (() => {
    switch (chatState) {
      case 'listening':
        return Mic;
      case 'processing':
        return Loader2;
      case 'speaking':
        return Volume2;
      default:
        return Mic;
    }
  })();

  const ariaLabel = (() => {
    switch (chatState) {
      case 'listening':
        return 'Stop listening';
      case 'processing':
        return 'Processing your question';
      case 'speaking':
        return 'Interrupt and speak';
      default:
        return 'Ask a question with voice';
    }
  })();

  const Icon = currentIcon;

  return (
    <div className={cn('relative', className)}>
      {/* Transcript overlay — shows above the button while listening */}
      {showTranscriptOverlay && chatState === 'listening' && (
        <div
          className={cn(
            'absolute bottom-full right-0 mb-3 min-w-[240px] max-w-[320px]',
            'px-4 py-3 rounded-[var(--radius-lg)]',
            'bg-[var(--glass-bg)] backdrop-blur-[24px]',
            'border border-[var(--glass-border)]',
            'shadow-[var(--shadow-md)]',
            'animate-[scaleIn_200ms_cubic-bezier(0.25,1,0.5,1)]',
            'origin-bottom-right'
          )}
        >
          {/* Listening indicator dots */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-error)] animate-voice-pulse" />
            <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
              Listening...
            </span>
          </div>

          {/* Live transcript */}
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text)] min-h-[1.5rem]">
            {voiceInput.interimTranscript || voiceInput.transcript || (
              <span className="text-[var(--color-muted)] italic">
                Speak now...
              </span>
            )}
          </p>
        </div>
      )}

      {/* Processing indicator overlay */}
      {chatState === 'processing' && (
        <div
          className={cn(
            'absolute bottom-full right-0 mb-3 min-w-[200px]',
            'px-4 py-3 rounded-[var(--radius-lg)]',
            'bg-[var(--glass-bg)] backdrop-blur-[24px]',
            'border border-[var(--glass-border)]',
            'shadow-[var(--shadow-md)]',
            'animate-[scaleIn_200ms_cubic-bezier(0.25,1,0.5,1)]',
            'origin-bottom-right'
          )}
        >
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-[var(--color-primary)]" />
            <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
              Thinking...
            </span>
          </div>
          {lastTranscript && (
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text)] mt-2 opacity-70">
              &ldquo;{lastTranscript}&rdquo;
            </p>
          )}
        </div>
      )}

      {/* Speaking indicator overlay */}
      {chatState === 'speaking' && (
        <div
          className={cn(
            'absolute bottom-full right-0 mb-3 min-w-[160px]',
            'px-4 py-3 rounded-[var(--radius-lg)]',
            'bg-[var(--glass-bg)] backdrop-blur-[24px]',
            'border border-[var(--glass-border)]',
            'shadow-[var(--shadow-md)]',
            'animate-[scaleIn_200ms_cubic-bezier(0.25,1,0.5,1)]',
            'origin-bottom-right'
          )}
        >
          {/* Sound wave bars */}
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[3px] h-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[3px] bg-[var(--color-primary)] rounded-full animate-sound-wave"
                  style={{
                    animationDelay: `${i * 120}ms`,
                    height: '100%',
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
              Speaking...
            </span>
          </div>
        </div>
      )}

      {/* Main button */}
      <Tooltip content={ariaLabel} position="top">
        <button
          onClick={handleClick}
          className={cn(
            'relative p-2.5 rounded-full cursor-pointer',
            'transition-all duration-150',
            'active:scale-[0.96]',
            'min-h-[44px] min-w-[44px] flex items-center justify-center',
            /* Idle */
            chatState === 'idle' && [
              'text-[var(--color-muted)]',
              'hover:text-[var(--color-primary)]',
              'hover:bg-[var(--color-surface)]',
            ],
            /* Listening — pulsing red */
            chatState === 'listening' && [
              'text-white',
              'bg-[var(--color-error)]',
              'animate-voice-pulse',
            ],
            /* Processing — spinner */
            chatState === 'processing' && [
              'text-[var(--color-primary)]',
              'bg-[var(--color-primary)]/10',
            ],
            /* Speaking — active primary */
            chatState === 'speaking' && [
              'text-[var(--color-primary)]',
              'bg-[var(--color-primary)]/10',
            ]
          )}
          aria-label={ariaLabel}
        >
          <Icon
            size={20}
            className={cn(chatState === 'processing' && 'animate-spin')}
          />
        </button>
      </Tooltip>

      {/* Privacy consent dialog */}
      {showConsentDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
            onClick={handleConsentDeny}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            className={cn(
              'relative z-10 max-w-sm w-full',
              'px-6 py-5 rounded-[var(--radius-xl)]',
              'bg-[var(--glass-bg)] backdrop-blur-[24px]',
              'border border-[var(--glass-border)]',
              'shadow-[var(--shadow-lg),inset_0_1px_0_rgba(255,255,255,0.1)]',
              'animate-[scaleIn_300ms_cubic-bezier(0.25,1,0.5,1)]'
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Voice input privacy notice"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={20} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-heading)] font-semibold text-base text-[var(--color-text)] mb-1">
                  Voice Input Privacy
                </h3>
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)] leading-relaxed">
                  Voice recognition in Chrome sends your audio to Google&apos;s servers for processing. Your speech data helps improve recognition accuracy but is transmitted externally.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleConsentDeny}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConsentApprove}
                fullWidth
              >
                Allow Voice
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="assertive" role="status">
        {chatState === 'listening' && 'Now listening. Speak your question.'}
        {chatState === 'processing' && 'Processing your question.'}
        {chatState === 'speaking' && 'AI is responding.'}
      </div>
    </div>
  );
}
