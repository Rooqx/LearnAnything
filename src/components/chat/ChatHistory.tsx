"use client";

import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { CourseSummary } from "@/types";
import { MODE_COLORS } from "@/lib/constants";

interface ChatHistoryProps {
  courses: CourseSummary[];
  onSelect: (courseId: string) => void;
  className?: string;
}

export function ChatHistory({ courses, onSelect, className }: ChatHistoryProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {courses.map((course) => (
        <button
          key={course.id}
          onClick={() => onSelect(course.id)}
          className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-left cursor-pointer transition-colors hover:bg-[var(--color-surface-elevated)]"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{course.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="custom" customColor={MODE_COLORS[course.mode]} size="sm">{course.mode}</Badge>
              <span className="text-xs text-[var(--color-muted)]">{formatDate(course.lastAccessedAt)}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
