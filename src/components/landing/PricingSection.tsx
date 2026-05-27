/* ============================================================
   Pricing Section — Hybrid Credits/Subscription Toggle
   Full pricing section with animated toggle between credits
   and subscription views.

   Credits View: Grid of credit bundles with "Best Value" badge
   Subscription View: 3 tiers with "Most Popular" on Pro

   Data sourced from src/constants/pricing.ts

   Animations:
   - Toggle: smooth content swap with fade + slight translateY
   - Cards: staggered fade-in on section scroll into view
   - Popular badge: subtle pulse glow via CSS keyframe
   ============================================================ */

'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, X as XIcon, Coins, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LumiPlaceholder } from './LumiPlaceholder';
import { useAnimationMode } from '@/hooks/useAnimationMode';
import { cn } from '@/lib/utils';
import {
  CREDIT_BUNDLES,
  SUBSCRIPTION_PLANS,
  CREDITS_EXPLANATION,
  formatNaira,
} from '@/constants/pricing';
import Link from 'next/link';

/** Custom ease-out curve */
const EASE_OUT_STRONG: [number, number, number, number] = [0.23, 1, 0.32, 1];

/** Toggle modes */
type PricingMode = 'credits' | 'subscription';

/**
 * Pricing section with hybrid credits/subscription toggle.
 *
 * The toggle pill switches between two views with an animated
 * content swap (fade + translateY). Both views share the same
 * section container.
 *
 * Credits view: responsive grid of credit bundle cards
 * Subscription view: 3 subscription plan cards
 *
 * Below each view is contextual info:
 * - Credits: "How Credits Work" 3-step flow
 * - Subscription: feature comparison highlights
 */
export function PricingSection() {
  const [mode, setMode] = useState<PricingMode>('credits');
  const { isFull } = useAnimationMode();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const shouldAnimate = isFull && isInView;

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className={cn(
        'py-24 md:py-32 lg:py-40',
        'px-4 md:px-6 lg:px-8',
        'relative'
      )}
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          {isFull ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE_OUT_STRONG }}
            >
              <LumiPlaceholder size={56} variant="excited" className="mx-auto mb-4" />
              <span
                className={cn(
                  'inline-flex items-center gap-1.5',
                  'px-3 py-1 mb-4 rounded-full',
                  'bg-[var(--color-reward)]/10 border border-[var(--color-reward)]/20',
                  'text-[var(--color-reward)]',
                  'font-[family-name:var(--font-body)] text-[10px] font-medium tracking-[0.15em] uppercase'
                )}
              >
                Pricing
              </span>
              <h2
                id="pricing-heading"
                className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] text-[var(--color-text)]"
              >
                Pick your power-up
              </h2>
              <p className="mt-4 font-[family-name:var(--font-body)] text-lg text-[var(--color-text-secondary)] max-w-[45ch] mx-auto">
                Credits for casual learners. Subscriptions for the committed.
              </p>
            </motion.div>
          ) : (
            <div>
              <LumiPlaceholder size={56} variant="excited" className="mx-auto mb-4" />
              <span
                className={cn(
                  'inline-flex items-center gap-1.5',
                  'px-3 py-1 mb-4 rounded-full',
                  'bg-[var(--color-reward)]/10 border border-[var(--color-reward)]/20',
                  'text-[var(--color-reward)]',
                  'font-[family-name:var(--font-body)] text-[10px] font-medium tracking-[0.15em] uppercase'
                )}
              >
                Pricing
              </span>
              <h2
                id="pricing-heading"
                className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] text-[var(--color-text)]"
              >
                Pick your power-up
              </h2>
              <p className="mt-4 font-[family-name:var(--font-body)] text-lg text-[var(--color-text-secondary)] max-w-[45ch] mx-auto">
                Credits for casual learners. Subscriptions for the committed.
              </p>
            </div>
          )}
        </div>

        {/* Toggle pill — Credits / Subscription */}
        <div className="flex justify-center mb-12">
          <div
            className={cn(
              'relative inline-flex items-center',
              'rounded-full',
              'bg-[var(--color-surface)]',
              'border border-[var(--color-border)]',
              'p-1'
            )}
            role="tablist"
            aria-label="Pricing mode"
          >
            {/* Active indicator — animated sliding pill */}
            <div
              className={cn(
                'absolute top-1 bottom-1 rounded-full',
                'bg-[var(--color-primary)]',
                'transition-all duration-300',
                mode === 'credits'
                  ? 'left-1 w-[calc(50%-4px)]'
                  : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
              )}
              style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
            />

            <button
              role="tab"
              aria-selected={mode === 'credits'}
              onClick={() => setMode('credits')}
              className={cn(
                'relative z-10 flex items-center gap-2',
                'px-5 py-2.5 rounded-full',
                'font-[family-name:var(--font-body)] text-sm font-medium',
                'transition-colors duration-200 cursor-pointer',
                'min-h-[44px]',
                mode === 'credits'
                  ? 'text-white'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              )}
            >
              <Coins size={16} aria-hidden="true" />
              Credits
            </button>

            <button
              role="tab"
              aria-selected={mode === 'subscription'}
              onClick={() => setMode('subscription')}
              className={cn(
                'relative z-10 flex items-center gap-2',
                'px-5 py-2.5 rounded-full',
                'font-[family-name:var(--font-body)] text-sm font-medium',
                'transition-colors duration-200 cursor-pointer',
                'min-h-[44px]',
                mode === 'subscription'
                  ? 'text-white'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              )}
            >
              <CreditCard size={16} aria-hidden="true" />
              Subscription
            </button>
          </div>
        </div>

        {/* Content area — animated swap between views */}
        {isFull ? (
          <AnimatePresence mode="wait">
            {mode === 'credits' ? (
              <motion.div
                key="credits"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: EASE_OUT_STRONG }}
              >
                <CreditsView shouldAnimate={shouldAnimate} isFull={isFull} />
              </motion.div>
            ) : (
              <motion.div
                key="subscription"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: EASE_OUT_STRONG }}
              >
                <SubscriptionView shouldAnimate={shouldAnimate} isFull={isFull} />
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          mode === 'credits' ? (
            <CreditsView shouldAnimate={false} isFull={false} />
          ) : (
            <SubscriptionView shouldAnimate={false} isFull={false} />
          )
        )}
      </div>
    </section>
  );
}

