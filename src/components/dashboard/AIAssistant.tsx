"use client";

import { Send, MoreHorizontal } from "lucide-react";
import Image from "next/image";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const ACCENT = "#2ED573";

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * AIAssistant
 *
 * Dashboard card with a glossy gradient background image.
 * Contains a "Mode" toggle pill, "AI assistant" heading, and a
 * pill-shaped input field with a green send button.
 */
export default function AIAssistant() {
  return (
    <div
      className="relative rounded-3xl overflow-hidden flex flex-col justify-end h-full min-h-[260px]"
      style={{ boxShadow: "2px 4px 16px rgba(0,0,0,0.08)" }}
    >
      {/* ── Background image ───────────────────────────────────────── */}
      <Image
        src="/ai-assistant-bg.png"
        alt="AI tutor background"
        fill
        className="object-cover"
        priority
      />

      {/* ── Dark overlay for readability ─────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)",
        }}
      />

      {/* ── Top-right actions ──────────────────────────────────────── */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          className="text-[11px] font-medium px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-opacity-90"
          style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            color: TEXT_PRIMARY,
          }}
        >
          Mode
        </button>
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-opacity-90"
          style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
        >
          <MoreHorizontal size={14} color={TEXT_PRIMARY} strokeWidth={2} />
        </button>
      </div>

      {/* ── Bottom content ─────────────────────────────────────────── */}
      <div className="relative z-10 p-5 flex flex-col gap-3">
        <h3 className="text-[18px] font-bold" style={{ color: TEXT_PRIMARY }}>
          AI tutor
        </h3>

        {/* Input field */}
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2.5"
          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
        >
          <input
            type="text"
            placeholder="course to generate..."
            className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-gray-400"
            style={{ color: TEXT_PRIMARY }}
          />
          <button
            title="Send"
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 hover:opacity-80"
            style={{ backgroundColor: "black" }}
          >
            <Send size={14} color="#FFFFFF" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
