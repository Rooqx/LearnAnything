"use client";

import { usePathname } from "next/navigation";
import { Home, Users, CreditCard, Settings, LogOut, Crown } from "lucide-react";
import Link from "next/link";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const progressPercentage = 30; // Replace with your dynamic calculation later
  const daysLeft = 28;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo + Border Line */}
      <div className="flex flex-col">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">XAM</h1>
        </div>
        <div className="border-b border-gray-200" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-6">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive("/dashboard")
                  ? "bg-purple-50 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Home className="w-5 h-5" />
              Dashboard overview
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/sub-accounts"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive("/dashboard/sub-accounts")
                  ? "bg-purple-50 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Users className="w-5 h-5" />
              Sub accounts
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/billings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive("/dashboard/billings")
                  ? "bg-purple-50 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Billings
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive("/dashboard/settings")
                  ? "bg-purple-50 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </li>
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

          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Pro Plan
          </h3>

          <p className="text-center text-gray-500 mb-8">
            Current subscription plan
          </p>

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
        <Link href="/signout" className="flex items-center gap-3 text-red-600 hover:text-red-700">
          <LogOut className="w-5 h-5" />
          Log out
        </Link>
      </div>
    </aside>
  );
}