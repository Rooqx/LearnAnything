"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui";
import * as LucideIcons from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  className?: string;
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[icon] || LucideIcons.Activity;
  return (
    <Card hoverable className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-heading font-bold text-[var(--color-text)]">{value}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{label}</p>
        </div>
        <Icon size={24} className="text-[var(--color-primary)] opacity-60" />
      </div>
    </Card>
  );
}
