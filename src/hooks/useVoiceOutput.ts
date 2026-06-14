/* ============================================================
   useVoiceOutput Hook (ElevenLabs + Double Buffering)
   Replaces native SpeechSynthesis with a premium Cloud TTS.
   - Gapless playback via Audio prefetching (Double Buffering)
   - Aggressive HTTP GET caching to save API credits
   - Graceful fallback to native TTS if quota is exceeded
   - LocalStorage persistence for selected voice & speed
   ============================================================ */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { stripMarkdownForTTS, splitIntoChunks } from '@/lib/stripMarkdownForTTS';

/* ── Constants ── */
const VOICE_PREFS_KEY = 'lore-voice-prefs-v2';
const DEFAULT_RATE = 1.0;
const MIN_RATE = 0.6;
const MAX_RATE = 1.6;
const CHUNK_MAX_LENGTH = 200;

export interface Voice {
  voiceId: string;
  name: string;
}

export const ELEVENLABS_VOICES: Voice[] = [
  { voiceId: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Warm & Engaging)' },
  { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Soft & Calm)' },
  { voiceId: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Deep & Clear)' },
  { voiceId: 't0jbNlBVZ17f02VISSeL', name: 'Jessie (Conversational)' },
];

export interface UseVoiceOutputReturn {
  isSpeaking: boolean;
  isPaused: boolean;
  speak: (text: string, options?: { stripMarkdown?: boolean }) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  voices: Voice[];
  selectedVoice: Voice | null;
  setSelectedVoice: (voice: Voice) => void;
  rate: number;
  setRate: (rate: number) => void;
  isSupported: boolean;
  currentChunkIndex: number;
  totalChunks: number;
}

interface VoicePreferences {
  voiceId: string | null;
  rate: number;
}

function loadVoicePreferences(): VoicePreferences {
  if (typeof window === 'undefined') {
    return { voiceId: null, rate: DEFAULT_RATE };
  }
  try {
    const stored = localStorage.getItem(VOICE_PREFS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        voiceId: parsed.voiceId ?? null,
        rate: Math.min(MAX_RATE, Math.max(MIN_RATE, parsed.rate ?? DEFAULT_RATE)),
      };
    }
  } catch {}
  return { voiceId: null, rate: DEFAULT_RATE };
}

function saveVoicePreferences(prefs: VoicePreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VOICE_PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}

