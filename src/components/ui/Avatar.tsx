"use client";

import { cn } from "@/lib/utils";

/* ============================================================
   Avatar Component
   
   User and Lumi avatar with image support and fallback initials.
   Circular by default with multiple size options.
   ============================================================ */

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string;
  alt?: string;
  /** Display name — first letter used as fallback */
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-24 w-24 text-2xl",
};

/**
 * Get initials from a display name (max 2 characters).
 * @example getInitials("John Doe") → "JD"
 * @example getInitials("Alice") → "A"
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({
  src,
  alt = "Avatar",
  name = "",
  size = "md",
  className,
}: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        "bg-[var(--color-primary)]/20",
        "flex items-center justify-center",
        "font-heading font-semibold text-[var(--color-primary)]",
        sizeStyles[size],
        className
      )}
      aria-label={alt}
    >
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials || "?"}</span>
      )}
    </div>
  );
}
