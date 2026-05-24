"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * ThemeProvider
 *
 * Reads the persisted theme from Zustand and applies the
 * `data-theme` attribute to <html> on mount and on change.
 * This drives all CSS variable switching between dark/light modes.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}
