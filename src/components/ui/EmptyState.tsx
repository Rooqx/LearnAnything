"use client";

import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaOnClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

/** Empty state placeholder with Lumi, message, and optional CTA. Reused across all empty pages. */
export function EmptyState({ title, description, ctaLabel, ctaOnClick, icon, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16 text-center", className)}>
      {icon && <div className="mb-2">{icon}</div>}
      <h3 className="font-heading text-xl font-semibold text-[var(--color-text)]">{title}</h3>
      {description && <p className="max-w-sm text-sm text-[var(--color-muted)]">{description}</p>}
      {ctaLabel && ctaOnClick && (
        <Button variant="primary" onClick={ctaOnClick}>{ctaLabel}</Button>
      )}
    </div>
  );
}
