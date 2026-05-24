/* ============================================================
   Toggle Component
   On/off toggle switch with animated knob.
   Used in: Settings (theme, animation mode, notifications),
   PricingToggle (credits/subscription).
   ============================================================ */

'use client';

import { cn } from '@/lib/utils';

export interface ToggleProps {
  /** Whether the toggle is in the "on" state */
  isOn: boolean;
  /** Callback when the toggle state changes */
  onToggle: (isOn: boolean) => void;
  /** Accessible label for the toggle */
  label?: string;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Toggle switch component.
 *
 * Uses CSS transitions for the knob movement (no JS animation needed).
 * On state: --color-primary background with white knob.
 * Off state: muted surface background.
 *
 * Animation: 200ms ease-out transition on the knob translateX
 * and background color change simultaneously.
 */
export function Toggle({
  isOn,
  onToggle,
  label,
  size = 'md',
  disabled = false,
  className,
}: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onToggle(!isOn)}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer',
        'rounded-full transition-colors duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'focus-visible:outline-[var(--color-primary)]',
        /* Active press feedback */
        'active:scale-[0.96]',

        /* Background color */
        isOn
          ? 'bg-[var(--color-primary)]'
          : 'bg-[var(--color-surface-elevated)]',

        /* Size */
        size === 'sm' && 'w-10 h-6 min-h-[44px] min-w-[44px] p-0.5',
        size === 'md' && 'w-12 h-7 p-0.5',

        /* Disabled */
        disabled && 'opacity-50 cursor-not-allowed active:scale-100',

        className
      )}
    >
      {/* Knob */}
      <span
        className={cn(
          'block rounded-full bg-white shadow-sm',
          'transition-transform duration-200',
          /* Knob size */
          size === 'sm' && 'w-5 h-5',
          size === 'md' && 'w-6 h-6',
          /* Knob position — translateX moves it right when on */
          isOn && size === 'sm' && 'translate-x-4',
          isOn && size === 'md' && 'translate-x-5',
          !isOn && 'translate-x-0'
        )}
        aria-hidden="true"
      />
    </button>
  );
}
