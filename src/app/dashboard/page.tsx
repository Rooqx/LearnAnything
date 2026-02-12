"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  CheckCircle2,
  Calendar,
  ChevronDown,
  Users,
} from "lucide-react";
import { useDashboard } from "@/src/hooks/dashboard/use_dashbaord_hook";
import { useUser } from "@/src/hooks/use_user_hook";

export default function DashboardPage() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [selectedMonth, setSelectedMonth] = useState("November");
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: dashboardData, isLoading, error } = useDashboard();
  // const { data: userData } = useUser();
  console.log("data", dashboardData);
  //console.log("user", userData);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMonthDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-lg">
          A
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">Total Papers Created</p>
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900">142</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">Sub Accounts</p>
              <div className="bg-green-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900">38</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">Total Papers Taken</p>
              <div className="bg-purple-100 p-3 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900">12</p>
          </div>
        </div>

        {/* Progress Tracker + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exam Progress Tracker */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-gray-900">
                Exam Progress Tracker
              </h3>

              {/* Month Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  <Calendar className="w-4 h-4" />
                  {selectedMonth}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${monthDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {monthDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    {months.map((month) => (
                      <button
                        key={month}
                        onClick={() => {
                          setSelectedMonth(month);
                          setMonthDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          selectedMonth === month
                            ? "bg-purple-50 text-purple-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Donut Chart */}
            <div className="relative w-64 h-64 mx-auto">
              <svg viewBox="0 0 200 200" className="transform -rotate-90">
                {/* Background */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="36"
                />
                {/* In Progress - Purple */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="36"
                  strokeDasharray={`${(35 / 100) * 502.4} 502.4`}
                  strokeDashoffset="0"
                />
                {/* Not Started - Dark */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#1F2937"
                  strokeWidth="36"
                  strokeDasharray={`${(53 / 100) * 502.4} 502.4`}
                  strokeDashoffset={`${-(35 / 100) * 502.4}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-900"></p>
                  <p className="text-gray-600"></p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300" />
                <span className="text-sm text-gray-600">
                  Completed <strong></strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-400" />
                <span className="text-sm text-gray-600">
                  In Progress <strong></strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-800" />
                <span className="text-sm text-gray-600">
                  Not Started <strong></strong>
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Activity
            </h3>
            <div className="space-y-6">
              {[
                { text: "New Sub Account created", time: "53s ago" },
                { text: 'Started "BIO 211 Test"', time: "2h ago" },
                { text: 'Published new exam: "MAT 111"', time: "5h ago" },
                { text: '101 students submitted "EEE 121"', time: "1d ago" },
                { text: "Sub Account 12 closed", time: "5d ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-gray-900 text-white p-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{item.text}</p>
                    <p className="text-sm text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
