"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   Card Component
   
   Glass card base — the fundamental surface component.
   Uses backdrop-filter blur for glassmorphism effect.
   Supports hover lift, click interaction, and padding variants.
   ============================================================ */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the card has a hover lift effect */
  hoverable?: boolean;
  /** Whether the card is clickable (adds cursor-pointer) */
  clickable?: boolean;
  /** Padding preset */
  padding?: "none" | "sm" | "md" | "lg";
  /** Whether to use elevated glass surface */
  elevated?: boolean;
}

const paddingStyles: Record<string, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      hoverable = false,
      clickable = false,
      padding = "md",
      elevated = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          /* Glass surface */
          elevated ? "glass-elevated" : "glass",
          "rounded-[var(--radius-lg)]",
          "transition-all duration-200 ease-out",
          /* Padding */
          paddingStyles[padding],
          /* Hover lift effect */
          hoverable && "hover:-translate-y-0.5 hover:shadow-md",
          /* Clickable */
          clickable && "cursor-pointer active:scale-[0.98]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
