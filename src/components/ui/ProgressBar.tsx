/* ============================================================
   ProgressBar Component
   Linear progress bar with animated fill.
   Used in: learning interface header, course cards, XP level bar.

   Color-coded variants matching the design system.
   ============================================================ */

import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  /** Progress value (0–100) */
  value: number;
  /** Color variant for the fill */
  variant?: 'primary' | 'accent' | 'success' | 'reward';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the percentage label */
  showLabel?: boolean;
  /** Whether to animate the fill on mount */
  animated?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Linear progress bar component.
 *
 * The fill uses CSS transition for smooth animated growth.
 * Clamped between 0 and 100 to prevent overflow.
 * Uses transform: scaleX for GPU-accelerated animation
 * (never animate width directly — taste-skill performance rule).
 */
export function ProgressBar({
  value,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  animated = true,
  className,
}: ProgressBarProps) {
  /* Clamp value between 0 and 100 */
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      {/* Optional label */}
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-[var(--color-text-secondary)] font-[family-name:var(--font-body)]">
            Progress
          </span>
          <span className="text-sm font-medium text-[var(--color-text)] font-[family-name:var(--font-body)]">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}

      {/* Track */}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          'bg-[var(--color-surface-elevated)]',
          size === 'sm' && 'h-1.5',
          size === 'md' && 'h-2.5',
          size === 'lg' && 'h-3.5'
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Fill — uses scaleX for GPU-accelerated animation */}
        <div
          className={cn(
            'h-full rounded-full origin-left',
            animated && 'transition-transform duration-700 ease-out',
            variant === 'primary' && 'bg-[var(--color-primary)]',
            variant === 'accent' && 'bg-[var(--color-accent)]',
            variant === 'success' && 'bg-[var(--color-success)]',
            variant === 'reward' && 'bg-[var(--color-reward)]'
          )}
          style={{
            transform: `scaleX(${clampedValue / 100})`,
          }}
        />
      </div>
    </div>
  );
}
