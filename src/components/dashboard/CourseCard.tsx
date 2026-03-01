"use client";

import { MoreHorizontal, X, Check } from "lucide-react";
import Link from "next/link";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const MUTED = "#6B7280";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Course {
  id: number;
  title: string;
  description: string;
  bgColor: string;
  status: string;
  statusEmoji: string;
  badgeBg: string;
  badgeText: string;
  /* ── Dashboard-only fields (optional — won't break existing usage) ── */
  progress?: number;
  teaching_style?: string;
  chapters?: number;
  modules?: number;
  slug?: string;
}

// ─── Static Data ───────────────────────────────────────────────────────────────

export const COURSES: Course[] = [
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

// ─── Component ─────────────────────────────────────────────────────────────────

interface CourseCardProps {
  course: Course;
  /** "default" renders the existing card; "dashboard" renders progress + mentor style */
  variant?: "default" | "dashboard";
}

/**
 * CourseCard
 *
 * Reusable card displaying a single course entry.
 *
 * variant="default" (original): coloured background, title, description,
 *   status badge, and three action buttons.
 *
 * variant="dashboard": white card with title, level/class badges,
 *   progress bar + percentage, and mentor name. Wrapped in a Link
 *   to the course learning plan.
 */
export default function CourseCard({ course, variant = "default" }: CourseCardProps) {
  /* ── Dashboard variant ───────────────────────────────────────────── */
  if (variant === "dashboard") {
    const inner = (
      <div
        className="rounded-2xl p-8 flex flex-col gap-3 w-[300px] shadow-[2px_3px_10px_rgba(0,0,0,0.08)] transition-all duration-200 hover:shadow-lg"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Title */}
        <h3
          className="text-[15px] font-bold leading-snug"
          style={{ color: TEXT_PRIMARY }}
        >
          {course.title}
        </h3>

        {/* Badges row */}
        <div className="flex items-center gap-2">
          {course.modules && (
            <span
              className="text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#F3F4F6", color: MUTED }}
            >
              {course.modules} Modules
            </span>
          )}
          {course.chapters && (
            <span
              className="text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#F3F4F6", color: MUTED }}
            >
              {course.chapters} Chapters
            </span>
          )}
        </div>

        {/* Progress section */}
        {course.progress !== undefined && (
          <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-[12px] font-semibold" style={{ color: TEXT_PRIMARY }}>
              {course.progress}% <span className="font-normal" style={{ color: MUTED }}>completed</span>
            </span>
            <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "#E5E7EB" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${course.progress}%`,
                  backgroundColor: "#2ED573",
                }}
              />
            </div>
          </div>
        )}

        {/* Mentor row */}
        {course.teaching_style && (
          <div className="flex items-center gap-2 mt-1">
         
            <span className="text-[11px]" style={{ color: MUTED }}>
             Teaching Style:  <span className="font-medium" style={{ color: TEXT_PRIMARY }}>{course.teaching_style} </span>
            </span>
          </div>
        )}
      </div>
    );

    /* If the course has a slug, wrap in Link to learning plan */
    if (course.slug) {
      return (
        <Link href={`/courses/${course.slug}/learning-plan`} className="block">
          {inner}
        </Link>
      );
    }
    return inner;
  }

  /* ── Default variant (existing — unchanged) ────────────────────── */
  return (
    <div
      className="rounded-2xl mb-4 flex flex-col gap-3 w-[90%] p-2 shadow-[2px_3px_10px_rgba(0,0,0,0.1)]"
      style={{ backgroundColor: course.bgColor }}
    >
      {/* Inner container with subtle gradient overlay */}
      <div className="p-8 w-full h-full bg-[rgba(255,255,255,0.3)] rounded-2xl">
        {/* Title */}
        <h3
          className="text-[16px] md:text-[18px] font-bold leading-snug"
          style={{ color: TEXT_PRIMARY }}
        >
          {course.title}
        </h3>

        {/* Description */}
        <p
          className="text-[12px] md:text-[14px] leading-relaxed mt-1"
          style={{ color: MUTED }}
        >
          {course.description}
        </p>

        {/* Footer row: status badge + action buttons */}
        <div className="flex items-center justify-between mt-3">
          {/* Status badge */}
          <span
            className="text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: course.badgeBg, color: course.badgeText }}
          >
            {course.status} {course.statusEmoji}
          </span>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              title="More options"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white bg-opacity-60 hover:bg-opacity-100 transition-all duration-200"
            >
              <MoreHorizontal size={13} color={TEXT_PRIMARY} strokeWidth={2} />
            </button>
            <button
              title="Dismiss"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white bg-opacity-60 hover:bg-opacity-100 transition-all duration-200"
            >
              <X size={13} color={TEXT_PRIMARY} strokeWidth={2.5} />
            </button>
            <button
              title="Remove"
              className="w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200"
              style={{ backgroundColor: TEXT_PRIMARY }}
            >
              <Check size={13} color="#F9FBFA" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
