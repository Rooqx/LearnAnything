/* ============================================================
   useVoiceInput Hook
   Browser-native Speech-to-Text via the Web SpeechRecognition API.

   Provides a reusable, framework-agnostic hook for capturing
   user speech and converting it to text in real-time.

   Browser support:
   - Chrome, Edge, Opera: Full support (via webkitSpeechRecognition)
   - Firefox: Behind a flag (dom.media.webspeech.recognition.enable)
   - Safari: Not supported

   Privacy note: Chrome sends audio to Google's servers for
   processing. A consent check should be performed before first use.
   ============================================================ */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/* ── Type declarations for the Web Speech API ── */

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  onspeechstart: (() => void) | null;
  onspeechend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

/* ── Hook configuration ── */

export interface UseVoiceInputOptions {
  /** BCP-47 language tag for recognition (default: 'en-US') */
  lang?: string;
  /** Whether to keep listening after each utterance (default: false) */
  continuous?: boolean;
  /** Whether to show interim results as user speaks (default: true) */
  interimResults?: boolean;
  /** Callback fired when a final transcript is available */
  onTranscript?: (transcript: string) => void;
  /** Callback fired when an error occurs */
  onError?: (error: string) => void;
}

/* ── Hook return type ── */

export interface UseVoiceInputReturn {
  /** Whether the microphone is currently active and listening */
  isListening: boolean;
  /** The final, confirmed transcript text */
  transcript: string;
  /** Real-time interim transcript (updates as the user speaks) */
  interimTranscript: string;
  /** Error message if recognition failed (null when no error) */
  error: string | null;
  /** Whether the browser supports SpeechRecognition */
  isSupported: boolean;
  /** Start listening for speech input */
  startListening: () => void;
  /** Stop listening and finalize the transcript */
  stopListening: () => void;
  /** Clear the current transcript and error state */
  resetTranscript: () => void;
}

/* ── User-friendly error messages ── */

const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'Microphone access was denied. Please allow microphone access in your browser settings.',
  'no-speech': 'No speech was detected. Please try again and speak clearly.',
  'audio-capture': 'No microphone was found. Please connect a microphone and try again.',
  'network': 'A network error occurred. Speech recognition requires an internet connection in Chrome.',
  'aborted': 'Speech recognition was cancelled.',
  'service-not-allowed': 'Speech recognition service is not allowed. Please try again.',
  'language-not-supported': 'The selected language is not supported for speech recognition.',
};

/**
 * Get the user-friendly error message for a SpeechRecognition error code.
 */
function getErrorMessage(errorCode: string): string {
  return ERROR_MESSAGES[errorCode] || `Speech recognition error: ${errorCode}`;
}

/**
 * Check if the browser supports the Web SpeechRecognition API.
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/**
 * Get the SpeechRecognition constructor for the current browser.
 */
function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;

  const constructor =
    (window as unknown as Record<string, SpeechRecognitionConstructor>).SpeechRecognition ||
    (window as unknown as Record<string, SpeechRecognitionConstructor>).webkitSpeechRecognition;

  return constructor || null;
}

/* ── Constants ── */

const VOICE_CONSENT_KEY = 'lore-voice-consent';

/**
 * Check if the user has previously consented to voice input.
 */
export function hasVoiceConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(VOICE_CONSENT_KEY) === 'true';
}

/**
 * Record that the user has consented to voice input.
 */
export function setVoiceConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VOICE_CONSENT_KEY, 'true');
}

/* ============================================================
   Main Hook
   ============================================================ */

export function useVoiceInput(options: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const {
    lang = 'en-US',
    continuous = false,
    interimResults = true,
    onTranscript,
    onError,
  } = options;

  /* ── State ── */
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  /* ── Refs ── */
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isListeningRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);

  /* Keep callback refs in sync without triggering re-renders */
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const isSupported = isSpeechRecognitionSupported();

  /**
   * Initialize and start the SpeechRecognition instance.
   */
  const startListening = useCallback(() => {
    if (!isSupported) {
      const msg = 'Voice input is not supported in this browser. Please use Chrome or Edge.';
      setError(msg);
      onErrorRef.current?.(msg);
      return;
    }

    /* Abort any existing recognition session */
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        /* Ignore abort errors on already-stopped instances */
      }
      recognitionRef.current = null;
    }

    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    /* ── Configure ── */
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    /* ── Event: recognition started ── */
    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setError(null);
      setTranscript('');
      setInterimTranscript('');
    };

    /* ── Event: results received ── */
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let currentInterim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += text;
        } else {
          currentInterim += text;
        }
      }

      if (currentInterim) {
        setInterimTranscript(currentInterim);
      }

      if (finalTranscript) {
        const trimmed = finalTranscript.trim();
        setTranscript(trimmed);
        setInterimTranscript('');
        onTranscriptRef.current?.(trimmed);
      }
    };

    /* ── Event: error occurred ── */
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      /* "aborted" errors are expected when we manually stop — don't surface them */
      if (event.error === 'aborted') return;

      const message = getErrorMessage(event.error);
      setError(message);
      onErrorRef.current?.(message);

      isListeningRef.current = false;
      setIsListening(false);
    };

    /* ── Event: recognition ended ── */
    recognition.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;
    };

    /* ── Start listening ── */
    try {
      recognition.start();
    } catch (err) {
      const message = 'Failed to start speech recognition. Please try again.';
      setError(message);
      onErrorRef.current?.(message);
      isListeningRef.current = false;
      setIsListening(false);
    }
  }, [isSupported, continuous, interimResults, lang]);

  /**
   * Stop listening and finalize the current transcript.
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* Already stopped — ignore */
      }
    }
    isListeningRef.current = false;
    setIsListening(false);
  }, []);

  /**
   * Clear the transcript and error state.
   */
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          /* Already cleaned up */
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
