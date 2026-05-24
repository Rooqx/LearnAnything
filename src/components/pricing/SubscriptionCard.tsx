"use client";

import { Check } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  name: string;
  tagline: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  onSubscribe: () => void;
  className?: string;
}

/** Single subscription tier card for pricing page */
export function SubscriptionCard({ name, tagline, price, features, isPopular, onSubscribe, className }: SubscriptionCardProps) {
  return (
    <Card hoverable className={cn("relative flex flex-col", isPopular && "ring-2 ring-[var(--color-primary)] shadow-glow", className)}>
      {isPopular && <Badge variant="primary" className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
      <h3 className="font-heading text-xl font-bold">{name}</h3>
      <p className="text-sm text-[var(--color-muted)] mt-1">{tagline}</p>
      <p className="font-heading text-3xl font-bold mt-4">{price}<span className="text-sm font-normal text-[var(--color-muted)]">/mo</span></p>
      <ul className="mt-5 space-y-2.5 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check size={16} className="mt-0.5 shrink-0 text-[var(--color-success)]" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button variant={isPopular ? "primary" : "secondary"} onClick={onSubscribe} className="mt-6 w-full">Get Started</Button>
    </Card>
  );
}
