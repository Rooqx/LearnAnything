/* ============================================================
   How It Works Section
   3-step visual explanation of the Lore flow.

   Layout:
   Desktop: 3 glass cards side by side with connecting line
   Mobile: Vertical stack with connecting line running down

   Steps:
   1. "Tell Lore what you want" — MessageCircle icon
   2. "AI builds your course" — Sparkles icon
   3. "Learn your way" — GraduationCap icon

   Animations (Emil's framework):
   - Cards scroll-triggered stagger: 100ms apart
   - Each card: translateY(24px) + opacity 0 → 1
   - Connecting line draws itself on scroll
   - Hover: card lifts translateY(-4px) + shadow increases
   - Duration: 500ms, custom ease-out
   ============================================================ */

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle, Sparkles, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAnimationMode } from '@/hooks/useAnimationMode';
import { cn } from '@/lib/utils';

/** Step data — icon, title, description */
const STEPS = [
  {
    step: 1,
    title: 'Tell Lore what you want',
    description: 'Open the chat, type any topic, or pick from smart suggestions. Be as specific or as broad as you like.',
    Icon: MessageCircle,
    iconColor: 'var(--color-primary)',
  },
  {
    step: 2,
    title: 'AI builds your course',
    description: 'Lore generates a full structured course in seconds with modules, lessons, videos, quizzes, and everything else.',
    Icon: Sparkles,
    iconColor: 'var(--color-accent)',
  },
  {
    step: 3,
    title: 'Learn your way',
    description: 'Interactive lessons at your pace. Ask questions mid-lesson. Earn XP and badges as you go.',
    Icon: GraduationCap,
    iconColor: 'var(--color-success)',
  },
] as const;

/** Custom ease-out curve — Emil's strong ease-out */
const EASE_OUT_STRONG: [number, number, number, number] = [0.23, 1, 0.32, 1];

/**
 * How It Works section.
 *
 * Uses CSS grid for the 3-card layout with a connecting line
 * drawn between cards. On mobile, the grid collapses to a
 * single column with a vertical connecting line.
 *
 * Each step card uses the existing Card component (glass variant)
 * with interactive hover effects.
 */
export function HowItWorksSection() {
  const { isFull } = useAnimationMode();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const shouldAnimate = isFull && isInView;

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className={cn(
        /* Generous section padding — DENSITY 4, breathing room */
        'py-24 md:py-32 lg:py-40',
        'px-4 md:px-6 lg:px-8',
        'relative'
      )}
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          {isFull ? (
            <motion.div
              initial={{ opacity: 0, y: 64, filter: 'blur(12px)' }}
              animate={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 64, filter: 'blur(12px)' }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Eyebrow tag — taste-skill microscopic pill badge */}
              <span
                className={cn(
                  'inline-flex items-center gap-1.5',
                  'px-3 py-1 mb-4 rounded-full',
                  'bg-[var(--color-reward)]/10 border border-[var(--color-reward)]/20',
                  'text-[var(--color-reward)]',
                  'font-[family-name:var(--font-body)] text-[10px] font-medium tracking-[0.15em] uppercase'
                )}
              >
                Simple as 1-2-3
              </span>

              <h2
                id="how-it-works-heading"
                className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] text-[var(--color-text)]"
              >
                Three steps. Zero friction.
              </h2>
              <p className="mt-4 font-[family-name:var(--font-body)] text-lg text-[var(--color-text-secondary)] max-w-[50ch] mx-auto">
                From curiosity to course in under a minute.
              </p>
            </motion.div>
          ) : (
            <div>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5',
                  'px-3 py-1 mb-4 rounded-full',
                  'bg-[var(--color-reward)]/10 border border-[var(--color-reward)]/20',
                  'text-[var(--color-reward)]',
                  'font-[family-name:var(--font-body)] text-[10px] font-medium tracking-[0.15em] uppercase'
                )}
              >
                Simple as 1-2-3
              </span>

              <h2
                id="how-it-works-heading"
                className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] text-[var(--color-text)]"
              >
                Three steps. Zero friction.
              </h2>
              <p className="mt-4 font-[family-name:var(--font-body)] text-lg text-[var(--color-text-secondary)] max-w-[50ch] mx-auto">
                From curiosity to course in under a minute.
              </p>
            </div>
          )}
        </div>

        {/* Step cards with connecting line */}
        <div className="relative">
          {/* Connecting line — horizontal on desktop, vertical on mobile */}
          <div
            className={cn(
              'absolute hidden md:block',
              'top-1/2 left-[16.67%] right-[16.67%]',
              'h-[2px]',
              '-translate-y-1/2',
              'bg-gradient-to-r from-[var(--color-primary)]/40 via-[var(--color-accent)]/40 to-[var(--color-success)]/40'
            )}
            aria-hidden="true"
          />
          {/* Mobile vertical connecting line */}
          <div
            className={cn(
              'absolute md:hidden',
              'left-1/2 -translate-x-1/2 top-[10%] bottom-[10%]',
              'w-[2px]',
              'bg-gradient-to-b from-[var(--color-primary)]/40 via-[var(--color-accent)]/40 to-[var(--color-success)]/40'
            )}
            aria-hidden="true"
          />

          {/* Cards grid — 3 columns on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
            {STEPS.map((step, index) => {
              const StepIcon = step.Icon;

              const cardContent = (
                <Card
                  variant="glass"
                  padding="lg"
                  interactive
                  className={cn(
                    'relative group',
                    /* Hover lift — subtle translateY + shadow increase */
                    'hover:-translate-y-1 hover:shadow-[var(--shadow-md)]',
                    'transition-all duration-200',
                    'text-center'
                  )}
                >
                  {/* Step number — large, top-left (desktop: centered) */}
                  <span
                    className={cn(
                      'block font-[family-name:var(--font-heading)] font-bold text-5xl',
                      'text-[var(--color-primary)]/20',
                      'mb-4',
                      'leading-none'
                    )}
                    aria-hidden="true"
                  >
                    {String(step.step).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl mb-5',
                      'flex items-center justify-center',
                      'bg-[var(--color-surface-elevated)]',
                      'border border-[var(--color-border)]',
                      'mx-auto',
                      /* Subtle glow on hover */
                      'group-hover:shadow-[0_0_20px_rgba(255,48,8,0.15)]',
                      'transition-shadow duration-300'
                    )}
                  >
                    <StepIcon
                      size={24}
                      style={{ color: step.iconColor }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)] mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              );

              /* FULL mode: animate each card with stagger */
              if (isFull) {
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    animate={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 40, filter: 'blur(8px)' }}
                    transition={{
                      duration: 0.8,
                      ease: [0.32, 0.72, 0, 1],
                      delay: 0.15 + index * 0.1,
                    }}
                  >
                    {cardContent}
                  </motion.div>
                );
              }

              /* LITE mode: render without animation wrapper */
              return <div key={step.step}>{cardContent}</div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