/* ============================================================
   CreditsView — Grid of credit bundle cards
   ============================================================ */

function CreditsView({
  shouldAnimate,
  isFull,
}: {
  shouldAnimate: boolean;
  isFull: boolean;
}) {
  return (
    <div>
      {/* Credit bundles grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
        {CREDIT_BUNDLES.map((bundle, index) => {
          const cardContent = (
            <Card
              key={bundle.id}
              variant={bundle.isBestValue ? 'elevated' : 'glass'}
              padding="md"
              interactive
              className={cn(
                'relative text-center group',
                'hover:-translate-y-1',
                'transition-all duration-200',
                bundle.isBestValue && [
                  /* Best value card gets accent glow border */
                  'border-[var(--color-accent)]/40',
                  'shadow-[0_0_24px_rgba(255,229,0,0.12)]',
                ]
              )}
            >
              {/* Best Value badge */}
              {bundle.isBestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="accent" size="sm" pulse>
                    Best Value
                  </Badge>
                </div>
              )}

              {/* Credit amount */}
              <p className="font-[family-name:var(--font-heading)] font-bold text-2xl md:text-3xl text-[var(--color-text)] mt-2">
                {bundle.credits}
              </p>
              <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-muted)] mb-3">
                credits
              </p>

              {/* What it gets you */}
              <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-text-secondary)] mb-4">
                {bundle.description}
              </p>

              {/* Price */}
              <p className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)] mb-4">
                {formatNaira(bundle.price)}
              </p>

              {/* CTA */}
              <Link href="/sign-up" className="block">
                <Button
                  variant={bundle.isBestValue ? 'primary' : 'secondary'}
                  size="sm"
                  fullWidth
                >
                  Buy
                </Button>
              </Link>
            </Card>
          );

          if (isFull) {
            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: EASE_OUT_STRONG,
                  delay: index * 0.05,
                }}
              >
                {cardContent}
              </motion.div>
            );
          }

          return <div key={bundle.id}>{cardContent}</div>;
        })}
      </div>

      {/* How Credits Work — 3 step mini-flow */}
      <div className="max-w-3xl mx-auto">
        <h3 className="font-[family-name:var(--font-heading)] font-semibold text-xl text-[var(--color-text)] text-center mb-8">
          How credits work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDITS_EXPLANATION.map((step) => (
            <div key={step.step} className="text-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-[family-name:var(--font-heading)] font-bold text-sm mb-3">
                {step.step}
              </span>
              <h4 className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)] mb-1">
                {step.title}
              </h4>
              <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-text-secondary)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SubscriptionView — 3 plan tier cards
   ============================================================ */

function SubscriptionView({
  shouldAnimate,
  isFull,
}: {
  shouldAnimate: boolean;
  isFull: boolean;
}) {
  return (
    <div>
      {/* Subscription plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto mb-12">
        {SUBSCRIPTION_PLANS.map((plan, index) => {
          const cardContent = (
            <Card
              key={plan.id}
              variant={plan.isPopular ? 'elevated' : 'glass'}
              padding="lg"
              className={cn(
                'relative group',
                'transition-all duration-200',
                'hover:-translate-y-1',
                plan.isPopular && [
                  /* Most popular card gets primary gradient border */
                  'border-[var(--color-primary)]/40',
                  'shadow-[0_0_32px_rgba(255,48,8,0.15)]',
                ]
              )}
            >
              {/* Most Popular badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="primary" size="sm" pulse>
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Plan name */}
              <h3 className="font-[family-name:var(--font-heading)] font-bold text-xl text-[var(--color-text)] mt-2">
                {plan.name}
              </h3>
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] mb-6">
                {plan.tagline}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="font-[family-name:var(--font-heading)] font-bold text-3xl text-[var(--color-text)]">
                  {formatNaira(plan.priceMonthly)}
                </span>
                <span className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)] ml-1">
                  /month
                </span>
              </div>

              {/* Feature list */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check size={16} className="text-[var(--color-success)] shrink-0 mt-0.5" aria-hidden="true" />
                    ) : (
                      <XIcon size={16} className="text-[var(--color-muted)]/40 shrink-0 mt-0.5" aria-hidden="true" />
                    )}
                    <span
                      className={cn(
                        'font-[family-name:var(--font-body)] text-sm',
                        feature.included
                          ? 'text-[var(--color-text)]'
                          : 'text-[var(--color-muted)]/60 line-through'
                      )}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/sign-up" className="block">
                <Button
                  variant={plan.isPopular ? 'primary' : 'secondary'}
                  size="md"
                  fullWidth
                >
                  Get {plan.name}
                </Button>
              </Link>
            </Card>
          );

          if (isFull) {
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: EASE_OUT_STRONG,
                  delay: index * 0.1,
                }}
              >
                {cardContent}
              </motion.div>
            );
          }

          return <div key={plan.id}>{cardContent}</div>;
        })}
      </div>

      {/* Subscription feature highlight row */}
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)]">
          All plans include XP tracking, streak system, achievement badges, and
          full leaderboard access. Cancel anytime — no questions asked.
        </p>
      </div>
    </div>
  );
}
