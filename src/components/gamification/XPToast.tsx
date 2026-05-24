"use client";

import { FloatUp } from "@/components/ux";
import { cn } from "@/lib/utils";

/** XP earned toast notification — appears with float-up animation */
export function XPToast({ xp, isVisible, className }: { xp: number; isVisible: boolean; className?: string }) {
  if (!isVisible) return null;
  return (
    <div className={cn("fixed top-20 left-1/2 -translate-x-1/2 z-50", className)}>
      <FloatUp xp={xp} />
    </div>
  );
}
