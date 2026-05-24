"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  labelLeft?: string;
  labelRight?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ isOn, onToggle, labelLeft, labelRight, disabled = false, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full",
        "transition-colors duration-200",
        isOn ? "bg-[var(--color-primary)]" : "bg-[var(--color-muted)]/30",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {labelLeft && <span className="sr-only">{labelLeft}</span>}
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow-sm",
          "transition-transform duration-200",
          isOn ? "translate-x-6" : "translate-x-1"
        )}
      />
      {labelRight && <span className="sr-only">{labelRight}</span>}
    </button>
  );
}
