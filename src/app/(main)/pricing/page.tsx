/* ============================================================
   Pricing Page
   Credits/subscription toggle with card grids.
   ============================================================ */

'use client';

import { useState } from 'react';
import { Check, Zap, Star, Users } from 'lucide-react';
import { Card, Badge, Button, Toggle } from '@/components/ui';
import { AnimatedPage, FadeIn, StaggerChildren } from '@/components/ux';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CREDIT_PACKAGES, SUBSCRIPTION_TIERS } from '@/lib/constants';

export default function PricingPage() {
  const [showSubscription, setShowSubscription] = useState(false);

  return (
    <AnimatedPage>
      <PageWrapper maxWidth="lg">
        <div className="space-y-8">
          {/* Header */}
          <FadeIn>
            <div className="text-center max-w-lg mx-auto">
              <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl tracking-[-0.02em] text-[var(--color-text)]">
                Pick your plan
              </h1>
              <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)] mt-2">
                Pay per course with credits, or go unlimited with a subscription
              </p>
            </div>
          </FadeIn>

          {/* Toggle */}
          <FadeIn delay={100}>
            <div className="flex items-center justify-center gap-3">
              <span className={`font-[family-name:var(--font-body)] text-sm ${!showSubscription ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-muted)]'}`}>
                Credits
              </span>
              <Toggle isOn={showSubscription} onToggle={setShowSubscription} label="Switch between credits and subscription" />
              <span className={`font-[family-name:var(--font-body)] text-sm ${showSubscription ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-muted)]'}`}>
                Subscription
              </span>
            </div>
          </FadeIn>

          {/* Credits grid */}
          {!showSubscription && (
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CREDIT_PACKAGES.map((pkg) => (
                <Card
                  key={pkg.id}
                  variant={pkg.popular ? 'elevated' : 'glass'}
                  padding="lg"
                  gradientBorder={pkg.popular}
                  className="relative"
                >
                  {pkg.popular && (
                    <Badge variant="primary" size="sm" className="absolute top-4 right-4">
                      Popular
                    </Badge>
                  )}
                  {pkg.bestValue && (
                    <Badge variant="success" size="sm" className="absolute top-4 right-4">
                      Best value
                    </Badge>
                  )}
                  <div className="space-y-4">
                    <div>
                      <p className="font-[family-name:var(--font-heading)] font-bold text-3xl text-[var(--color-text)]">
                        {pkg.credits}
                      </p>
                      <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)]">credits</p>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)]">
                        ${pkg.price}
                      </p>
                      <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-muted)]">
                        ${(pkg.price / pkg.credits).toFixed(2)} per course
                      </p>
                    </div>
                    <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)]">
                      {pkg.courses}
                    </p>
                    <Button
                      variant={pkg.popular ? 'primary' : 'secondary'}
                      fullWidth
                    >
                      Buy credits
                    </Button>
                  </div>
                </Card>
              ))}
            </StaggerChildren>
          )}

          {/* Subscription grid */}
          {showSubscription && (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUBSCRIPTION_TIERS.map((tier) => {
                const TierIcon = tier.id === 'free' ? Zap : tier.id === 'pro' ? Star : Users;
                return (
                  <Card
                    key={tier.id}
                    variant={tier.popular ? 'elevated' : 'glass'}
                    padding="lg"
                    gradientBorder={tier.popular}
                    className="relative flex flex-col"
                  >
                    {tier.popular && (
                      <Badge variant="primary" size="sm" className="absolute top-4 right-4">
                        Recommended
                      </Badge>
                    )}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                          <TierIcon size={20} />
                        </div>
                        <div>
                          <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)]">
                            {tier.name}
                          </h3>
                          <p className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">{tier.tagline}</p>
                        </div>
                      </div>

                      <div>
                        <span className="font-[family-name:var(--font-heading)] font-bold text-3xl text-[var(--color-text)]">
                          {tier.price === 0 ? 'Free' : `$${tier.price}`}
                        </span>
                        {tier.price > 0 && (
                          <span className="text-sm text-[var(--color-muted)] font-[family-name:var(--font-body)]">/month</span>
                        )}
                      </div>

                      <ul className="space-y-2.5">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check size={16} className="text-[var(--color-success)] shrink-0 mt-0.5" />
                            <span className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text)]">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant={tier.popular ? 'primary' : 'secondary'}
                      fullWidth
                      className="mt-6"
                    >
                      {tier.price === 0 ? 'Current plan' : 'Upgrade'}
                    </Button>
                  </Card>
                );
              })}
            </StaggerChildren>
          )}

          {/* How credits work */}
          <FadeIn delay={200}>
            <Card variant="glass" padding="lg">
              <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)] mb-3">
                How credits work
              </h3>
              <div className="space-y-2 font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)]">
                <p>1 credit = 1 AI-generated course on any topic</p>
                <p>Credits never expire and can be used anytime</p>
                <p>Courses include interactive content, quizzes, and AI help</p>
                <p>Free users get 3 courses per month</p>
              </div>
            </Card>
          </FadeIn>
        </div>
      </PageWrapper>
    </AnimatedPage>
  );
}
