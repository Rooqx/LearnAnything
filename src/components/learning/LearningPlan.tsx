"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Code, Calculator, Play } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { LumiAnimated, StaggerChildren } from "@/components/ux";
import { cn, formatDuration } from "@/lib/utils";
import { MODE_COLORS } from "@/lib/constants";
import type { Course, ContentBlockType } from "@/types";

const contentIcons: Record<string, React.ElementType> = { text: BookOpen, "bullet-list": BookOpen, code: Code, math: Calculator, video: Play, image: BookOpen };

interface LearningPlanProps {
  course: Course;
  onBegin: () => void;
}

export function LearningPlan({ course, onBegin }: LearningPlanProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold">{course.title}</h1>
        <div className="mt-3 flex items-center justify-center gap-3">
          <Badge variant="custom" customColor={MODE_COLORS[course.mode]}>{course.mode}</Badge>
          <span className="text-sm text-[var(--color-muted)]">{formatDuration(course.totalTime)}</span>
        </div>
      </div>

      <StaggerChildren className="space-y-3">
        {course.modules.map((mod) => (
          <div key={mod.id} className="glass rounded-[var(--radius-lg)] overflow-hidden">
            <button onClick={() => toggleModule(mod.id)} className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[var(--color-surface-elevated)]/50 transition-colors">
              <div className="flex items-center gap-3">
                {expandedModules.has(mod.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <div className="text-left">
                  <p className="font-heading text-sm font-semibold">Module {mod.order + 1}: {mod.title}</p>
                  <p className="text-xs text-[var(--color-muted)]">{formatDuration(mod.estimatedTime)} · {mod.pages.length} pages</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {mod.contentTypes.map((type) => { const Icon = contentIcons[type] || BookOpen; return <Icon key={type} size={14} className="text-[var(--color-muted)]" />; })}
              </div>
            </button>
            {expandedModules.has(mod.id) && (
              <div className="border-t border-[var(--color-border)] px-5 py-3 space-y-1">
                {mod.pages.map((page) => (
                  <p key={page.id} className="text-sm text-[var(--color-text-secondary)] py-1 pl-8">{page.title}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </StaggerChildren>

      <div className="mt-8 flex flex-col items-center gap-4">
        <LumiAnimated state="excited" size={64} />
        <p className="text-sm text-[var(--color-muted)]">You&apos;ve got this! Let&apos;s go.</p>
        <Button variant="primary" size="lg" onClick={onBegin}>Begin Learning</Button>
      </div>
    </div>
  );
}
