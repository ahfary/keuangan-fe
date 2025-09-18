"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import Cookies from "js-cookie";

export default function Navbar() {
  const [user, setUser] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClient, setIsClient] = useState(false); // State untuk melacak sisi klien

  useEffect(() => {
    // Kode ini hanya akan berjalan di sisi klien
    setIsClient(true); 
    setUser(Cookies.get("name"));
    const role = Cookies.get("userRole");
    setUserRole(role ? role.charAt(0).toUpperCase() + role.slice(1) : "User");
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari santri atau transaksi..."
          className="ml-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <NotificationDropdown />

        {/* Profile */}
        <div className="flex items-center">
          {isClient ? ( // Hanya render bagian ini jika sudah di sisi klien
            <>
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {user ? user.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{user || '...'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userRole || '...'}</p>
              </div>
            </>
          ) : (
            // Placeholder saat render di server
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          )}
        </div>
      </div>
    </header>
  );
}