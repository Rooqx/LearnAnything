/* ============================================================
   LumiAnimated — SVG Mascot Component
   A small glowing cosmic orb with an expressive face.
   4 emotion states rendered as SVG with CSS animations.

   States: idle, thinking, excited, celebrating
   Props: size (px), state (LumiState)
   Respects useAnimationMode — LITE mode uses static SVG only.
   ============================================================ */

'use client';

import { useAnimationMode } from '@/hooks/useAnimationMode';
import { cn } from '@/lib/utils';
import type { LumiState } from '@/types';

export interface LumiAnimatedProps {
  /** Pixel size of the Lumi orb */
  size?: number;
  /** Current emotion state */
  state?: LumiState;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Lumi mascot — SVG cosmic orb with 4 emotion states.
 *
 * Built as inline SVG with CSS animations instead of Lottie
 * for instant availability. Can be swapped to Lottie later.
 *
 * LITE mode: renders static SVG without animations.
 * FULL mode: CSS animations per state (bob, spin, bounce, celebrate).
 *
 * The orb has a gradient fill from primary to reward,
 * with a face (eyes and mouth) that changes per state.
 * Soft glow effect via SVG filter.
 */
export function LumiAnimated({
  size = 80,
  state = 'idle',
  className,
}: LumiAnimatedProps) {
  const { isLite } = useAnimationMode();

  /** Determine animation class based on state and mode */
  const animationClass = isLite
    ? ''
    : state === 'idle'
      ? 'animate-lumi-bob'
      : state === 'thinking'
        ? 'animate-lumi-think'
        : state === 'excited'
          ? 'animate-lumi-bounce'
          : 'animate-lumi-celebrate';

  /** Eye shape changes per state */
  const getEyes = () => {
    const eyeY = size * 0.38;
    const leftEyeX = size * 0.36;
    const rightEyeX = size * 0.64;
    const eyeSize = size * 0.06;

    switch (state) {
      case 'thinking':
        /* Eyes looking upward */
        return (
          <>
            <circle cx={leftEyeX} cy={eyeY - eyeSize} r={eyeSize} fill="white" />
            <circle cx={rightEyeX} cy={eyeY - eyeSize} r={eyeSize} fill="white" />
          </>
        );
      case 'excited':
        /* Wide eyes */
        return (
          <>
            <circle cx={leftEyeX} cy={eyeY} r={eyeSize * 1.4} fill="white" />
            <circle cx={rightEyeX} cy={eyeY} r={eyeSize * 1.4} fill="white" />
          </>
        );
      case 'celebrating':
        /* Star eyes — rendered as small star shapes */
        return (
          <>
            <text
              x={leftEyeX}
              y={eyeY + eyeSize}
              textAnchor="middle"
              fill="white"
              fontSize={eyeSize * 4}
              fontFamily="sans-serif"
            >
              ★
            </text>
            <text
              x={rightEyeX}
              y={eyeY + eyeSize}
              textAnchor="middle"
              fill="white"
              fontSize={eyeSize * 4}
              fontFamily="sans-serif"
            >
              ★
            </text>
          </>
        );
      default:
        /* Idle — normal round eyes */
        return (
          <>
            <circle cx={leftEyeX} cy={eyeY} r={eyeSize} fill="white" />
            <circle cx={rightEyeX} cy={eyeY} r={eyeSize} fill="white" />
          </>
        );
    }
  };

  /** Mouth shape changes per state */
  const getMouth = () => {
    const mouthY = size * 0.52;
    const centerX = size * 0.5;

    switch (state) {
      case 'thinking':
        /* Small O shape */
        return (
          <circle
            cx={centerX}
            cy={mouthY}
            r={size * 0.04}
            fill="none"
            stroke="white"
            strokeWidth={size * 0.015}
          />
        );
      case 'excited':
      case 'celebrating':
        /* Wide smile arc */
        return (
          <path
            d={`M ${centerX - size * 0.1} ${mouthY} Q ${centerX} ${mouthY + size * 0.08} ${centerX + size * 0.1} ${mouthY}`}
            fill="none"
            stroke="white"
            strokeWidth={size * 0.02}
            strokeLinecap="round"
          />
        );
      default:
        /* Gentle smile */
        return (
          <path
            d={`M ${centerX - size * 0.07} ${mouthY} Q ${centerX} ${mouthY + size * 0.05} ${centerX + size * 0.07} ${mouthY}`}
            fill="none"
            stroke="white"
            strokeWidth={size * 0.015}
            strokeLinecap="round"
          />
        );
    }
  };

  return (
    <div
      className={cn(animationClass, className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Lumi mascot — ${state} state`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial gradient for the orb body */}
          <radialGradient id={`lumi-grad-${size}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="var(--color-reward)" />
            <stop offset="50%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-primary-dark)" />
          </radialGradient>

          {/* Soft glow filter */}
          <filter id={`lumi-glow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={size * 0.06} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.38}
          fill="var(--color-primary)"
          opacity={0.15}
          filter={`url(#lumi-glow-${size})`}
        />

        {/* Main orb body */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.32}
          fill={`url(#lumi-grad-${size})`}
        />

        {/* Highlight / light reflection */}
        <ellipse
          cx={size * 0.42}
          cy={size * 0.35}
          rx={size * 0.12}
          ry={size * 0.08}
          fill="white"
          opacity={0.25}
        />

        {/* Face — eyes and mouth */}
        <g>
          {getEyes()}
          {getMouth()}
        </g>

        {/* Celebrating sparkles — only in celebrating state */}
        {state === 'celebrating' && (
          <g opacity={0.8}>
            <circle cx={size * 0.15} cy={size * 0.2} r={size * 0.02} fill="var(--color-accent)" />
            <circle cx={size * 0.85} cy={size * 0.25} r={size * 0.015} fill="var(--color-accent)" />
            <circle cx={size * 0.2} cy={size * 0.75} r={size * 0.018} fill="var(--color-reward)" />
            <circle cx={size * 0.82} cy={size * 0.7} r={size * 0.022} fill="var(--color-primary)" />
            <circle cx={size * 0.5} cy={size * 0.12} r={size * 0.015} fill="var(--color-success)" />
          </g>
        )}
      </svg>
    </div>
  );
}
