"use client";

import { Bell, Plus, Minus, Menu, LayoutGrid, UserCircle2 } from "lucide-react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const ACCENT = "#2ED573";

// ─── FloatingNavRail ───────────────────────────────────────────────────────────

/**
 * FloatingNavRail
 *
 * Vertical floating navigation rail anchored to the left edge of the
 * dashboard content area. Contains three visual groups stacked vertically:
 *  - Top pill:    active/profile icon, hamburger menu, grid view toggle
 *  - Middle:      bell notification icon with a green badge counter
 *  - Bottom pill: zoom-in (+) and zoom-out (-) controls with a divider
 */
export function FloatingNavRail() {
  return (
    <div className="flex flex-col justify-between items-center gap-4 h-4/5">
      {/* Top pill — primary nav icons */}
      <div
        className="flex flex-col items-center gap-3 px-2 py-3 rounded-2xl"
        style={{ backgroundColor: TEXT_PRIMARY }}
      >
        {/* Active state — filled light circle */}
        <button
          title="Profile"
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#F9FBFA" }}
        >
          <UserCircle2 size={16} color={TEXT_PRIMARY} strokeWidth={1.8} />
        </button>

        {/* Hamburger menu */}
        <button
          title="Menu"
          className="w-8 h-8 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
        >
          <Menu size={16} color="#F9FBFA" strokeWidth={1.8} />
        </button>

        {/* Grid / apps view */}
        <button
          title="Grid View"
          className="w-8 h-8 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
        >
          <LayoutGrid size={16} color="#F9FBFA" strokeWidth={1.8} />
        </button>
      </div>

      {/* Bottom pill — bell + zoom controls */}
      <div
        className="flex flex-col items-center px-2 py-2 rounded-2xl gap-1"
        style={{ backgroundColor: TEXT_PRIMARY }}
      >
        {/* Bell with green notification badge */}
        <div className="relative">
          <button
            title="Notifications"
            className="w-8 h-8 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-200"
          >
            <Bell size={20} color="#F9FBFA" strokeWidth={1.8} />
          </button>

          {/* Notification count badge */}
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{ backgroundColor: ACCENT, color: TEXT_PRIMARY }}
          >
            25
          </span>
        </div>

        {/* Zoom in */}
        <button
          title="Zoom In"
          className="w-8 h-8 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-200"
        >
          <Plus size={16} color="#F9FBFA" strokeWidth={2} />
        </button>

        {/* Subtle divider between + and - */}
        <div
          className="w-5 h-px"
          style={{ backgroundColor: "rgba(249,251,250,0.2)" }}
        />

        {/* Zoom out */}
        <button
          title="Zoom Out"
          className="w-8 h-8 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-200"
        >
          <Minus size={16} color="#F9FBFA" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// ─── WaveDivider ───────────────────────────────────────────────────────────────

interface WaveDividerProps {
  /** Background colour of the left pane */
  leftColor: string;
  /** Background colour of the right pane */
  rightColor: string;
}

/**
 * WaveDivider
 *
 * Absolutely-positioned inline SVG placed at the junction of the left
 * and right dashboard panes, near the top of the content area.
 *
 * Instead of a hard vertical line, it renders an organic S-curve / swoosh
 * that blends the column divider into the dark header scoop above it.
 * The left half is filled with the left pane colour and the right half
 * with the right pane colour, producing a seamless curved boundary.
 */
export function WaveDivider({ leftColor, rightColor }: WaveDividerProps) {
  return (
    <div
      className="absolute top-0 z-10 pointer-events-none"
      style={{ left: "calc(40% - 30px)", width: "60px", height: "100px" }}
    >
      <svg
        viewBox="0 0 60 100"
        width="60"
        height="100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/*
          Left fill — traces left + bottom edges then curves back up to
          the top, filled with the left pane colour.
        */}
        <path d="M0,0 L0,100 L60,100 C20,100 40,0 30,0 Z" fill={leftColor} />

        {/*
          Right fill — mirror of the left path, filled with the right
          pane colour to complete the visual divider.
        */}
        <path d="M30,0 C40,0 20,100 60,100 L60,0 Z" fill={rightColor} />
      </svg>
    </div>
  );
}
