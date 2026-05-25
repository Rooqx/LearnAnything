/* ============================================================
   Badge Component
   Status, mode, and achievement badges used across the app.
   Color-coded by context: learning mode, rarity, or status.
   ============================================================ */

import { cn } from '@/lib/utils';

export interface BadgeProps {
  /** Badge label text */
  children: React.ReactNode;
  /** Color variant — determines background and text colors */
  variant?: 'primary' | 'accent' | 'success' | 'reward' | 'error' | 'muted' | 'custom';
  /** Size variant */
  size?: 'sm' | 'md';
  /** Custom background color (only when variant is 'custom') */
  customColor?: string;
  /** Add pulse glow animation (used for streaks, new badges) */
  pulse?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Badge component for status indicators, mode labels, and achievements.
 *
 * Compact pill-shaped labels. The small size uses taste-skill's
 * microscopic eyebrow tag pattern (10px uppercase tracking).
 *
 * Mode badges use the mode-specific colors:
 * - BEGINNER: primary (--color-primary / red-orange)
 * - SIMPLIFIED: accent (--color-accent / yellow)
 * - QUICK: success (--color-success / neon mint)
 */
export function Badge({
  children,
  variant = 'primary',
  size = 'sm',
  customColor,
  pulse = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'font-[family-name:var(--font-body)] font-medium',
        'rounded-full whitespace-nowrap select-none',

        /* Size */
        size === 'sm' && 'px-2.5 py-0.5 text-[10px] uppercase tracking-[0.08em]',
        size === 'md' && 'px-3 py-1 text-xs',

        /* Color variants — semi-transparent backgrounds with solid text */
        variant === 'primary' && 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]',
        variant === 'accent' && 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]',
        variant === 'success' && 'bg-[var(--color-success)]/15 text-[var(--color-success)]',
        variant === 'reward' && 'bg-[var(--color-reward)]/15 text-[var(--color-reward)]',
        variant === 'error' && 'bg-[var(--color-error)]/15 text-[var(--color-error)]',
        variant === 'muted' && 'bg-[var(--color-muted)]/15 text-[var(--color-muted)]',

        /* Pulse glow animation — used for streaks, recently earned badges */
        pulse && 'animate-pulse-glow',

        className
      )}
      style={
        variant === 'custom' && customColor
          ? {
              backgroundColor: `${customColor}26`,
              color: customColor,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
