"use client";

import Link from "next/link";
import { Card, Badge, ProgressBar } from "@/components/ui";
import { useCourseStore } from "@/store/useCourseStore";
import { formatDate } from "@/lib/utils";
import { MODE_COLORS } from "@/lib/constants";

export function RecentCourses({ className }: { className?: string }) {
  const courses = useCourseStore((s) => s.courseList).slice(0, 4);

  if (courses.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="mb-3 font-heading text-lg font-semibold">Recent Courses</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hidden">
        {courses.map((course) => (
          <Link key={course.id} href={`/learn/${course.id}`} className="min-w-[220px] cursor-pointer">
            <Card hoverable clickable className="w-full">
              <h4 className="font-heading text-sm font-semibold line-clamp-2">{course.title}</h4>
              <Badge variant="custom" customColor={MODE_COLORS[course.mode]} size="sm" className="mt-2">{course.mode}</Badge>
              <ProgressBar value={course.progress} height="sm" className="mt-3" color={MODE_COLORS[course.mode]} />
              <p className="mt-2 text-xs text-[var(--color-muted)]">{formatDate(course.lastAccessedAt)}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
