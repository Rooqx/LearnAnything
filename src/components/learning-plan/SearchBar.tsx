"use client";

import { Search } from "lucide-react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const INPUT_BG = "#F0F1F0";
const TEXT_MUTED = "#9CA3AF";
const TEXT_PRIMARY = "#121212";

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * SearchBar
 *
 * Pill-shaped search input with a magnifying glass icon.
 * Used in the middle column of the Learning Plan page
 * to filter chapters.
 */
export default function SearchBar() {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-full w-full"
      style={{ backgroundColor: INPUT_BG }}
    >
      <Search size={15} color={TEXT_MUTED} strokeWidth={2} />
      <input
        type="text"
        placeholder="SEARCH"
        className="bg-transparent outline-none text-[13px] font-medium w-full placeholder:tracking-wider"
        style={{ color: TEXT_PRIMARY }}
      />
    </div>
  );
}
