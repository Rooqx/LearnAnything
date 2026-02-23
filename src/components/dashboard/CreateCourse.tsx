"use client";

import {
  Bell,
  Plus,
  Minus,
  MoreHorizontal,
  X,
  Menu,
  LayoutGrid,
  UserCircle2,
  Check,
} from "lucide-react";
import PillInput from "@/src/components/ui/PillInput";
import { useState, useRef, useEffect } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const MUTED = "#6B7280";
const ACCENT = "#2ED573";

// Chat bubble colours — intentionally reuse the course card palette
const USER_BUBBLE_BG = "#EADBFF"; // matches Card 2 (purple)
const AI_BUBBLE_BG = "#DDFCE2"; // matches Card 3 (green)

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

// Mock AI replies — cycled through for demo purposes
const AI_REPLIES = [
  "Certainly! UX Design focuses on the overall experience on the design and inserted with elements manuals, marketings, and implement revicate are strumbling experience. UX Design terom specificsmous understand ethical principles, and design and design ars and nousomenns in healthcare.",
  "That's a great question! Let me break that down for you in a structured and easy-to-follow way.",
  "Great point! Here's how you can think about this concept step by step.",
];

// ─── Static Data ───────────────────────────────────────────────────────────────

interface Course {
  id: number;
  title: string;
  description: string;
  bgColor: string;
  status: string;
  statusEmoji: string;
  badgeBg: string;
  badgeText: string;
}

