"use client";

import { useAnimationMode } from "@/hooks/useAnimationMode";
import { cn } from "@/lib/utils";

type FadeDirection = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: React.ReactNode;
  direction?: FadeDirection;
  delay?: number;
  duration?: number;
  className?: string;
}

const directionKeyframes: Record<FadeDirection, string> = {
  up: "from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }",
  down: "from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); }",
  left: "from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); }",
  right: "from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); }",
  none: "from { opacity: 0; } to { opacity: 1; }",
};

export function FadeIn({ children, direction = "up", delay = 0, duration = 300, className }: FadeInProps) {
  const mode = useAnimationMode();
  const animName = `fadeIn-${direction}`;

  if (mode === "lite") {
    return <div className={cn("transition-opacity duration-200", className)} style={{ opacity: 1 }}>{children}</div>;
  }

  return (
    <div className={cn(className)} style={{ animation: `${animName} ${duration}ms ease-out ${delay}ms both` }}>
      {children}
      <style jsx>{`@keyframes ${animName} { ${directionKeyframes[direction]} }`}</style>
    </div>
  );
}
