"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";
import { LumiAnimated } from "@/components/ux";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  userName?: string;
  isTyping?: boolean;
  children?: React.ReactNode;
}

export function ChatBubble({ message, isUser, userName, isTyping, children }: ChatBubbleProps) {
  return (
    <div className={cn("flex gap-3 py-2", isUser ? "flex-row-reverse" : "flex-row")}>
      {isUser ? <Avatar name={userName || "You"} size="sm" /> : <LumiAnimated state={isTyping ? "thinking" : "idle"} size={36} />}
      <div className={cn("max-w-[80%] rounded-2xl px-4 py-3", isUser ? "bg-[var(--color-primary)] text-white" : "glass")}>
        {isTyping ? (
          <div className="flex gap-1.5 py-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-[var(--color-muted)] animate-typing-dot" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm leading-relaxed">{message}</p>
            {children}
          </>
        )}
      </div>
    </div>
  );
}
