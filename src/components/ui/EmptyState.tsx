/* ============================================================
   EmptyState Component
   Composed empty state: Lumi mascot + message + CTA button.
   Used on all pages when there is no data to display.
   ============================================================ */

import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './Button';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  /** Lumi or icon component displayed above the message */
  icon?: ReactNode;
  /** Primary message — Space Grotesk heading */
  title: string;
  /** Secondary descriptive message */
  description?: string;
  /** CTA button label */
  actionLabel?: string;
  /** CTA button click handler */
  onAction?: () => void;
  /** CTA button variant */
  actionVariant?: ButtonProps['variant'];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Empty state composition component.
 * Provides a consistent "nothing here yet" experience
 * across all pages. Lumi IDLE appears above the message
 * with a CTA button to guide the user.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-16 px-6',
        className
      )}
    >
      {icon && <div className="mb-6">{icon}</div>}

      <h3 className="font-[family-name:var(--font-heading)] font-semibold text-xl text-[var(--color-text)] mb-2">
        {title}
      </h3>

      {description && (
        <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)] text-base max-w-sm mb-6">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant={actionVariant} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
