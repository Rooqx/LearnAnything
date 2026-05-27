/* ============================================================
   Hero Section — Above the Fold
   The most important section. Gen Z decides in 3 seconds.

   Layout (DESIGN_VARIANCE: 9 — anti-center bias):
   Desktop: Split screen — left text + CTA, right chat mock
   Mobile: Single column — visual above text

   Headline: "Your AI tutor just dropped." (Option B)
   Subheadline: Clear, plain-language value proposition

   Animations (Emil's framework):
   - Headline words stagger in — slideUp + fadeIn, 40ms apart
   - Subheadline fades in after headline completes
   - CTAs scale in from 0.95 (never 0) after subheadline
   - Mock card floats in from right
   - Lumi pulses continuously via CSS keyframes
   - Background particles drift slowly — CSS keyframes only

   All animations use custom ease-out curves, never ease-in.
   ============================================================ */

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LumiPlaceholder } from './LumiPlaceholder';
import { useAnimationMode } from '@/hooks/useAnimationMode';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/** Chat messages for the mock interface */
const MOCK_MESSAGES = [
  {
    sender: 'user' as const,
    text: 'teach me how blockchain works',
  },
  {
    sender: 'lumi' as const,
    text: "On it. I'm building your course now: blockchain fundamentals, how transactions work, smart contracts, and more.",
  },
  {
    sender: 'lumi' as const,
    text: '5 modules ready. Let\'s start with "What is a blockchain?" →',
  },
] as const;

/** Words of the headline — staggered animation on each */
const HEADLINE_WORDS = ['Your', 'AI', 'tutor', 'just', 'dropped.'];

/** Custom ease-out curve — Emil's strong ease-out */
const EASE_OUT_STRONG: [number, number, number, number] = [0.23, 1, 0.32, 1];

/**
 * Hero section component.
 *
 * Split-screen layout on desktop (anti-center bias, VARIANCE=9):
 * - Left (55%): Headline, subheadline, dual CTAs, Lumi
 * - Right (45%): Mock chat interface showing a Lore conversation
 *
 * Mobile: stacks vertically with chat mock above text content.
 *
 * Background: gradient-mesh from globals.css + subtle floating
 * particles in brand colors using CSS keyframes.
 */
