"use client";

import {
  Bell,
  Plus,
  Minus,
  MoreHorizontal,
  X,
  Menu,
  LayoutGrid,
  UserCircle2,
} from "lucide-react";
import PillInput from "@/src/components/ui/PillInput";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const MUTED = "#6B7280";
const ACCENT = "#2ED573";

// ─── Static Data ───────────────────────────────────────────────────────────────

interface Course {
  id: number;
  title: string;
  description: string;
  bgColor: string;
  status: string;
  statusEmoji: string;
  badgeBg: string;
  badgeText: string;
}

const COURSES: Course[] = [
  {
    id: 1,
    title: "Introduction to Programming",
    description: "Learn basic medical language for effective communication.",
    bgColor: "#E2F6F8",
    status: "Completed",
    statusEmoji: "🥳",
    badgeBg: "#D1F7E0",
    badgeText: "#166534",
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    description: "Learn basic medical language for effective communication.",
    bgColor: "#EADBFF",
    status: "In Progress",
    statusEmoji: "⏱",
    badgeBg: "#FEF9C3",
    badgeText: "#854D0E",
  },
  {
    id: 3,
    title: "UX Design Principles",
    description:
      "Understand ethical principles and professionaiss and nouisomenns in healthcare.",
    bgColor: "#DDFCE2",
    status: "Upcoming",
    statusEmoji: "⏱",
    badgeBg: "#F3F4F6",
    badgeText: "#374151",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * CourseCard
 *
 * Reusable card displaying a single course entry.
 * Each card has a coloured background, title, description,
 * a status badge, and three action buttons (more, close-light, close-dark).
 */
function CourseCard({ course }: { course: Course }) {
  return (
    <div
      className="rounded-2xl p-4 mb-4 flex flex-col gap-3"
      style={{ backgroundColor: course.bgColor }}
    >
      {/* Title */}
      <h3
        className="text-[15px] font-bold leading-snug"
        style={{ color: TEXT_PRIMARY }}
      >
        {course.title}
      </h3>

      {/* Description */}
      <p className="text-[12px] leading-relaxed" style={{ color: MUTED }}>
        {course.description}
      </p>

      {/* Footer row: status badge + action buttons */}
      <div className="flex items-center justify-between">
        {/* Status badge */}
        <span
          className="text-[11px] font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: course.badgeBg, color: course.badgeText }}
        >
          {course.status} {course.statusEmoji}
        </span>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* More options */}
          <button
            title="More options"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white bg-opacity-60 hover:bg-opacity-100 transition-all duration-200"
          >
            <MoreHorizontal size={13} color={TEXT_PRIMARY} strokeWidth={2} />
          </button>

          {/* Light dismiss */}
          <button
            title="Dismiss"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white bg-opacity-60 hover:bg-opacity-100 transition-all duration-200"
          >
            <X size={13} color={TEXT_PRIMARY} strokeWidth={2.5} />
          </button>

          {/* Dark remove */}
          <button
            title="Remove"
            className="w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200"
            style={{ backgroundColor: TEXT_PRIMARY }}
          >
            <X size={13} color="#F9FBFA" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * FloatingNavRail
 *
 * Vertical floating navigation rail anchored to the left edge
 * of the content area. Contains three visual groups:
 *  - Top pill:    active icon, hamburger menu, grid view
 *  - Middle:      bell notification icon with badge
 *  - Bottom pill: zoom-in (+) and zoom-out (-) controls
 */
function FloatingNavRail() {
  return (
    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4">
      {/* Top pill — primary nav icons */}
      <div
        className="flex flex-col items-center gap-3 px-2 py-3 rounded-2xl"
        style={{ backgroundColor: TEXT_PRIMARY }}
      >
        {/* Active state indicator — filled circle */}
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

      {/* Bell with green notification badge */}
      <div className="relative">
        <button
          title="Notifications"
          className="w-8 h-8 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-200"
        >
          <Bell size={20} color={TEXT_PRIMARY} strokeWidth={1.8} />
        </button>

        {/* Badge */}
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{ backgroundColor: ACCENT, color: TEXT_PRIMARY }}
        >
          25
        </span>
      </div>

      {/* Bottom pill — zoom controls */}
      <div
        className="flex flex-col items-center px-2 py-2 rounded-2xl gap-1"
        style={{ backgroundColor: TEXT_PRIMARY }}
      >
        <button
          title="Zoom In"
          className="w-8 h-8 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-200"
        >
          <Plus size={16} color="#F9FBFA" strokeWidth={2} />
        </button>

        {/* Divider */}
        <div
          className="w-5 h-px"
          style={{ backgroundColor: "rgba(249,251,250,0.2)" }}
        />

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

/**
 * WaveDivider
 *
 * An absolutely-positioned inline SVG that sits at the junction of
 * the left and right panes, near the top of the content area.
 * Instead of a hard vertical line, it renders an organic S-curve /
 * swoosh that blends the column divider into the dark header above.
 *
 * The left side of the SVG is filled with the left pane colour and
 * the right side with the right pane colour, producing a smooth
 * curved boundary between the two columns.
 */
function WaveDivider({
  leftColor,
  rightColor,
}: {
  leftColor: string;
  rightColor: string;
}) {
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
          Left fill: fills the area to the left of the swoosh curve.
          Path traces the left and bottom edges, then the curve back up.
        */}
        <path d="M0,0 L0,100 L60,100 C20,100 40,0 30,0 Z" fill={leftColor} />

        {/*
          Right fill: fills the area to the right of the swoosh curve.
          Mirror of the left path to complete the divider visual.
        */}
        <path d="M30,0 C40,0 20,100 60,100 L60,0 Z" fill={rightColor} />
      </svg>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * CreateCourse
 *
 * Two-pane dashboard layout:
 *  - Left pane  (~40%): scrollable list of existing course cards
 *  - Right pane (~60%): prompt area for generating a new course
 *
 * A floating nav rail sits on the far left edge, and a wave SVG
 * divider provides the organic column boundary described in the spec.
 */
export default function CreateCourse() {
  const LEFT_BG = "#F9FBFA";
  const RIGHT_BG = "#F2F4F3";

  const handleCoursePrompt = (prompt: string) => {
    // TODO: wire up to course generation API
    console.log("Generate course for:", prompt);
  };

  return (
    <div className="relative flex h-full min-h-[calc(100vh-100px)]">
      {/* ── FLOATING NAV RAIL ─────────────────────────────────────────────
          Absolute-positioned on the left edge, vertically centred.
          Floats above both panes via z-index.
      ──────────────────────────────────────────────────────────────────── */}
      <FloatingNavRail />

      {/* ── LEFT PANE — Courses ───────────────────────────────────────────
          Scrollable list of course cards.
          Left padding accounts for the floating nav rail width (~60px).
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className="w-[40%] h-full overflow-y-auto pl-16 pr-6 pt-6 pb-6"
        style={{ backgroundColor: LEFT_BG, scrollbarWidth: "none" }}
      >
        <h2
          className="text-[22px] font-bold mb-5"
          style={{ color: TEXT_PRIMARY }}
        >
          Courses
        </h2>

        {COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* ── WAVE DIVIDER ──────────────────────────────────────────────────
          Organic SVG swoosh at the top of the column boundary.
          Rendered between the two panes so it appears to blend the
          straight vertical divider into the curved header scoop above.
      ──────────────────────────────────────────────────────────────────── */}
      <WaveDivider leftColor={LEFT_BG} rightColor={RIGHT_BG} />

      {/* ── RIGHT PANE — Create New Course ────────────────────────────────
          Centred prompt input for generating a new course via AI.
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col px-10 pt-6 pb-6"
        style={{ backgroundColor: RIGHT_BG }}
      >
        <h2
          className="text-[22px] font-bold mb-4"
          style={{ color: TEXT_PRIMARY }}
        >
          Create New Course
        </h2>

        {/* Vertically and horizontally centred input */}
        <div className="flex-1 flex items-center justify-center">
          <PillInput
            placeholder="Enter what u would like to learn"
            buttonLabel="SEND"
            buttonColor="#F97316"
            buttonTextColor="#ffffff"
            onSubmit={handleCoursePrompt}
            className="w-full max-w-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
