import { cn } from "@/lib/utils";

/** Consistent page padding and max-width wrapper for all page content */
export function PageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 py-6 lg:px-8 lg:py-8", className)}>
      {children}
    </div>
  );
}
