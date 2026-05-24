"use client";

import { cn } from "@/lib/utils";

/* ============================================================
   Badge Component
   
   Status, mode, and achievement badges with color variants.
   Used for learning mode indicators, achievement states,
   and general status labels throughout the app.
   ============================================================ */

type BadgeVariant = "primary" | "accent" | "reward" | "success" | "error" | "muted" | "custom";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Custom color for 'custom' variant — pass a hex color */
  customColor?: string;
  /** Optional left icon */
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
  accent: "bg-[var(--color-accent)]/15 text-[var(--color-accent)]",
  reward: "bg-[var(--color-reward)]/15 text-[var(--color-reward)]",
  success: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
  error: "bg-[var(--color-error)]/15 text-[var(--color-error)]",
  muted: "bg-[var(--color-muted)]/15 text-[var(--color-muted)]",
  custom: "", // Styles applied inline via customColor
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export function Badge({
  children,
  variant = "primary",
  size = "sm",
  customColor,
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        "rounded-[var(--radius-full)]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      style={
        variant === "custom" && customColor
          ? {
              backgroundColor: `${customColor}20`,
              color: customColor,
            }
          : undefined
      }
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
