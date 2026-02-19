import ScoopedFrame from "@/src/components/lessons/ScoopedFrame";
import LessonContent from "@/src/components/lessons/LessonContent";

export default function LessonPage() {
  return (
    <main
      className=" w-full max-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#F0F4F2" }}
    >
      <ScoopedFrame>
        <LessonContent
          title="Title"
          moduleNum={1}
          chapterNum={3}
          totalPages={3}
        />
      </ScoopedFrame>
    </main>
  );
}
