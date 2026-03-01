"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseCard, { Course } from "./CourseCard";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const ACCENT = "#2ED573";
const CONTENT_BG = "#F9FBFA";

// ─── Static Data (dashboard course cards) ──────────────────────────────────────

const DASHBOARD_COURSES: Course[] = [
  {
    id: 101,
    title: "Design thinking",
    description: "",
    bgColor: "#FFFFFF",
    status: "",
    statusEmoji: "",
    badgeBg: "",
    badgeText: "",
    // Dashboard-only fields
 modules: 2,
    chapters: 10,
    progress: 46,
    teaching_style: "Simplified",
    slug: "design-thinking",
  },
  {
    id: 102,
    title: "Leadership",
    description: "",
    bgColor: "#FFFFFF",
    status: "",
    statusEmoji: "",
    badgeBg: "",
    badgeText: "",
    modules: 2,
    chapters: 10,
    progress: 72,
    teaching_style: "Beginner",
    slug: "leadership",
  },
  {
    id: 103,
    title: "IT English",
    description: "",
    bgColor: "#FFFFFF",
    status: "",
    statusEmoji: "",
    badgeBg: "",
    badgeText: "",
    modules: 2,
    chapters: 10,
    progress: 56,
    teaching_style: "Quick",
    slug: "it-english",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * YourCourses
 *
 * Green-background card spanning the full right column width.
 * Contains a horizontal row of 3 CourseCards using the "dashboard" variant.
 * Each card links to `/courses/[slug]/learning-plan`.
 */
export default function YourCourses() {
  return (
    <div
      className="rounded-3xl p-6 flex flex-col gap-5"
      style={{
        backgroundColor: ACCENT,
        boxShadow: "2px 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold" style={{ color: CONTENT_BG }}>
          Your courses
        </h2>

        <div className="flex items-center gap-2">
          {/* Arrows */}
          <button
            title="Previous"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/20 hover:scale-110 active:scale-115 cursor-pointer"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <ChevronLeft size={16} color={CONTENT_BG} strokeWidth={2} />
          </button>
          <button
            title="Next"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/20 hover:scale-110 active:scale-115 cursor-pointer"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <ChevronRight size={16} color={CONTENT_BG} strokeWidth={2} />
          </button>

          {/* View all */}
          <button
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-opacity-90"
            style={{ backgroundColor: CONTENT_BG, color: "#121212" }}
          >
            View all
          </button>
        </div>
      </div>

      {/* ── Course cards row ────────────────────────────────────────── */}
      <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {DASHBOARD_COURSES.map((course) => (
          <CourseCard key={course.id} course={course} variant="dashboard" />
        ))}
      </div>
    </div>
  );
}
