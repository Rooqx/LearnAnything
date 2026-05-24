"use client";

import { ContentRenderer } from "./ContentRenderer";
import type { CoursePage } from "@/types";

/** Single content page unit inside the learning swipe container */
export function LearningPage({ page }: { page: CoursePage }) {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-6">
      <h2 className="font-heading text-xl font-semibold mb-6">{page.title}</h2>
      <div className="space-y-4">
        {page.content.map((block) => (
          <ContentRenderer key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}
