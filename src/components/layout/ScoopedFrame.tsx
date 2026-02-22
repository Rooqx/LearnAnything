"use client";

import {
  GraduationCap,
  Users,
  Gauge,
  Inbox,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const FRAME_BG = "#121212";
const CONTENT_BG = "#F9FBFA";
const ACCENT = "#2ED573";

// ─── Static Data ───────────────────────────────────────────────────────────────

/** Icon-only nav items rendered after the "Learning Plan" labelled button */
const ICON_NAV_ITEMS = [
  { icon: Users, label: "Community" },
  { icon: Gauge, label: "Progress" },
  { icon: Inbox, label: "Inbox" },
  { icon: SlidersHorizontal, label: "Settings" },
];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ScoopedFrameProps {
  /** Page content rendered inside the light content area */
  children: React.ReactNode;
  /** Optional extra classes on the outermost wrapper */
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * ScoopedFrame
 *
 * Global reusable layout shell used across all desktop pages.
 * Renders the dark outer frame, sticky top header, the signature
 * "top scoop" SVG transition, and a flexible light content area
 * that accepts any page content as children.
 */
export default function ScoopedFrame({ children, className = "" }: ScoopedFrameProps) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-3xl min-h-screen ${className}`}
      style={{ backgroundColor: FRAME_BG }}
    >
      {/* ── TOP HEADER ──────────────────────────────────────────────────────
          Sticky dark bar containing the brand, navigation, and user profile.
          Sits above the scoop so it is always visible.
      ─────────────────────────────────────────────────────────────────────── */}
      <header
        className="relative z-20 flex items-center justify-between px-8 py-3"
        style={{ backgroundColor: FRAME_BG }}
      >
        {/* Brand */}
        <span className="text-lg font-bold tracking-tight" style={{ color: CONTENT_BG }}>
          LearnAnything
        </span>

        {/* Primary navigation */}
        <nav className="flex items-center gap-6">
          {/* "Learning Plan" — only item with a visible text label */}
          <button className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity duration-200">
            <GraduationCap size={17} color={CONTENT_BG} strokeWidth={1.6} />
            <span className="text-sm font-medium" style={{ color: CONTENT_BG }}>
              Learning Plan
            </span>
          </button>

          {/* Icon-only nav items */}
          {ICON_NAV_ITEMS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              title={label}
              className="opacity-60 hover:opacity-100 transition-opacity duration-200"
            >
              <Icon size={17} color={CONTENT_BG} strokeWidth={1.6} />
            </button>
          ))}
        </nav>

        {/* User profile */}
        <div className="flex items-center gap-2.5">
          {/* Avatar — uses accent green as placeholder background */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
            style={{ backgroundColor: ACCENT, color: FRAME_BG }}
          >
            ET
          </div>

          {/* Name + email stacked */}
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold" style={{ color: CONTENT_BG }}>
              Ellington Thom
            </span>
            <span className="text-[10px] opacity-50" style={{ color: CONTENT_BG }}>
              annetteg.gmail.com
            </span>
          </div>

          {/* Dropdown indicator */}
          <ChevronDown size={14} color={CONTENT_BG} strokeWidth={2} className="opacity-70" />
        </div>
      </header>

      {/* ── TOP SCOOP ───────────────────────────────────────────────────────
          Full-width SVG strip that sits directly beneath the header.
          The rect fills the entire strip with the content background colour,
          then the cubic-bezier path draws the dark dome shape emerging from
          the header centre — giving the illusion that the frame extends
          downward in a smooth sweep before the light content area begins.
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full" style={{ marginTop: "-1px" }}>
        <svg
          viewBox="0 0 1200 48"
          width="100%"
          height="48"
          preserveAspectRatio="none"
          display="block"
        >
          {/* Base: content colour fills the whole strip */}
          <rect width="1200" height="48" fill={CONTENT_BG} />

          {/*
            Dome: centred at x=600.
            Two cubic bezier arcs form a smooth bell shape.
            Left arc:  (480,0) → (530,0) → (570,48) → (600,48)
            Right arc: (600,48) → (630,48) → (670,0) → (720,0)
          */}
          <path
            d="M480,0 C530,0 570,48 600,48 C630,48 670,0 720,0 Z"
            fill={FRAME_BG}
          />
        </svg>
      </div>

      {/* ── CONTENT AREA ────────────────────────────────────────────────────
          Flexible region that grows to fill remaining viewport height.
          All page-specific layout is injected here via children.
      ─────────────────────────────────────────────────────────────────────── */}
      <main
        className="relative z-0 flex-1 overflow-hidden"
        style={{ backgroundColor: CONTENT_BG }}
      >
        {children}
      </main>
    </div>
  );
}
