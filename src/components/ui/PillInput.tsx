"use client";

import { Mic, Search } from "lucide-react";
import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PillInputProps {
  /** Placeholder text inside the input */
  placeholder?: string;
  /** Label for the right-side CTA button */
  buttonLabel?: string;
  /** Background colour of the CTA button — defaults to CTA token #F97316 */
  buttonColor?: string;
  /** Text colour of the CTA button */
  buttonTextColor?: string;
  /** Called with the trimmed input value when the user submits */
  onSubmit?: (value: string) => void;
  /** Override the default search icon with any React node */
  icon?: React.ReactNode;
  /** Optional extra classes on the outer wrapper */
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * PillInput
 *
 * A reusable, heavily-rounded pill-shaped input composed of three zones:
 *  - Left icon (defaults to a magnifying glass)
 *  - Centre free-text input field
 *  - Right inline CTA button
 *
 * Submits on button click OR on Enter keypress.
 */
export default function PillInput({
  placeholder = "Enter text...",
  buttonLabel = "SEND",
  buttonColor = "#F97316",
  buttonTextColor = "#ffffff",
  onSubmit,
  icon,
  className = "",
}: PillInputProps) {
  const [value, setValue] = useState("");

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (onSubmit && trimmed) {
      onSubmit(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className={`flex items-center gap-3 rounded-full px-5 py-3 bg-white shadow-sm border border-[#E8EDE9] ${className}`}
    >
      {/* Left icon — falls back to a muted search/magnifying glass */}
      <button className="shrink-0 flex items-center p-3 rounded-full bg-slate-100 cursor-pointer">
        {icon ?? <Mic size={18} color="#9CA3AF" strokeWidth={1.8} />}
      </button>

      {/* Centre text input — grows to fill available space */}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[14px] text-[#121212] placeholder:text-[#121212] placeholder:opacity-40"
      />

      {/* Right CTA button */}
      <button
        onClick={handleSubmit}
        className="shrink-0 px-6 py-2 rounded-full text-sm font-bold cursor-pointer tracking-widest transition-opacity duration-200 hover:opacity-90 active:opacity-75"
        style={{ backgroundColor: "black", color: buttonTextColor }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
