"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { AnimatedPage, LumiAnimated } from "@/components/ux";

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    /* TODO: Implement signup logic, then navigate to /onboarding */
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <AnimatedPage>
      <div className="flex min-h-dvh">
        {/* Left — Brand visual (desktop only) */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:gap-6 lg:px-12"
          style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(108,60,225,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(200,241,53,0.1) 0%, transparent 50%), var(--color-bg)" }}>
          <LumiAnimated state="excited" size={120} />
          <h1 className="font-heading text-4xl font-bold text-center">
            Learn<span className="text-[var(--color-primary)]">Anything</span>
          </h1>
          <p className="text-lg text-[var(--color-muted)] text-center max-w-md">Learn anything. Master everything.</p>
        </div>

        {/* Right — Auth form */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
            <LumiAnimated state="excited" size={80} />
            <h1 className="font-heading text-2xl font-bold">
              Learn<span className="text-[var(--color-primary)]">Anything</span>
            </h1>
          </div>

          <div className="w-full max-w-sm">
            <h2 className="font-heading text-2xl font-bold mb-1">Create your account</h2>
            <p className="text-sm text-[var(--color-muted)] mb-6">Start your learning journey today</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input id="name" label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" leftIcon={<User size={18} />} required />
              <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" leftIcon={<Mail size={18} />} required />
              <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" leftIcon={<Lock size={18} />} required />
              <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>Create Account</Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--color-border)]" /><span className="text-xs text-[var(--color-muted)]">OR</span><div className="h-px flex-1 bg-[var(--color-border)]" />
            </div>

            <div className="space-y-3">
              <Button variant="secondary" fullWidth leftIcon={<User size={18} />}>Continue with Google</Button>
              <Button variant="secondary" fullWidth leftIcon={<User size={18} />}>Continue with Apple</Button>
            </div>

            <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-[var(--color-primary)] cursor-pointer hover:underline font-medium">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
