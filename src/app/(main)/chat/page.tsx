"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Menu } from "lucide-react";
import { Button, Drawer } from "@/components/ui";
import { AnimatedPage, LumiAnimated } from "@/components/ux";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestionChips } from "@/components/chat/SuggestionChips";
import { ModeSelector } from "@/components/chat/ModeSelector";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { WelcomePrompt } from "@/components/chat/WelcomePrompt";
import { useCourseStore } from "@/store/useCourseStore";
import { useUserStore } from "@/store/useUserStore";
import type { LearningMode } from "@/types";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  showModeSelector?: boolean;
  isTyping?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const displayName = useUserStore((s) => s.profile.displayName);
  const courseList = useCourseStore((s) => s.courseList);
  const { selectedMode, setSelectedMode, setCurrentTopic, setIsGenerating } = useCourseStore();

  const isEmptyState = messages.length === 0;

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), text, isUser: true };
    const typingMsg: ChatMessage = { id: `typing-${Date.now()}`, text: "", isUser: false, isTyping: true };

    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setCurrentTopic(text);

    /* Simulate Lumi response after short delay */
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((m) => !m.isTyping),
        {
          id: `lumi-${Date.now()}`,
          text: `Great choice! "${text}" sounds fascinating. How deep do you want to go?`,
          isUser: false,
          showModeSelector: true,
        },
      ]);
    }, 1200);
  };

  const handleModeSelect = (mode: LearningMode) => {
    setSelectedMode(mode);
    setMessages((prev) => [
      ...prev,
      { id: `gen-${Date.now()}`, text: "Amazing! Building your course now...", isUser: false },
    ]);
    setIsGenerating(true);
    /* TODO: Trigger actual API call and navigate to loading/plan */
  };

  const handleNewCourse = () => {
    setMessages([]);
    setSelectedMode(null);
    setCurrentTopic("");
  };

  return (
    <AnimatedPage>
      <div className="flex h-[calc(100dvh-4rem)] md:h-[calc(100dvh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-[280px] md:flex-col md:border-r md:border-[var(--color-border)] md:bg-[var(--color-surface)]/50">
          <div className="p-4">
            <Button variant="primary" fullWidth leftIcon={<Plus size={18} />} onClick={handleNewCourse}>New Course</Button>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            <ChatHistory courses={courseList} onSelect={() => {}} />
          </div>
          <div className="flex items-center justify-center p-4 border-t border-[var(--color-border)]">
            <LumiAnimated state="idle" size={36} />
            <span className="ml-2 text-xs text-[var(--color-muted)]">Powered by AI</span>
          </div>
        </aside>

        {/* Mobile Drawer */}
        <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Courses">
          <div className="p-4">
            <Button variant="primary" fullWidth leftIcon={<Plus size={18} />} onClick={() => { handleNewCourse(); setDrawerOpen(false); }}>New Course</Button>
          </div>
          <div className="px-2">
            <ChatHistory courses={courseList} onSelect={() => setDrawerOpen(false)} />
          </div>
        </Drawer>

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Mobile header */}
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 md:hidden">
            <button onClick={() => setDrawerOpen(true)} className="cursor-pointer text-[var(--color-muted)]"><Menu size={22} /></button>
            <span className="font-heading text-sm font-semibold">New Course</span>
          </div>

          {isEmptyState ? (
            /* Empty state */
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
              <WelcomePrompt />
              <ChatInput onSend={handleSend} className="w-full max-w-[640px]" />
              <SuggestionChips onSelect={handleSend} className="max-w-[640px] justify-center" />
            </div>
          ) : (
            /* Active chat */
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} userName={displayName} isTyping={msg.isTyping}>
                    {msg.showModeSelector && (
                      <ModeSelector selectedMode={selectedMode} onSelect={handleModeSelect} disabled={!!selectedMode} />
                    )}
                  </ChatBubble>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t border-[var(--color-border)] p-4">
                <ChatInput onSend={handleSend} disabled={!!selectedMode} className="max-w-[640px] mx-auto" />
              </div>
            </>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
