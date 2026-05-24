"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Chip, Input } from "@/components/ui";
import { AnimatedPage, LumiAnimated, ScaleOnPress } from "@/components/ux";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useAnimationStore } from "@/store/useAnimationStore";
import { useUserStore } from "@/store/useUserStore";
import { INTEREST_OPTIONS, DAILY_GOAL_OPTIONS, MAX_DISPLAY_NAME_LENGTH } from "@/lib/constants";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [goalMinutes, setGoalMinutes] = useState(20);
  const [showDeviceBanner, setShowDeviceBanner] = useState(false);

  const { isLowEnd, isDetected } = useDeviceDetection();
  const setAnimationMode = useAnimationStore((s) => s.setAnimationMode);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const setDailyGoalMinutes = useUserStore((s) => s.setDailyGoalMinutes);

  const toggleInterest = (interest: string) => {
    setInterests((prev) => prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]);
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      /* Save profile data */
      updateProfile({ displayName, interests, hasCompletedOnboarding: true, dailyGoalMinutes: goalMinutes });
      setDailyGoalMinutes(goalMinutes);

      /* Check device detection result */
      if (isDetected && isLowEnd) {
        setShowDeviceBanner(true);
      } else {
        setAnimationMode("full");
        router.push("/dashboard");
      }
    }
  };

  const handleDeviceChoice = (mode: "full" | "lite") => {
    setAnimationMode(mode);
    router.push("/dashboard");
  };

  const canProceed = step === 0 ? interests.length > 0 : step === 1 ? displayName.trim().length > 0 : true;

  return (
    <AnimatedPage>
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
        {/* Step indicator dots */}
        <div className="mb-8 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn("h-2 rounded-full transition-all duration-300", i === step ? "w-8 bg-[var(--color-primary)]" : i < step ? "w-2 bg-[var(--color-primary)]" : "w-2 bg-[var(--color-muted)]/30")} />
          ))}
        </div>

        <LumiAnimated state={step === 0 ? "idle" : "excited"} size={80} />

        <div className="mt-6 w-full max-w-md">
          {/* Step 1: Interests */}
          {step === 0 && (
            <div style={{ animation: "pageIn 300ms ease-out" }}>
              <h2 className="text-center font-heading text-2xl font-bold mb-2">What are you curious about?</h2>
              <p className="text-center text-sm text-[var(--color-muted)] mb-6">Pick at least one topic</p>
              <div className="flex flex-wrap justify-center gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <ScaleOnPress key={interest}>
                    <Chip label={interest} isSelected={interests.includes(interest)} onClick={() => toggleInterest(interest)} />
                  </ScaleOnPress>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Display Name */}
          {step === 1 && (
            <div style={{ animation: "pageIn 300ms ease-out" }}>
              <h2 className="text-center font-heading text-2xl font-bold mb-2">What should we call you?</h2>
              <p className="text-center text-sm text-[var(--color-muted)] mb-6">This is how you&apos;ll appear to others</p>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME_LENGTH))} placeholder="Your name" className="text-center" autoFocus />
              <p className="mt-2 text-right text-xs text-[var(--color-muted)]">{displayName.length}/{MAX_DISPLAY_NAME_LENGTH}</p>
            </div>
          )}

          {/* Step 3: Daily Goal */}
          {step === 2 && (
            <div style={{ animation: "pageIn 300ms ease-out" }}>
              <h2 className="text-center font-heading text-2xl font-bold mb-2">How much time can you give?</h2>
              <p className="text-center text-sm text-[var(--color-muted)] mb-6">Set your daily learning goal</p>
              <div className="grid grid-cols-2 gap-3">
                {DAILY_GOAL_OPTIONS.map((goal) => (
                  <ScaleOnPress key={goal.minutes}>
                    <Card clickable onClick={() => setGoalMinutes(goal.minutes)} className={cn("text-center transition-all duration-200", goalMinutes === goal.minutes && "ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/5")}>
                      <p className="font-heading text-xl font-bold">{goal.label}</p>
                      <p className="text-xs text-[var(--color-muted)]">{goal.description}</p>
                    </Card>
                  </ScaleOnPress>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 0 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
            <Button variant="primary" fullWidth onClick={handleNext} disabled={!canProceed}>
              {step === 2 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>

        {/* Device detection banner */}
        {showDeviceBanner && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center">
            <div className="absolute inset-0 bg-black/40" />
            <Card className="relative z-10 w-full max-w-sm p-6 text-center" elevated>
              <LumiAnimated state="excited" size={48} />
              <p className="mt-3 text-sm font-medium">Hey! Your device runs smoother with lighter animations. Which do you prefer?</p>
              <div className="mt-4 flex gap-3">
                <Button variant="secondary" fullWidth onClick={() => handleDeviceChoice("lite")}>Keep it smooth</Button>
                <Button variant="primary" fullWidth onClick={() => handleDeviceChoice("full")}>Full experience</Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <style jsx>{`@keyframes pageIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </AnimatedPage>
  );
}
