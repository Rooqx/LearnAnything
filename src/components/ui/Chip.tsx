"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}

export function Chip({ label, isSelected = false, onClick, icon, variant = "default", className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium",
        "rounded-[var(--radius-full)] cursor-pointer",
        "transition-all duration-200 ease-out",
        "active:scale-[0.96]",
        variant === "default" && !isSelected && "glass text-[var(--color-text-secondary)] hover:text-[var(--color-text)]",
        variant === "default" && isSelected && "bg-[var(--color-primary)] text-white shadow-sm",
        variant === "outline" && !isSelected && "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
        variant === "outline" && isSelected && "border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </button>
  );
}
