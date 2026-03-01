"use client";

import { Clock, Calendar, CheckCircle2 } from "lucide-react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const MUTED = "#6B7280";
const ACCENT = "#2ED573";
const CARD_BG = "#FFFFFF";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SummaryStat {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
  bgColor: string;
}

// ─── Static Data ───────────────────────────────────────────────────────────────

const SUMMARY_STATS: SummaryStat[] = [
  {
    icon: Calendar,
    value: 9,
    label: "Courses Generated",
    color: "#7C3AED",
    bgColor: "#EDE9FE",
  },
  {
    icon:  Clock ,
    value: 4,
    label: "Courses in-progress",
    color: "#D97706",
    bgColor: "#FEF3C7",
  },
  {
    icon: CheckCircle2,
    value: 15,
    label: "Courses Completed",
    color: ACCENT,
    bgColor: "#D1F7E0",
  },
];

/** Segmented progress bar data */
const SEGMENTS = [
  { label: "42%", width: 42, color: "#7C3AED" },
  { label: "15%", width: 15, color: "#D97706" },
  { label: "56%", width: 56, color: ACCENT },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

/**
 * SVG circular progress ring around the avatar.
 * Uses a stroke-dasharray/dashoffset trick for the incomplete ring.
 */
function ProgressRing({ percent }: { percent: number }) {
  const size = 130;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="absolute top-0 left-0 -rotate-90"
    >
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={stroke}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={ACCENT}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700"
      />
    </svg>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * StatisticCard
 *
 * Left column card on the dashboard.
 * Contains: avatar with progress ring, welcome text, activity %,
 * segmented progress bar, and 3 summary stats at the bottom.
 */
export default function StatisticCard() {
  return (
    <div
      className="rounded-3xl p-6 flex flex-col gap-5 h-full"
      style={{
        backgroundColor: CARD_BG,
        boxShadow: "2px 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Header: title + "View all" ────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2
          className="text-[20px] font-bold"
          style={{ color: TEXT_PRIMARY }}
        >
          Statistic
        </h2>
        <button
          className="text-[11px] cursor-pointer font-medium px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-gray-100"
          style={{ backgroundColor: "#F3F4F6", color: MUTED }}
        >
          View all
        </button>
      </div>

      {/* ── Avatar with progress ring ─────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative" style={{ width: 130, height: 130 }}>
          <ProgressRing percent={78} />
          {/* Avatar circle */}
          <div
            className="absolute rounded-full flex items-center justify-center text-[28px] font-bold overflow-hidden"
            style={{
              top: 10,
              left: 10,
              width: 110,
              height: 110,
              backgroundColor: "#E2F6F8",
              color: TEXT_PRIMARY,
            }}
          >
            ET
          </div>
          {/* Beginner badge — overlapping bottom */}
          <span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-3 py-1 rounded-full z-10"
            style={{ backgroundColor: "#D1F7E0", color: ACCENT }}
          >
            Enthusiaist
          </span>
        </div>

        {/* Welcome text */}
        <p
          className="text-[15px] font-semibold text-center"
          style={{ color: TEXT_PRIMARY }}
        >
          Welcome, Tim 👋
        </p>
      </div>

      {/* ── Activity section ──────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span
            className="text-[32px] font-bold leading-none"
            style={{ color: TEXT_PRIMARY }}
          >
            78%
          </span>
          <span className="text-[12px]" style={{ color: MUTED }}>
            Total month activity
          </span>
        </div>

        {/* Segmented progress bar */}
        <div className="flex items-center gap-0.5 w-full">
          {SEGMENTS.map((seg) => (
            <div
              key={seg.color}
              className="h-2 rounded-full"
              style={{
                width: `${seg.width}%`,
                backgroundColor: seg.color,
              }}
            />
          ))}
        </div>

        {/* Segment labels */}
        <div className="flex justify-between items-center gap-4 mt-0.5">
          {SEGMENTS.map((seg) => (
            <span
              key={seg.label}
              className="text-[12px] font-medium"
              style={{ color: seg.color }}
            >
              {seg.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Summary stats row ─────────────────────────────────────── */}
      <div className="flex items-center mt-auto p-2 bg-[#F9f4fa] rounded-xl">
        <div className="bg-white flex items-center w-full rounded-md">
        {SUMMARY_STATS.map((stat) => (
          <>
          <div
            key={stat.label}
            className="w-full flex h-[200px] flex-col justify-between items-center py-6 rounded-2xl"
            style={{ backgroundColor: "", borderStyle: "solid", borderLeftColor: stat.label === "Courses Completed" ? "transparent":"black" }}
          >
            <span className="p-3 rounded-full" 
            style={{background: stat.color}}>
            <stat.icon size={20} color={stat.bgColor} strokeWidth={2} />
            </span>
            <div className="flex flex-col gap-2 items-center justify-center">
            <span
              className="text-[20px] font-bold leading-none"
              style={{ color: TEXT_PRIMARY }}
            >
              {stat.value}
            </span>
            <span className="text-[10px] font-medium text-nowrap" style={{ color: MUTED }}>
              {stat.label}
            </span>
            </div>
          </div>
         {stat.label === "Courses Completed" ? <div className="w-1 rounded-full h-4/5 bg-[black]"/> : <div className="w-1 rounded-full h-4/5 bg-[black]"/>}
          </>
        ))}
      </div>
      </div>
    </div>
  );
}
