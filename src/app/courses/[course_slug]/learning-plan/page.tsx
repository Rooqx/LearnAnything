"use client";

import { useCallback, useRef, useState } from "react";

// ── Layout Components (already built) ──────────────────────────────────────────
import ScoopedFrame from "@/src/components/layout/ScoopedFrame";
import { FloatingNavRail, WaveDivider } from "@/src/components/dashboard/DashboardNav";

// ── Learning Plan Components ───────────────────────────────────────────────────
import SearchBar from "@/src/components/learning-plan/SearchBar";
import StatCards from "@/src/components/learning-plan/StatCards";
import ModuleCard from "@/src/components/learning-plan/ModuleCard";
import type { Module } from "@/src/components/learning-plan/ModuleCard";
import ChapterCard from "@/src/components/learning-plan/ChapterCard";
import type { Chapter } from "@/src/components/learning-plan/ChapterCard";
import ConnectingLines from "@/src/components/learning-plan/ConnectingLines";
import EventPanel from "@/src/components/learning-plan/EventPanel";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const CONTENT_BG = "#F9FBFA";
const LEFT_PANE_BG = "#F3F4F3";
const DIVIDER_COLOR = "#D1D5DB";
const TEXT_PRIMARY = "#121212";
const CARDS_BG = ["#DDFCE2", "#E2F6F8", "#EADBFF"];

// ─── Static Data ───────────────────────────────────────────────────────────────

const MODULES: Module[] = [
  {
    id: 1,
    title: "Module 1",
    subtitle: "TITLE L",
    description: "Learn basic medical language for effective communication.",
    chapterLength: "2",
  },

  {
    id: 2,
    title: "Module 2",
    subtitle: "Title",
    description: "Learn basic medical language for effective communication.",
    chapterLength: "2",
  },
  {
    id: 3,
    title: "Module 3",
    subtitle: "Title",
    description: "Advanced topics in healthcare systems and policy.",
    chapterLength: "2",
  },
      {
    id: 4,
    title: "Module 1",
    subtitle: "TITLE L",
    description: "Learn basic medical language for effective communication.",
    chapterLength: "5",
  },
    {
    id: 5,
    title: "Module 1",
    subtitle: "TITLE L",
    description: "Learn basic medical language for effective communication.",
    chapterLength: "1",
  },
];

const CHAPTERS: Chapter[] = [
  // ── Module 1 chapters ──
  {
    id: 1,
    moduleId: 1,
    title: "Chapter title",
    lectureLabel: "Lecture 1: Basics",
    description: "Understand the structure and function of the human body.",
    progress: 100,
    status: "Completed",
    statusEmoji: "🥳",
  },
  {
    id: 2,
    moduleId: 1,
    title: "Chapter title",
    lectureLabel: "Quiz 1 Review",
    description:
      "Understand ethical principles and professionalism in healthcare.",
    progress: 100,
    status: "Completed",
    statusEmoji: "🥳",
  },
  {
    id: 3,
    moduleId: 1,
    title: "Assignment 1 Draft",
    lectureLabel: "Assignment",
    description:
      "Understand ethical principles and professionalism in healthcare.",
    progress: 45,
    status: "In Progress",
    statusEmoji: "⏱",
  },
  // ── Module 2 chapters ──
  {
    id: 4,
    moduleId: 2,
    title: "Healthcare Systems",
    lectureLabel: "Lecture 1: Overview",
    description: "Overview of global healthcare systems and structures.",
    progress: 30,
    status: "In Progress",
    statusEmoji: "⏱",
  },
  {
    id: 5,
    moduleId: 2,
    title: "Policy Analysis",
    lectureLabel: "Lecture 2: Policy",
    description: "Analyzing healthcare policies and their impacts.",
    progress: 0,
    status: "Upcoming",
    statusEmoji: "📅",
  },
  // ── Module 3 chapters ──
  {
    id: 6,
    moduleId: 3,
    title: "Research Methods",
    lectureLabel: "Lecture 1: Methodology",
    description: "Introduction to qualitative and quantitative research.",
    progress: 0,
    status: "Upcoming",
    statusEmoji: "📅",
  },
  {
    id: 7,
    moduleId: 3,
    title: "Ethics in Research",
    lectureLabel: "Quiz 1: Ethics",
    description: "Ethical considerations in medical research.",
    progress: 0,
    status: "Upcoming",
    statusEmoji: "📅",
  },
];

// ─── Page Component ────────────────────────────────────────────────────────────

