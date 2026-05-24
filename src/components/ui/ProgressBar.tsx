"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  height?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const heightStyles = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

export function ProgressBar({ value, color, height = "md", showLabel = false, animated = true, className }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-[var(--color-muted)]">
          <span>Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-[var(--color-border)]", heightStyles[height])}>
        <div
          className={cn("h-full rounded-full", animated && "transition-all duration-500 ease-out")}
          style={{
            width: `${clampedValue}%`,
            backgroundColor: color || "var(--color-primary)",
          }}
        />
      </div>
    </div>
  );
}
