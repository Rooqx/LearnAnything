"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const positionStyles = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({ content, children, position = "top", className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setIsVisible(true); };
  const hide = () => { timeoutRef.current = setTimeout(() => setIsVisible(false), 100); };

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {isVisible && (
        <div className={cn("absolute z-50 whitespace-nowrap rounded-lg bg-[var(--color-surface-elevated)] px-3 py-1.5 text-xs text-[var(--color-text)] shadow-md", positionStyles[position], className)} role="tooltip">
          {content}
        </div>
      )}
    </div>
  );
}
