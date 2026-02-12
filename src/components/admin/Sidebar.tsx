// components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, CreditCard, Settings, LogOut, Crown } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard overview", icon: Home },
    { href: "/dashboard/sub-accounts", label: "Sub accounts", icon: Users },
    { href: "/dashboard/billings", label: "Billings", icon: CreditCard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  // Subscription countdown
  const totalBillingCycleDays = 30;
  const daysLeft = 28;
  const progressPercentage = ((totalBillingCycleDays - daysLeft) / totalBillingCycleDays) * 100;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900">XAM</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-gray-50 ${
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
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

      {/* Subscription Card */}
      <div className="p-6 border-t border-gray-200">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="mb-8 flex justify-center">
            <div className="bg-gray-900 rounded-2xl p-6 inline-block">
              <Crown className="w-12 h-12 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Pro Plan</h3>
          <p className="text-center text-gray-500 mb-8">Current subscription plan</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gray-900 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">
              {daysLeft} days left
            </span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-gray-200">
        <a href="#" className="flex items-center gap-3 text-red-600 hover:text-red-700">
          <LogOut className="w-5 h-5" />
          Log out
        </a>
      </div>
    </aside>
  );
}