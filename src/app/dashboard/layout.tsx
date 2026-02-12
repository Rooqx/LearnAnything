import { ReactNode } from "react";
import AdminSidebar from "@/src/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
