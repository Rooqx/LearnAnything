/* ============================================================
   Landing Page Footer
   Clean, not overwhelming. Lore personality in the copy.

   Layout:
   Desktop: 3 columns — brand, links, social
   Mobile: Stacked, centered

   Social links: X, Instagram, WhatsApp, Telegram, TikTok
   Legal: Copyright + Privacy Policy + Terms of Service
   ============================================================ */

import { LumiPlaceholder } from './LumiPlaceholder';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/** Footer navigation links */
const FOOTER_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Sign Up', href: '/sign-up' },
] as const;

/** Social media links */
const SOCIAL_LINKS = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: 'Telegram',
    href: 'https://t.me',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
] as const;

/**
 * Landing page footer.
 *
 * Clean, minimal design with Lore personality.
 * Three-column layout on desktop, stacked and centered on mobile.
 *
 * SEO: Includes structured navigation links, social links with
 * proper aria-labels, and legal links (Privacy, Terms).
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'py-16 md:py-20',
        'px-4 md:px-6 lg:px-8',
        'border-t border-[var(--color-border)]',
        'bg-[var(--color-surface)]'
      )}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Column 1: Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <LumiPlaceholder size={32} variant="default" />
              <span className="font-[family-name:var(--font-heading)] font-bold text-xl text-[var(--color-text)] tracking-tight">
                Lore
              </span>
            </div>
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] max-w-[30ch] mx-auto md:mx-0">
              AI-powered learning that actually makes sense. Built for the
              curious ones.
            </p>
          </div>

          {/* Column 2: Navigation links */}
          <nav className="text-center" aria-label="Footer navigation">
            <h3 className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)] mb-4">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Social + Made in Nigeria */}
          <div className="text-center md:text-right">
            <h3 className="font-[family-name:var(--font-heading)] font-semibold text-sm text-[var(--color-text)] mb-4">
              Connect
            </h3>
            <div className="flex items-center gap-3 justify-center md:justify-end mb-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    'bg-[var(--color-surface-elevated)]',
                    'border border-[var(--color-border)]',
                    'text-[var(--color-text-secondary)]',
                    'hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30',
                    'transition-all duration-150',
                    'cursor-pointer'
                  )}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-muted)]">
              Made with ❤️ in Nigeria
            </p>
          </div>
        </div>

        {/* Bottom bar — copyright + legal */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-muted)]">
            &copy; {currentYear} Lore. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="font-[family-name:var(--font-body)] text-xs text-[var(--color-muted)] hover:text-[var(--color-text-secondary)] transition-colors duration-150"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-[family-name:var(--font-body)] text-xs text-[var(--color-muted)] hover:text-[var(--color-text-secondary)] transition-colors duration-150"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
