/* ============================================================
   Root Page — Lore Landing Page
   Composition-only page file. Imports section components and
   renders them in order. Zero business logic, zero inline styles.

   SEO: Full metadata with Open Graph and Twitter cards.
   Semantic HTML: Single <h1>, proper heading hierarchy,
   landmark roles, and descriptive aria-labels.
   ============================================================ */

import type { Metadata } from 'next';
import {
  Navbar,
  HeroSection,
  HowItWorksSection,
  FeaturesSection,
  PricingSection,
  FAQSection,
  CTASection,
  Footer,
} from '@/components/landing';

/* ============================================================
   SEO Metadata — Strict Best Practices
   - Descriptive title under 60 characters
   - Meta description between 120-155 characters
   - Open Graph tags for social sharing
   - Twitter card configuration
   - Canonical URL
   - Keywords for search discovery
   ============================================================ */

export const metadata: Metadata = {
  title: 'Lore — Your AI Tutor Just Dropped',
  description:
    'Type any topic and Lore builds you a full interactive course in seconds. AI-powered lessons, videos, quizzes, and gamified progress. Learn anything, for real.',
  keywords: [
    'AI tutor',
    'AI learning',
    'online courses',
    'interactive learning',
    'AI-generated courses',
    'gamified education',
    'learn anything',
    'Lore',
    'AI education',
    'personalized learning',
  ],
  openGraph: {
    title: 'Lore — Your AI Tutor Just Dropped',
    description:
      'Type any topic and Lore builds you a full interactive course in seconds. AI-powered lessons, videos, quizzes, and gamified progress.',
    type: 'website',
    siteName: 'Lore',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lore — Your AI Tutor Just Dropped',
    description:
      'Type any topic and Lore builds you a full interactive course in seconds. AI-powered lessons, videos, quizzes, and gamified progress.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

/**
 * Landing page — composition of all section components.
 *
 * This is a Server Component. Interactive sections (Navbar,
 * HeroSection, PricingSection, FAQSection) are Client Components
 * internally via 'use client' directives.
 *
 * Section order:
 * 1. Navbar (fixed, not in flow)
 * 2. Hero — above the fold
 * 3. How It Works — 3-step flow
 * 4. Features — bento grid
 * 5. Pricing — hybrid toggle
 * 6. FAQ — accordion
 * 7. CTA — final conversion
 * 8. Footer — links and info
 */
export default function LandingPage() {
  return (
    <>
      {/* Skip to content link — accessibility requirement */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-primary)] focus:text-white focus:outline-none"
      >
        Skip to content
      </a>

      <Navbar />

      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
