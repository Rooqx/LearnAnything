"use client";

import {
  GraduationCap,
  Users,
  Gauge,
  Inbox,
  SlidersHorizontal,
  Type,
  PenLine,
  StickyNote,
  MousePointer2,
  MessageCircle,
  Smile,
  Plus,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoopedFrameProps {
  children: React.ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FRAME_BG = "#121212";
const CONTENT_BG = "#F9FBFA";
const ACCENT = "#2ED573";

const NAV_ITEMS = [
  { icon: GraduationCap, label: "Learning Plan" },
  { icon: Users, label: "Community" },
  { icon: Gauge, label: "Progress" },
  { icon: Inbox, label: "Inbox" },
  { icon: SlidersHorizontal, label: "Settings" },
];

const TOOLBAR_ITEMS = [
  { icon: Type, bg: "#D1F7E8", color: "#121212" },
  { icon: PenLine, bg: "#FDE8D1", color: "#121212" },
  { icon: StickyNote, bg: "#E8D1FD", color: "#121212" },
  { icon: MousePointer2, bg: "#D1E8FD", color: "#121212" },
  { icon: MessageCircle, bg: "#FDD1E8", color: "#121212" },
  { icon: Smile, bg: "#FDF7D1", color: "#121212" },
  { icon: Plus, bg: "#121212", color: "#F9FBFA" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScoopedFrame({ children }: ScoopedFrameProps) {
  return (
    <div
      className="relative flex flex-col overflow-hidden w-full p-2"
      style={{
        backgroundColor: FRAME_BG,
        margin: "0 auto",
      }}
    >
      {/* ── TOP HEADER BAR ──────────────────────────────────────────────── */}
      <div
        className="relative z-20 flex items-center justify-between px-6 pt-5 pb-4"
        style={{ backgroundColor: FRAME_BG }}
      >
        {/* Left: Brand name */}
        <span
          className="text-xl font-bold tracking-tight"
          style={{ color: CONTENT_BG }}
        >
          LearnAnything
        </span>

        {/* Center: Nav icons */}
        <nav className="flex items-center gap-5">
          {NAV_ITEMS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              title={label}
              className="opacity-70 hover:opacity-100 transition-opacity duration-200"
            >
              <Icon size={17} color={CONTENT_BG} strokeWidth={1.6} />
            </button>
          ))}
        </nav>

        {/* Right: User avatar + info */}
        <div className="flex items-center gap-2">
          {/* Avatar circle using accent color */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
            style={{ backgroundColor: ACCENT, color: FRAME_BG }}
          >
            ET
          </div>
          <div className="flex flex-col justify-start items-start text-right leading-tight">
            <span
              className="text-[11px] font-semibold"
              style={{ color: CONTENT_BG }}
            >
              Ellington Thom
            </span>
            <span
              className="text-[10px] opacity-50"
              style={{ color: CONTENT_BG }}
            >
              annette@gmail.com
            </span>
          </div>
        </div>
      </div>

      {/* ── TOP SCOOP (black dome dipping DOWN into content area) ─────── */}
      {/*
        SVG strip sits between the header and the white content area.
        Background is filled with CONTENT_BG so only the central dome
        (filled with FRAME_BG) is visible — giving the illusion that the
        dark header extends downward into the white body in the center.
      */}
      <div className="relative z-10 w-full" style={{ marginTop: "-1px" }}>
        <svg
          viewBox="0 0 390 44"
          width="100%"
          height="44"
          preserveAspectRatio="none"
          display="block"
        >
          {/* Content-colored base — hides the rectangular header bottom */}
          <rect width="390" height="44" fill={CONTENT_BG} />
          {/*
            The dome: starts at x=110 (top of strip, y=0), curves DOWN to
            the lowest point at (195, 44), then back up to x=280 (y=0).
            Filled with frame color so it blends with the header above.
          */}
          <path
            d="M110,0 C140,0 165,44 195,44 C225,44 250,0 280,0 Z"
            fill={FRAME_BG}
          />
        </svg>
      </div>

      {/* ── MAIN CONTENT AREA ───────────────────────────────────────────── */}
      <div
        className="relative z-0 flex-1 overflow-hidden"
        style={{ backgroundColor: CONTENT_BG }}
      >
        {children}
      </div>

      {/* ── BOTTOM ARCH (black dome rising UP into content area) ─────── */}
      {/*
        SVG strip sits between the white content area and the footer bar.
        Same principle as the top scoop but inverted — a wide arch rises
        upward from the bottom of the strip, acting as the "docking bay"
        for the pastel toolbar. The toolbar is absolutely layered on top.
      */}
      <div className="relative z-10 w-full" style={{ marginBottom: "-1px" }}>
        <svg
          viewBox="0 0 390 68"
          width="100%"
          height="68"
          preserveAspectRatio="none"
          display="block"
        >
          {/* Content-colored base */}
          <rect width="390" height="68" fill={CONTENT_BG} />
          {/*
            The arch: starts at x=60 (bottom of strip, y=68), curves UP to
            the peak at (195, 10), then back down to x=330 (y=68).
            Filled with frame color so it blends with the footer below.
          */}
          <path
            d="M60,68 C90,68 140,10 195,10 C250,10 300,68 330,68 Z"
            fill={FRAME_BG}
          />
        </svg>

        {/* Pastel toolbar — floated inside the arch negative space */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ paddingTop: "18px" }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            {TOOLBAR_ITEMS.map(({ icon: Icon, bg, color }, i) => (
              <button
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-150 hover:scale-110 active:scale-95"
                style={{ backgroundColor: bg }}
                title={`Tool ${i + 1}`}
              >
                <Icon size={14} color={color} strokeWidth={1.8} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM FOOTER BAR (thin closing strip) ───────────────────── */}
      <div
        className="relative z-20 h-6"
        style={{ backgroundColor: FRAME_BG }}
      />
    </div>
  );
}
