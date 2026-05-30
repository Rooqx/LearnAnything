/* ============================================================
   Landing Page Navbar
   Sticky navigation with glass morphism scroll effect.

   Desktop: Lumi + wordmark left, nav links center, CTA right
   Mobile: Lumi + wordmark left, hamburger right → full screen
           overlay with staggered link reveals

   Scroll behavior:
   - Top of page: transparent background
   - On scroll: glass surface with backdrop-blur
   - Transition: 300ms custom ease-out

   Animation (Emil's principles):
   - Nav items fade in staggered on page load (50ms apart)
   - Mobile menu links stagger on open (80ms apart)
   - Hamburger morphs to X with rotate transforms
   - All transitions use custom cubic-bezier, never ease-in
   ============================================================ */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LumiPlaceholder } from './LumiPlaceholder';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/** Navigation links — each maps to a section anchor ID */
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
] as const;

/**
 * Landing page navbar component.
 *
 * Uses IntersectionObserver pattern to detect scroll position.
 * When the user scrolls past 40px, the navbar gains a glass
 * surface (backdrop-blur + semi-transparent background).
 *
 * Mobile menu is a full-screen overlay with staggered link
 * entrances — each link slides up with a 80ms delay per item.
 *
 * All nav links use smooth scroll via anchor hrefs.
 * The "Get Started" CTA links to /sign-up.
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /** Track scroll position to toggle glass effect */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    /* Check initial position (handles page refresh mid-scroll) */
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /** Close mobile menu when a link is clicked */
  const handleLinkClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  /** Prevent body scroll when mobile menu is open */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          /* Positioning — sticky with floating pill effect */
          'fixed top-0 left-0 right-0 z-50',
          'px-4 md:px-6 lg:px-8',
          'transition-all duration-300',

          /* Glass effect on scroll — transparent by default */
          isScrolled
            ? [
                'py-3',
                'bg-[var(--glass-bg)]',
                'backdrop-blur-[20px]',
                'border-b border-[var(--glass-border)]',
                /* Inner refraction highlight — liquid glass technique */
                'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
              ]
            : 'py-5 bg-transparent'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Lumi logo + wordmark */}
          <Link
            href="/"
            className="flex items-center gap-1 shrink-0 group"
            aria-label="Lore — home"
          >
            <LumiPlaceholder size={36} variant="default" />
            <span
              className={cn(
                'font-[family-name:var(--font-heading)] font-bold text-xl',
                'text-[var(--color-text)]',
                'tracking-tight'
              )}
            >
              Lore
            </span>
          </Link>

          {/* Center: Desktop nav links */}
          <div className="hidden md:flex items-center gap-8" role="menubar">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'font-[family-name:var(--font-body)] text-sm font-medium',
                  'text-[var(--color-text-secondary)]',
                  'hover:text-[var(--color-text)]',
                  'transition-colors duration-150',
                  'cursor-pointer'
                )}
                role="menuitem"
                /* Staggered fade-in on page load — 50ms apart */
                style={{
                  animation: `fadeInDown 400ms cubic-bezier(0.23, 1, 0.32, 1) ${index * 50}ms both`,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <div
              className="hidden md:block"
              style={{
                animation: `fadeInDown 400ms cubic-bezier(0.23, 1, 0.32, 1) ${NAV_LINKS.length * 50}ms both`,
              }}
            >
              <a href="/sign-up">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile hamburger button */}
            <button
              className={cn(
                'md:hidden relative z-50',
                'w-11 h-11 flex items-center justify-center',
                'rounded-full cursor-pointer',
                'text-[var(--color-text)]',
                'hover:bg-[var(--color-surface)]',
                'transition-colors duration-150',
                'active:scale-[0.96]'
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {/* Hamburger ↔ X morphing animation via rotate transforms */}
              <span className="relative w-5 h-5">
                <span
                  className={cn(
                    'absolute left-0 w-5 h-[2px] bg-current rounded-full',
                    'transition-all duration-300',
                    isMobileMenuOpen
                      ? 'top-1/2 -translate-y-1/2 rotate-45'
                      : 'top-1'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-5 h-[2px] bg-current rounded-full',
                    'transition-all duration-300',
                    isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 w-5 h-[2px] bg-current rounded-full',
                    'transition-all duration-300',
                    isMobileMenuOpen
                      ? 'top-1/2 -translate-y-1/2 -rotate-45'
                      : 'bottom-1'
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay — full screen with glass effect */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-0 z-40 md:hidden',
          'transition-all duration-500',
          /* Overlay background — heavy glass effect */
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        style={{
          /* Transition uses custom drawer curve from Emil's skill */
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Glass background */}
        <div
          className={cn(
            'absolute inset-0',
            'bg-[var(--color-bg)]/95',
            'backdrop-blur-[40px]'
          )}
        />

        {/* Menu content — centered vertically */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-8">
          {/* Lumi logo in mobile menu */}
          <LumiPlaceholder
            size={64}
            variant="excited"
            className={cn(
              'transition-all duration-500',
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            )}
          />

          {/* Nav links — staggered entrance */}
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={cn(
                'font-[family-name:var(--font-heading)] font-semibold text-3xl',
                'text-[var(--color-text)]',
                'hover:text-[var(--color-primary)]',
                'transition-all duration-300',
                'cursor-pointer',
                /* Staggered entrance — 80ms delay per item */
                isMobileMenuOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              )}
              style={{
                /* Each link has an incremental delay for stagger effect */
                transitionDelay: isMobileMenuOpen ? `${(index + 1) * 80}ms` : '0ms',
                transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Mobile CTA */}
          <div
            className={cn(
              'transition-all duration-300',
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            )}
            style={{
              transitionDelay: isMobileMenuOpen ? `${(NAV_LINKS.length + 1) * 80}ms` : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            <a href="/sign-up" onClick={handleLinkClick}>
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
