"use client";

import React from "react";
import { Search } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar() {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari santri atau transaksi..."
          className="ml-2 bg-transparent focus:outline-none text-gray-200 placeholder-gray-400"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <NotificationDropdown />

        {/* Profile */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-white">Admin Pondok</p>
            <p className="text-xs text-gray-400">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
