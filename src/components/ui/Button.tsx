import { ButtonHTMLAttributes, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "google";
  asChild?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const base =
    "w-full py-3 rounded-xl font-medium transition flex items-center justify-center gap-3";
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    google: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <Comp className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Comp>
  );
}
