// app/dashboard/billings/page.tsx
"use client";

import { useState } from "react";
import { ChevronDown, X, Trash2, Crown } from "lucide-react";

export default function BillingsPage() {
  const [period] = useState("Last 6 months");
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const invoices = [
    { id: "INV-2025-11", date: "Nov 15, 2025", amount: "$29.00", status: "Paid" },
    { id: "INV-2025-10", date: "Oct 15, 2025", amount: "$29.00", status: "Paid" },
    { id: "INV-2025-09", date: "Sep 15, 2025", amount: "$29.00", status: "Paid" },
    { id: "INV-2025-08", date: "Aug 15, 2025", amount: "$0.00", status: "Unpaid" },
    { id: "INV-2025-07", date: "Jul 15, 2025", amount: "$29.00", status: "Paid" },
    { id: "INV-2025-06", date: "Jun 15, 2025", amount: "$29.00", status: "Paid" },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Billings</h2>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-lg">
          A
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        {/* Billings Information Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Billings Information</h3>
          <p className="text-gray-600 mb-8">Manage your subscription and billings</p>

          {/* Current Plan */}
          <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gray-900 rounded-2xl p-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">You are on pro plan</p>
                <p className="text-2xl font-bold text-gray-900">$29.00 / Monthly</p>
              </div>
            </div>
            <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel subscription
            </button>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Payment Method</h4>
            <button 
              onClick={() => setShowAddCardModal(true)}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              + Add payment method
            </button>
          </div>

          {/* Existing Cards */}
          <div className="space-y-4">
            {/* Default Card */}
            <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg" />
                <div>
                  <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-600">Expires on 06/27</p>
                </div>
                <span className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Default
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                  Edit
                </button>
                <button className="text-red-500 hover:text-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Second Card */}
            <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-blue-600 rounded-lg" />
                <div>
                  <p className="font-medium text-gray-900">•••• •••• •••• 1234</p>
                  <p className="text-sm text-gray-600">Expires on 08/26</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                  Edit
                </button>
                <button className="text-red-500 hover:text-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Billing History</h4>
            <div className="relative">
              <button className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                {period}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{inv.id}</p>
                  <p className="text-sm text-gray-600">{inv.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${inv.status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {inv.status}
                  </span>
                  <p className="font-semibold text-gray-900">{inv.amount}</p>
                  <button className="text-gray-500 hover:text-gray-700">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add Payment Method</h3>
              <button 
                onClick={() => setShowAddCardModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-8">
              Enter your card details to add a new payment method
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YYYY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
                <input
                  type="text"
                  placeholder="123 main street, Lagos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-10">
              <button
                onClick={() => setShowAddCardModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddCardModal(false);
                  alert("Payment method added!");
                }}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
              >
                Add payment method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}