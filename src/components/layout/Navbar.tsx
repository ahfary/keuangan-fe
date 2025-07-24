import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Cari santri atau transaksi..."
          className="ml-2 bg-transparent focus:outline-none text-gray-700 dark:text-gray-300"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                A
            </div>
            <div className="ml-3">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">Admin Pondok</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
            </div>
        </div>
      </div>
    </header>
  );
}