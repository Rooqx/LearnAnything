/* ============================================================
   Features Section — Asymmetric Bento Grid
   DESIGN_VARIANCE: 9 — no boring 3-column layouts.

   Highlights what makes Lore different using an asymmetric
   bento grid with mixed card sizes. Some cards contain
   mini UI mockups with subtle looping animations.

   Layout:
   Desktop: CSS Grid with fractional units (2fr 1fr, 1fr 2fr)
   Mobile: Single column stack

   Icons: Lucide only — never emojis (anti-emoji policy).
   ============================================================ */

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Target,
  Zap,
  MessageSquare,
  Trophy,
  Play,
  Gamepad2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAnimationMode } from '@/hooks/useAnimationMode';
import { cn } from '@/lib/utils';

/** Feature card data */
const FEATURES = [
  {
    id: 'learn-anything',
    title: 'Learn anything — literally',
    description: 'Blockchain, cooking, calculus, Japanese, guitar chords — if it exists, Lore can teach it. Any topic, any depth.',
    Icon: Target,
    iconColor: 'var(--color-primary)',
    /* Large card — spans 2 columns on desktop */
    span: 'large' as const,
  },
  {
    id: 'three-modes',
    title: '3 learning modes',
    description: 'Beginner for deep dives. Simplified for quick understanding. Quick for rapid overviews.',
    Icon: Zap,
    iconColor: 'var(--color-accent)',
    span: 'small' as const,
  },
  {
    id: 'ask-questions',
    title: 'AI that talks back',
    description: 'Stuck on something? Ask Lore mid-lesson via the floating help button. It explains, not just answers.',
    Icon: MessageSquare,
    iconColor: 'var(--color-success)',
    span: 'small' as const,
  },
  {
    id: 'gamified',
    title: 'Gamified progress',
    description: 'XP, streaks, badges, leaderboard. Learning should feel like leveling up, not sitting in a lecture hall.',
    Icon: Trophy,
    iconColor: 'var(--color-reward)',
    span: 'large' as const,
  },
  {
    id: 'rich-content',
    title: 'Rich content',
    description: 'Videos, code blocks, math equations, interactive quizzes — not just walls of text.',
    Icon: Play,
    iconColor: 'var(--color-primary)',
    span: 'large' as const,
  },
  {
    id: 'feels-like-game',
    title: 'Feels like a game',
    description: 'Daily goals, streak tracking, achievement badges, and a weekly leaderboard. Compete with yourself or your friends.',
    Icon: Gamepad2,
    iconColor: 'var(--color-accent)',
    span: 'small' as const,
  },
] as const;

/** Custom ease-out curve */
const EASE_OUT_STRONG: [number, number, number, number] = [0.23, 1, 0.32, 1];

/**
 * Features section with asymmetric bento grid.
 *
 * Grid layout uses CSS Grid with fractional units to create
 * an intentionally asymmetric layout (VARIANCE=9):
 * Row 1: large (2fr) + small (1fr)
 * Row 2: small (1fr) + large (2fr)
 * Row 3: large (2fr) + small (1fr)
 *
 * On mobile: collapses to single column (w-full, px-4).
 *
 * Each card has a subtle animated gradient border on hover.
 */
export function FeaturesSection() {
  const { isFull } = useAnimationMode();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });
  const shouldAnimate = isFull && isInView;

  return (
    <section
      ref={sectionRef}
      id="features"
      className={cn(
        'py-24 md:py-32 lg:py-40',
        'px-4 md:px-6 lg:px-8',
        'relative'
      )}
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16 md:mb-20 max-w-2xl">
          {isFull ? (
            <motion.div
              initial={{ opacity: 0, y: 64, filter: 'blur(12px)' }}
              animate={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 64, filter: 'blur(12px)' }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            >
              <span
                className={cn(
                  'inline-flex items-center gap-1.5',
                  'px-3 py-1 mb-4 rounded-full',
                  'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20',
                  'text-[var(--color-primary)]',
                  'font-[family-name:var(--font-body)] text-[10px] font-medium tracking-[0.15em] uppercase'
                )}
              >
                Why Lore
              </span>
              <h2
                id="features-heading"
                className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] text-[var(--color-text)]"
              >
                Not another boring learning app.
              </h2>
              <p className="mt-4 font-[family-name:var(--font-body)] text-lg text-[var(--color-text-secondary)] max-w-[55ch]">
                Lore is what happens when you build a learning tool for people
                who actually hate learning tools.
              </p>
            </motion.div>
          ) : (
            <div>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5',
                  'px-3 py-1 mb-4 rounded-full',
                  'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20',
                  'text-[var(--color-primary)]',
                  'font-[family-name:var(--font-body)] text-[10px] font-medium tracking-[0.15em] uppercase'
                )}
              >
                Why Lore
              </span>
              <h2
                id="features-heading"
                className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] text-[var(--color-text)]"
              >
                Not another boring learning app.
              </h2>
              <p className="mt-4 font-[family-name:var(--font-body)] text-lg text-[var(--color-text-secondary)] max-w-[55ch]">
                Lore is what happens when you build a learning tool for people
                who actually hate learning tools.
              </p>
            </div>
          )}
        </div>

        {/* Bento grid — asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map((feature, index) => {
            const FeatureIcon = feature.Icon;

            const cardContent = (
              <Card
                variant="glass"
                padding="lg"
                interactive
                className={cn(
                  'group relative h-full',
                  'hover:-translate-y-1',
                  'transition-all duration-200',
                  /* On hover: glow border effect */
                  'hover:border-[var(--color-primary)]/30'
                )}
              >
                {/* Icon container */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl mb-5',
                    'flex items-center justify-center',
                    'bg-[var(--color-surface-elevated)]',
                    'border border-[var(--color-border)]',
                    'group-hover:scale-110',
                    'transition-transform duration-200'
                  )}
                >
                  <FeatureIcon
                    size={22}
                    style={{ color: feature.iconColor }}
                    aria-hidden="true"
                  />
                </div>

                {/* Title */}
                <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)] mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );

            /* Calculate grid span for bento layout:
               large = 2 columns, small = 1 column on desktop */
            const gridClass = feature.span === 'large' ? 'md:col-span-2' : 'md:col-span-1';

            if (isFull) {
              return (
                <motion.div
                  key={feature.id}
                  className={gridClass}
                  initial={{ opacity: 0, y: 64, filter: 'blur(12px)' }}
                  animate={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 64, filter: 'blur(12px)' }}
                  transition={{
                    duration: 0.8,
                    ease: [0.32, 0.72, 0, 1],
                    delay: index * 0.1,
                  }}
                >
                  {cardContent}
                </motion.div>
              );
            }

            return (
              <div key={feature.id} className={gridClass}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
