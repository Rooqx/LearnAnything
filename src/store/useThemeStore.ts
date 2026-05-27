/* ============================================================
   Theme Store
   Manages dark/light/system theme state with localStorage
   persistence. Defaults to 'system' so new users get their
   OS-level preference automatically.

   The ThemeProvider component resolves 'system' to the actual
   dark/light value and syncs it to data-theme on <html>.
   ============================================================ */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Available theme options — 'system' follows OS preference */
export type ThemeOption = 'dark' | 'light' | 'system';

interface ThemeState {
  /** Selected theme option — 'system' defers to OS preference */
  theme: ThemeOption;
  /** Toggle between dark, light, and system */
  toggleTheme: () => void;
  /** Set a specific theme directly */
  setTheme: (theme: ThemeOption) => void;
}

/**
 * Theme store with localStorage persistence.
 * Default is 'system' — follows the user's OS color scheme preference.
 * When set to 'system', the ThemeProvider listens to
 * `prefers-color-scheme` media query and resolves accordingly.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',

      toggleTheme: () =>
        set((state) => ({
          theme:
            state.theme === 'system'
              ? 'light'
              : state.theme === 'light'
                ? 'dark'
                : 'system',
        })),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'lore-theme',
    }
  )
);
