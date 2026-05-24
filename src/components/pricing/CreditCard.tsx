"use client";

import { Card, Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

interface CreditCardProps {
  credits: number;
  description: string;
  price: string;
  isPopular?: boolean;
  onBuy: () => void;
  className?: string;
}

/** Single credit bundle card for pricing page */
export function CreditCard({ credits, description, price, isPopular, onBuy, className }: CreditCardProps) {
  return (
    <Card hoverable className={cn("relative flex flex-col items-center text-center", isPopular && "ring-2 ring-[var(--color-primary)]", className)}>
      {isPopular && <Badge variant="primary" className="absolute -top-3 right-3">Best Value</Badge>}
      <p className="font-heading text-3xl font-bold text-[var(--color-text)]">{credits}</p>
      <p className="text-xs text-[var(--color-muted)] mt-1">credits</p>
      <p className="text-sm text-[var(--color-text-secondary)] mt-3">{description}</p>
      <p className="font-heading text-xl font-bold mt-3">{price}</p>
      <Button variant={isPopular ? "primary" : "secondary"} size="sm" onClick={onBuy} className="mt-4 w-full">Buy Credits</Button>
    </Card>
  );
}