export function useVoiceOutput(): UseVoiceOutputReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVoiceState, setSelectedVoiceState] = useState<Voice | null>(null);
  const [rate, setRateState] = useState(DEFAULT_RATE);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  const chunksRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);
  const isCancelledRef = useRef(false);
  const isMountedRef = useRef(true);

  // Audio queue refs
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    const prefs = loadVoicePreferences();
    setRateState(prefs.rate);
    const savedVoice = ELEVENLABS_VOICES.find((v) => v.voiceId === prefs.voiceId);
    setSelectedVoiceState(savedVoice || ELEVENLABS_VOICES[0]);

    return () => {
      isMountedRef.current = false;
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
    }
    if (nextAudioRef.current) {
      nextAudioRef.current.pause();
      nextAudioRef.current.src = '';
      nextAudioRef.current = null;
    }
  };

  /** Check if url is valid via fetch before setting audio source to catch 429s */
  const fetchAudioUrl = async (text: string, voiceId: string): Promise<string | null> => {
    try {
      const url = `/api/tts?text=${encodeURIComponent(text)}&voiceId=${voiceId}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`ElevenLabs API Error: ${res.status}`);
        return null; // Fallback to native
      }
      return url;
    } catch {
      return null;
    }
  };

  /** Native fallback if ElevenLabs is out of credits */
  const speakNativeFallback = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (isCancelledRef.current || !('speechSynthesis' in window)) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const playChunk = async (index: number): Promise<void> => {
    if (isCancelledRef.current || index >= chunksRef.current.length) return;

    currentChunkRef.current = index;
    if (isMountedRef.current) setCurrentChunkIndex(index);

    const text = chunksRef.current[index];
    const voiceId = selectedVoiceState?.voiceId || ELEVENLABS_VOICES[0].voiceId;

    return new Promise(async (resolve) => {
      // 1. Determine audio source
      let audioSrc = nextAudioRef.current?.src;

      // If not prefetched, fetch it now
      if (!audioSrc) {
        audioSrc = await fetchAudioUrl(text, voiceId) || '';
      }

      // If ElevenLabs failed (429/401), fallback to native Web Speech
      if (!audioSrc) {
        await speakNativeFallback(text);
        resolve();
        return;
      }

      if (isCancelledRef.current) {
        resolve();
        return;
      }

      // 2. Setup audio element
      const audio = new Audio(audioSrc);
      audio.playbackRate = rate;
      currentAudioRef.current = audio;
      
      // 3. Prefetch the NEXT chunk in the background (Double-Buffering)
      if (index + 1 < chunksRef.current.length) {
        const nextText = chunksRef.current[index + 1];
        fetchAudioUrl(nextText, voiceId).then((nextUrl) => {
          if (nextUrl && !isCancelledRef.current) {
            const nextAudio = new Audio(nextUrl);
            nextAudio.preload = 'auto'; // Force browser to cache it immediately
            nextAudioRef.current = nextAudio;
          }
        });
      } else {
        nextAudioRef.current = null;
      }

      // 4. Play current audio
      audio.onended = () => {
        resolve();
      };
      
      audio.onerror = () => {
        // If HTML Audio fails, fallback to native
        speakNativeFallback(text).then(resolve);
      };

      try {
        await audio.play();
      } catch (e) {
        console.warn('Audio play interrupted or failed', e);
        resolve(); // Continue anyway
      }
    });
  };

  const speak = useCallback(
    async (text: string, options: { stripMarkdown?: boolean } = {}) => {
      if (!text.trim()) return;
      const { stripMarkdown = true } = options;

      // Stop previous
      isCancelledRef.current = true;
      cleanupAudio();
      window.speechSynthesis?.cancel();

      setTimeout(async () => {
        isCancelledRef.current = false;
        const cleanText = stripMarkdown ? stripMarkdownForTTS(text) : text;
        if (!cleanText.trim()) return;

        const chunks = splitIntoChunks(cleanText, CHUNK_MAX_LENGTH);
        chunksRef.current = chunks;
        currentChunkRef.current = 0;

        if (isMountedRef.current) {
          setTotalChunks(chunks.length);
          setCurrentChunkIndex(0);
          setIsSpeaking(true);
          setIsPaused(false);
        }

        // Play sequentially
        for (let i = 0; i < chunks.length; i++) {
          if (isCancelledRef.current) break;
          await playChunk(i);
        }

        if (isMountedRef.current && !isCancelledRef.current) {
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentChunkIndex(0);
          setTotalChunks(0);
        }
      }, 50); // Small debounce
    },
    [selectedVoiceState, rate]
  );

  const stop = useCallback(() => {
    isCancelledRef.current = true;
    cleanupAudio();
    window.speechSynthesis?.cancel();
    chunksRef.current = [];
    
    if (isMountedRef.current) {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentChunkIndex(0);
      setTotalChunks(0);
    }
  }, []);

  const pause = useCallback(() => {
    if (currentAudioRef.current && isSpeaking) {
      currentAudioRef.current.pause();
      window.speechSynthesis?.pause();
      if (isMountedRef.current) setIsPaused(true);
    }
  }, [isSpeaking]);

  const resume = useCallback(() => {
    if (currentAudioRef.current && isPaused) {
      currentAudioRef.current.playbackRate = rate;
      currentAudioRef.current.play();
      window.speechSynthesis?.resume();
      if (isMountedRef.current) setIsPaused(false);
    }
  }, [isPaused, rate]);

  const setSelectedVoice = useCallback(
    (voice: Voice) => {
      setSelectedVoiceState(voice);
      saveVoicePreferences({ voiceId: voice.voiceId, rate });
    },
    [rate]
  );

  const setRate = useCallback(
    (newRate: number) => {
      const clamped = Math.min(MAX_RATE, Math.max(MIN_RATE, newRate));
      setRateState(clamped);
      if (currentAudioRef.current) {
        currentAudioRef.current.playbackRate = clamped;
      }
      saveVoicePreferences({ voiceId: selectedVoiceState?.voiceId ?? null, rate: clamped });
    },
    [selectedVoiceState]
  );

  return {
    isSpeaking,
    isPaused,
    speak,
    stop,
    pause,
    resume,
    voices: ELEVENLABS_VOICES,
    selectedVoice: selectedVoiceState,
    setSelectedVoice,
    rate,
    setRate,
    isSupported: true, // Audio element is always supported
    currentChunkIndex,
    totalChunks,
  };
}
