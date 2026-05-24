"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   Input Component
   
   Text input with animated focus glow, floating label,
   error state display, and password show/hide toggle.
   Min height 48px for touch targets.
   ============================================================ */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Floating label text */
  label?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Left icon element */
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              /* Base */
              "w-full min-h-12 rounded-[var(--radius-md)]",
              "bg-[var(--color-surface)] text-[var(--color-text)]",
              "border border-[var(--color-border)]",
              "px-4 py-3 text-base",
              "placeholder:text-[var(--color-muted)]",
              /* Focus: primary border glow */
              "transition-all duration-200 ease-out",
              "focus:border-[var(--color-primary)]",
              "focus:outline-none",
              "focus:shadow-[0_0_0_3px_rgba(108,60,225,0.15)]",
              /* Error state */
              error &&
                "border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(255,107,107,0.15)]",
              /* Icon padding adjustments */
              leftIcon && "pl-11",
              isPassword && "pr-11",
              className
            )}
            {...props}
          />

          {/* Password toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
