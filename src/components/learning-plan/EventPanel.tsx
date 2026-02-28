"use client";

import { Clock, Music, MapPin } from "lucide-react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const MUTED = "#6B7280";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface EventItem {
  id: number;
  type: string;
  typeIcon: "avatar" | "music" | "pin";
  date: string;
  title: string;
  description: string;
  bgColor: string;
  badge?: string;
}

// ─── Static Data ───────────────────────────────────────────────────────────────

const EVENTS: EventItem[] = [
  {
    id: 1,
    type: "Webinar",
    typeIcon: "avatar",
    date: "Tu, 25.03",
    title: "Department Meeting",
    description:
      "critical appraisal skills, and applying evidence-based guidelines in practice",
    bgColor: "#E2F6F8",
    badge: "Start at 12:30",
  },
  {
    id: 2,
    type: "Lesson",
    typeIcon: "music",
    date: "We, 26.03",
    title: "Final Review",
    description:
      "Overview healt, policy, and their impact on patient care.",
    bgColor: "#EADBFF",
  },
  {
    id: 3,
    type: "Task",
    typeIcon: "pin",
    date: "Th, 27.03",
    title: "Submit Final Grades",
    description:
      "Examination of mfecious diseases, non-communicable diseases, and healthcare disparities.",
    bgColor: "#FEF9C3",
  },
];

// ─── Helper: Type Icon ─────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: EventItem["typeIcon"] }) {
  const size = 16;
  const sw = 1.6;

  switch (type) {
    case "avatar":
      return (
        <div
          className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center"
        >
          <span className="text-[9px] font-bold text-white">👤</span>
        </div>
      );
    case "music":
      return <Music size={size} color={TEXT_PRIMARY} strokeWidth={sw} />;
    case "pin":
      return <MapPin size={size} color={TEXT_PRIMARY} strokeWidth={sw} />;
  }
}

// ─── Sub-component: Event Card ─────────────────────────────────────────────────

function EventCard({ event }: { event: EventItem }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2 transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: event.bgColor,
        boxShadow: "1px 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header: icon + type + date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TypeIcon type={event.typeIcon} />
          <span
            className="text-[12px] font-semibold"
            style={{ color: TEXT_PRIMARY }}
          >
            {event.type}
          </span>
        </div>
        <span className="text-[11px] font-medium" style={{ color: MUTED }}>
          {event.date}
        </span>
      </div>

      {/* Title */}
      <h4
        className="text-[14px] font-bold leading-snug"
        style={{ color: TEXT_PRIMARY }}
      >
        {event.title}
      </h4>

      {/* Description */}
      <p className="text-[11px] leading-relaxed" style={{ color: MUTED }}>
        {event.description}
      </p>

      {/* Optional badge */}
      {event.badge && (
        <div className="flex items-center gap-1.5 mt-1">
          <Clock size={12} color={MUTED} strokeWidth={2} />
          <span className="text-[11px] font-medium" style={{ color: MUTED }}>
            {event.badge}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Sub-component: Floating Sticky Note ───────────────────────────────────────

function StickyNote() {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2 mt-4 transition-transform duration-300 hover:rotate-0"
      style={{
        backgroundColor: "#DDFCE2",
        boxShadow: "2px 4px 12px rgba(0,0,0,0.08)",
        transform: "rotate(2deg)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={14} color="#2ED573" strokeWidth={2} />
          <span
            className="text-[12px] font-bold"
            style={{ color: TEXT_PRIMARY }}
          >
            Teacher Tools
          </span>
        </div>
        <span className="text-[11px] font-medium" style={{ color: MUTED }}>
          Fr, 28.07
        </span>
      </div>
      <p className="text-[11px] leading-relaxed" style={{ color: MUTED }}>
        Importance of teamwork and communication among healthcare professionals
        for optimal patient outcomes.
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

/**
 * EventPanel
 *
 * Right column of the Learning Plan page.
 * Shows the "My Event" heading, three event cards with pastel
 * backgrounds, and a floating tilted sticky-note "Teacher Tools"
 * card at the bottom.
 */
export default function EventPanel() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2 pb-6">
      {/* Column heading */}
      <h2
        className="text-[22px] font-bold"
        style={{ color: TEXT_PRIMARY }}
      >
        My Event
      </h2>

      {/* Event cards */}
      {EVENTS.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      {/* Floating sticky note */}
      <StickyNote />
    </div>
  );
}
