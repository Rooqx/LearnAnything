"use client";

import { MoreHorizontal, X, Check, Hexagon } from "lucide-react";
import { forwardRef, useCallback, useRef, useState } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const ACCENT = "#2ED573";
const MUTED = "#6B7280";
const CARD_BG = "#FFFFFF";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Chapter {
  id: number;
  moduleId: number;
  title: string;
  lectureLabel: string;
  description: string;
  progress: number; // 0–100
  status: string;
  statusEmoji: string;
}

interface ChapterCardProps {
  chapter: Chapter;
  /** Called on every drag frame with the card's new bounding rect */
  onDragMove?: (chapterId: number) => void;
  onDragEnd?: (chapterId: number) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * ChapterCard
 *
 * Draggable card displaying a single chapter entry within the
 * chapters column. Features a title, lecture/quiz sub-label,
 * description, progress bar, status badge, action buttons,
 * and a green hexagonal icon on the right edge.
 *
 * Drag is implemented via native pointer events (no external lib).
 * The forwarded ref attaches to the card's root element so the
 * parent can read its position for SVG line anchoring.
 */
const ChapterCard = forwardRef<HTMLDivElement, ChapterCardProps>(
  function ChapterCard({ chapter, onDragMove, onDragEnd }, ref) {
    const innerRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOrigin = useRef({ x: 0, y: 0 });
    const startOffset = useRef({ x: 0, y: 0 });

    // ── Drag handlers ──────────────────────────────────────────────────
    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        dragOrigin.current = { x: e.clientX, y: e.clientY };
        startOffset.current = { ...offset };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      },
      [offset]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - dragOrigin.current.x;
        const dy = e.clientY - dragOrigin.current.y;
        setOffset({
          x: startOffset.current.x + dx,
          y: startOffset.current.y + dy,
        });
        onDragMove?.(chapter.id);
      },
      [isDragging, chapter.id, onDragMove]
    );

    const handlePointerUp = useCallback(() => {
      setIsDragging(false);
      onDragEnd?.(chapter.id);
    }, [chapter.id, onDragEnd]);

    // ── Progress bar width ─────────────────────────────────────────────
    const progressPercent = Math.min(100, Math.max(0, chapter.progress));

    return (
      <div
        ref={(node) => {
          // Merge forwarded ref + internal ref
          (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className="relative rounded-2xl p-4 flex flex-col gap-2 cursor-grab active:cursor-grabbing touch-none select-none transition-shadow duration-200"
        style={{
          backgroundColor: CARD_BG,
          boxShadow: isDragging
            ? "4px 8px 20px rgba(0,0,0,0.15)"
            : "2px 3px 10px rgba(0,0,0,0.08)",
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          zIndex: isDragging ? 50 : 1,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* ── Title + Lecture label ────────────────────────────────────── */}
        <div className="flex flex-col">
          <span
            className="text-[15px] font-bold leading-tight"
            style={{ color: TEXT_PRIMARY }}
          >
            {chapter.title}
          </span>
          <span
            className="text-[12px] font-semibold mt-0.5"
            style={{ color: TEXT_PRIMARY }}
          >
            {chapter.lectureLabel}
          </span>
        </div>

        {/* ── Description ─────────────────────────────────────────────── */}
        <p
          className="text-[11px] leading-relaxed"
          style={{ color: MUTED }}
        >
          {chapter.description}
        </p>

        {/* ── Progress bar ────────────────────────────────────────────── */}
        <div className="w-full h-1 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: ACCENT,
            }}
          />
        </div>

        {/* ── Footer: status badge + action buttons ───────────────────── */}
        <div className="flex items-center justify-between mt-1">
          <span
            className="text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: "#D1F7E0", color: "#166534" }}
          >
            {chapter.status} {chapter.statusEmoji}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              title="More options"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={13} color={TEXT_PRIMARY} strokeWidth={2} />
            </button>

            <button
              title="Dismiss"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <X size={13} color={MUTED} strokeWidth={2.5} />
            </button>

            <button
              title="Confirm"
              className="w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-200"
              style={{ backgroundColor: TEXT_PRIMARY }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Check size={13} color="#F9FBFA" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ── Green hexagonal icon (right edge) ───────────────────────── */}
        <div
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center"
          style={{ color: ACCENT }}
        >
          <Hexagon size={22} strokeWidth={1.5} fill="#D1F7E0" />
        </div>
      </div>
    );
  }
);

export default ChapterCard;
