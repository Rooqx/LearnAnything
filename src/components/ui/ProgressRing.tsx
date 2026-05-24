"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  maxValue?: number;
  size?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  className?: string;
}

export function ProgressRing({ value, maxValue = 100, size = 120, label, sublabel, color, className }: ProgressRingProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const pathColor = color || "var(--color-primary)";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)} style={{ width: size }}>
      <CircularProgressbar
        value={percentage}
        styles={buildStyles({
          pathColor,
          trailColor: "var(--color-border)",
          pathTransitionDuration: 0.8,
        })}
      />
      {label && <span className="text-center text-sm font-medium text-[var(--color-text)]">{label}</span>}
      {sublabel && <span className="text-center text-xs text-[var(--color-muted)]">{sublabel}</span>}
    </div>
  );
}
