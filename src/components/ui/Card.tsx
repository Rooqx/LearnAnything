/* ============================================================
   Card Component
   Glass surface card — the foundation container used throughout
   the app. Implements taste-skill Liquid Glass pattern with
   backdrop-filter blur and inner refraction highlight.

   Variants: default (glass), elevated (glass-elevated), solid
   ============================================================ */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Surface variant */
  variant?: 'glass' | 'elevated' | 'solid';
  /** Show gradient top border in --color-primary */
  gradientBorder?: boolean;
  /** Make the card interactive (adds hover effects + cursor) */
  interactive?: boolean;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Optional header content rendered above children */
  header?: ReactNode;
  /** Optional footer content rendered below children */
  footer?: ReactNode;
}

/**
 * Glass card base component.
 *
 * Implements the taste-skill Liquid Glass pattern:
 * - backdrop-filter: blur(16px) for glass effect
 * - 1px border with --glass-border for subtle edge
 * - Inner refraction highlight (inset shadow) for physical depth
 * - Never pure flat — always has some depth cue
 *
 * High-end-visual-design Double-Bezel inspiration:
 * - The card itself serves as the inner core
 * - Wrap in an outer shell div when extra depth is needed
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'glass',
      gradientBorder = false,
      interactive = false,
      padding = 'md',
      header,
      footer,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          'rounded-[var(--radius-lg)]',

          /* Variant-specific surface styles */
          variant === 'glass' && [
            'bg-[var(--glass-bg)]',
            'backdrop-blur-[16px]',
            'border border-[var(--glass-border)]',
            /* Inner refraction — Liquid Glass technique */
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
          ],
          variant === 'elevated' && [
            'bg-[var(--glass-bg)]',
            'backdrop-blur-[24px]',
            'border border-[var(--glass-border)]',
            'shadow-[var(--shadow-md),inset_0_1px_0_rgba(255,255,255,0.1)]',
          ],
          variant === 'solid' && [
            'bg-[var(--color-surface)]',
            'border border-[var(--color-border)]',
          ],

          /* Gradient top border — used on featured cards like StatCards */
          gradientBorder && [
            'before:absolute before:inset-x-0 before:top-0 before:h-[2px]',
            'before:bg-gradient-to-r before:from-[var(--color-primary)] before:to-[var(--color-accent)]',
          ],

          /* Interactive state — adds hover effects */
          interactive && [
            'cursor-pointer',
            'transition-all duration-200',
            'hover:shadow-[var(--shadow-md)]',
            'hover:border-[var(--color-primary)]/30',
            'active:scale-[0.98]',
          ],

          /* Padding */
          padding === 'none' && 'p-0',
          padding === 'sm' && 'p-4',
          padding === 'md' && 'p-6',
          padding === 'lg' && 'p-8',

          className
        )}
        {...props}
      >
        {header && (
          <div className="mb-4 pb-4 border-b border-[var(--color-border)]">
            {header}
          </div>
        )}

        {children}

        {footer && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
