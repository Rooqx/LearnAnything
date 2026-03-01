"use client";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Stat {
  value: number;
  label: string;
  emoji?: string;
  bgColor: string;
}

// ─── Static Data ───────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { value: 26, label: "Total Chapters", bgColor: "#E2F6F8" },
  { value: 2, label: "Completed", emoji: "🥳", bgColor: "#D1F7E0" },
  { value: 23, label: "Not Completed", bgColor: "#FFFFFF" },
];

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * StatCards
 *
 * Horizontal row of three pill-shaped stat indicators displayed
 * above the chapters list. Each card shows a large number,
 * a label, and optionally an emoji.
 */
export default function StatCards() {
  return (
    <div className="flex justify-center items-center gap-3 w-full">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-2xl shadow-[1px_2px_6px_rgba(0,0,0,0.1)]"
          style={{ backgroundColor: stat.bgColor }}
        >
          <div className="flex items-center gap-1">
            <span
              className="text-[22px] font-bold leading-none text-nowrap"
              style={{ color: TEXT_PRIMARY }}
            >
              {stat.value}
            </span>
            {stat.emoji && (
              <span className="text-[14px]">{stat.emoji}</span>
            )}
          </div>
          <span className="text-[11px] text-gray-500 text-nowrap font-medium mt-1">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
