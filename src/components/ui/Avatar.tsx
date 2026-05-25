/* ============================================================
   Avatar Component
   User and Lumi avatar with fallback initials.
   Uses squircle-inspired rounded shape (not perfect circle)
   for a premium feel per taste-skill guidance.
   ============================================================ */

import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface AvatarProps {
  /** Image source URL */
  src?: string | null;
  /** Alt text for the image */
  alt: string;
  /** Display name for generating fallback initials */
  name?: string;
  /** Size variant — maps to specific pixel sizes */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS classes */
  className?: string;
}

/** Size mappings in pixels */
const SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 96,
} as const;

/**
 * Extract initials from a display name.
 * Takes the first character of the first two words.
 * Example: "Kai Nakamura" → "KN", "Priya" → "P"
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

/**
 * Avatar component.
 *
 * Shows a user photo when available, falls back to
 * generated initials on a gradient background.
 * Uses a slightly rounded square (squircle) shape
 * instead of a perfect circle for differentiation
 * from generic AI avatar patterns.
 */
export function Avatar({
  src,
  alt,
  name = '',
  size = 'md',
  className,
}: AvatarProps) {
  const pixelSize = SIZES[size];
  const initials = name ? getInitials(name) : '?';

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden',
        'rounded-[30%]',
        'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-reward)]',
        className
      )}
      style={{ width: pixelSize, height: pixelSize }}
      role="img"
      aria-label={alt}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={pixelSize}
          height={pixelSize}
          className="object-cover w-full h-full"
        />
      ) : (
        <div
          className={cn(
            'w-full h-full flex items-center justify-center',
            'font-[family-name:var(--font-heading)] font-semibold text-white',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-lg',
            size === 'xl' && 'text-2xl'
          )}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
