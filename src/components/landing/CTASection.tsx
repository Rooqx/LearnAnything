/* ============================================================
   CTA Section — Final Conversion Push
   Last chance to get the sign-up.

   Layout:
   - Full width section with elevated gradient background
   - Large Lumi (120px, excited state)
   - Bold headline + single line subtext
   - Primary CTA with continuous glow pulse
   - Secondary sign-in link

   Animations:
   - Lumi bounces in from above
   - Headline and CTA animate in staggered
   - CTA button has continuous subtle pulse on glow/shadow
   ============================================================ */

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LumiPlaceholder } from './LumiPlaceholder';
import { useAnimationMode } from '@/hooks/useAnimationMode';
import { cn } from '@/lib/utils';


/** Custom ease-out curve */
const EASE_OUT_STRONG: [number, number, number, number] = [0.23, 1, 0.32, 1];

/**
 * Final CTA section — designed to create urgency and excitement.
 *
 * Uses a more intense version of the gradient mesh background
 * with higher opacity radial gradients. Lumi appears in excited
 * state at 120px. The primary CTA has a continuous glow pulse
 * animation to draw the eye.
 */
export function CTASection() {
  const { isFull } = useAnimationMode();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const shouldAnimate = isFull && isInView;

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative py-24 md:py-32 lg:py-40',
        'px-4 md:px-6 lg:px-8',
        'overflow-hidden'
      )}
      aria-label="Get started with Lore"
    >
      {/* Elevated gradient background — more intense than hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse at 30% 20%, rgba(255,48,8,0.2) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 80%, rgba(255,229,0,0.12) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 50%, rgba(255,140,0,0.08) 0%, transparent 60%)',
          ].join(', '),
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Lumi — excited, 120px */}
        {isFull ? (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9, filter: 'blur(8px)' }}
            animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, y: -30, scale: 0.9, filter: 'blur(8px)' }}
            transition={{
              duration: 0.8,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="mb-8"
          >
            <LumiPlaceholder size={120} variant="excited" />
          </motion.div>
        ) : (
          <div className="mb-8">
            <LumiPlaceholder size={120} variant="excited" />
          </div>
        )}

        {/* Headline */}
        {isFull ? (
          <motion.h2
            initial={{ opacity: 0, y: 64, filter: 'blur(12px)' }}
            animate={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 64, filter: 'blur(12px)' }}
            transition={{
              duration: 0.8,
              ease: [0.32, 0.72, 0, 1],
              delay: 0.15,
            }}
            className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] text-[var(--color-text)] mb-4"
          >
            Your AI teacher is waiting.
          </motion.h2>
        ) : (
          <h2 className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] text-[var(--color-text)] mb-4">
            Your AI teacher is waiting.
          </h2>
        )}

        {/* Subtext */}
        {isFull ? (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.4,
              ease: EASE_OUT_STRONG,
              delay: 0.25,
            }}
            className="font-[family-name:var(--font-body)] text-lg text-[var(--color-text-secondary)] mb-10 max-w-[45ch]"
          >
            Start learning for free. No credit card. No boring sign-up forms.
            Just pick a topic and go.
          </motion.p>
        ) : (
          <p className="font-[family-name:var(--font-body)] text-lg text-[var(--color-text-secondary)] mb-10 max-w-[45ch]">
            Start learning for free. No credit card. No boring sign-up forms.
            Just pick a topic and go.
          </p>
        )}

        {/* Primary CTA — with continuous glow pulse */}
        {isFull ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={shouldAnimate ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.4,
              ease: EASE_OUT_STRONG,
              delay: 0.35,
            }}
            className="flex flex-col items-center gap-4"
          >
            <a href="/sign-up">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                className="animate-pulse-glow"
              >
                Start Learning Free
              </Button>
            </a>
            <a
              href="/sign-in"
              className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors duration-150"
            >
              Already have an account?{' '}
              <span className="text-[var(--color-primary)] underline underline-offset-4">
                Sign in
              </span>
            </a>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <a href="/sign-up">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                className="animate-pulse-glow"
              >
                Start Learning Free
              </Button>
            </a>
            <a
              href="/sign-in"
              className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors duration-150"
            >
              Already have an account?{' '}
              <span className="text-[var(--color-primary)] underline underline-offset-4">
                Sign in
              </span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
