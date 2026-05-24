"use client";

import { useState, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({ onSend, placeholder = "e.g. How does machine learning work?", disabled, className }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className={cn("flex items-center gap-2 rounded-full glass px-4 py-2", className)}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none"
        autoFocus
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || disabled}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full cursor-pointer",
          "transition-all duration-200",
          value.trim() ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-muted)]/20 text-[var(--color-muted)]"
        )}
        aria-label="Send message"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
