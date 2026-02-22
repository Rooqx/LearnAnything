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
  Star,
  Home,
  ChevronLeftCircle,
  ChevronRight,
  Share,
  Send,
} from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoopedFrameProps {
  children: React.ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MUTED = "#6B7280";
const FRAME_BG = "#121212";
const CONTENT_BG = "#F9FBFA";
const ACCENT = "#2ED573";
const TEXT_COLOR = "#121212";

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

/** Left / Right floating navigation arrows */
function SideArrows({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  const btnBase: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 30,
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.2s",
  };

  return (
    <>
      <button
        onClick={onPrev}
        style={{ ...btnBase, left: "500px" }}
        title="Previous"
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "rgba(18,18,18,0.15)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "rgba(18,18,18,0.08)")
        }
      >
        <p className=" text-white">Prev</p>
        <ChevronLeftCircle size={16} color={TEXT_COLOR} strokeWidth={2} />
      </button>

      <button
        onClick={onNext}
        style={{ ...btnBase, right: "500px" }}
        title="Next"
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "rgba(18,18,18,0.15)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "rgba(18,18,18,0.08)")
        }
      >
        <p className=" text-white">Next</p>
        <ChevronRight size={16} color={TEXT_COLOR} strokeWidth={2} />
      </button>
    </>
  );
}

/*TODO FIX */
/** Bottom navigation bar with home, page pills, and AI star */
function BottomNav({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Left: Home icon */}
      <button
        className="w-9 h-9 flex items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-70"
        title="Home"
      >
        <Home size={20} color={"#121212"} strokeWidth={1.8} />
      </button>

      {/* Center: Page indicator pill */}
      <div
        className="flex items-center gap-1 px-2 py-1.5 -mb-5 rounded-full"
        style={{ backgroundColor: "transparent", color: CONTENT_BG }}
      >
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          const isActive = pageNum === currentPage;
          console.log("isActive:", pageNum);
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className="w-9 h-9 cusor-pointer rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-200"
              style={{
                backgroundColor: isActive ? ACCENT : "transparent",
                color: isActive ? CONTENT_BG : MUTED,
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#D4EDD8";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
              }}
            >
              pg {pageNum}
            </button>
          );
        })}
      </div>

      {/* Right: Ask question / Input */}
      <div className="absolute right-15 w-100 p-2">
        <input
          type="text"
          placeholder="Ask a question"
          className="w-full rounded-full px-2 p-1 text-[0.8rem] outline-none border border-[#121212]"
        />
      </div>
      <button
        className="w-9 h-9 cursor-pointer flex bg-[#121212] items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-70"
        title="AI Assistant"
      >
        <Send size={18} color={CONTENT_BG} strokeWidth={1.8} />
      </button>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScoopedFrame({ children }: ScoopedFrameProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePrev = () =>
    setCurrentPage((p) => (p > 1 ? p - 1 : 3 /*totalPages*/));

  const handleNext = () =>
    setCurrentPage((p) => (p < 3 /*totalPages*/ ? p + 1 : 1));

  return (
    <div
      className="relative flex flex-col overflow-hidden w-full h-full px-2 py-0"
      style={{
        backgroundColor: FRAME_BG,
        margin: "0",
      }}
    >
      {/* ── TOP HEADER BAR ──────────────────────────────────────────────── */}
      <div
        className="relative z-20 flex items-center justify-between px-6 py-2"
        style={{ backgroundColor: FRAME_BG }}
      >
        {/* Left: Brand name */}
        <span
          className="text-xl font-bold tracking-tight flex items-center"
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

      {/* ── MAIN CONTENT AREA ───────────────────────────────────────────── */}
      <div
        className="relative z-0 overflow-hidden rounded-3xl pb-5 "
        style={{ backgroundColor: "" }}
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
      <div className="relative z-10 w-full -mt-10">
        {/* ── FLOATING SIDE ARROWS ─────────────────────────────────────── */}
        <div className="w-1/2 bg-red-500 z-30 px-20">
          <SideArrows onPrev={handlePrev} onNext={handleNext} />
        </div>
        {/* ── FIXED BOTTOM NAV ───────────────────────────────────────────*/}
        <BottomNav
          totalPages={3}
          currentPage={1}
          onPageChange={setCurrentPage}
        />
        <svg
          viewBox="0 0 390 48"
          width="100%"
          height="48"
          preserveAspectRatio="none"
          display="block"
        >
          {/* Content-colored base*/}

          <path
            d="M0,44
               L122,44
               C132,44 132,2 142,2
               L248,2
               C258,2 258,44 268,44
               L390,44 Z"
            fill="#121212"
          />
        </svg>
      </div>
    </div>
  );
}
