/* ============================================================
   Course Store
   Manages the active course state, page navigation,
   loading/error states for course generation, and
   the list of all user courses.
   ============================================================ */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course, LearningMode } from '@/types';

interface CourseState {
  /** All courses created by the user */
  courses: Course[];

  /** Currently active course being learned */
  activeCourse: Course | null;

  /** Current page index within the active course (flat across all modules) */
  currentPageIndex: number;

  /** Current module index within the active course */
  currentModuleIndex: number;

  /** Selected learning mode for course generation */
  selectedMode: LearningMode | null;

  /** Whether a course is currently being generated */
  isLoading: boolean;

  /** Error message from failed course generation */
  error: string | null;

  /** Topic entered in the chat input */
  currentTopic: string;

  /** Set the topic from chat input */
  setTopic: (topic: string) => void;

  /** Set the selected learning mode */
  setMode: (mode: LearningMode) => void;

  /** Set loading state for course generation */
  setLoading: (loading: boolean) => void;

  /** Set error state for course generation */
  setError: (error: string | null) => void;

  /** Add a newly generated course and set it as active */
  addCourse: (course: Course) => void;

  /** Upsert a course from the DB to keep the store synced and set it as active */
  upsertCourse: (course: Course) => void;

  /** Set a course as the active course for learning */
  setActiveCourse: (courseId: string) => void;

  /** Navigate to the next page within the active course */
  nextPage: () => void;

  /** Navigate to the previous page within the active course */
  prevPage: () => void;

  /** Jump to a specific page index */
  goToPage: (pageIndex: number) => void;

  /** Mark a page as completed and update course progress */
  completePage: () => void;

  /** Mark a specific chapter as completed */
  completeChapter: (courseId: string, chapterId: string, moduleId?: string) => void;

  /** Mark the entire course as completed */
  completeCourse: (courseId: string) => void;

  /** Update last accessed timestamp */
  touchCourse: (courseId: string) => void;

  /** Clear the active course (exit learning interface) */
  clearActiveCourse: () => void;

  /** Reset generation state (topic, mode, loading, error) */
  resetGeneration: () => void;

  /** Set the entire list of courses (e.g. from DB) */
  setCourses: (courses: Course[]) => void;
}

/**
 * Calculate the flat page index from module and page indices.
 * Used to determine overall progress across the course.
 */
function getFlatPageIndex(course: Course, moduleIndex: number, pageIndex: number): number {
  let index = 0;
  for (let i = 0; i < moduleIndex; i++) {
    index += course.modules[i].pages.length;
  }
  return index + pageIndex;
}

/**
 * Calculate module and page indices from a flat page index.
 * Used when navigating to a specific page.
 */
