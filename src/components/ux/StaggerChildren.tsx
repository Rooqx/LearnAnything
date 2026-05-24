"use client";

import { Children } from "react";
import { useAnimationMode } from "@/hooks/useAnimationMode";
import { cn } from "@/lib/utils";

/** Staggered list item entrance animation. Wraps a list of children with delayed fade-in. */
export function StaggerChildren({ children, staggerMs = 80, className }: { children: React.ReactNode; staggerMs?: number; className?: string }) {
  const mode = useAnimationMode();
  const items = Children.toArray(children);

  return (
    <div className={cn(className)}>
      {items.map((child, i) => (
        <div
          key={i}
          style={mode === "full" ? { animation: `staggerIn 300ms ease-out ${i * staggerMs}ms both` } : undefined}
        >
          {child}
        </div>
      ))}
      {mode === "full" && (
        <style jsx>{`
          @keyframes staggerIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      )}
    </div>
  );
}
