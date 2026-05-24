"use client";

import { Chip } from "@/components/ui";
import { SUGGESTION_CHIPS } from "@/lib/constants";

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
  className?: string;
}

export function SuggestionChips({ onSelect, className }: SuggestionChipsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className || ""}`}>
      {SUGGESTION_CHIPS.map((chip) => (
        <Chip key={chip} label={chip} onClick={() => onSelect(chip)} variant="outline" />
      ))}
    </div>
  );
}
