"use client";

import { LumiAnimated } from "@/components/ux";

export function WelcomePrompt() {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <LumiAnimated state="excited" size={80} />
      <h1 className="font-heading text-3xl font-bold md:text-4xl">What will you master today?</h1>
      <p className="max-w-md text-[var(--color-muted)]">Describe anything — I&apos;ll build you a full course in seconds.</p>
    </div>
  );
}
