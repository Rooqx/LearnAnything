"use client";

import { LumiAnimated } from "@/components/ux";
import { cn } from "@/lib/utils";

/** Floating AI help button on learning interface — opens mini chat drawer */
export function AIHelpButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-20 right-4 z-20 md:bottom-8 md:right-8",
        "flex h-14 w-14 items-center justify-center rounded-full",
        "glass-elevated cursor-pointer glow-primary",
        "transition-all duration-200 hover:scale-105",
        className
      )}
      aria-label="Ask Lumi for help"
    >
      <LumiAnimated state="idle" size={44} />
    </button>
  );
}
