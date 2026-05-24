"use client";

import { CreditCard, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { icon: CreditCard, label: "Buy Credits", desc: "Choose a bundle that fits your needs" },
  { icon: Sparkles, label: "Generate Course", desc: "AI builds your personalized course" },
  { icon: BookOpen, label: "Learn", desc: "Dive into interactive content" },
];

/** 3-step visual explainer for how credits work */
export function HowCreditsWork({ className }: { className?: string }) {
  return (
    <div className={cn("mt-10", className)}>
      <h3 className="text-center font-heading text-lg font-semibold mb-6">How Credits Work</h3>
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-4 md:flex-col md:text-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/15">
              <step.icon size={24} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold">{step.label}</p>
              <p className="text-xs text-[var(--color-muted)]">{step.desc}</p>
            </div>
            {i < steps.length - 1 && <div className="hidden md:block text-[var(--color-muted)]">→</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
