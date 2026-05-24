"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import { Toggle, Avatar } from "@/components/ui";
import { AnimatedPage, StaggerChildren } from "@/components/ux";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LeaderboardRow } from "@/components/gamification/LeaderboardRow";
import { cn, formatXP } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";

/* Mock data — replaced by API data later */
const MOCK_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, userId: "1", displayName: "NeonCoder", xpThisWeek: 4200, isCurrentUser: false },
  { rank: 2, userId: "2", displayName: "AstraNova", xpThisWeek: 3800, isCurrentUser: false },
  { rank: 3, userId: "3", displayName: "PixelWizard", xpThisWeek: 3100, isCurrentUser: false },
  { rank: 4, userId: "4", displayName: "ByteRunner", xpThisWeek: 2600, isCurrentUser: false },
  { rank: 5, userId: "5", displayName: "You", xpThisWeek: 1800, isCurrentUser: true },
  { rank: 6, userId: "6", displayName: "QuantumLeap", xpThisWeek: 1500, isCurrentUser: false },
  { rank: 7, userId: "7", displayName: "CodeNinja", xpThisWeek: 1200, isCurrentUser: false },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"friends" | "global">("global");

  const podium = MOCK_ENTRIES.slice(0, 3);
  const rest = MOCK_ENTRIES.slice(3);
  const podiumColors = ["var(--color-reward)", "#C0C0C0", "#CD7F32"];
  const podiumSizes = [80, 64, 64];

  return (
    <AnimatedPage>
      <PageWrapper className="max-w-2xl mx-auto">
        <h1 className="text-center font-heading text-2xl font-bold md:text-3xl">This Week&apos;s Champions</h1>

        <div className="mt-4 flex justify-center">
          <div className="inline-flex rounded-full glass p-1">
            {(["friends", "global"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("rounded-full px-5 py-2 text-sm font-medium cursor-pointer transition-all duration-200", tab === t ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-muted)]")}>
                {t === "friends" ? "Friends" : "Global"}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 podium */}
        <div className="mt-8 flex items-end justify-center gap-4">
          {[1, 0, 2].map((idx) => {
            const entry = podium[idx];
            if (!entry) return null;
            const isFirst = idx === 0;
            return (
              <div key={entry.userId} className={cn("flex flex-col items-center gap-2", isFirst && "mb-4")}>
                <div className="relative">
                  {isFirst && <Crown size={24} className="absolute -top-5 left-1/2 -translate-x-1/2" style={{ color: podiumColors[0] }} />}
                  <Avatar name={entry.displayName} size={isFirst ? "lg" : "md"} className={cn("ring-2", isFirst ? "ring-[var(--color-reward)]" : "")} />
                </div>
                <p className="text-sm font-semibold truncate max-w-[80px]">{entry.displayName}</p>
                <p className="text-xs font-bold" style={{ color: podiumColors[idx] }}>{formatXP(entry.xpThisWeek)} XP</p>
              </div>
            );
          })}
        </div>

        {/* Rest of leaderboard */}
        <StaggerChildren className="mt-6 space-y-1">
          {rest.map((entry) => <LeaderboardRow key={entry.userId} entry={entry} />)}
        </StaggerChildren>

        <p className="mt-6 text-center text-xs text-[var(--color-muted)]">Resets every Monday at midnight</p>
      </PageWrapper>
    </AnimatedPage>
  );
}
