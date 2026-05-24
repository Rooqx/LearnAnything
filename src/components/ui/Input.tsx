/* ============================================================
   Input Component
   Text input with animated focus border glow, floating label,
   error state, and optional icon.

   Design tokens: --color-primary (focus), --color-error (error)
   Animation: border glows primary on focus, label floats upward
   ============================================================ */

'use client';

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text displayed above or floating */
  label?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Helper text displayed below the input (hidden when error present) */
  helperText?: string;
  /** Icon element rendered on the left side */
  leftIcon?: ReactNode;
  /** Icon element rendered on the right side */
  rightIcon?: ReactNode;
  /** Input size variant */
  inputSize?: 'sm' | 'md' | 'lg';
}

/**
 * Text input component with animated interactions.
 *
 * Implements taste-skill input patterns:
 * - Glass surface background matching the design system
 * - Border glows --color-primary on focus (CSS transition)
 * - Error state: --color-error border + subtle shake animation
 * - Label sits above the input (taste-skill Rule 6: label above)
 * - Helper text below, replaced by error text when present
 *
 * Focus animation uses ease-out-quart for premium responsiveness.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      className,
      id,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label — always above input per taste-skill Rule 6 */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'font-[family-name:var(--font-body)] text-sm font-medium',
              'transition-colors duration-150',
              isFocused
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)]',
              error && 'text-[var(--color-error)]'
            )}
          >
            {label}
          </label>
        )}

        {/* Input wrapper — contains the input and optional icons */}
        <div
          className={cn(
            'relative flex items-center',
            'bg-[var(--color-surface)]',
            'border rounded-[var(--radius-md)]',
            'transition-all duration-200',
            /* Shadow and border states */
            isFocused && !error && [
              'border-[var(--color-primary)]',
              'shadow-[0_0_0_3px_rgba(255,48,8,0.15)]',
            ],
            error && [
              'border-[var(--color-error)]',
              'shadow-[0_0_0_3px_rgba(255,23,68,0.15)]',
              /* Subtle shake animation on error — CSS keyframe */
              'animate-[shake_0.3s_ease-in-out]',
            ],
            !isFocused && !error && 'border-[var(--color-border)]',

            /* Size */
            inputSize === 'sm' && 'h-9',
            inputSize === 'md' && 'h-11',
            inputSize === 'lg' && 'h-13'
          )}
        >
          {/* Left icon */}
          {leftIcon && (
            <span
              className={cn(
                'pl-3 shrink-0 text-[var(--color-muted)]',
                'transition-colors duration-150',
                isFocused && 'text-[var(--color-primary)]'
              )}
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-full bg-transparent',
              'px-3 py-2',
              'font-[family-name:var(--font-body)] text-[var(--color-text)]',
              'placeholder:text-[var(--color-muted)]',
              'outline-none border-none',
              'text-base',
              leftIcon && 'pl-1',
              rightIcon && 'pr-1',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <span
              className="pr-3 shrink-0 text-[var(--color-muted)] cursor-pointer"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error or helper text below input */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[var(--color-error)] text-sm font-[family-name:var(--font-body)]"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="text-[var(--color-muted)] text-sm font-[family-name:var(--font-body)]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
