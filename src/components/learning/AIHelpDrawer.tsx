"use client";

import { Drawer } from "@/components/ui";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";

interface AIHelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Mini chat drawer for in-lesson AI questions */
export function AIHelpDrawer({ isOpen, onClose }: AIHelpDrawerProps) {
  const handleSend = (message: string) => {
    /* TODO: Send message to AI help endpoint with current page context */
    console.log("AI Help:", message);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="right" title="Ask Lumi">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <ChatBubble message="Hey! I'm here to help with this lesson. What's on your mind?" isUser={false} />
        </div>
        <div className="border-t border-[var(--color-border)] p-4">
          <ChatInput onSend={handleSend} placeholder="Ask about this lesson..." />
        </div>
      </div>
    </Drawer>
  );
}
