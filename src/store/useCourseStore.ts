import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Course, CourseSummary, LearningMode } from "@/types";

/* ============================================================
   Course Store
   Manages active course state, course list, learning mode,
   current page/module index, and loading/error states.
   Persisted so users can resume where they left off.
   ============================================================ */

interface CourseStoreState {
  /** The currently active course being learned */
  activeCourse: Course | null;
  /** List of all user's courses (summaries for list views) */
  courseList: CourseSummary[];
  /** Selected learning mode for course generation */
  selectedMode: LearningMode | null;
  /** Topic entered by the user in chat */
  currentTopic: string;
  /** Loading state during course generation */
  isGenerating: boolean;
  /** Error message from course generation */
  generationError: string | null;
}

interface CourseStoreActions {
  /** Set the active course for learning */
  setActiveCourse: (course: Course) => void;

  /** Clear the active course (e.g. when navigating away) */
  clearActiveCourse: () => void;

  /** Update the active course's progress (module/page index) */
  updateProgress: (moduleIndex: number, pageIndex: number) => void;

  /** Mark the active course as completed */
  completeCourse: () => void;

  /** Set the selected learning mode */
  setSelectedMode: (mode: LearningMode | null) => void;

  /** Set the current topic */
  setCurrentTopic: (topic: string) => void;

  /** Set generating state */
  setIsGenerating: (isGenerating: boolean) => void;

  /** Set generation error */
  setGenerationError: (error: string | null) => void;

  /** Add a course to the list */
  addCourseToList: (summary: CourseSummary) => void;

  /** Update a course in the list */
  updateCourseInList: (id: string, updates: Partial<CourseSummary>) => void;

  /** Reset chat state for a new course generation */
  resetChatState: () => void;
}

export const useCourseStore = create<CourseStoreState & CourseStoreActions>()(
  persist(
    (set, get) => ({
      /* ---------- Default State ---------- */
      activeCourse: null,
      courseList: [],
      selectedMode: null,
      currentTopic: "",
      isGenerating: false,
      generationError: null,

      /* ---------- Actions ---------- */

      setActiveCourse: (course) => set({ activeCourse: course }),

      clearActiveCourse: () => set({ activeCourse: null }),

      updateProgress: (moduleIndex, pageIndex) => {
        const course = get().activeCourse;
        if (!course) return;

        /* Calculate overall progress percentage based on module and page position */
        const totalPages = course.modules.reduce(
          (sum, mod) => sum + mod.pages.length,
          0
        );
        const pagesCompleted =
          course.modules
            .slice(0, moduleIndex)
            .reduce((sum, mod) => sum + mod.pages.length, 0) + pageIndex;
        const progress = Math.round((pagesCompleted / totalPages) * 100);

        set({
          activeCourse: {
            ...course,
            currentModuleIndex: moduleIndex,
            currentPageIndex: pageIndex,
            progress,
            lastAccessedAt: new Date().toISOString(),
          },
        });

        /* Also update the course list entry */
        get().updateCourseInList(course.id, { progress });
      },

      completeCourse: () => {
        const course = get().activeCourse;
        if (!course) return;

        set({
          activeCourse: {
            ...course,
            isCompleted: true,
            progress: 100,
          },
        });

        get().updateCourseInList(course.id, {
          isCompleted: true,
          progress: 100,
        });
      },

      setSelectedMode: (mode) => set({ selectedMode: mode }),

      setCurrentTopic: (topic) => set({ currentTopic: topic }),

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      setGenerationError: (error) => set({ generationError: error }),

      addCourseToList: (summary) =>
        set((state) => ({
          courseList: [summary, ...state.courseList],
        })),

      updateCourseInList: (id, updates) =>
        set((state) => ({
          courseList: state.courseList.map((course) =>
            course.id === id ? { ...course, ...updates } : course
          ),
        })),

      resetChatState: () =>
        set({
          selectedMode: null,
          currentTopic: "",
          isGenerating: false,
          generationError: null,
        }),
    }),
    {
      name: "la-course",
      /* Only persist course list and active course, not transient chat state */
      partialize: (state) => ({
        activeCourse: state.activeCourse,
        courseList: state.courseList,
      }),
    }
  )
);
