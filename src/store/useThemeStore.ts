import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ============================================================
   Theme Store
   Manages dark/light mode toggle.
   Persisted to localStorage so theme preference survives reloads.
   The ThemeProvider component reads this and applies data-theme
   attribute to <html>.
   ============================================================ */

type Theme = "dark" | "light";

interface ThemeStoreState {
  theme: Theme;
}

interface ThemeStoreActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStoreState & ThemeStoreActions>()(
  persist(
    (set, get) => ({
      theme: "dark",

      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set({ theme: get().theme === "dark" ? "light" : "dark" }),
    }),
    {
      name: "la-theme",
    }
  )
);
