/* ============================================================
   Sign In Page
   Email + password sign-in form with social auth buttons
   (Google + Apple).
   Animated pill toggle to sign-up.
   ============================================================ */

'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { Button, Input, Card } from '@/components/ui';
import { LumiAnimated, StaggerChildren } from '@/components/ux';
import Link from 'next/link';
import type { LumiState } from '@/types';
import { signInSchema, type SignInInput } from '@/validators/auth.schema';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [lumiState, setLumiState] = useState<LumiState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setErrorMsg('');
    setLumiState('thinking');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setErrorMsg('Invalid email or password');
        setLumiState('idle');
        return;
      }

      setLumiState('excited');
      
      // Brief celebration before navigating
      setTimeout(() => {
        router.push(callbackUrl);
      }, 600);
    } catch (error) {
      setErrorMsg('Something went wrong. Please try again.');
      setLumiState('idle');
    }
  };

  const handleSocialAuth = async (provider: string) => {
    setLumiState('thinking');
    await signIn(provider, { callbackUrl });
  };

  return (
    <StaggerChildren key="sign-in-page" className="space-y-2" staggerDelay={70}>
      {/* Lumi mascot */}
      <div className="flex justify-center">
        <LumiAnimated size={72} state={lumiState} />
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl tracking-tight text-[var(--color-text)]">
          Welcome back
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[var(--color-muted)]">
          Sign in to continue your learning journey
        </p>
      </div>

      {/* Auth toggle pill */}
      <div className="flex justify-center">
        <div className="inline-flex bg-[var(--color-surface)] rounded-full p-1 border border-[var(--color-border)]">
          <span className="px-5 py-2 rounded-full text-sm font-medium font-[family-name:var(--font-body)] bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]">
            Sign in
          </span>
          <Link
            href="/sign-up"
            className="px-5 py-2 rounded-full text-sm font-medium font-[family-name:var(--font-body)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors duration-150"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Sign in form */}
      <Card variant="glass" padding="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            leftIcon={<Mail size={18} />}
            error={errors.email?.message}
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            {...register('password')}
            leftIcon={<Lock size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 cursor-pointer transition-transform duration-150 active:scale-95"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            error={errors.password?.message}
            autoComplete="current-password"
          />

          {errorMsg && (
            <p className="text-[var(--color-error)] text-sm font-[family-name:var(--font-body)]" role="alert">
              {errorMsg}
            </p>
          )}

          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Sign in
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-muted)] font-[family-name:var(--font-body)] uppercase tracking-wide">
            or continue with
          </span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        {/* Social auth buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            className="w-6 h-6 rounded-full"
            onClick={() => handleSocialAuth('google')}
            disabled={isSubmitting}
            leftIcon={
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            }
          >
          </Button>
          <Button
            variant="secondary"
            className="w-6 h-6 rounded-full"
            onClick={() => handleSocialAuth('apple')}
            disabled={isSubmitting}
            leftIcon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            }
          >
          </Button>
        </div>
      </Card>
    </StaggerChildren>
  );
}

export default function SignInPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center p-12">
          <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
