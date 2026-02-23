"use client";

import { Mic } from "lucide-react";
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
  /** Override the default mic icon with any React node */
  icon?: React.ReactNode;
  /** Optional extra classes on the outer wrapper */
  className?: string;

  // ── Controlled mode (optional) ──────────────────────────────────────────────
  // When both value + onChange are provided, the PARENT owns the state.
  // When omitted, PillInput manages its own internal state (uncontrolled).
  // Either way the component behaves identically from the outside.

  /** Controlled value — if provided, the parent owns the input state */
  value?: string;
  /** onChange handler — called on every keystroke when in controlled mode */
  onChange?: (value: string) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * PillInput
 *
 * A reusable, heavily-rounded pill-shaped input with three zones:
 *  - Left  : icon (defaults to a mic)
 *  - Centre: text input field
 *  - Right : inline CTA button
 *
 * Supports two modes:
 *  - Uncontrolled (default): PillInput manages its own value state.
 *    Just pass onSubmit and you're done.
 *
 *  - Controlled: pass value + onChange and the parent owns the state.
 *    Useful when the parent needs to read or clear the value externally.
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
  value: controlledValue,
  onChange,
}: PillInputProps) {
  // ── Internal state — only used when in uncontrolled mode ────────────────────
  const [internalValue, setInternalValue] = useState("");

  // ── Determine active mode ───────────────────────────────────────────────────
  const isControlled = controlledValue !== undefined;

  // The value the <input> actually renders — either from props or internal state
  const inputValue = isControlled ? controlledValue : internalValue;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isControlled) {
      // Delegate to parent — parent is responsible for updating its state
      onChange?.(e.target.value);
    } else {
      setInternalValue(e.target.value);
    }
  };

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    onSubmit?.(trimmed);

    // Clear the input after a successful submit
    if (isControlled) {
      // Signal the parent to reset its value
      onChange?.("");
    } else {
      setInternalValue("");
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
      {/* Left icon — falls back to a mic */}
      <button
        type="button"
        className="shrink-0 flex items-center p-3 rounded-full bg-slate-100 cursor-pointer"
      >
        {icon ?? <Mic size={18} color="#9CA3AF" strokeWidth={1.8} />}
      </button>

      {/* Centre text input — grows to fill available space */}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[14px] text-[#121212] placeholder:text-[#121212] placeholder:opacity-40"
      />

      {/* Right CTA button */}
      <button
        type="button"
        onClick={handleSubmit}
        className="shrink-0 px-6 py-2 rounded-full text-sm font-bold cursor-pointer tracking-widest transition-opacity duration-200 hover:opacity-90 active:opacity-75"
        style={{ backgroundColor: buttonColor, color: buttonTextColor }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
