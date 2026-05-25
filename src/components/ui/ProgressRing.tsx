/* ============================================================
   ProgressRing Component
   Circular progress indicator using react-circular-progressbar.
   Used in: DailyGoalRing on the dashboard.
   ============================================================ */

'use client';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { cn } from '@/lib/utils';

export interface ProgressRingProps {
  /** Progress value (0–100) */
  value: number;
  /** Text displayed inside the ring */
  text?: string;
  /** Size in pixels */
  size?: number;
  /** Stroke width of the progress arc */
  strokeWidth?: number;
  /** Color of the progress arc — defaults to --color-primary */
  color?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Circular progress ring component.
 *
 * Wraps react-circular-progressbar with the Molten design system colors.
 * Uses CSS custom properties for consistent theming.
 * The trail (background arc) uses the surface-elevated color
 * for subtle contrast against glass surfaces.
 */
export function ProgressRing({
  value,
  text,
  size = 120,
  strokeWidth = 10,
  color,
  className,
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      <CircularProgressbar
        value={clampedValue}
        text={text || `${Math.round(clampedValue)}%`}
        strokeWidth={strokeWidth}
        styles={buildStyles({
          /* Path color — the actual progress arc */
          pathColor: color || 'var(--color-primary)',
          /* Text styling inside the ring */
          textColor: 'var(--color-text)',
          textSize: '16px',
          /* Trail color — the background arc */
          trailColor: 'var(--color-surface-elevated)',
          /* Smooth transition on value change */
          pathTransitionDuration: 0.7,
          /* Round the path ends for a premium feel */
          strokeLinecap: 'round',
        })}
      />
    </div>
  );
}
