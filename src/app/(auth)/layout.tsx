/* ============================================================
   Auth Layout
   Shared layout for sign-in and sign-up pages.
   Split layout on desktop: left branding panel + right form.
   Mobile: full-width form with mesh gradient background.
   ============================================================ */

import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--color-bg)]">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-[var(--color-primary)] blur-[120px]" />
          <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] rounded-full bg-[var(--color-accent)] blur-[120px]" />
          <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] rounded-full bg-[var(--color-reward)] blur-[100px]" />
        </div>

        {/* Branding content */}
        <div className="relative z-10 flex flex-col items-start justify-center px-16 py-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-reward)] flex items-center justify-center shadow-[var(--shadow-md)]">
              <span className="text-white text-lg font-bold font-[family-name:var(--font-heading)]">
                LA
              </span>
            </div>
            <span className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)]">
              LearnAnything
            </span>
          </div>

          {/* Tagline */}
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-5xl leading-[1.15] tracking-[-0.02em] text-[var(--color-text)] mb-6 max-w-md">
            Your brain is about to get an upgrade
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-[var(--color-text-secondary)] max-w-sm leading-relaxed">
            AI-powered courses that adapt to how you learn. Start with a question, and we build the path to mastery.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-10">
            {['AI-generated courses', 'Gamified learning', 'Learn at your pace'].map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 rounded-full bg-[var(--glass-bg)] backdrop-blur-sm border border-[var(--glass-border)] text-sm font-[family-name:var(--font-body)] text-[var(--color-text-secondary)]"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] bg-repeat" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--color-bg)]">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
