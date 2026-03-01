"use client";

import { BookOpen, MoreHorizontal, X, Check, Plus } from "lucide-react";
import { forwardRef } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const ACCENT = "#2ED573";
const MUTED = "#6B7280";
const CARD_BG = "#82f195ff";
const PILL_BG = "#F0F1F0";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Module {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  chapterLength: string;
}

interface ModuleCardProps {
  cardBg: string;
  module: Module;
  isActive: boolean;
  onClick: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * ModuleCard
 *
 * Displays a single module in the Teaching Plan column.
 * Features a book icon, title/subtitle, description,
 * a "CHAPTER LONK" pill button, action buttons,
 * and a green `+` connection node (top-right) used as
 * the SVG line origin for connecting to chapter cards.
 *
 * Accepts a forwarded ref that attaches to the `+` node
 * so the parent can read its position for SVG line drawing.
 */
const ModuleCard = forwardRef<HTMLDivElement, ModuleCardProps>(
  function ModuleCard({ cardBg = CARD_BG, module, isActive, onClick }, ref) {
    return (
      <div
        className="relative rounded-2xl p-2 cursor-pointer transition-all duration-300 w-4/5 "
        style={{
          zIndex:100,
          backgroundColor: cardBg,
          boxShadow: isActive
            ? `0 0 0 2px ${ACCENT}, 2px 4px 12px rgba(0,0,0,0.1)`
            : "2px 3px 10px rgba(0,0,0,0.2)",
            scrollbarWidth:"none",
            
        }}
        onClick={onClick}
      >
         {/* Inner container with subtle gradient overlay */}
      <div className="p-8 w-full h-full flex flex-col gap-2.5 bg-[rgba(255,255,255,0.3)] rounded-2xl">
     
        {/* ── Header: Book icon + Module title/subtitle ───────────────── */}
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ backgroundColor: "#F0F1F0" }}
          >
            <BookOpen size={15} color={TEXT_PRIMARY} strokeWidth={1.8} />
          </div>
          <div className="flex flex-col">
            <span
              className="text-[15px] font-bold leading-tight"
              style={{ color: TEXT_PRIMARY }}
            >
              {module.title}
            </span>
            <span
              className="text-[11px] font-semibold tracking-wider uppercase mt-0.5"
              style={{ color: MUTED }}
            >
              {module.subtitle}
            </span>
          </div>
        </div>

        {/* ── Description ─────────────────────────────────────────────── */}
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: MUTED }}
        >
          {module.description}
        </p>

        {/* ── Footer: Chapter pill + action buttons ───────────────────── */}
        <div className="flex items-center justify-between mt-1">
          <span
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: PILL_BG, color: TEXT_PRIMARY }}
          >
            {module.chapterLength} Chapters
          </span>

          <div className="flex items-center gap-1.5">
            <button
              title="More options"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <MoreHorizontal size={13} color={TEXT_PRIMARY} strokeWidth={2} />
            </button>

            <button
              title="Dismiss"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X size={13} color={MUTED} strokeWidth={2.5} />
            </button>

            <button
              title="Confirm"
              className="w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-200"
              style={{ backgroundColor: TEXT_PRIMARY }}
            >
              <Check size={13} color="#F9FBFA" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ── Green "+" Connection Node (top-right) ───────────────────── */}
        <div
          ref={ref}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor: "#D1F7E0" }}
        >
          <Plus size={13} color={ACCENT} strokeWidth={2.5} />
        </div>
        </div>
      </div>
    );
  }
);

export default ModuleCard;
