/* ============================================================
   ThemeProvider
   Client component that syncs Zustand theme state to the
   data-theme attribute on <html>. Supports 'system' mode
   which follows the OS prefers-color-scheme media query.

   Placed in the root layout wrapping all content.
   ============================================================ */

'use client';

import { useEffect, useCallback, type ReactNode } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Resolves the selected theme option to an actual dark/light value.
 * When 'system' is selected, checks the OS media query.
 */
function getResolvedTheme(theme: 'dark' | 'light' | 'system'): 'dark' | 'light' {
  if (theme !== 'system') return theme;

  /* Check OS-level preference via media query */
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  /* SSR fallback — default to dark */
  return 'dark';
}

/**
 * ThemeProvider component.
 *
 * Why this is a separate component instead of inline in layout.tsx:
 * - layout.tsx is a Server Component by default in Next.js App Router
 * - useThemeStore requires 'use client' for Zustand reactivity
 * - Isolating this to a leaf client component keeps the layout
 *   as a Server Component (taste-skill RSC SAFETY rule)
 *
 * On mount:
 * 1. Reads the persisted theme from Zustand (localStorage)
 * 2. Resolves 'system' to actual dark/light via OS media query
 * 3. Sets data-theme attribute on <html> for CSS variable switching
 * 4. If 'system', subscribes to media query changes for live updates
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme);

  /** Apply the resolved theme to the DOM */
  const applyTheme = useCallback((resolved: 'dark' | 'light') => {
    document.documentElement.setAttribute('data-theme', resolved);
  }, []);

  /* Sync theme state to DOM whenever it changes */
  useEffect(() => {
    const resolved = getResolvedTheme(theme);
    applyTheme(resolved);

    /* When 'system' is selected, listen for OS preference changes
       so switching system dark mode live-updates the app */
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (event: MediaQueryListEvent) => {
        applyTheme(event.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, applyTheme]);

  return <>{children}</>;
}
