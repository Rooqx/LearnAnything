/* ============================================================
   LumiPlaceholder Component — Mascot & Logo
   A high-end CSS-animated SVG cosmic orb placeholder for Lumi.
   Designed to be modular so it can be swapped with a real Lottie
   file in one line.

   Animation: bobbing, pulsing, glowing, and blinking eyes using
   GPU-accelerated CSS keyframes only (Zero JS frame cost).
   ============================================================ */

'use client';

import { cn } from '@/lib/utils';
import { useId } from 'react';

export interface LumiPlaceholderProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Expressive animation state mapped to globals.css keyframes */
  state?: 'idle' | 'thinking' | 'excited' | 'celebrating';
  /** Additional custom class names */
  className?: string;
  /** Unique ID for automated testing and query selection */
  id?: string;
  variant?: string; // Adding variant to avoid type errors from HeroSection usages
}

/**
 * Lumi Mascot Placeholder.
 * Built using layered SVGs with radial gradient meshes and SVG glows.
 *
 * Sizing mapping (maintained touch target rules):
 * - sm: 32px (used in navbar brand logo)
 * - md: 64px (standard visual contexts)
 * - lg: 120px (used in Hero sections)
 * - xl: 180px (used in CTA full-screen sections)
 */
export function LumiPlaceholder({
  size = 'md',
  state = 'idle',
  className,
  id = 'lumi-mascot-placeholder',
  variant, // backwards compatibility
}: LumiPlaceholderProps) {
  const uniqueId = useId().replace(/:/g, '');
  const actualState = variant && !['sm','md','lg','xl'].includes(variant) ? variant as any : state;

  // Map size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 md:w-32 md:h-32',
    xl: 'w-32 h-32 md:w-44 md:h-44',
  };

  // If size is a number (backwards compatibility), use inline style instead of class
  const isNumberSize = typeof size === 'number';
  const sizeClass = isNumberSize ? '' : sizeClasses[size as keyof typeof sizeClasses];
  const sizeStyle = isNumberSize ? { width: size, height: size } : undefined;

  // Map expressive state classes from globals.css
  const stateClasses = {
    idle: 'animate-lumi-bob',
    thinking: 'animate-lumi-think',
    excited: 'animate-lumi-bounce',
    celebrating: 'animate-lumi-celebrate',
  };

  const coreGradId = `lumiCoreGrad-${uniqueId}`;
  const ringGradId = `lumiRingGrad-${uniqueId}`;

  return (
    <div
      id={id}
      className={cn(
        'relative inline-flex items-center justify-center select-none pointer-events-none',
        sizeClass,
        stateClasses[actualState as keyof typeof stateClasses] || stateClasses.idle,
        className
      )}
      style={sizeStyle}
      role="img"
      aria-label={`Lore Mascot Lumi in ${actualState} mode`}
    >
      {/* Outer Radial Glow Bezel Layer */}
      <div
        className={cn(
          'absolute inset-0 rounded-full blur-xl opacity-60 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-reward)]',
          'transition-all duration-700 ease-out-strong'
        )}
      />

      {/* SVG Mascot Core */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_24px_rgba(255,48,8,0.5)]"
      >
        <defs>
          {/* Main Cosmic Sphere Gradient */}
          <radialGradient
            id={coreGradId}
            cx="40%"
            cy="40%"
            r="60%"
            fx="30%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#FFF8F5" />
            <stop offset="35%" stopColor="#FF8C00" />
            <stop offset="70%" stopColor="#FF3008" />
            <stop offset="100%" stopColor="#CC2000" />
          </radialGradient>

          {/* Holographic Inner Ring Glow */}
          <radialGradient
            id={ringGradId}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="70%" stopColor="#FFE500" stopOpacity="0" />
            <stop offset="95%" stopColor="#FFE500" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF3008" stopOpacity="0.8" />
          </radialGradient>

          {/* SVG Glow Filter for vector lines */}
          <filter id="vectorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Aura Ring */}
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke={`url(#${ringGradId})`}
          strokeWidth="3"
          strokeDasharray="6 4 2 4"
          className={cn(
            'origin-center animate-[spin_20s_linear_infinite]',
            actualState === 'thinking' && 'animate-[spin_6s_linear_infinite]',
            actualState === 'celebrating' && 'animate-[spin_4s_linear_infinite]'
          )}
        />

        {/* Dynamic Sphere Core */}
        <circle
          cx="60"
          cy="60"
          r="46"
          fill={`url(#${coreGradId})`}
          className="transition-transform duration-500 ease-out-strong"
        />

        {/* Soft Bezel Reflection Highlight */}
        <ellipse
          cx="48"
            cy="32"
          rx="18"
          ry="10"
          fill="#FFF8F5"
          fillOpacity="0.55"
          transform="rotate(-15 48 32)"
        />

        {/* Expressive Face Group */}
        <g className="origin-center transition-all duration-300">
          {/* Eyes with built-in SVG blinking animation keyframes */}
          <g>
            {/* Left Eye */}
            <ellipse
              cx="44"
              cy="62"
              rx="6"
              ry="9"
              fill="#080400"
              className="animate-[lumiBlink_4s_ease-in-out_infinite]"
            />
            {/* Left Eye Sparkle */}
            <circle
              cx="42"
              cy="58"
              r="2.5"
              fill="#FFF8F5"
              className="animate-[lumiBlink_4s_ease-in-out_infinite]"
            />

            {/* Right Eye */}
            <ellipse
              cx="76"
              cy="62"
              rx="6"
              ry="9"
              fill="#080400"
              className="animate-[lumiBlink_4s_ease-in-out_infinite]"
            />
            {/* Right Eye Sparkle */}
            <circle
              cx="74"
              cy="58"
              r="2.5"
              fill="#FFF8F5"
              className="animate-[lumiBlink_4s_ease-in-out_infinite]"
            />
          </g>

          {/* Cute Rosy Cheeks */}
          <ellipse
            cx="34"
            cy="70"
            rx="5.5"
            ry="3.5"
            fill="#FFE500"
            fillOpacity="0.6"
          />
          <ellipse
            cx="86"
            cy="70"
            rx="5.5"
            ry="3.5"
            fill="#FFE500"
            fillOpacity="0.6"
          />

          {/* Expressive Mouth Path */}
          {(actualState === 'idle' || actualState === 'default') && (
            /* Gentle Smile */
            <path
              d="M54 71C54 74.3137 56.6863 77 60 77C63.3137 77 66 74.3137 66 71"
              stroke="#080400"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {actualState === 'thinking' && (
            /* Wry/Curious line */
            <path
              d="M53 73C56.5 70.5 59.5 75.5 67 73"
              stroke="#080400"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {(actualState === 'excited' || actualState === 'celebrating') && (
            /* Big excited open mouth */
            <path
              d="M52 70Q60 84 68 70Z"
              fill="#080400"
              stroke="#080400"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          )}
        </g>
      </svg>

      {/* Dynamic blink keyframes defined locally to isolate CPU load */}
      <style jsx global>{`
        @keyframes lumiBlink {
          0%, 90%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.1);
          }
        }
      `}</style>
    </div>
  );
}
