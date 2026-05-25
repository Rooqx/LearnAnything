/* ============================================================
   Chip Component
   Selectable/tappable pill for suggestions, filters, and modes.
   ============================================================ */

'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

export function Chip({
  children,
  selected = false,
  onClick,
  icon,
  size = 'md',
  disabled = false,
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1.5',
        'rounded-full whitespace-nowrap select-none',
        'font-[family-name:var(--font-body)] font-medium',
        'transition-all duration-200 cursor-pointer',
        'active:scale-[0.96]',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'focus-visible:outline-[var(--color-primary)]',
        'min-h-[44px]',
        selected && [
          'bg-[var(--color-primary)] text-white',
          'border border-[var(--color-primary)]',
          'shadow-[var(--shadow-sm)]',
        ],
        !selected && [
          'bg-[var(--glass-bg)]',
          'border border-[var(--glass-border)]',
          'text-[var(--color-text-secondary)]',
          'hover:border-[var(--color-primary)]/40',
          'hover:text-[var(--color-text)]',
          'backdrop-blur-sm',
        ],
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        disabled && 'opacity-50 cursor-not-allowed active:scale-100',
        className
      )}
      aria-pressed={selected}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
