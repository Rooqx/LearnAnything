/* ============================================================
   LumiPlaceholder — CSS-Animated SVG Glowing Orb
   Standalone placeholder for Lumi mascot on the landing page.

   When the real Lottie animation is ready, swap only the
   internals of this component — the interface stays identical.

   Features:
   - Pure CSS keyframes for pulse glow + gentle float
   - Two variants: 'default' (calm) and 'excited' (energetic)
   - Uses --color-primary (#FF3008) as the glow color
   - GPU-accelerated — only animates transform and opacity
   - No JS animation libraries — works in FULL and LITE modes
   ============================================================ */

import { cn } from '@/lib/utils';

export interface LumiPlaceholderProps {
  /** Pixel size of the Lumi orb (width and height) */
  size?: number;
  /** Visual variant — default is calm idle, excited is energetic */
  variant?: 'default' | 'excited';
  /** Additional CSS classes */
  className?: string;
}

/**
 * CSS-animated SVG orb placeholder for Lumi.
 *
 * Structure:
 * - Outer glow ring (blurred circle in --color-primary)
 * - Main orb body (radial gradient: reward → primary → primary-dark)
 * - Light reflection highlight (ellipse)
 * - Expressive face (eyes + mouth SVG paths)
 *
 * Animations (CSS keyframes — defined inline via <style>):
 * - lumi-float: translateY bob, 3s infinite (default) / 2s (excited)
 * - lumi-pulse: scale + glow intensity pulse, 2s infinite
 *
 * Lottie swap plan:
 * Replace the <svg> element inside the wrapper div with:
 *   <DotLottieReact src="/lumi.lottie" autoplay loop />
 * The wrapper div maintains size, animation class, and aria-label.
 */
export function LumiPlaceholder({
  size = 80,
  variant = 'default',
  className,
}: LumiPlaceholderProps) {
  const isExcited = variant === 'excited';

  /* Unique ID suffix prevents SVG filter/gradient ID collisions
     when multiple LumiPlaceholder instances exist on the same page */
  const uid = `lp-${size}-${variant}`;

  return (
    <div
      className={cn(
        /* Float animation — GPU-accelerated via transform only */
        isExcited ? 'animate-lumi-float-excited' : 'animate-lumi-float',
        className
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Lumi — Lore's AI mascot"
    >
      {/* Inline keyframes scoped to this component.
          These are lightweight CSS-only animations that run
          on both FULL and LITE animation modes. */}
      <style>{`
        @keyframes lumi-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes lumi-float-excited {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-10px) scale(1.03); }
          50% { transform: translateY(0) scale(1); }
          75% { transform: translateY(-6px) scale(1.02); }
        }
        @keyframes lumi-glow-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        .animate-lumi-float {
          animation: lumi-float 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-lumi-float-excited {
          animation: lumi-float-excited 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .lumi-glow-ring {
          animation: lumi-glow-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial gradient for the orb body — warm orange core
              fading to deep red at the edges */}
          <radialGradient id={`${uid}-grad`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="var(--color-reward)" />
            <stop offset="50%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-primary-dark)" />
          </radialGradient>

          {/* Soft glow filter — Gaussian blur creates the outer glow ring */}
          <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={size * 0.08} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow ring — pulsing opacity animation */}
        <circle
          className="lumi-glow-ring"
          cx={size / 2}
          cy={size / 2}
          r={size * 0.42}
          fill="var(--color-primary)"
          opacity={0.15}
          filter={`url(#${uid}-glow)`}
        />

        {/* Main orb body */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.32}
          fill={`url(#${uid}-grad)`}
        />

        {/* Light reflection / specular highlight */}
        <ellipse
          cx={size * 0.42}
          cy={size * 0.35}
          rx={size * 0.12}
          ry={size * 0.08}
          fill="white"
          opacity={0.25}
        />

        {/* Face — eyes */}
        {isExcited ? (
          /* Excited: wide eyes */
          <>
            <circle
              cx={size * 0.36}
              cy={size * 0.38}
              r={size * 0.07}
              fill="white"
            />
            <circle
              cx={size * 0.64}
              cy={size * 0.38}
              r={size * 0.07}
              fill="white"
            />
          </>
        ) : (
          /* Default: calm round eyes */
          <>
            <circle
              cx={size * 0.36}
              cy={size * 0.38}
              r={size * 0.055}
              fill="white"
            />
            <circle
              cx={size * 0.64}
              cy={size * 0.38}
              r={size * 0.055}
              fill="white"
            />
          </>
        )}

        {/* Face — mouth */}
        {isExcited ? (
          /* Excited: wide smile */
          <path
            d={`M ${size * 0.4} ${size * 0.52} Q ${size * 0.5} ${size * 0.6} ${size * 0.6} ${size * 0.52}`}
            fill="none"
            stroke="white"
            strokeWidth={size * 0.02}
            strokeLinecap="round"
          />
        ) : (
          /* Default: gentle smile */
          <path
            d={`M ${size * 0.43} ${size * 0.52} Q ${size * 0.5} ${size * 0.57} ${size * 0.57} ${size * 0.52}`}
            fill="none"
            stroke="white"
            strokeWidth={size * 0.015}
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}
