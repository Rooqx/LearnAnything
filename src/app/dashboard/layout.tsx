import { ReactNode } from "react";
import ScoopedFrame from "@/src/components/layout/ScoopedFrame";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ScoopedFrame isDashboard>{children}</ScoopedFrame>;
}
