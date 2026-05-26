/* ============================================================
   Theme Store
   Manages dark/light theme state with localStorage persistence.
   The ThemeProvider component syncs this state to the
   data-theme attribute on <html> for CSS variable switching.
   ============================================================ */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  /** Current active theme */
  theme: 'dark' | 'light';
  /** Toggle between dark and light */
  toggleTheme: () => void;
  /** Set a specific theme directly */
  setTheme: (theme: 'dark' | 'light') => void;
}

/**
 * Theme store with localStorage persistence.
 * Default is 'dark' — the Molten palette looks best on dark surfaces.
 * The ThemeProvider reads this on mount and applies data-theme to <html>.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'lore-theme',
    }
  )
);
