"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const LINE_COLOR = "#2ED573";
const LINE_DASH = "6 4";
const LINE_WIDTH = 2;

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ConnectingLinesProps {
  /** Ref to the container that the SVG should overlay (left + middle columns) */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Ref to the active module's green `+` node */
  moduleNodeRef: React.RefObject<HTMLDivElement | null>;
  /** Refs to each visible chapter card's root element */
  chapterRefs: React.RefObject<(HTMLDivElement | null)[]>;
  /** Increment this counter to force a re-render (e.g. on drag) */
  redrawKey: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Get the centre point of an element relative to a container */
function getCentre(
  el: HTMLElement,
  container: HTMLElement
): { x: number; y: number } | null {
  const cRect = container.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();
  return {
    x: eRect.left + eRect.width / 2 - cRect.left,
    y: eRect.top + eRect.height / 2 - cRect.top,
  };
}

/** Get the right-centre of an element relative to a container */
function getRightCentre(
  el: HTMLElement,
  container: HTMLElement
): { x: number; y: number } | null {
  const cRect = container.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();
  return {
    x: eRect.right - cRect.left,
    y: eRect.top + eRect.height / 2 - cRect.top,
  };
}

/** Get the left-centre of an element relative to a container */
function getLeftCentre(
  el: HTMLElement,
  container: HTMLElement
): { x: number; y: number } | null {
  const cRect = container.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();
  return {
    x: eRect.left - cRect.left,
    y: eRect.top + eRect.height / 2 - cRect.top,
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * ConnectingLines
 *
 * Absolutely positioned SVG overlay that draws dotted green
 * cubic-bezier paths from the active module's `+` node to
 * each visible chapter card's left edge.
 *
 * Recalculates on mount, window resize, and whenever
 * `redrawKey` changes (triggered by drag events).
 */
export default function ConnectingLines({
  containerRef,
  moduleNodeRef,
  chapterRefs,
  redrawKey,
}: ConnectingLinesProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const rafId = useRef<number>(0);

  const calc = useCallback(() => {
    const container = containerRef.current;
    const moduleNode = moduleNodeRef.current;
    const chapters = chapterRefs.current;

    if (!container || !moduleNode || !chapters) {
      setPaths([]);
      return;
    }

    const origin = getRightCentre(moduleNode, container);
    if (!origin) {
      setPaths([]);
      return;
    }

    const newPaths: string[] = [];

    for (const chEl of chapters) {
      if (!chEl) continue;
      const target = getLeftCentre(chEl, container);
      if (!target) continue;

      // Horizontal distance for the bezier control points
      const dx = Math.abs(target.x - origin.x) * 0.5;

      const d = `M ${origin.x} ${origin.y}
                 C ${origin.x + dx} ${origin.y},
                   ${target.x - dx} ${target.y},
                   ${target.x} ${target.y}`;

      newPaths.push(d);
    }

    setPaths(newPaths);
  }, [containerRef, moduleNodeRef, chapterRefs]);

  // Recalculate whenever redrawKey changes
  useEffect(() => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(calc);
    return () => cancelAnimationFrame(rafId.current);
  }, [redrawKey, calc]);

  // Recalculate on resize
  useEffect(() => {
    const handler = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(calc);
    };

    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [calc]);

  // Initial calculation after mount
  useEffect(() => {
    // Small delay to ensure layout is settled
    const timer = setTimeout(calc, 100);
    return () => clearTimeout(timer);
  }, [calc]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={LINE_WIDTH}
          strokeDasharray={LINE_DASH}
          strokeLinecap="round"
          className="transition-opacity duration-300"
        />
      ))}
    </svg>
  );
}
