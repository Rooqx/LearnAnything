// components/lecturer/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, BarChart2, Settings, LogOut } from "lucide-react";

export default function LecturerSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/lecturer/dashboard", label: "Dashboard", icon: Home },
    { href: "/lecturer/dashboard/exams", label: "Exams", icon: FileText },
    { href: "/lecturer/dashboard/results", label: "Results", icon: BarChart2 },
    { href: "/lecturer/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900">XAM SubAccount</h1>
      </div>

      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-gray-50 ${
                  pathname === item.href
                    ? "bg-purple-50 text-purple-700 font-medium"
                    : "text-gray-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-gray-200">
        <a href="#" className="flex items-center gap-3 text-red-600 hover:text-red-700">
          <LogOut className="w-5 h-5" />
          Log out
        </a>
      </div>
    </aside>
  );
}