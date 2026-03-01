"use client";

import { ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const MUTED = "#6B7280";
const ACCENT = "#2ED573";
const INACTIVE = "#E5E7EB";

// ─── Static Data ───────────────────────────────────────────────────────────────

interface BarData {
  name: string;
  value: number;
  isActive: boolean;
}

const BAR_DATA: BarData[] = [
  { name: "Engage", value: 42, isActive: false },
  { name: "Grow", value: 55, isActive: false },
  { name: "Skills", value: 87, isActive: true },
  { name: "Rate", value: 38, isActive: false },
];

// ─── Custom Label ──────────────────────────────────────────────────────────────

/** Renders the percentage label above each bar */
function renderLabel(props: { x?: number; y?: number; width?: number; value?: number; index?: number }) {
  const { x = 0, y = 0, width = 0, value = 0, index = 0 } = props;
  const isActive = BAR_DATA[index]?.isActive;
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill={isActive ? ACCENT : MUTED}
      textAnchor="middle"
      fontSize={12}
      fontWeight={isActive ? 700 : 500}
    >
      {value}%
    </text>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * StudyProcess
 *
 * White card with a bar chart (recharts) showing study engagement metrics.
 * The "Skills" bar is highlighted green as the active/tallest bar.
 * Other bars are greyed out with their percentages.
 */
export default function StudyProcess() {
  return (
    <div
      className="rounded-3xl p-6 flex flex-col gap-4 h-full"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "2px 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2
          className="text-[16px] font-bold"
          style={{ color: TEXT_PRIMARY }}
        >
          Study process
        </h2>
        <button
          className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-gray-100"
          style={{ backgroundColor: "#F3F4F6", color: MUTED }}
        >
          Week
          <ChevronDown size={12} strokeWidth={2} />
        </button>
      </div>

      {/* ── Bar Chart ──────────────────────────────────────────────── */}
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={BAR_DATA}
            margin={{ top: 25, right: 10, left: 10, bottom: 5 }}
            barCategoryGap="25%"
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: MUTED, fontWeight: 500 }}
            />
            <YAxis hide domain={[0, 100]} />
            <Bar dataKey="value" radius={[8, 8, 8, 8]} maxBarSize={50}>
              {BAR_DATA.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isActive ? ACCENT : INACTIVE}
                />
              ))}
              <LabelList dataKey="value" content={renderLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
