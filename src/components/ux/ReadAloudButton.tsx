/* ============================================================
   ReadAloud Button Component
   Reads the current learning page content aloud using the
   browser's SpeechSynthesis API.

   Extracts text from ContentBlock[], strips markdown/LaTeX,
   and speaks with chunked playback. Provides play/pause/stop
   controls with progress tracking.

   Design: Follows Lore design system tokens.
   - 44px minimum touch target
   - Scale(0.96) on :active (Emil's tactile feedback)
   - Smooth transitions with ease-out-quart
   - Glass-morphism popover for settings
   ============================================================ */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Volume2, Pause, Play, Square, Settings } from 'lucide-react';
import { Tooltip } from '@/components/ui';
import { VoiceSettings } from '@/components/ux/VoiceSettings';
import { useVoiceOutput, isSpeechSynthesisSupported } from '@/hooks/useVoiceOutput';
import { cn } from '@/lib/utils';
import type { ContentBlock } from '@/types';

export interface ReadAloudButtonProps {
  /** Content blocks from the current learning page */
  blocks: ContentBlock[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Extracts speakable text from an array of ContentBlocks.
 * Skips code, image, and video blocks; briefly announces math.
 */
function extractSpeakableText(blocks: ContentBlock[]): string {
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'text':
      case 'bullet_list':
        if (block.content.trim()) {
          parts.push(block.content);
        }
        break;
      case 'code':
        parts.push('Code example.');
        break;
      case 'math':
        parts.push('Math expression.');
        break;
      case 'image':
        parts.push(
          block.meta?.alt ? `Image: ${block.meta.alt}.` : 'Image.'
        );
        break;
      case 'video':
        parts.push(
          block.meta?.title ? `Video: ${block.meta.title}.` : 'Video.'
        );
        break;
      default:
        break;
    }
  }

  return parts.join('\n\n');
}

/**
 * ReadAloudButton — reads the current page's content aloud.
 *
 * States:
 * - Idle: Volume2 icon, muted color
 * - Playing: Pause icon, primary color, subtle pulse animation
 * - Paused: Play icon, primary color
 */
export function ReadAloudButton({ blocks, className }: ReadAloudButtonProps) {
  const voiceOutput = useVoiceOutput();
  const [showSettings, setShowSettings] = useState(false);

  const {
    isSpeaking,
    isPaused,
    speak,
    stop,
    pause,
    resume,
    isSupported,
    currentChunkIndex,
    totalChunks,
  } = voiceOutput;

  /* Don't render if browser doesn't support TTS */
  if (!isSupported) return null;

  /* Memoize the speakable text to avoid recomputing on every render */
  const speakableText = useMemo(() => extractSpeakableText(blocks), [blocks]);

  const handleClick = useCallback(() => {
    if (isSpeaking && !isPaused) {
      /* Currently playing → pause */
      pause();
    } else if (isPaused) {
      /* Currently paused → resume */
      resume();
    } else {
      /* Idle → start reading */
      if (speakableText.trim()) {
        speak(speakableText);
      }
    }
  }, [isSpeaking, isPaused, pause, resume, speak, speakableText]);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  /* Determine current visual state */
  const isActive = isSpeaking || isPaused;
  const progress =
    totalChunks > 0 ? Math.round(((currentChunkIndex + 1) / totalChunks) * 100) : 0;

  /* Determine the icon to show */
  const Icon = isSpeaking && !isPaused ? Pause : isPaused ? Play : Volume2;

  /* Determine the aria-label */
  const ariaLabel = isSpeaking && !isPaused
    ? 'Pause reading'
    : isPaused
      ? 'Resume reading'
      : 'Read page aloud';

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Main play/pause button */}
      <Tooltip content={ariaLabel}>
        <button
          onClick={handleClick}
          className={cn(
            'relative p-2.5 rounded-full cursor-pointer',
            'transition-all duration-150',
            'active:scale-[0.96]',
            'min-h-[44px] min-w-[44px] flex items-center justify-center',
            /* Idle state */
            !isActive && [
              'text-[var(--color-muted)]',
              'hover:text-[var(--color-primary)]',
              'hover:bg-[var(--color-surface)]',
            ],
            /* Active state (playing or paused) */
            isActive && [
              'text-[var(--color-primary)]',
              'bg-[var(--color-primary)]/10',
            ],
            /* Playing pulse animation */
            isSpeaking && !isPaused && 'animate-voice-pulse'
          )}
          aria-label={ariaLabel}
        >
          <Icon size={20} />

          {/* Progress ring indicator when active */}
          {isActive && totalChunks > 1 && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 44 44"
              aria-hidden="true"
            >
              <circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeDasharray={`${(progress / 100) * 113} 113`}
                strokeLinecap="round"
                opacity={0.4}
              />
            </svg>
          )}
        </button>
      </Tooltip>

      {/* Stop button — only visible when active */}
      {isActive && (
        <Tooltip content="Stop reading">
          <button
            onClick={handleStop}
            className={cn(
              'p-2 rounded-full cursor-pointer',
              'text-[var(--color-muted)]',
              'hover:text-[var(--color-error)]',
              'hover:bg-[var(--color-error)]/10',
              'transition-all duration-150',
              'active:scale-[0.96]',
              'min-h-[44px] min-w-[44px] flex items-center justify-center',
              'animate-[fadeIn_150ms_ease-out]'
            )}
            aria-label="Stop reading"
          >
            <Square size={16} />
          </button>
        </Tooltip>
      )}

      {/* Settings gear */}
      <VoiceSettings voiceOutput={voiceOutput} />

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" role="status">
        {isSpeaking && !isPaused && 'Reading page content aloud.'}
        {isPaused && 'Reading paused.'}
      </div>
    </div>
  );
}
