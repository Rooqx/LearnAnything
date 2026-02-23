"use client";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const TEXT_PRIMARY = "#121212";
const USER_BUBBLE_BG = "#EADBFF"; // matches Course Card 2 (purple)
const AI_BUBBLE_BG = "#DDFCE2"; // matches Course Card 3 (green)

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

/** Cycled through for demo/mock AI responses */
export const AI_REPLIES = [
  "Certainly! UX Design focuses on the overall experience on the design and inserted with elements manuals, marketings, and implement revicate are strumbling experience. UX Design terom specificsmous understand ethical principles, and design and design ars and nousomenns in healthcare.",
  "That's a great question! Let me break that down for you in a structured and easy-to-follow way.",
  "Great point! Here's how you can think about this concept step by step.",
];

// ─── Component ─────────────────────────────────────────────────────────────────

interface ChatBubbleProps {
  message: Message;
}

/**
 * ChatBubble
 *
 * Renders a single message bubble for the AI Tutor Chat view.
 * Reusable in any chat context across the app.
 *
 * - User messages: right-aligned, purple (#EADBFF), tight bottom-right radius
 * - AI messages:   left-aligned,  green  (#DDFCE2), tight bottom-left radius
 */
export default function ChatBubble({ message }: ChatBubbleProps) {
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