function getModuleAndPageIndex(
  course: Course,
  flatIndex: number
): { moduleIndex: number; pageIndex: number } {
  let remaining = flatIndex;
  for (let i = 0; i < course.modules.length; i++) {
    if (remaining < course.modules[i].pages.length) {
      return { moduleIndex: i, pageIndex: remaining };
    }
    remaining -= course.modules[i].pages.length;
  }
  /* Fallback to last page if index is out of bounds */
  const lastModule = course.modules.length - 1;
  return {
    moduleIndex: lastModule,
    pageIndex: course.modules[lastModule].pages.length - 1,
  };
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],
      activeCourse: null,
      currentPageIndex: 0,
      currentModuleIndex: 0,
      selectedMode: null,
      isLoading: false,
      error: null,
      currentTopic: '',

      setTopic: (topic) => set({ currentTopic: topic }),

      setMode: (mode) => set({ selectedMode: mode }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      addCourse: (course) =>
        set((state) => ({
          courses: [course, ...state.courses],
          activeCourse: course,
          currentPageIndex: 0,
          currentModuleIndex: 0,
          isLoading: false,
          error: null,
        })),

      upsertCourse: (course) =>
        set((state) => {
          const exists = state.courses.some((c) => c.id === course.id);
          const newCourses = exists
            ? state.courses.map((c) => (c.id === course.id ? course : c))
            : [course, ...state.courses];
            
          const isActive = state.activeCourse?.id === course.id;
          
          return {
            courses: newCourses,
            activeCourse: course,
            currentPageIndex: isActive ? state.currentPageIndex : 0,
            currentModuleIndex: isActive ? state.currentModuleIndex : 0,
            isLoading: false,
            error: null,
          };
        }),

      setCourses: (courses) => set({ courses }),

      setActiveCourse: (courseId) => {
        const state = get();
        const course = state.courses.find((c) => c.id === courseId);
        if (course) {
          set({
            activeCourse: course,
            currentPageIndex: 0,
            currentModuleIndex: 0,
          });
        }
      },

      nextPage: () => {
        const state = get();
        if (!state.activeCourse) return;

        const { modules } = state.activeCourse;
        const currentModule = modules[state.currentModuleIndex];

        /* Calculate current page within the module */
        let pageInModule = state.currentPageIndex;
        for (let i = 0; i < state.currentModuleIndex; i++) {
          pageInModule -= modules[i].pages.length;
        }

        if (pageInModule < currentModule.pages.length - 1) {
          /* More pages in current module */
          set({ currentPageIndex: state.currentPageIndex + 1 });
        } else if (state.currentModuleIndex < modules.length - 1) {
          /* Move to next module */
          set({
            currentPageIndex: state.currentPageIndex + 1,
            currentModuleIndex: state.currentModuleIndex + 1,
          });
        }
        /* If at the last page of the last module, do nothing */
      },

      prevPage: () => {
        const state = get();
        if (!state.activeCourse || state.currentPageIndex <= 0) return;

        const { modules } = state.activeCourse;
        const newPageIndex = state.currentPageIndex - 1;

        /* Determine which module the new page index falls in */
        const { moduleIndex } = getModuleAndPageIndex(state.activeCourse, newPageIndex);

        set({
          currentPageIndex: newPageIndex,
          currentModuleIndex: moduleIndex,
        });
      },

      goToPage: (pageIndex) => {
        const state = get();
        if (!state.activeCourse) return;

        const { moduleIndex } = getModuleAndPageIndex(state.activeCourse, pageIndex);

        set({
          currentPageIndex: pageIndex,
          currentModuleIndex: moduleIndex,
        });
      },

      completePage: () =>
        set((state) => {
          if (!state.activeCourse) return state;

          const updatedCourse = {
            ...state.activeCourse,
            completedPages: Math.min(
              state.activeCourse.completedPages + 1,
              state.activeCourse.totalPages
            ),
            lastAccessedAt: new Date().toISOString(),
          };

          return {
            activeCourse: updatedCourse,
            courses: state.courses.map((c) =>
              c.id === updatedCourse.id ? updatedCourse : c
            ),
          };
        }),

      completeChapter: (courseId, chapterId, moduleId) =>
        set((state) => {
          const newCourses = state.courses.map((c) => {
            if (c.id !== courseId) return c;
            
            const newChapterIds = c.completedChapterIds?.includes(chapterId) 
              ? c.completedChapterIds 
              : [...(c.completedChapterIds || []), chapterId];
              
            const newModuleIds = moduleId && !c.completedModuleIds?.includes(moduleId)
              ? [...(c.completedModuleIds || []), moduleId]
              : (c.completedModuleIds || []);
              
            return {
              ...c,
              completedChapterIds: newChapterIds,
              completedModuleIds: newModuleIds,
            };
          });

          return {
            courses: newCourses,
            activeCourse: state.activeCourse?.id === courseId 
              ? newCourses.find(c => c.id === courseId) 
              : state.activeCourse,
          };
        }),

      completeCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  status: 'completed' as const,
                  completedPages: c.totalPages,
                  lastAccessedAt: new Date().toISOString(),
                }
              : c
          ),
        })),

      touchCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId
              ? { ...c, lastAccessedAt: new Date().toISOString() }
              : c
          ),
        })),

      clearActiveCourse: () =>
        set({
          activeCourse: null,
          currentPageIndex: 0,
          currentModuleIndex: 0,
        }),

      resetGeneration: () =>
        set({
          currentTopic: '',
          selectedMode: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'lore-courses',
    }
  )
);
