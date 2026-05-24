"use client";

import { Sprout, Zap, Timer } from "lucide-react";
import { Card } from "@/components/ui";
import { LEARNING_MODES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { LearningMode } from "@/types";

interface ModeSelectorProps {
  selectedMode: LearningMode | null;
  onSelect: (mode: LearningMode) => void;
  disabled?: boolean;
}

const iconMap: Record<string, React.ElementType> = { Sprout, Zap, Timer };

export function ModeSelector({ selectedMode, onSelect, disabled }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-3">
      {LEARNING_MODES.map((mode) => {
        const Icon = iconMap[mode.icon];
        const isSelected = selectedMode === mode.mode;
        return (
          <Card
            key={mode.mode}
            clickable={!disabled}
            onClick={() => !disabled && onSelect(mode.mode)}
            className={cn(
              "relative cursor-pointer transition-all duration-200",
              isSelected && "ring-2 ring-offset-2 ring-offset-[var(--color-bg)]",
              disabled && "opacity-60 cursor-not-allowed"
            )}
            style={{ borderColor: isSelected ? mode.color : undefined, boxShadow: isSelected ? `0 0 20px ${mode.color}30` : undefined }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg p-1.5" style={{ backgroundColor: `${mode.color}20` }}>
                <Icon size={20} style={{ color: mode.color }} />
              </div>
              <h4 className="font-heading font-semibold text-sm">{mode.name}</h4>
            </div>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">{mode.description}</p>
            <p className="mt-2 text-xs font-medium" style={{ color: mode.color }}>{mode.estimatedTime}</p>
          </Card>
        );
      })}
    </div>
  );
}
