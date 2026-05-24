/* ============================================================
   Button Component
   Primary interactive element used throughout the app.

   Variants: primary, secondary, ghost, danger
   Sizes: sm, md, lg
   Features: loading state, icon slots, scale-on-press,
             minimum 44px touch target on mobile.

   Design tokens: --color-primary, --radius-full
   Animation: scale(0.96) on active, 150ms ease-out-quart
   ============================================================ */

'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant determining color scheme and emphasis */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Size variant — all sizes maintain 44px minimum touch target */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading spinner and disable interactions */
  isLoading?: boolean;
  /** Icon element rendered before the label */
  leftIcon?: ReactNode;
  /** Icon element rendered after the label */
  rightIcon?: ReactNode;
  /** Render as full width */
  fullWidth?: boolean;
}

/**
 * Primary button component.
 * Implements taste-skill button patterns:
 * - Pill shape (border-radius: 9999px) for primary CTAs
 * - Scale(0.96) on :active for tactile press feedback (Emil's principle)
 * - Custom ease-out-quart curve for premium feel
 * - Loading state with spinner
 * - Never uses `ease-in` — always ease-out for responsiveness
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          /* Base styles — all variants share these */
          'relative inline-flex items-center justify-center gap-2',
          'font-[family-name:var(--font-body)] font-medium',
          'rounded-full cursor-pointer select-none',
          'transition-all duration-150',
          /* Scale on press — Emil's tactile feedback principle */
          'active:scale-[0.96]',
          /* Focus visible ring for keyboard navigation */
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
          /* Disabled state */
          isDisabled && 'opacity-50 cursor-not-allowed active:scale-100',

          /* Variant styles */
          variant === 'primary' && [
            'bg-[var(--color-primary)] text-white',
            'hover:bg-[var(--color-primary-dark)]',
            'shadow-[var(--shadow-sm)]',
            'hover:shadow-[var(--shadow-md)]',
          ],
          variant === 'secondary' && [
            'bg-[var(--glass-bg)] text-[var(--color-text)]',
            'border border-[var(--glass-border)]',
            'backdrop-blur-md',
            'hover:bg-[var(--color-surface-elevated)]',
            /* Inner refraction highlight — taste-skill Liquid Glass */
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
          ],
          variant === 'ghost' && [
            'bg-transparent text-[var(--color-text)]',
            'hover:bg-[var(--color-surface)]',
          ],
          variant === 'danger' && [
            'bg-[var(--color-error)] text-white',
            'hover:brightness-110',
          ],

          /* Size styles — all maintain 44px minimum touch target */
          size === 'sm' && 'h-9 px-4 text-sm min-h-[44px]',
          size === 'md' && 'h-11 px-6 text-base min-h-[44px]',
          size === 'lg' && 'h-13 px-8 text-lg min-h-[44px]',

          /* Full width */
          fullWidth && 'w-full',

          className
        )}
        {...props}
      >
        {/* Loading spinner replaces left icon */}
        {isLoading ? (
          <Loader2
            size={size === 'sm' ? 16 : 20}
            className="animate-spin"
            aria-hidden="true"
          />
        ) : (
          leftIcon && (
            <span className="shrink-0" aria-hidden="true">
              {leftIcon}
            </span>
          )
        )}

        {children && <span className={cn(isLoading && 'opacity-70')}>{children}</span>}

        {rightIcon && !isLoading && (
          <span className="shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
