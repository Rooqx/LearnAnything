/* ============================================================
   ThemeProvider
   Client component that syncs Zustand theme state to the
   data-theme attribute on <html>. This enables CSS variable
   switching between dark and light mode.

   Placed in the root layout wrapping all content.
   Reads theme on mount, applies it to DOM, and subscribes
   to changes.
   ============================================================ */

'use client';

import { useEffect, type ReactNode } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

interface ThemeProviderProps {
  children: ReactNode;
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
 * 2. Sets data-theme attribute on <html> for CSS variable switching
 * 3. Subscribes to theme changes and updates the DOM attribute
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme);

  /* Sync theme state to DOM whenever it changes.
     Sets data-theme on <html> which triggers CSS variable switching
     defined in globals.css (:root / [data-theme="dark"] / [data-theme="light"]) */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
