/* ============================================================
   useVoiceOutput Hook
   Browser-native Text-to-Speech via the Web SpeechSynthesis API.

   Provides a reusable hook for reading text aloud with:
   - Markdown/LaTeX stripping before speech
   - Sentence-boundary chunking to avoid SpeechSynthesis cutoff
   - Voice selection with localStorage persistence
   - Play/pause/stop/resume controls
   - Progress tracking (current chunk index)

   Browser support:
   - Chrome, Edge, Firefox, Safari: Full support
   - All modern browsers support SpeechSynthesis
   ============================================================ */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { stripMarkdownForTTS, splitIntoChunks } from '@/lib/stripMarkdownForTTS';

/* ── Constants ── */

const VOICE_PREFS_KEY = 'lore-voice-prefs';
const DEFAULT_RATE = 1.0;
const DEFAULT_PITCH = 1.0;
const MIN_RATE = 0.6;
const MAX_RATE = 1.6;
const MIN_PITCH = 0.6;
const MAX_PITCH = 1.4;
const CHUNK_MAX_LENGTH = 200;

/* ── Types ── */

interface VoicePreferences {
  voiceURI: string | null;
  rate: number;
  pitch: number;
}

export interface UseVoiceOutputReturn {
  /** Whether the synthesis is currently speaking */
  isSpeaking: boolean;
  /** Whether playback is paused */
  isPaused: boolean;
  /** Speak the given text (auto-strips markdown if stripMarkdown is true) */
  speak: (text: string, options?: SpeakOptions) => void;
  /** Stop all speech and reset the queue */
  stop: () => void;
  /** Pause current speech */
  pause: () => void;
  /** Resume paused speech */
  resume: () => void;
  /** Available system voices */
  voices: SpeechSynthesisVoice[];
  /** Currently selected voice */
  selectedVoice: SpeechSynthesisVoice | null;
  /** Set the preferred voice */
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  /** Current speech rate (0.6 – 1.6) */
  rate: number;
  /** Set the speech rate */
  setRate: (rate: number) => void;
  /** Current pitch (0.6 – 1.4) */
  pitch: number;
  /** Set the pitch */
  setPitch: (pitch: number) => void;
  /** Whether the browser supports SpeechSynthesis */
  isSupported: boolean;
  /** Current chunk being spoken (0-indexed) */
  currentChunkIndex: number;
  /** Total number of chunks in the current utterance queue */
  totalChunks: number;
}

export interface SpeakOptions {
  /** Whether to strip markdown before speaking (default: true) */
  stripMarkdown?: boolean;
}

/* ── Helpers ── */

/**
 * Check if the browser supports the Web SpeechSynthesis API.
 */
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

/**
 * Load voice preferences from localStorage.
 */
function loadVoicePreferences(): VoicePreferences {
  if (typeof window === 'undefined') {
    return { voiceURI: null, rate: DEFAULT_RATE, pitch: DEFAULT_PITCH };
  }

  try {
    const stored = localStorage.getItem(VOICE_PREFS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<VoicePreferences>;
      return {
        voiceURI: parsed.voiceURI ?? null,
        rate: clampRate(parsed.rate ?? DEFAULT_RATE),
        pitch: clampPitch(parsed.pitch ?? DEFAULT_PITCH),
      };
    }
  } catch {
    /* Corrupted localStorage — use defaults */
  }

  return { voiceURI: null, rate: DEFAULT_RATE, pitch: DEFAULT_PITCH };
}

/**
 * Save voice preferences to localStorage.
 */
function saveVoicePreferences(prefs: VoicePreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(VOICE_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* Storage full or unavailable — silently fail */
  }
}

function clampRate(value: number): number {
  return Math.min(MAX_RATE, Math.max(MIN_RATE, value));
}

function clampPitch(value: number): number {
  return Math.min(MAX_PITCH, Math.max(MIN_PITCH, value));
}

/* ============================================================
   Main Hook
   ============================================================ */