export default function LearningPlanPage() {
  // ── State ────────────────────────────────────────────────────────────────────
  const [activeModuleId, setActiveModuleId] = useState(1);
  const [redrawKey, setRedrawKey] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // ── Refs for SVG connecting lines ────────────────────────────────────────────
  const columnsContainerRef = useRef<HTMLDivElement>(null);
  const moduleNodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const chapterCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get only chapters for the active module
  const activeChapters = CHAPTERS.filter((c) => c.moduleId === activeModuleId);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleModuleClick = useCallback(
    (moduleId: number) => {
      if (moduleId === activeModuleId) return;

      // Trigger fade-out
      setIsFading(true);

      // After fade-out completes, switch module and fade-in
      setTimeout(() => {
        setActiveModuleId(moduleId);
        // Reset chapter refs for new module
        chapterCardRefs.current = [];
        setIsFading(false);
        // Force SVG redraw after DOM settles
        setTimeout(() => setRedrawKey((k) => k + 1), 50);
      }, 300);
    },
    [activeModuleId]
  );

  const handleChapterDragMove = useCallback(() => {
    setRedrawKey((k) => k + 1);
  }, []);

  const handleChapterDragEnd = useCallback(() => {
    setRedrawKey((k) => k + 1);
  }, []);

  // Ref for the currently active module's + node
  const activeModuleNodeRef = useRef<HTMLDivElement | null>(null);

  return (
    <ScoopedFrame>
      <div className="relative flex h-full w-full overflow-hidden">
        {/* ── Left Floating Nav Rail ─────────────────────────────────────── */}
        <div
          className="shrink-0 flex flex-col items-center py-6 px-5"
          style={{ width: "72px" }}
        >
          <FloatingNavRail />
        </div>

        {/* ── Wavy curve at top-left junction  <WaveDivider leftColor={LEFT_PANE_BG} rightColor={CONTENT_BG} /> ────────────────────────────── */}
       

        {/* ── Three-column area (relative for SVG overlay) ───────────────── */}
        <div
          ref={columnsContainerRef}
          className="relative flex flex-1 overflow-hidden"
        >
          {/* ── SVG Connecting Lines Overlay ──────────────────────────────── */}
          <ConnectingLines
            containerRef={columnsContainerRef}
            moduleNodeRef={activeModuleNodeRef}
            chapterRefs={chapterCardRefs}
            redrawKey={redrawKey}
          />

          {/* ══════════════════════════════════════════════════════════════════
              LEFT COLUMN — Teaching Plan (~35%)
          ══════════════════════════════════════════════════════════════════ */}
          <div
            className="flex flex-col items-center gap-5 py-6 px-0  overflow-y-auto"
            style={{ width: "35%", backgroundColor: CONTENT_BG, scrollbarWidth: "none"}}
          >
            <h2
              className="text-[22px] font-bold w-full text-start px-10"
              style={{ color: TEXT_PRIMARY }}
            >
              Teaching Plan for course
            </h2>

            {MODULES.map((mod) => (
              <ModuleCard
                cardBg={CARDS_BG[mod.id % CARDS_BG.length]}
                key={mod.id}
                module={mod}
                isActive={mod.id === activeModuleId}
                onClick={() => handleModuleClick(mod.id)}
                ref={(node) => {
                  moduleNodeRefs.current[mod.id] = node;
                  if (mod.id === activeModuleId) {
                    activeModuleNodeRef.current = node;
                  }
                }}
              />
            ))}
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              MIDDLE COLUMN — Chapters (~35%)
          ══════════════════════════════════════════════════════════════════ */}
          <div
            className="flex flex-col gap-4 py-6 px-5 overflow-y-auto"
            style={{ width: "30%", scrollbarWidth: "none" }}
          >
            {/* Search + Stats */}
            <SearchBar />
            <StatCards />

            {/* Chapter cards with fade animation */}
            <div
              className="flex flex-col gap-4 transition-opacity duration-300"
              style={{ opacity: isFading ? 0 : 1 }}
            >
              {activeChapters.map((ch, i) => (
                <ChapterCard
                  key={`${activeModuleId}-${ch.id}`}
                  chapter={ch}
                  onDragMove={handleChapterDragMove}
                  onDragEnd={handleChapterDragEnd}
                  ref={(node) => {
                    chapterCardRefs.current[i] = node;
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Vertical dashed divider ───────────────────────────────────── */}
          <div
            className="self-stretch my-6"
            style={{
              width: "1px",
              backgroundImage: `repeating-linear-gradient(to bottom, ${DIVIDER_COLOR} 0, ${DIVIDER_COLOR} 6px, transparent 6px, transparent 12px)`,
            }}
          />

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT COLUMN — My Event (~30%)
          ══════════════════════════════════════════════════════════════════ */}
          <div className="flex-1 py-6 px-5 overflow-y-auto" style={{ backgroundColor: LEFT_PANE_BG, scrollbarWidth: "none" }}>
            <EventPanel />
          </div>
        </div>
      </div>
    </ScoopedFrame>
  );
}
