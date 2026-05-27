/* ============================================================
   FAQ Section — Accordion
   Click-to-expand FAQ with personality-driven answers.

   Behavior:
   - Only one item open at a time
   - Smooth CSS height transition on open/close
   - Expanded item gets --color-primary left border accent
   - Arrow icon rotates 180° on expand
   - Section fades in on scroll
   - Items stagger on section entrance

   Copy: Gen Z voice — honest, not corporate, slightly fun.
   ============================================================ */

'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useAnimationMode } from '@/hooks/useAnimationMode';
import { cn } from '@/lib/utils';

/** FAQ items — question + answer pairs */
const FAQ_ITEMS = [
  {
    id: 'how-generate',
    question: 'How does Lore actually generate my course?',
    answer: 'You type a topic into the chat. Our AI analyzes it, breaks it into logical modules and chapters, finds relevant videos, generates interactive content, and builds quiz questions — all in about 30 seconds. The result is a full structured course you can start immediately.',
  },
  {
    id: 'what-learn',
    question: 'What can I learn on Lore?',
    answer: "Honestly? Almost anything. Blockchain, cooking, psychology, guitar, calculus, history, coding, photography — if there's knowledge about it, Lore can teach it. Some very niche or brand-new topics might have thinner content, but we're always improving.",
  },
  {
    id: 'modes',
    question: "What's the difference between Beginner, Simplified, and Quick?",
    answer: 'Beginner gives you the deepest course — more modules, detailed explanations, videos, and quizzes. Simplified covers the essentials without going too deep. Quick gives you a rapid overview — perfect when you just need to understand the basics fast. Same AI, different depth.',
  },
  {
    id: 'credits',
    question: 'How do credits work?',
    answer: "You buy credit bundles and spend them to generate courses. Quick courses cost 1 credit, Simplified cost 2, and Beginner cost 3. Once a course is generated, it's yours forever — no extra cost to revisit it. Credits never expire.",
  },
  {
    id: 'free-trial',
    question: 'Is there a free trial?',
    answer: "You get starter credits when you sign up — enough to generate a few courses and see how it works. No credit card required. After that, you can buy more credits or grab a subscription.",
  },
  {
    id: 'mobile',
    question: 'Can I learn on my phone?',
    answer: "The web app is fully responsive and works great on mobile browsers. A dedicated mobile app is in the works — but the mobile web experience is solid right now.",
  },
  {
    id: 'vs-youtube',
    question: 'How is this different from YouTube or Google?',
    answer: "YouTube gives you random videos with no structure. Google gives you articles you have to piece together yourself. Lore gives you a complete, structured course — with progression, quizzes, and tracking. It's the difference between a pile of ingredients and a meal.",
  },
  {
    id: 'mid-lesson',
    question: 'What if I want to ask a question mid-lesson?',
    answer: "Hit the floating Lumi help button in any lesson. Ask your question and Lore explains it in context — referencing what you're currently learning. It's like having a tutor sitting next to you who actually knows the material.",
  },
] as const;

/** Custom ease-out curve */
const EASE_OUT_STRONG: [number, number, number, number] = [0.23, 1, 0.32, 1];

/**
 * FAQ section with accordion behavior.
 *
 * Uses CSS grid max-height transition for smooth open/close
 * animation (not JS-driven height). This ensures the animation
 * runs off the main thread and stays smooth.
 *
 * Layout: single column, max-width 3xl for readability.
 * Each item is a self-contained accordion panel.
 */
export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { isFull } = useAnimationMode();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });
  const shouldAnimate = isFull && isInView;

  /** Toggle accordion — only one open at a time */
  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className={cn(
        'py-24 md:py-32 lg:py-40',
        'px-4 md:px-6 lg:px-8',
        'relative'
      )}
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
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
                  'bg-[var(--color-success)]/10 border border-[var(--color-success)]/20',
                  'text-[var(--color-success)]',
                  'font-[family-name:var(--font-body)] text-[10px] font-medium tracking-[0.15em] uppercase'
                )}
              >
                FAQ
              </span>
              <h2
                id="faq-heading"
                className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] text-[var(--color-text)]"
              >
                Got questions?
              </h2>
              <p className="mt-4 font-[family-name:var(--font-body)] text-lg text-[var(--color-text-secondary)]">
                Real answers. No corporate fluff.
              </p>
            </motion.div>
          ) : (
            <div>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5',
                  'px-3 py-1 mb-4 rounded-full',
                  'bg-[var(--color-success)]/10 border border-[var(--color-success)]/20',
                  'text-[var(--color-success)]',
                  'font-[family-name:var(--font-body)] text-[10px] font-medium tracking-[0.15em] uppercase'
                )}
              >
                FAQ
              </span>
              <h2
                id="faq-heading"
                className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] text-[var(--color-text)]"
              >
                Got questions?
              </h2>
              <p className="mt-4 font-[family-name:var(--font-body)] text-lg text-[var(--color-text-secondary)]">
                Real answers. No corporate fluff.
              </p>
            </div>
          )}
        </div>

        {/* Accordion items */}
        <div className="space-y-3" role="list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openId === item.id;

            const accordionContent = (
              <div
                key={item.id}
                className={cn(
                  'rounded-[var(--radius-lg)]',
                  'bg-[var(--glass-bg)]',
                  'backdrop-blur-[16px]',
                  'border border-[var(--glass-border)]',
                  'overflow-hidden',
                  'transition-all duration-200',
                  /* Hover: subtle background tint */
                  'hover:bg-[var(--color-surface-elevated)]/50',
                  /* Active item: primary left border */
                  /*isOpen && 'border-l-2 border-l-[var(--color-primary)]'*/
                )}
                role="listitem"
              >
                {/* Question — clickable trigger */}
                <button
                  onClick={() => handleToggle(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between gap-4',
                    'px-5 md:px-6 py-4 md:py-5',
                    'text-left cursor-pointer',
                    'min-h-[44px]',
                    'active:scale-[0.99]',
                    'transition-transform duration-300'
                  )}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span className="font-[family-name:var(--font-heading)] font-semibold text-base text-[var(--color-text)]">
                    {item.question}
                  </span>

                  {/* Arrow — rotates 180° when open */}
                  <ChevronDown
                    size={18}
                    className={cn(
                      'shrink-0 text-[var(--color-muted)]',
                      'transition-transform duration-300',
                      isOpen && 'rotate-180 text-[var(--color-primary)]'
                    )}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                    aria-hidden="true"
                  />
                </button>

                {/* Answer — CSS Grid transition for mathematically perfect smooth open/close */}
                <div
                  id={`faq-answer-${item.id}`}
                  className={cn(
              
                    'grid',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  )}
                  style={{ 
                    transition: 'grid-template-rows 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms cubic-bezier(0.32, 0.72, 0, 1)' 
                  }}
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <div className="overflow-hidden 
                  ">
                    <div className="flex gap-3 px-5 md:px-6 pb-4 md:pb-5 font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      <div className="bg-[var(--color-primary)] rounded-full w-1 shrink-0 my-1" />
                      <div>{item.answer}</div>
                    </div>
                  </div>
                </div>
              </div>
            );

            if (isFull) {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                  animate={shouldAnimate ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 40, filter: 'blur(8px)' }}
                  transition={{
                    duration: 0.8,
                    ease: [0.32, 0.72, 0, 1],
                    delay: 0.1 + index * 0.08,
                  }}
                >
                  {accordionContent}
                </motion.div>
              );
            }

            return <div key={item.id}>{accordionContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
