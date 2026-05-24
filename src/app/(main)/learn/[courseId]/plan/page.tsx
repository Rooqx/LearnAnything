"use client";

import { useRouter } from "next/navigation";
import { AnimatedPage } from "@/components/ux";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LearningPlan } from "@/components/learning/LearningPlan";
import { useCourseStore } from "@/store/useCourseStore";
import { EmptyState } from "@/components/ui";
import { LumiAnimated } from "@/components/ux";

export default function LearningPlanPage({ params }: { params: Promise<{ courseId: string }> }) {
  const router = useRouter();
  const activeCourse = useCourseStore((s) => s.activeCourse);

  if (!activeCourse) {
    return (
      <AnimatedPage>
        <PageWrapper>
          <EmptyState
            title="No course loaded"
            description="Generate a course from the chat to see the learning plan."
            ctaLabel="Go to Chat"
            ctaOnClick={() => router.push("/chat")}
            icon={<LumiAnimated state="idle" size={80} />}
          />
        </PageWrapper>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <PageWrapper>
        <LearningPlan course={activeCourse} onBegin={() => router.push(`/learn/${activeCourse.id}`)} />
      </PageWrapper>
    </AnimatedPage>
  );
}
