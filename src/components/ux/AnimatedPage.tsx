"use client";

import { useAnimationMode } from "@/hooks/useAnimationMode";
import { cn } from "@/lib/utils";

/** Wraps every page with entry/exit transitions. FULL: motion fade+slide, LITE: CSS transition. */
export function AnimatedPage({ children, className }: { children: React.ReactNode; className?: string }) {
  const mode = useAnimationMode();

  if (mode === "lite") {
    return <div className={cn("animate-fade-in", className)}>{children}</div>;
  }

  /* FULL mode: use CSS animation since we avoid top-level framer-motion import */
  return (
    <div className={cn(className)} style={{ animation: "pageIn 300ms ease-out" }}>
      {children}
      <style jsx>{`
        @keyframes pageIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
