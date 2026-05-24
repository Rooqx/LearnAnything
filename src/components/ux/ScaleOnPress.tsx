"use client";

import { cn } from "@/lib/utils";

/** Subtle scale interaction on press — wraps buttons and interactive cards */
export function ScaleOnPress({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("transition-transform duration-150 active:scale-[0.96]", className)}>
      {children}
    </div>
  );
}
