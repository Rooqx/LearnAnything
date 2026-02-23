"use client";

import { useState, useRef, useEffect } from "react";

import PillInput from "@/src/components/ui/PillInput";
import ChatBubble, {
  Message,
  AI_REPLIES,
} from "@/src/components/ui/ChatBubble";
import CourseCard, { COURSES } from "@/src/components/dashboard/CourseCard";
import {
  FloatingNavRail,
  WaveDivider,
} from "@/src/components/dashboard/DashboardNav";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const LEFT_BG = "#F9FBFA";
const RIGHT_BG = "#F2F4F3";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CreateCourseProps {
  /**
   * Optional server action injected from page.tsx.
   * Receives the stable sessionID and the user's message.
   * When omitted, the component works in demo/mock-only mode.
   */
  onSend?: (params: { sessionID: string; msg: string }) => Promise<void>;
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * CreateCourse
 *
 * Slim orchestration shell for the two-pane dashboard layout.
 * All sub-components live in their own dedicated files:
 *
 *  - ChatBubble              → src/components/ui/ChatBubble.tsx
 *  - CourseCard              → src/components/dashboard/CourseCard.tsx
 *  - FloatingNavRail + WaveDivider → src/components/dashboard/DashboardNav.tsx
 *
 * This file owns only:
 *  - Chat state (messages, isChatMode)
 *  - A stable sessionId for the entire browser session
 *  - Event handlers (handleCoursePrompt, handleChatMessage, appendAiReply)
 *  - The two-pane layout JSX
 *
 * Data flow:
 *  page.tsx  →  onSend (server action)  →  CreateCourse  →  PillInput.onSubmit
 */
export default function CreateCourse({ onSend }: CreateCourseProps) {
  // ── State ─────────────────────────────────────────────────────────────────

  /** All messages in the current chat session */
  const [messages, setMessages] = useState<Message[]>([]);

  /** Toggles the right pane between create mode and chat mode */
  const [isChatMode, setIsChatMode] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────

  /**
   * Stable session identifier — generated once when the component mounts
   * and reused for every message in this browser session.
   * Passed to the server action so the backend can correlate messages.
   */
  const sessionId = crypto.randomUUID();
  console.log(sessionId);

  /** Cycles through AI_REPLIES for variety in demo responses */
  const replyIndexRef = useRef(0);

  /** Invisible anchor div — scrolled into view on every new message */
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Effects ───────────────────────────────────────────────────────────────

  /** Auto-scroll to the latest message whenever messages change */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  /**
   * Fires when the user submits the initial "Create New Course" prompt.
   * Seeds the first user message, switches to chat mode, fires the server
   * action (if wired up), then appends a mock AI reply for local feedback.
   */
  const handleCoursePrompt = async (prompt: string) => {
    const firstMessage: Message = {
      id: Date.now(),
      role: "user",
      content: prompt,
    };

    setMessages([firstMessage]);
    setIsChatMode(true);

    // ── Send to server action ──────────────────────────────────────────────
    await onSend?.({ sessionID: sessionId, msg: prompt });

    appendAiReply();
  };

  /**
   * Fires when the user sends a follow-up message inside chat mode.
   * Appends the user message, fires the server action, then schedules
   * a mock AI reply for local feedback while waiting for a real response.
   */
  const handleChatMessage = async (message: string) => {
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMsg]);

    // ── Send to server action ──────────────────────────────────────────────
    await onSend?.({ sessionID: sessionId, msg: message });

    appendAiReply();
  };

  /**
   * Appends a mock AI response after an 800ms delay to simulate
   * a network round-trip. Cycles through AI_REPLIES for variety.
   * Replace or extend this once the real API response is wired up.
   */
  const appendAiReply = () => {
    setTimeout(() => {
      const reply = AI_REPLIES[replyIndexRef.current % AI_REPLIES.length];
      replyIndexRef.current += 1;
      const aiMsg: Message = {
        id: Date.now(),
        role: "ai",
        content: reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative flex justify-between h-full gap-10 overflow-hidden">
      {/* ── FLOATING NAV RAIL ───────────────────────────────────────────────
          Anchored to the left edge, provides primary dashboard navigation.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="pl-5 pt-5 shrink-0">
        <FloatingNavRail />
      </div>

      {/* ── LEFT PANE — Courses ─────────────────────────────────────────────
          Scrollable list of existing course cards. Width is fixed at 30%
          to maintain the two-column split proportion.
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

      {/* ── WAVE DIVIDER ────────────────────────────────────────────────────
          Organic SVG swoosh at the top of the column boundary.
      ──────────────────────────────────────────────────────────────────── */}
      <WaveDivider leftColor={LEFT_BG} rightColor={RIGHT_BG} />

      {/* ── RIGHT PANE ──────────────────────────────────────────────────────
          Switches between two views based on isChatMode:
            • false → "Create New Course" with a centred prompt input
            • true  → "AI Tutor Chat" with scrollable bubbles + bottom input
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col pt-5 px-15 pb-6 min-h-0 overflow-hidden rounded-tl-3xl"
        style={{ backgroundColor: RIGHT_BG }}
      >
        {/* Heading updates to reflect the active mode */}
        <h2
          className="text-[22px] font-bold mb-4 shrink-0"
          style={{ color: TEXT_PRIMARY }}
        >
          {isChatMode ? "AI Tutor Chat" : "Create New Course"}
        </h2>

        {isChatMode ? (
          /* ── CHAT VIEW ───────────────────────────────────────────────────
              Scrollable message history fills available space.
              PillInput is pinned to the bottom via shrink-0.
          ────────────────────────────────────────────────────────────── */
          <>
            {/* Scrollable message list */}
            <div
              className="flex-1 overflow-y-auto pr-2 min-h-0"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#D1D5DB transparent",
              }}
            >
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {/* Auto-scroll anchor */}
              <div ref={chatEndRef} />
            </div>

            {/* Bottom-pinned message input */}
            <div className="shrink-0 pt-3">
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
          /* ── CREATE VIEW ─────────────────────────────────────────────────
              Vertically and horizontally centres the course prompt input.
          ────────────────────────────────────────────────────────────── */
          <div className="flex-1 flex items-center justify-center">
            <PillInput
              placeholder="Enter what u would like to learn"
              buttonLabel="SEND"
              buttonColor="#121212"
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