const COURSES: Course[] = [
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

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * ChatBubble
 *
 * Renders a single message bubble inside the AI Tutor Chat view.
 *
 * - User messages: right-aligned, purple (#EADBFF), tight bottom-right radius
 * - AI messages:   left-aligned,  green  (#DDFCE2), tight bottom-left radius
 */
function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full mb-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className="max-w-[75%] px-4 py-3 text-[13px] leading-relaxed"
        style={{
          backgroundColor: isUser ? USER_BUBBLE_BG : AI_BUBBLE_BG,
          color: TEXT_PRIMARY,
          // Tighter corner on the "speaker" side to indicate message origin
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

/**
 * CourseCard
 *
 * Reusable card displaying a single course entry.
 * Each card has a coloured background, title, description,
 * a status badge, and three action buttons (more, close-light, close-dark).
 */
function CourseCard({ course }: { course: Course }) {
  return (
    <div
      className="rounded-2xl  mb-4 flex flex-col gap-3 w-[90%] p-2 shadow-[2px_3px_10px_rgba(0,0,0,0.1)]"
      style={{ backgroundColor: course.bgColor }}
    >
      {/* curve in efect container */}
      <div className=" p-8 w-full h-full bg-linear-to-r from-[rgba(255,255,255,0.5)] to-[#E5E7E] rounded-2xl">
        {/* Title */}
        <h3
          className="text-[16px] md:text-[18px] font-bold leading-snug"
          style={{ color: TEXT_PRIMARY }}
        >
          {course.title}
        </h3>

        {/* Description */}
        <p
          className="text-[12px] md:text-[14px] leading-relaxed"
          style={{ color: MUTED }}
        >
          {course.description}
        </p>

        {/* Footer row: status badge + action buttons */}
        <div className="flex items-center justify-between">
          {/* Status badge */}
          <span
            className="text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: course.badgeBg, color: course.badgeText }}
          >
            {course.status} {course.statusEmoji}
          </span>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* More options */}
            <button
              title="More options"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white bg-opacity-60 hover:bg-opacity-100 transition-all duration-200"
            >
              <MoreHorizontal size={13} color={TEXT_PRIMARY} strokeWidth={2} />
            </button>

            {/* Light dismiss */}
            <button
              title="Dismiss"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white bg-opacity-60 hover:bg-opacity-100 transition-all duration-200"
            >
              <X size={13} color={TEXT_PRIMARY} strokeWidth={2.5} />
            </button>

            {/* Dark remove */}
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

/**
 * FloatingNavRail
 *
 * Vertical floating navigation rail anchored to the left edge
 * of the content area. Contains three visual groups:
 *  - Top pill:    active icon, hamburger menu, grid view
 *  - Middle:      bell notification icon with badge
 *  - Bottom pill: zoom-in (+) and zoom-out (-) controls
 */
function FloatingNavRail() {
  return (
    <div className="flex flex-col justify-between items-center gap-4 h-4/5 ">
      {/* Top pill — primary nav icons */}
      <div
        className="flex flex-col items-center gap-3 px-2 py-3 rounded-2xl"
        style={{ backgroundColor: TEXT_PRIMARY }}
      >
        {/* Active state indicator — filled circle */}
        <button
          title="Profile"
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#F9FBFA" }}
        >
          <UserCircle2 size={16} color={TEXT_PRIMARY} strokeWidth={1.8} />
        </button>

        {/* Hamburger menu */}
        <button
          title="Menu"
          className="w-8 h-8 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
        >
          <Menu size={16} color="#F9FBFA" strokeWidth={1.8} />
        </button>

        {/* Grid / apps view */}
        <button
          title="Grid View"
          className="w-8 h-8 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
        >
          <LayoutGrid size={16} color="#F9FBFA" strokeWidth={1.8} />
        </button>
      </div>

      {/* Bottom pill — zoom controls */}
      <div
        className="flex flex-col items-center px-2 py-2 rounded-2xl gap-1"
        style={{ backgroundColor: TEXT_PRIMARY }}
      >
        {/* Bell with green notification badge */}
        <div className="relative">
          <button
            title="Notifications"
            className="w-8 h-8 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-200"
          >
            <Bell size={20} color={"white"} strokeWidth={1.8} />
          </button>

          {/* Badge */}
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{ backgroundColor: ACCENT, color: TEXT_PRIMARY }}
          >
            25
          </span>
        </div>
        <button
          title="Zoom In"
          className="w-8 h-8 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-200"
        >
          <Plus size={16} color="#F9FBFA" strokeWidth={2} />
        </button>

        {/* Divider */}
        <div
          className="w-5 h-px"
          style={{ backgroundColor: "rgba(249,251,250,0.2)" }}
        />

        <button
          title="Zoom Out"
          className="w-8 h-8 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-200"
        >
          <Minus size={16} color="#F9FBFA" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

/**
 * WaveDivider
 *
 * An absolutely-positioned inline SVG that sits at the junction of
 * the left and right panes, near the top of the content area.
 * Instead of a hard vertical line, it renders an organic S-curve /
 * swoosh that blends the column divider into the dark header above.
 *
 * The left side of the SVG is filled with the left pane colour and
 * the right side with the right pane colour, producing a smooth
 * curved boundary between the two columns.
 */
function WaveDivider({
  leftColor,
  rightColor,
}: {
  leftColor: string;
  rightColor: string;
}) {
  return (
    <div
      className="absolute top-0 z-10 pointer-events-none"
      style={{ left: "calc(40% - 30px)", width: "60px", height: "100px" }}
    >
      <svg
        viewBox="0 0 60 100"
        width="60"
        height="100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/*
          Left fill: fills the area to the left of the swoosh curve.
          Path traces the left and bottom edges, then the curve back up.
        */}
        <path d="M0,0 L0,100 L60,100 C20,100 40,0 30,0 Z" fill={leftColor} />

        {/*
          Right fill: fills the area to the right of the swoosh curve.
          Mirror of the left path to complete the divider visual.
        */}
        <path d="M30,0 C40,0 20,100 60,100 L60,0 Z" fill={rightColor} />
      </svg>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * CreateCourse
 *
 * Two-pane dashboard layout:
 *  - Left pane  (~40%): scrollable list of existing course cards
 *  - Right pane (~60%): switches between two states:
 *      1. "create" — centred prompt input for generating a new course
 *      2. "chat"   — AI Tutor Chat with scrollable message history
 *
 * A floating nav rail sits on the far left edge, and a wave SVG
 * divider provides the organic column boundary described in the spec.
 */
export default function CreateCourse() {
  const LEFT_BG = "#F9FBFA";
  const RIGHT_BG = "#F2F4F3";

  // ── State ──────────────────────────────────────────────────────────────────

  /** All messages in the current chat session */
  const [messages, setMessages] = useState<Message[]>([]);

  /** Tracks whether the right pane is in chat mode or create mode */
  const [isChatMode, setIsChatMode] = useState(false);

  /** Counter used to cycle through mock AI replies for demo purposes */
  const replyIndexRef = useRef(0);

  /** Ref attached to an invisible div at the bottom of the chat list */
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Effects ────────────────────────────────────────────────────────────────

  /** Auto-scroll to the latest message whenever the messages array changes */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Fires when the user submits the "Create New Course" prompt.
   * Adds the first user message, switches to chat mode, then
   * appends a mock AI reply after a short delay.
   */
  const handleCoursePrompt = (prompt: string) => {
    const firstMessage: Message = {
      id: Date.now(),
      role: "user",
      content: prompt,
    };
    setMessages([firstMessage]);
    setIsChatMode(true);
    appendAiReply();
  };

  /**
   * Fires when the user sends a follow-up message inside chat mode.
   * Appends the user message then schedules a mock AI reply.
   */
  const handleChatMessage = (message: string) => {
    const userMsg: Message = { id: Date.now(), role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    appendAiReply();
  };

  /**
   * Appends a mock AI message after an 800ms delay to simulate
   * a network round-trip. Cycles through AI_REPLIES for variety.
   */
  const appendAiReply = () => {
    setTimeout(() => {
      const reply = AI_REPLIES[replyIndexRef.current % AI_REPLIES.length];
      replyIndexRef.current += 1;
      const aiMsg: Message = { id: Date.now(), role: "ai", content: reply };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="relative flex justify-between h-full gap-10 overflow-hidden">
      {/* ── FLOATING NAV RAIL ─────────────────────────────────────────────
          Absolute-positioned on the left edge, vertically centred.
          Floats above both panes via z-index.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="pl-5 pt-5 shrink-0">
        <FloatingNavRail />
      </div>

      {/* ── LEFT PANE — Courses ───────────────────────────────────────────
          Scrollable list of course cards.
          Left padding accounts for the floating nav rail width (~60px).
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className="w-[30%] flex flex-col items-center min-h-0 overflow-y-auto pt-5 pb-30"
        style={{ backgroundColor: LEFT_BG, scrollbarWidth: "none" }}
      >
        <h2
          className="text-[22px] font-bold mb-5 flex justify-start w-full ml-8"
          style={{ color: TEXT_PRIMARY }}
        >
          Courses
        </h2>

        {COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* ── RIGHT PANE ────────────────────────────────────────────────────
          Conditionally renders one of two views depending on isChatMode:
            - CREATE view: centred prompt input (initial state)
            - CHAT view:   scrollable message history + bottom input bar
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col pt-5 px-15 pb-6 min-h-0 overflow-hidden rounded-tl-3xl"
        style={{ backgroundColor: RIGHT_BG }}
      >
        {/* Heading changes with the active mode */}
        <h2
          className="text-[22px] font-bold mb-4 shrink-0"
          style={{ color: TEXT_PRIMARY }}
        >
          {isChatMode ? "AI Tutor Chat" : "Create New Course"}
        </h2>

        {isChatMode ? (
          /* ── CHAT VIEW ─────────────────────────────────────────────────
              Fills remaining height with a scrollable bubble list and
              pins the PillInput to the bottom of the pane.
          ────────────────────────────────────────────────────────────── */
          <>
            {/* Scrollable message history */}
            <div
              className="flex-1 overflow-y-auto pr-2 mb-0 min-h-0"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#D1D5DB transparent",
              }}
            >
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {/* Invisible anchor — scrolled into view on new messages */}
              <div ref={chatEndRef} />
            </div>

            {/* Bottom-pinned chat input */}
            <div className="shrink-0">
              <PillInput
                placeholder="Type your message here"
                buttonLabel="SEND"
                buttonColor="#F97316"
                buttonTextColor="#ffffff"
                onSubmit={handleChatMessage}
                className="w-full shadow-md"
              />
            </div>
          </>
        ) : (
          /* ── CREATE VIEW ───────────────────────────────────────────────
              Vertically and horizontally centres the course prompt input.
          ────────────────────────────────────────────────────────────── */
          <div className="flex-1 flex items-center justify-center">
            <PillInput
              placeholder="Enter what u would like to learn"
              buttonLabel="SEND"
              buttonColor="#F97316"
              buttonTextColor="#ffffff"
              onSubmit={handleCoursePrompt}
              className="w-full max-w-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}
