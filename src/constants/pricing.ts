/* ============================================================
   Pricing Constants
   All credit bundles and subscription plans live here.
   Single source of truth for PricingSection and payment flows.

   Amounts are in NGN (Nigerian Naira).
   Credit costs per course mode (from context.md):
     Beginner:   3 credits
     Simplified: 2 credits
     Quick:      1 credit
   ============================================================ */

/** Credit cost per course generation mode */
export const CREDIT_COSTS = {
  beginner: 3,
  simplified: 2,
  quick: 1,
} as const;

/** Individual credit bundle available for one-time purchase */
export interface CreditBundle {
  /** Unique identifier for the bundle */
  id: string;
  /** Number of credits included */
  credits: number;
  /** Price in NGN */
  price: number;
  /** What you can do with this bundle — human-readable */
  description: string;
  /** Whether this bundle is the best value */
  isBestValue: boolean;
}

/** All available credit bundles — ordered by credits ascending */
export const CREDIT_BUNDLES: CreditBundle[] = [
  {
    id: 'credits-5',
    credits: 5,
    price: 500,
    description: '1–5 quick courses',
    isBestValue: false,
  },
  {
    id: 'credits-10',
    credits: 10,
    price: 900,
    description: '3–10 courses',
    isBestValue: false,
  },
  {
    id: 'credits-25',
    credits: 25,
    price: 2000,
    description: '8–25 courses',
    isBestValue: false,
  },
  {
    id: 'credits-50',
    credits: 50,
    price: 3500,
    description: '16–50 courses',
    isBestValue: true,
  },
  {
    id: 'credits-100',
    credits: 100,
    price: 6000,
    description: '33–100 courses',
    isBestValue: false,
  },
  {
    id: 'credits-200',
    credits: 200,
    price: 10000,
    description: '66–200 courses',
    isBestValue: false,
  },
  {
    id: 'credits-500',
    credits: 500,
    price: 22000,
    description: '166–500 courses',
    isBestValue: false,
  },
  {
    id: 'credits-1000',
    credits: 1000,
    price: 40000,
    description: '333–1000 courses',
    isBestValue: false,
  },
];

/** Feature included in a subscription plan */
export interface PlanFeature {
  /** Feature description */
  text: string;
  /** Whether this feature is included in the plan */
  included: boolean;
}

/** Subscription plan definition */
export interface SubscriptionPlan {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Monthly price in NGN */
  priceMonthly: number;
  /** Short tagline */
  tagline: string;
  /** Whether this is the recommended plan */
  isPopular: boolean;
  /** List of features with inclusion status */
  features: PlanFeature[];
}

/** All subscription plans — 3 tiers */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    priceMonthly: 1500,
    tagline: 'Get started with AI learning',
    isPopular: false,
    features: [
      { text: 'Unlimited Simplified courses', included: true },
      { text: 'Unlimited Quick courses', included: true },
      { text: 'Beginner mode courses', included: false },
      { text: 'Priority generation', included: false },
      { text: 'Early access to new features', included: false },
      { text: 'XP and streak tracking', included: true },
      { text: 'Leaderboard access', included: true },
    ],
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    priceMonthly: 3500,
    tagline: 'For serious learners',
    isPopular: true,
    features: [
      { text: 'Unlimited Simplified courses', included: true },
      { text: 'Unlimited Quick courses', included: true },
      { text: 'Unlimited Beginner courses', included: true },
      { text: 'Priority generation', included: true },
      { text: 'Early access to new features', included: false },
      { text: 'XP and streak tracking', included: true },
      { text: 'Leaderboard access', included: true },
    ],
  },
  {
    id: 'plan-premium',
    name: 'Premium',
    priceMonthly: 6000,
    tagline: 'The complete experience',
    isPopular: false,
    features: [
      { text: 'Unlimited Simplified courses', included: true },
      { text: 'Unlimited Quick courses', included: true },
      { text: 'Unlimited Beginner courses', included: true },
      { text: 'Priority generation', included: true },
      { text: 'Early access to new features', included: true },
      { text: 'XP and streak tracking', included: true },
      { text: 'Leaderboard access', included: true },
    ],
  },
];

/** How credits work — 3-step explanation for the pricing section */
export const CREDITS_EXPLANATION = [
  {
    step: 1,
    title: 'Buy a bundle',
    description: 'Pick a credit pack that fits your learning goals.',
  },
  {
    step: 2,
    title: 'Generate courses',
    description: 'Each course costs 1–3 credits depending on depth.',
  },
  {
    step: 3,
    title: 'Learn forever',
    description: 'Your courses stay yours. Re-visit anytime, no extra cost.',
  },
] as const;

/** Format NGN price for display */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}
