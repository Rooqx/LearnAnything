/* ============================================================
   Onboarding Page
   3-step flow: Interests → Name → Daily Goal
   Runs device detection after step 3.
   ============================================================ */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Button, Card, Chip, Input } from '@/components/ui';
import { LumiAnimated, FadeIn } from '@/components/ux';
import { useUserStore } from '@/store/useUserStore';
import { useAnimationStore } from '@/store/useAnimationStore';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import {
  INTEREST_OPTIONS,
  DAILY_GOAL_OPTIONS,
} from '@/lib/constants';
import type { InterestCategory, DailyGoalMinutes, LumiState } from '@/types';

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setInterests = useUserStore((state) => state.setInterests);
  const updateDisplayName = useUserStore((state) => state.updateDisplayName);
  const setDailyGoal = useUserStore((state) => state.setDailyGoal);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const setAnimationMode = useAnimationStore((state) => state.setAnimationMode);
  const setDetectionComplete = useAnimationStore((state) => state.setDetectionComplete);

  const { recommendedMode, isDetected } = useDeviceDetection();

  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<InterestCategory[]>([]);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [selectedGoal, setSelectedGoal] = useState<DailyGoalMinutes>(20);
  const [lumiState, setLumiState] = useState<LumiState>('idle');

  const toggleInterest = useCallback((interest: InterestCategory) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 5
          ? [...prev, interest]
          : prev
    );
  }, []);

  const canProceed = () => {
    if (step === 1) return selectedInterests.length >= 1;
    if (step === 2) return displayName.trim().length >= 2;
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      setInterests(selectedInterests);
      setStep(2);
      setLumiState('excited');
    } else if (step === 2) {
      updateDisplayName(displayName.trim());
      setStep(3);
      setLumiState('idle');
    }
  };

  const handleComplete = () => {
    setDailyGoal(selectedGoal);

    /* Apply device-detected animation mode silently */
    if (isDetected) {
      setAnimationMode(recommendedMode);
      setDetectionComplete();
    }

    completeOnboarding();
    setLumiState('celebrating');

    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-8 bg-[var(--color-bg)]">
      {/* Mesh gradient */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-[var(--color-primary)] blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-[var(--color-accent)] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-8">
        {/* Lumi */}
        <div className="flex justify-center">
          <LumiAnimated size={80} state={lumiState} />
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 === step
                  ? 'w-8 bg-[var(--color-primary)]'
                  : i + 1 < step
                    ? 'w-4 bg-[var(--color-primary)]/50'
                    : 'w-4 bg-[var(--color-surface-elevated)]'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Interests */}
        {step === 1 && (
          <FadeIn direction="right" key="step-1">
            <Card variant="glass" padding="lg">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)] mb-2">
                    What are you curious about?
                  </h2>
                  <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)] text-sm">
                    Pick up to 5 topics that interest you
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 justify-center">
                  {INTEREST_OPTIONS.map((option) => (
                    <Chip
                      key={option.value}
                      selected={selectedInterests.includes(option.value)}
                      onClick={() => toggleInterest(option.value)}
                    >
                      {option.label}
                    </Chip>
                  ))}
                </div>

                <p className="text-center text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)]">
                  {selectedInterests.length}/5 selected
                </p>
              </div>
            </Card>
          </FadeIn>
        )}

        {/* Step 2: Display Name */}
        {step === 2 && (
          <FadeIn direction="right" key="step-2">
            <Card variant="glass" padding="lg">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)] mb-2">
                    What should we call you?
                  </h2>
                  <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)] text-sm">
                    This is how you will appear on leaderboards
                  </p>
                </div>

                <Input
                  label="Display name"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  inputSize="lg"
                />
              </div>
            </Card>
          </FadeIn>
        )}

        {/* Step 3: Daily Goal */}
        {step === 3 && (
          <FadeIn direction="right" key="step-3">
            <Card variant="glass" padding="lg">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="font-[family-name:var(--font-heading)] font-bold text-2xl text-[var(--color-text)] mb-2">
                    Set your daily goal
                  </h2>
                  <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)] text-sm">
                    How much time do you want to learn each day?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {DAILY_GOAL_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedGoal(option.value)}
                      className={`p-4 rounded-[var(--radius-lg)] border text-left transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                        selectedGoal === option.value
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-[var(--shadow-sm)]'
                          : 'border-[var(--color-border)] bg-[var(--glass-bg)] hover:border-[var(--color-primary)]/30'
                      }`}
                    >
                      <p className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--color-text)]">
                        {option.label}
                      </p>
                      <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-muted)]">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </FadeIn>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              leftIcon={<ChevronLeft size={18} />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              rightIcon={<ChevronRight size={18} />}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              leftIcon={<Sparkles size={18} />}
            >
              Start learning
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
