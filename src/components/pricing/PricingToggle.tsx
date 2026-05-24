"use client";

import { cn } from "@/lib/utils";

interface PricingToggleProps {
  activeTab: "credits" | "subscription";
  onToggle: (tab: "credits" | "subscription") => void;
  className?: string;
}

/** Pill toggle between Credits and Subscription views */
export function PricingToggle({ activeTab, onToggle, className }: PricingToggleProps) {
  return (
    <div className={cn("inline-flex rounded-full glass p-1", className)}>
      {(["credits", "subscription"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onToggle(tab)}
          className={cn(
            "rounded-full px-6 py-2 text-sm font-medium cursor-pointer transition-all duration-200",
            activeTab === tab
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
          )}
        >
          {tab === "credits" ? "Credits" : "Subscription"}
        </button>
      ))}
    </div>
  );
}
