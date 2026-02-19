"use client";

import { useState } from "react";
import { Home, Star, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BlockType = "paragraph" | "snippet";

interface ContentBlock {
  type: BlockType;
  content: string;
  language?: string;
}

interface LessonContentProps {
  title?: string;
  moduleNum?: number;
  chapterNum?: number;
  blocks?: ContentBlock[];
  totalPages?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTENT_BG = "#F9FBFA";
const TEXT_COLOR = "#121212";
const ACCENT = "#2ED573";
const ACCENT_HOVER = "#26B861";
const MUTED = "#6B7280";

// Default hardcoded content blocks
const DEFAULT_BLOCKS: ContentBlock[] = [
  {
    type: "paragraph",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam eiusmod tempor incididunt ut labore et dolore magna aliqua. Inolutpat Ut quis nostrud exercitation ullamco laboris.",
  },
  {
    type: "snippet",
    language: "javascript",
    content: `function learn() {\n  return "knowledge";\n}`,
  },
  {
    type: "paragraph",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam eiusmod tempor incididunt ut labore et dolore magna aliqua. Inolutpat Ut quis nontrnud exercitation.",
  },
  {
    type: "snippet",
    language: "javascript",
    content: `function learn() {\n  return "knowledge";\n}`,
  },
  {
    type: "paragraph",
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
  },
  {
    type: "snippet",
    language: "javascript",
    content: `const apply = (fn, value) => {\n  return fn(value);\n};`,
  },
  {
    type: "paragraph",
    content:
      "Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Renders a subtle code/formula snippet block */
function SnippetBlock({
  example,
  content,
  language,
}: {
  example: string;
  content: string;
  language?: string;
}) {
  return (
    <div
      className="my-4 rounded-xl overflow-hidden"
      style={{
        backgroundColor: "#EEF3F1",
        borderLeft: `3px solid ${ACCENT}`,
      }}
    >
      {/* Snippet label */}
      {language && (
        <div
          className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: MUTED }}
        >
          {/*SNippiet or formula or workings */}
          {example}
        </div>
      )}
      {/* Code text */}
      <pre
        className="px-4 pb-3 text-[13px] leading-relaxed overflow-x-auto"
        style={{
          color: TEXT_COLOR,
          fontFamily: "'Courier New', Courier, monospace",
        }}
      >
        <code>{content}</code>
      </pre>
    </div>
  );
}

/** Renders a paragraph text block */
function ParagraphBlock({ content }: { content: string }) {
  return (
    <p
      className="text-[14px] leading-[1.75] my-3"
      style={{ color: TEXT_COLOR }}
    >
      {content}
    </p>
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
      style={{ backgroundColor: CONTENT_BG }}
    >
      {/* Left: Home icon */}
      <button
        className="w-9 h-9 flex items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-70"
        title="Home"
      >
        <Home size={20} color={TEXT_COLOR} strokeWidth={1.8} />
      </button>

      {/* Center: Page indicator pill */}
      <div
        className="flex items-center gap-1 px-2 py-1.5 rounded-full"
        style={{ backgroundColor: "#E8EDE9" }}
      >
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className="w-9 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-200"
              style={{
                backgroundColor: isActive ? ACCENT : "transparent",
                color: isActive ? "#121212" : MUTED,
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

      {/* Right: Star / AI icon */}
      <button
        className="w-9 h-9 flex items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-70"
        title="AI Assistant"
      >
        <Star size={20} color={TEXT_COLOR} strokeWidth={1.8} />
      </button>
    </div>
  );
}

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
    zIndex: 20,
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "rgba(18,18,18,0.08)",
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
        style={{ ...btnBase, left: "6px" }}
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
        <ChevronLeft size={16} color={TEXT_COLOR} strokeWidth={2} />
      </button>

      <button
        onClick={onNext}
        style={{ ...btnBase, right: "6px" }}
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
        <ChevronRight size={16} color={TEXT_COLOR} strokeWidth={2} />
      </button>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LessonContent({
  title = "Title",
  moduleNum = 1,
  chapterNum = 3,
  blocks = DEFAULT_BLOCKS,
  totalPages = 3,
}: LessonContentProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePrev = () => setCurrentPage((p) => (p > 1 ? p - 1 : totalPages));

  const handleNext = () => setCurrentPage((p) => (p < totalPages ? p + 1 : 1));

  return (
    /*
     * Full-height relative container so that absolute children
     * (side arrows, bottom nav) are anchored to this box — not the viewport.
     */
    <div
      className="w-full relative flex flex-col h-full rounded-3xl "
      style={{ backgroundColor: CONTENT_BG }}
    >
      {/* ── INNER HEADER ──────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 pt-0 pb-2 shrink-0"
        style={{ backgroundColor: CONTENT_BG }}
      >
        {/* Lesson title */}
        <h1
          className="text-[26px] font-bold leading-tight mb-4"
          style={{ color: TEXT_COLOR }}
        >
          {title}
        </h1>

        {/* Module / Chapter indicator */}
        <div className="text-right leading-tight flex flex-col items-start text-base">
          <p className=" font-semibold" style={{ color: TEXT_COLOR }}>
            Module {moduleNum}
          </p>
          <p className="" style={{ color: MUTED }}>
            Chapter {chapterNum}
          </p>
        </div>
      </div>

      {/* ── SCROLLABLE READING AREA ───────────────────────────────────── */}
      {/*
       * padding-bottom accounts for the fixed bottom nav height (~56px)
       * padding-x accounts for the side arrow buttons (~28px wide).
       */}
      <div
        className="flex-1 overflow-y-auto px-10 pt-1 pb-16"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Dynamic content blocks */}
        {blocks.map((block, index) =>
          block.type === "snippet" ? (
            <SnippetBlock
              key={index}
              content={block.content}
              language={block.language}
            />
          ) : (
            <ParagraphBlock key={index} content={block.content} />
          ),
        )}
      </div>

      {/* ── FLOATING SIDE ARROWS ─────────────────────────────────────── */}
      <SideArrows onPrev={handlePrev} onNext={handleNext} />

      {/* ── FIXED BOTTOM NAV ─────────────────────────────────────────── */}
      <BottomNav
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
