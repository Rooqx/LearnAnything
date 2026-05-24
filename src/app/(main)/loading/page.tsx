"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LumiAnimated } from "@/components/ux";
import { ProgressBar } from "@/components/ui";
import { LOADING_MESSAGES, LOADING_MESSAGE_INTERVAL } from "@/lib/constants";

/** Loading screen shown during AI course generation */
export default function LoadingPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, LOADING_MESSAGE_INTERVAL);

    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 8, 92));
    }, 500);

    return () => { clearInterval(messageTimer); clearInterval(progressTimer); };
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <LumiAnimated state="thinking" size={120} />
      <h2 className="mt-8 font-heading text-xl font-semibold text-center">{LOADING_MESSAGES[messageIndex]}</h2>
      <ProgressBar value={progress} height="md" className="mt-6 w-full max-w-xs" animated />
      <p className="mt-4 text-xs text-[var(--color-muted)]">This usually takes 10-30 seconds</p>
    </div>
  );
}
