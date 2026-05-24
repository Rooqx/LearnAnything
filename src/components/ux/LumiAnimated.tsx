"use client";

import { cn } from "@/lib/utils";
import type { LumiEmotion } from "@/types";

/**
 * LumiAnimated — The Lumi mascot as a CSS/SVG animated cosmic orb.
 * 4 emotion states with distinct animations.
 * Falls back gracefully. Can be swapped to Lottie later.
 */

interface LumiAnimatedProps {
  state?: LumiEmotion;
  size?: number;
  className?: string;
}

const stateAnimations: Record<LumiEmotion, string> = {
  idle: "animate-lumi-bob",
  thinking: "animate-lumi-think",
  excited: "animate-lumi-bounce",
  celebrating: "animate-lumi-celebrate",
};

export function LumiAnimated({ state = "idle", size = 64, className }: LumiAnimatedProps) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", stateAnimations[state], className)}
      style={{ width: size, height: size }}
      aria-label={`Lumi mascot - ${state}`}
      role="img"
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow-lg">
        <defs>
          {/* Radial gradient for the glowing orb effect */}
          <radialGradient id={`lumi-grad-${state}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#C8F135" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#6C3CE1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4F1FCC" stopOpacity="0.6" />
          </radialGradient>
          {/* Outer glow filter */}
          <filter id={`lumi-glow-${state}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Main orb body */}
        <circle cx="50" cy="50" r="35" fill={`url(#lumi-grad-${state})`} filter={`url(#lumi-glow-${state})`} />
        {/* Inner highlight for depth */}
        <circle cx="42" cy="40" r="12" fill="rgba(255,255,255,0.25)" />
        {/* Eyes */}
        <circle cx="40" cy="48" r={state === "excited" || state === "celebrating" ? 4.5 : 3.5} fill="#0E0B1A" />
        <circle cx="60" cy="48" r={state === "excited" || state === "celebrating" ? 4.5 : 3.5} fill="#0E0B1A" />
        {/* Eye highlights */}
        <circle cx="41.5" cy="46.5" r="1.5" fill="white" />
        <circle cx="61.5" cy="46.5" r="1.5" fill="white" />
        {/* Mouth — changes with emotion */}
        {state === "idle" && <path d="M44 58 Q50 62 56 58" stroke="#0E0B1A" strokeWidth="2" fill="none" strokeLinecap="round" />}
        {state === "thinking" && <circle cx="50" cy="60" r="3" fill="#0E0B1A" />}
        {state === "excited" && <path d="M42 56 Q50 66 58 56" stroke="#0E0B1A" strokeWidth="2" fill="#0E0B1A" strokeLinecap="round" />}
        {state === "celebrating" && (
          <>
            <path d="M40 55 Q50 68 60 55" stroke="#0E0B1A" strokeWidth="2" fill="#0E0B1A" strokeLinecap="round" />
            {/* Star eyes for celebrating */}
            <path d="M40 48 l-2-3 l3.5 1 l1-3.5 l1 3.5 l3.5-1 l-2 3 l2 3 l-3.5-1 l-1 3.5 l-1-3.5 l-3.5 1z" fill="#F7C948" />
            <path d="M60 48 l-2-3 l3.5 1 l1-3.5 l1 3.5 l3.5-1 l-2 3 l2 3 l-3.5-1 l-1 3.5 l-1-3.5 l-3.5 1z" fill="#F7C948" />
          </>
        )}
        {/* Sparkle particles for celebrating state */}
        {state === "celebrating" && (
          <>
            <circle cx="20" cy="25" r="2" fill="#F7C948" opacity="0.8" />
            <circle cx="80" cy="30" r="2.5" fill="#C8F135" opacity="0.7" />
            <circle cx="25" cy="75" r="1.5" fill="#6C3CE1" opacity="0.6" />
            <circle cx="78" cy="70" r="2" fill="#F7C948" opacity="0.8" />
          </>
        )}
      </svg>
    </div>
  );
}
