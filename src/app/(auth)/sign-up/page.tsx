/* ============================================================
   Sign Up Page
   Display name + email + password form with social auth.
   Mirror layout of sign-in with toggle to switch.
   ============================================================ */

'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, UserRound } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { LumiAnimated } from '@/components/ux';
import { useUserStore } from '@/store/useUserStore';
import { INITIAL_USER_DATA } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import Link from 'next/link';
import type { LumiState } from '@/types';

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lumiState, setLumiState] = useState<LumiState>('idle');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!email) newErrors.email = 'Email is required';
    if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    if (password && password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    setLumiState('thinking');

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const mockUser = {
      ...INITIAL_USER_DATA,
      id: generateId(),
      displayName: name.trim(),
      email,
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setLumiState('excited');

    await new Promise((resolve) => setTimeout(resolve, 600));
    router.push('/onboarding');
  };

  const handleSocialAuth = async (provider: string) => {
    setIsLoading(true);
    setLumiState('thinking');

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const mockUser = {
      ...INITIAL_USER_DATA,
      id: generateId(),
      displayName: provider === 'google' ? 'Alex Chen' : 'Alex',
      email: `alex@${provider}.com`,
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setLumiState('excited');

    await new Promise((resolve) => setTimeout(resolve, 600));
    router.push('/onboarding');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <LumiAnimated size={72} state={lumiState} />
      </div>

      <div className="text-center">
        <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl tracking-[-0.02em] text-[var(--color-text)] mb-2">
          Create your account
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)]">
          Start learning anything in minutes
        </p>
      </div>

      {/* Auth toggle pill */}
      <div className="flex justify-center">
        <div className="inline-flex bg-[var(--color-surface)] rounded-full p-1 border border-[var(--color-border)]">
          <Link
            href="/sign-in"
            className="px-5 py-2 rounded-full text-sm font-medium font-[family-name:var(--font-body)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Sign in
          </Link>
          <span className="px-5 py-2 rounded-full text-sm font-medium font-[family-name:var(--font-body)] bg-[var(--color-primary)] text-white">
            Sign up
          </span>
        </div>
      </div>

      <Card variant="glass" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Display name"
            type="text"
            placeholder="How should we call you?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<UserRound size={18} />}
            error={errors.name}
            autoComplete="name"
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            error={errors.password}
            autoComplete="new-password"
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Create account
          </Button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] uppercase tracking-wide">
            or continue with
          </span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => handleSocialAuth('google')}
            disabled={isLoading}
            leftIcon={
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            }
          >
            Google
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => handleSocialAuth('apple')}
            disabled={isLoading}
            leftIcon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            }
          >
            Apple
          </Button>
        </div>

        <p className="text-center text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] mt-6">
          By creating an account, you agree to our{' '}
          <a href="#" className="underline hover:text-[var(--color-text)] transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-[var(--color-text)] transition-colors">
            Privacy Policy
          </a>
        </p>
      </Card>
    </div>
  );
}