export function useVoiceOutput(): UseVoiceOutputReturn {
  /* ── State ── */
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRateState] = useState(DEFAULT_RATE);
  const [pitch, setPitchState] = useState(DEFAULT_PITCH);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  /* ── Refs ── */
  const chunksRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);
  const isCancelledRef = useRef(false);
  const isMountedRef = useRef(true);

  const isSupported = isSpeechSynthesisSupported();

  /* ── Load voices ── */
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0) return;

      if (isMountedRef.current) {
        setVoices(availableVoices);
      }

      /* Restore saved voice preference */
      const prefs = loadVoicePreferences();

      if (isMountedRef.current) {
        setRateState(prefs.rate);
        setPitchState(prefs.pitch);
      }

      if (prefs.voiceURI) {
        const savedVoice = availableVoices.find((v) => v.voiceURI === prefs.voiceURI);
        if (savedVoice && isMountedRef.current) {
          setSelectedVoiceState(savedVoice);
        }
      }

      /* If no saved voice, select a good English default */
      if (!prefs.voiceURI && isMountedRef.current) {
        const englishVoices = availableVoices.filter((v) => v.lang.startsWith('en'));
        const preferredVoice =
          englishVoices.find((v) => v.name.includes('Google') && v.name.includes('US')) ||
          englishVoices.find((v) => v.name.includes('Google')) ||
          englishVoices.find((v) => v.default) ||
          englishVoices[0] ||
          availableVoices[0];

        if (preferredVoice) {
          setSelectedVoiceState(preferredVoice);
        }
      }
    };

    /* Voices may load asynchronously (Chrome loads them lazily) */
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported]);

  /* ── Track mount state for safe async updates ── */
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Speak a single chunk of text as a SpeechSynthesisUtterance.
   * Returns a Promise that resolves when the chunk finishes speaking.
   */
  const speakChunk = useCallback(
    (text: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!isSupported || isCancelledRef.current) {
          reject(new Error('Cancelled'));
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onend = () => resolve();

        utterance.onerror = (event) => {
          /* "interrupted" and "cancelled" are expected when user calls stop() */
          if (event.error === 'interrupted' || event.error === 'canceled') {
            reject(new Error('Cancelled'));
          } else {
            reject(new Error(`Speech error: ${event.error}`));
          }
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    [isSupported, selectedVoice, rate, pitch]
  );

  /**
   * Speak text aloud, with automatic markdown stripping and chunking.
   */
  const speak = useCallback(
    async (text: string, options: SpeakOptions = {}) => {
      if (!isSupported || !text.trim()) return;

      const { stripMarkdown = true } = options;

      /* Cancel any ongoing speech */
      window.speechSynthesis.cancel();
      isCancelledRef.current = false;

      /* Strip markdown if needed */
      const cleanText = stripMarkdown ? stripMarkdownForTTS(text) : text;

      if (!cleanText.trim()) return;

      /* Split into chunks at sentence boundaries */
      const chunks = splitIntoChunks(cleanText, CHUNK_MAX_LENGTH);
      chunksRef.current = chunks;
      currentChunkRef.current = 0;

      if (isMountedRef.current) {
        setTotalChunks(chunks.length);
        setCurrentChunkIndex(0);
        setIsSpeaking(true);
        setIsPaused(false);
      }

      /* Speak each chunk sequentially */
      for (let i = 0; i < chunks.length; i++) {
        if (isCancelledRef.current) break;

        currentChunkRef.current = i;
        if (isMountedRef.current) {
          setCurrentChunkIndex(i);
        }

        try {
          await speakChunk(chunks[i]);
        } catch {
          /* Cancelled or error — stop the queue */
          break;
        }
      }

      /* All chunks finished (or cancelled) */
      if (isMountedRef.current) {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentChunkIndex(0);
        setTotalChunks(0);
      }
    },
    [isSupported, speakChunk]
  );

  /**
   * Stop all speech and clear the queue.
   */
  const stop = useCallback(() => {
    if (!isSupported) return;

    isCancelledRef.current = true;
    window.speechSynthesis.cancel();
    chunksRef.current = [];
    currentChunkRef.current = 0;

    if (isMountedRef.current) {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentChunkIndex(0);
      setTotalChunks(0);
    }
  }, [isSupported]);

  /**
   * Pause current speech.
   */
  const pause = useCallback(() => {
    if (!isSupported || !isSpeaking) return;

    window.speechSynthesis.pause();
    if (isMountedRef.current) {
      setIsPaused(true);
    }
  }, [isSupported, isSpeaking]);

  /**
   * Resume paused speech.
   */
  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return;

    window.speechSynthesis.resume();
    if (isMountedRef.current) {
      setIsPaused(false);
    }
  }, [isSupported, isPaused]);

  /**
   * Set the preferred voice and persist to localStorage.
   */
  const setSelectedVoice = useCallback(
    (voice: SpeechSynthesisVoice) => {
      setSelectedVoiceState(voice);
      saveVoicePreferences({
        voiceURI: voice.voiceURI,
        rate,
        pitch,
      });
    },
    [rate, pitch]
  );

  /**
   * Set the speech rate and persist to localStorage.
   */
  const setRate = useCallback(
    (newRate: number) => {
      const clamped = clampRate(newRate);
      setRateState(clamped);
      saveVoicePreferences({
        voiceURI: selectedVoice?.voiceURI ?? null,
        rate: clamped,
        pitch,
      });
    },
    [selectedVoice, pitch]
  );

  /**
   * Set the pitch and persist to localStorage.
   */
  const setPitch = useCallback(
    (newPitch: number) => {
      const clamped = clampPitch(newPitch);
      setPitchState(clamped);
      saveVoicePreferences({
        voiceURI: selectedVoice?.voiceURI ?? null,
        rate,
        pitch: clamped,
      });
    },
    [selectedVoice, rate]
  );

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    isSpeaking,
    isPaused,
    speak,
    stop,
    pause,
    resume,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    isSupported,
    currentChunkIndex,
    totalChunks,
  };
}
