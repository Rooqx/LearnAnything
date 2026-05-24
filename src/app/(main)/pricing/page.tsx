"use client";

import { useState } from "react";
import { AnimatedPage, FadeIn } from "@/components/ux";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import { CreditCard as CreditCardComponent } from "@/components/pricing/CreditCard";
import { SubscriptionCard } from "@/components/pricing/SubscriptionCard";
import { HowCreditsWork } from "@/components/pricing/HowCreditsWork";

const CREDITS = [
  { credits: 5, description: "Try it out", price: "$4.99" },
  { credits: 20, description: "Great for regular learners", price: "$14.99", isPopular: true },
  { credits: 50, description: "Power learner bundle", price: "$29.99" },
];

const SUBSCRIPTIONS = [
  {
    name: "Free", tagline: "Get started", price: "$0",
    features: ["2 AI courses/month", "Basic quiz mode", "Community leaderboard"],
  },
  {
    name: "Pro", tagline: "For serious learners", price: "$9.99", isPopular: true,
    features: ["Unlimited AI courses", "Advanced quiz modes", "Priority generation", "XP Boosts", "Badge unlocks"],
  },
  {
    name: "Team", tagline: "Learn together", price: "$24.99",
    features: ["Everything in Pro", "5 team members", "Team leaderboard", "Shared courses", "Admin dashboard"],
  },
];

export default function PricingPage() {
  const [tab, setTab] = useState<"credits" | "subscription">("subscription");

  return (
    <AnimatedPage>
      <PageWrapper className="max-w-4xl mx-auto text-center">
        <FadeIn>
          <h1 className="font-heading text-3xl font-bold md:text-4xl">Choose Your Plan</h1>
          <p className="mt-2 text-[var(--color-muted)]">Learn more, pay less. Cancel anytime.</p>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="mt-6 flex justify-center">
            <PricingToggle activeTab={tab} onToggle={setTab} />
          </div>
        </FadeIn>

        {tab === "credits" ? (
          <FadeIn delay={200}>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {CREDITS.map((c) => (
                <CreditCardComponent key={c.credits} {...c} onBuy={() => alert(`Buy ${c.credits} credits`)} />
              ))}
            </div>
            <HowCreditsWork />
          </FadeIn>
        ) : (
          <FadeIn delay={200}>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 items-start">
              {SUBSCRIPTIONS.map((s) => (
                <SubscriptionCard key={s.name} {...s} onSubscribe={() => alert(`Subscribe to ${s.name}`)} />
              ))}
            </div>
          </FadeIn>
        )}
      </PageWrapper>
    </AnimatedPage>
  );
}
