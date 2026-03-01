"use client";

import StatisticCard from "@/src/components/dashboard/StatisticCard";
import YourCourses from "@/src/components/dashboard/YourCourses";
import StudyProcess from "@/src/components/dashboard/StudyProcess";
import AIAssistant from "@/src/components/dashboard/AIAssistant";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const CONTENT_BG = "#F3F4F6";

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * Dashboard Page
 *
 * Two-column masonry-style layout:
 *   Left (~30%)  — StatisticCard (full height)
 *   Right (~70%) — YourCourses (top), StudyProcess + AIAssistant (bottom 50/50)
 */
export default function DashboardPage() {
  return (
    <div
      className="h-full overflow-y-auto p-6"
      style={{ backgroundColor: CONTENT_BG, scrollbarWidth: "none" }}
    >
      <div className="flex gap-5 h-full max-h-[calc(100vh-80px)]">
        {/* ══════════════════════════════════════════════════════════════════
            LEFT COLUMN — Statistic (~30%)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="w-[30%] shrink-0">
          <StatisticCard />
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT COLUMN — Courses + Study/AI (~70%)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Top: Your Courses (full width) */}
          <YourCourses />

          {/* Bottom: Study Process + AI Assistant (50/50) */}
          <div className="flex gap-5 flex-1 min-h-0">
            <div className="flex-1">
              <StudyProcess />
            </div>
            <div className="flex-1">
              <AIAssistant />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
