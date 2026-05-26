import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

/* ============================================================
   Font Configuration
   Loaded via next/font/google for zero layout shift.
   CSS variables are injected into <html> for global access.
   ============================================================ */

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/* ============================================================
   SEO Metadata
   ============================================================ */

export const metadata: Metadata = {
  title: "Lore — AI-Powered Learning Hub",
  description:
    "Learn anything you want with AI-generated interactive courses. Gamified learning tailored to your pace and style.",
  keywords: [
    "AI learning",
    "online courses",
    "gamified education",
    "lore",
    "interactive courses",
  ],
};

/* ============================================================
   Root Layout
   Applies fonts, theme provider, and global structure.
   The ThemeProvider reads from Zustand and sets data-theme
   attribute on <html> for CSS variable switching.
   ============================================================ */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      /* Font CSS variables are applied via className so next/font
         can inject them as CSS custom properties on <html> */
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      /* Default to dark theme — ThemeProvider will override on mount
         based on Zustand persisted state */
      data-theme="dark"
      suppressHydrationWarning
    >
      <body>
        <QueryProvider>
          <ThemeProvider>
            <main className="min-h-dvh">{children}</main>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
