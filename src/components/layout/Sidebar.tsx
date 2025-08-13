"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, FileText, LogOut, Store, Archive, ShoppingCart, BookText, TrendingUp, BookUser } from 'lucide-react';
import { cn } from '@/lib/utils'; // Pastikan utilitas cn sudah ada

// Tipe data baru untuk mendukung submenu
export interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
  subMenus?: NavLink[]; // Submenu bersifat opsional
}

// Struktur data navigasi yang baru
const navLinks: NavLink[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Santri', href: '/dashboard/santri', icon: Users },
  { 
    name: 'Toko / Kantin', 
    href: '/dashboard/kantin', // Base href untuk menu utama
    icon: Store,
    subMenus: [
      { name: 'Stok Barang', href: '/dashboard/kantin/stock', icon: Archive },
      { name: 'Data Penjualan', href: '/dashboard/kantin/penjualan', icon: ShoppingCart },
      { name: 'Pendapatan', href: '/dashboard/kantin/pendapatan', icon: TrendingUp },
      { name: 'Piutang', href: '/dashboard/kantin/piutang', icon: BookUser },
    ]
  },
  { name: 'Verifikasi Top-Up', href: '/dashboard/topup', icon: CreditCard },
  { name: 'Laporan', href: '/dashboard/laporan', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  // State untuk melacak menu mana yang sedang terbuka
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Fungsi untuk toggle menu
  const handleMenuClick = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">SakuSantri</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navLinks.map((link) => {
          const isParentActive = link.subMenus && pathname.startsWith(link.href);
          const isMenuOpen = openMenu === link.name;

          if (link.subMenus) {
            return (
              <div key={link.name}>
                <button
                  onClick={() => handleMenuClick(link.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isParentActive ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-700 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex items-center">
                    <link.icon className="w-5 h-5 mr-3" />
                    {link.name}
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                    className={cn("transition-transform", isMenuOpen && "rotate-180")}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {/* Render Submenu jika terbuka */}
                {isMenuOpen && (
                  <div className="pl-8 pt-1 space-y-1">
                    {link.subMenus.map((subMenu) => {
                      const isSubMenuActive = pathname === subMenu.href;
                      return (
                        <Link
                          key={subMenu.name}
                          href={subMenu.href}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                            isSubMenuActive ? 'bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          )}
                        >
                          <subMenu.icon className="w-4 h-4 mr-3" />
                          {subMenu.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Render link biasa (tanpa submenu)
          const isActive = pathname === link.href;
          return (
            <Link key={link.name} href={link.href}
              className={cn(
                "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t dark:border-gray-700">
         <Link href="/auth/login" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
        </Link>
      </div>
    </aside>
  );
}