export function HeroSection() {
  const { isFull } = useAnimationMode();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  /** Whether to run entrance animations */
  const shouldAnimate = isFull && isInView;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={cn(
        /* Full viewport height with safe dvh unit */
        'relative min-h-[100dvh]',
        /* Generous padding — taste-skill DENSITY 4 */
        'pt-28 md:pt-32 pb-16 md:pb-24',
        'px-4 md:px-6 lg:px-8',
        /* Flex layout for vertical centering */
        'flex items-center',
        'overflow-hidden'
      )}
      aria-label="Lore — Your AI tutor just dropped"
    >
      {/* Background particles — subtle floating orbs in brand colors.
          CSS keyframes only, pointer-events-none, very low opacity.
          Runs on both FULL and LITE modes (GPU-friendly). */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <style>{`
          @keyframes particle-drift-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(30px, -40px) scale(1.1); }
            50% { transform: translate(-20px, -80px) scale(0.95); }
            75% { transform: translate(40px, -30px) scale(1.05); }
          }
          @keyframes particle-drift-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-40px, -60px) scale(1.15); }
            66% { transform: translate(30px, -20px) scale(0.9); }
          }
          @keyframes particle-drift-3 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-30px, 40px); }
          }
        `}</style>
        {/* Particle 1 — primary color, top-left area */}
        <div
          className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, var(--color-primary), transparent 70%)',
            animation: 'particle-drift-1 12s ease-in-out infinite',
          }}
        />
        {/* Particle 2 — accent color, bottom-right area */}
        <div
          className="absolute bottom-[20%] right-[15%] w-48 h-48 rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, var(--color-accent), transparent 70%)',
            animation: 'particle-drift-2 10s ease-in-out infinite',
          }}
        />
        {/* Particle 3 — reward color, center area */}
        <div
          className="absolute top-[40%] right-[30%] w-32 h-32 rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, var(--color-reward), transparent 70%)',
            animation: 'particle-drift-3 8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Main content grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        {/* Right: Chat mock — shown below text on mobile (order-last) */}
        <div className="lg:col-span-5 lg:order-2 order-last flex justify-center lg:justify-end">
          {isFull ? (
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.95, filter: 'blur(12px)' }}
              animate={shouldAnimate ? { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, x: 60, scale: 0.95, filter: 'blur(12px)' }}
              transition={{
                duration: 0.8,
                ease: [0.32, 0.72, 0, 1],
                delay: 0.3,
              }}
              className="w-full max-w-md"
            >
              <ChatMock />
            </motion.div>
          ) : (
            <div className="w-full max-w-md">
              <ChatMock />
            </div>
          )}
        </div>

        {/* Left: Text content — headline, subheadline, CTAs */}
        <div className="lg:col-span-7 lg:order-1 flex flex-col items-start gap-6 md:gap-8">
          {/* Lumi mascot — floating above headline on desktop */}
          <div className="flex items-center gap-3">
            <LumiPlaceholder size={48} variant="excited" />
            {isFull ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
                animate={shouldAnimate ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
              >
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5',
                    'px-3 py-1 rounded-full',
                    'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20',
                    'text-[var(--color-primary)]',
                    'font-[family-name:var(--font-body)] text-xs font-medium tracking-wide uppercase'
                  )}
                >
                  <Sparkles size={12} aria-hidden="true" />
                  Now in beta
                </span>
              </motion.div>
            ) : (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5',
                  'px-3 py-1 rounded-full',
                  'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20',
                  'text-[var(--color-primary)]',
                  'font-[family-name:var(--font-body)] text-xs font-medium tracking-wide uppercase'
                )}
              >
                <Sparkles size={12} aria-hidden="true" />
                Now in beta
              </span>
            )}
          </div>

          {/* Headline — each word animates in staggered */}
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-[-0.03em] leading-[1.05] text-[var(--color-text)]">
            {HEADLINE_WORDS.map((word, index) => (
              isFull ? (
                <motion.span
                  key={word}
                  className="inline-block mr-[0.25em]"
                  initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                  animate={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 40, filter: 'blur(8px)' }}
                  transition={{
                    duration: 0.8,
                    ease: [0.32, 0.72, 0, 1],
                    delay: 0.15 + index * 0.06,
                  }}
                >
                  {/* Highlight "AI" in primary color for emphasis */}
                  {word === 'AI' ? (
                    <span className="text-[var(--color-primary)]">{word}</span>
                  ) : word === 'dropped.' ? (
                    <span className="text-gradient-primary">{word}</span>
                  ) : (
                    word
                  )}
                </motion.span>
              ) : (
                <span key={word} className="inline-block mr-[0.25em]">
                  {word === 'AI' ? (
                    <span className="text-[var(--color-primary)]">{word}</span>
                  ) : word === 'dropped.' ? (
                    <span className="text-gradient-primary">{word}</span>
                  ) : (
                    word
                  )}
                </span>
              )
            ))}
          </h1>

          {/* Subheadline — fades in after headline */}
          {isFull ? (
            <motion.p
              className="font-[family-name:var(--font-body)] text-lg md:text-xl text-[var(--color-text-secondary)] max-w-[55ch] leading-relaxed"
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              animate={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 32, filter: 'blur(8px)' }}
              transition={{
                duration: 0.8,
                ease: [0.32, 0.72, 0, 1],
                delay: 0.45,
              }}
            >
              Type any topic. Lore builds you a real course with lessons,
              videos, and quizzes in seconds. No more 47 open tabs.
            </motion.p>
          ) : (
            <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-[var(--color-text-secondary)] max-w-[55ch] leading-relaxed">
              Type any topic. Lore builds you a real course with lessons,
              videos, and quizzes in seconds. No more 47 open tabs.
            </p>
          )}

          {/* CTAs — primary + secondary */}
          {isFull ? (
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 24, filter: 'blur(8px)' }}
              transition={{
                duration: 0.8,
                ease: [0.32, 0.72, 0, 1],
                delay: 0.6,
              }}
            >
              <Link href="/sign-up">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                  className="shadow-[var(--shadow-lg)]"
                >
                  Start Learning Free
                </Button>
              </Link>
              <a
                href="#how-it-works"
                className={cn(
                  'font-[family-name:var(--font-body)] text-sm font-medium',
                  'text-[var(--color-text-secondary)]',
                  'hover:text-[var(--color-primary)]',
                  'transition-colors duration-150',
                  'cursor-pointer underline underline-offset-4 decoration-[var(--color-border)]',
                  'hover:decoration-[var(--color-primary)]'
                )}
              >
                See how it works
              </a>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/sign-up">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                  className="shadow-[var(--shadow-lg)]"
                >
                  Start Learning Free
                </Button>
              </Link>
              <a
                href="#how-it-works"
                className={cn(
                  'font-[family-name:var(--font-body)] text-sm font-medium',
                  'text-[var(--color-text-secondary)]',
                  'hover:text-[var(--color-primary)]',
                  'transition-colors duration-150',
                  'cursor-pointer underline underline-offset-4 decoration-[var(--color-border)]',
                  'hover:decoration-[var(--color-primary)]'
                )}
              >
                See how it works
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ChatMock — Simulated Lore conversation interface
   Glass card with chat bubbles showing a user-Lumi exchange.
   Gentle floating animation via CSS keyframes.
   ============================================================ */

function ChatMock() {
  return (
    <div
      className={cn(
        /* Glass card surface — matches the app's actual chat UI */
        'rounded-[var(--radius-xl)]',
        'bg-[var(--glass-bg)]',
        'backdrop-blur-[16px]',
        'border border-[var(--glass-border)]',
        'shadow-[var(--shadow-md),inset_0_1px_0_rgba(255,255,255,0.08)]',
        'p-5 md:p-6',
        'w-full',
        /* Subtle floating animation — CSS keyframe, GPU-friendly */
        'animate-lumi-bob'
      )}
    >
      {/* Chat header */}
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[var(--color-border)]">
        <LumiPlaceholder size={28} variant="excited" />
        <div>
          <p className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)]">
            Lore
          </p>
          <p className="font-[family-name:var(--font-body)] text-[10px] text-[var(--color-success)]">
            Ready to teach
          </p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="space-y-3">
        {MOCK_MESSAGES.map((msg, index) => (
          <div
            key={index}
            className={cn(
              'flex',
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] px-4 py-2.5 rounded-2xl',
                'font-[family-name:var(--font-body)] text-sm leading-relaxed',
                msg.sender === 'user'
                  ? [
                      'bg-[var(--color-primary)] text-white',
                      'rounded-br-md',
                    ]
                  : [
                      'bg-[var(--color-surface-elevated)] text-[var(--color-text)]',
                      'rounded-bl-md',
                      'border border-[var(--color-border)]',
                    ]
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Fake input bar */}
      <div className="mt-4 flex items-center gap-2">
        <div
          className={cn(
            'flex-1 px-4 py-2.5 rounded-full',
            'bg-[var(--color-surface)]',
            'border border-[var(--color-border)]',
            'font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)]'
          )}
        >
          What do you want to learn?
        </div>
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            'bg-[var(--color-primary)] text-white',
            'shrink-0'
          )}
        >
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
}
