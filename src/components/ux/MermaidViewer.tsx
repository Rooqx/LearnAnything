"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Card } from "@/components/ui";

// Initialize mermaid outside to avoid re-initialization
mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    fontFamily: "inherit",
    primaryColor: "#6366f1",
    primaryTextColor: "#f8fafc", // A safe light text color if dark mode, or use default
    primaryBorderColor: "#4f46e5",
    lineColor: "#71717a",
    secondaryColor: "#10b981",
    tertiaryColor: "#f43f5e",
  },
  securityLevel: "strict",
});

interface MermaidViewerProps {
  chart: string;
}

export function MermaidViewer({ chart }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      if (!containerRef.current || !chart) return;
      
      try {
        setError(null);
        // Generate a unique ID for the mermaid diagram
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (isMounted) {
          console.error("Mermaid parsing failed:", err);
          setError("Failed to render diagram.");
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div className="my-8 flex justify-center">
      {error ? (
        <Card variant="solid" padding="md" className="border-red-500/50 text-red-500 w-full text-center">
          {error}
        </Card>
      ) : (
        <div 
          ref={containerRef} 
          className="w-full max-w-3xl overflow-x-auto p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm [&_svg]:max-w-full [&_svg]:h-auto flex justify-center" 
        />
      )}
    </div>
  );
}
