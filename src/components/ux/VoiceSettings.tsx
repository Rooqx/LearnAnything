/* ============================================================
   Voice Settings Component
   Popover panel for configuring voice synthesis preferences:
   voice selection, speech rate, and pitch.

   Uses the existing Drawer component as the surface layer.
   All preferences are persisted to localStorage via
   the useVoiceOutput hook.

   Design: Glass-morphism surface consistent with the
   Lore design system. Emil's principles applied:
   - Scale(0.96) on active for tactile press
   - Custom ease-out-quart curves
   - 44px minimum touch targets
   ============================================================ */

'use client';

import { useState } from 'react';
import { Settings, Volume2, Check } from 'lucide-react';
import { Drawer, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { UseVoiceOutputReturn } from '@/hooks/useVoiceOutput';

export interface VoiceSettingsProps {
  /** The voice output hook instance to control */
  voiceOutput: UseVoiceOutputReturn;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Voice Settings panel — allows users to select a TTS voice,
 * adjust speech rate and pitch, and test the output.
 *
 * Opens as a bottom-sheet Drawer on mobile, consistent with
 * the existing UI pattern used by the AI Help panel.
 */
export function VoiceSettings({ voiceOutput, className }: VoiceSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    speak,
    stop,
    isSpeaking,
    isSupported,
  } = voiceOutput;

  if (!isSupported) return null;

  // Voices are hardcoded from ElevenLabs
  const activeVoices = voices;

  const handleTestVoice = () => {
    if (isSpeaking) {
      stop();
      return;
    }
    speak(
      'Hello! I am Lore, your AI learning companion. I will help you understand any topic.',
      { stripMarkdown: false }
    );
  };

  return (
    <>
      {/* Settings trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'p-2 rounded-full cursor-pointer',
          'text-[var(--color-muted)] hover:text-[var(--color-text)]',
          'hover:bg-[var(--color-surface)]',
          'transition-all duration-150',
          'active:scale-[0.96]',
          'min-h-[44px] min-w-[44px] flex items-center justify-center',
          className
        )}
        aria-label="Voice settings"
      >
        <Settings size={18} />
      </button>

      {/* Settings drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Voice Settings"
        className="!bg-[var(--color-bg)] !backdrop-blur-none"
      >
        <div className="space-y-6">
          {/* ── Voice selector ── */}
          <div>
            <label className="block font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)] mb-3">
              Voice
            </label>
            <div className="max-h-48 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              {activeVoices.map((voice) => (
                <button
                  key={voice.voiceId}
                  onClick={() => setSelectedVoice(voice)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-left cursor-pointer',
                    'transition-colors duration-150',
                    'hover:bg-[var(--color-surface-elevated)]',
                    'min-h-[44px]',
                    selectedVoice?.voiceId === voice.voiceId &&
                      'bg-[var(--color-primary)]/10'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text)] truncate">
                      {voice.name}
                    </p>
                    <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-muted)]">
                      Premium ElevenLabs Voice
                    </p>
                  </div>
                  {selectedVoice?.voiceId === voice.voiceId && (
                    <Check
                      size={16}
                      className="text-[var(--color-primary)] shrink-0"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Speech rate slider ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)]">
                Speed
              </label>
              <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
                {rate.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.6"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--color-surface-elevated)] accent-[var(--color-primary)]"
              aria-label="Speech rate"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
                Slower
              </span>
              <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
                Faster
              </span>
            </div>
          </div>



          {/* ── Test voice button ── */}
          <Button
            variant="secondary"
            fullWidth
            onClick={handleTestVoice}
            leftIcon={<Volume2 size={18} />}
          >
            {isSpeaking ? 'Stop Test' : 'Test Voice'}
          </Button>

          {/* ── Close / Done button ── */}
          <Button
            variant="primary"
            fullWidth
            onClick={() => setIsOpen(false)}
          >
            Done
          </Button>
        </div>
      </Drawer>
    </>
  );
}
