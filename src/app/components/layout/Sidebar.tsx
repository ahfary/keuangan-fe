"use client"; // Diperlukan karena kita menggunakan hook seperti usePathname

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, FileText, LogOut } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Santri', href: '/dashboard/santri', icon: Users },
  { name: 'Verifikasi Top-Up', href: '/dashboard/topup', icon: CreditCard },
  { name: 'Laporan', href: '/dashboard/laporan', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">SakuSantri</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t dark:border-gray-700">
         <Link
            href="/auth/login"
            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
        </Link>
      </div>
    </aside>
  );
}
