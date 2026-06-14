"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button, Drawer } from '@/components/ui';
if (typeof window !== 'undefined') {
  import('@justinribeiro/lite-youtube');
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lite-youtube': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { videoid: string; playlabel?: string };
    }
  }
}

export function getYoutubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
}

export function ModuleVideoIntro({ youtubeUrl }: { youtubeUrl: string }) {
  const videoId = getYoutubeVideoId(youtubeUrl);
  if (!videoId) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="w-full mb-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-border)] bg-[var(--color-surface)] relative"
    >
      <div className="aspect-video w-full bg-[#0a0a0a]">
        {/* @ts-expect-error Custom web component */}
        <lite-youtube videoid={videoId} style={{ width: '100%', height: '100%' }}></lite-youtube>
      </div>
      <div className="p-8 text-center bg-[var(--color-surface)]">
        <p className="text-xs font-[family-name:var(--font-mono)] text-[var(--color-muted)] uppercase tracking-[0.2em] mb-3">
          Foundational Lecture
        </p>
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-medium tracking-tight text-[var(--color-text)]">
          Watch this overview to build your mental model before reading the module chapters.
        </h3>
      </div>
    </motion.div>
  );
}

export function ModuleVideoButton({ youtubeUrl }: { youtubeUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const videoId = getYoutubeVideoId(youtubeUrl);
  
  if (!videoId) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-full text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 transition-colors cursor-pointer flex items-center justify-center shrink-0"
        aria-label="Watch Module Video"
      >
        <Play size={16} className="ml-0.5" />
      </button>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Module Lecture">
        <div className="p-4 pt-2">
          <div className="aspect-video w-full bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-[var(--color-border)]">
            {/* @ts-expect-error Custom web component */}
            <lite-youtube videoid={videoId} style={{ width: '100%', height: '100%' }}></lite-youtube>
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" onClick={() => setIsOpen(false)} fullWidth>
              Continue Reading
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
