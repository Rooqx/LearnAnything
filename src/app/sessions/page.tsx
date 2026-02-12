// app/lecturer/layout.tsx
import { ReactNode } from "react";
import LecturerSidebar from "@/components/lecturer/Sidebar";

export default function LecturerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <LecturerSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}