"use client";

//import { getQueryClient } from "@/src/lib/react_query";
import { QueryClientProvider } from "@tanstack/react-query";

import { ReactNode } from "react";
import { getQueryClient } from "../lib/react_query";

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
