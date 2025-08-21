"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, DollarSign, ShoppingCart, BarChart2, ChevronDown, ChevronRight, Circle } from 'lucide-react';
import Cookies from 'js-cookie'; // <-- 1. Impor js-cookie

// Tipe untuk item menu (tidak berubah)
interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  submenu?: NavItem[];
}

// --- KONFIGURASI MENU (tidak berubah) ---
const adminMenu: NavItem[] = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/santri', icon: Users, label: 'Santri' },
  { href: '/dashboard/topup', icon: DollarSign, label: 'Top Up' },
  { href: '/dashboard/kantin', icon: ShoppingCart, label: 'Kantin' },
  { href: '/dashboard/laporan', icon: BarChart2, label: 'Laporan' },
];

const waliSantriMenu = (santriId: string | null): NavItem[] => [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/topup', icon: DollarSign, label: 'Riwayat Transfer' },
  {
    href: '#',
    icon: Users,
    label: 'Santri',
    submenu: santriId ? [
      { href: `/dashboard/santri/${santriId}#jajan`, icon: Circle, label: 'Riwayat Jajan' },
      { href: `/dashboard/santri/${santriId}#hutang`, icon: Circle, label: 'Riwayat Hutang' },
      { href: `/dashboard/santri/${santriId}#tunai`, icon: Circle, label: 'Riwayat Tarik Tunai' },
    ] : [],
  },
];


// --- Komponen NavLink dan CollapsibleNavLink (tidak berubah) ---
const NavLink = ({ item, isSubmenu = false }: { item: NavItem; isSubmenu?: boolean; }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={`flex items-center p-3 rounded-lg transition-colors ${
                isActive
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
            } ${isSubmenu ? 'pl-12 text-sm' : 'text-base'}`}
        >
            <Icon className={`w-5 h-5 mr-4 ${isSubmenu ? 'w-3 h-3' : ''}`} />
            <span>{item.label}</span>
        </Link>
    );
};

const CollapsibleNavLink = ({ item }: { item: NavItem }) => {
    const pathname = usePathname();
    const isParentActive = item.submenu?.some(sub => pathname.startsWith(sub.href.split('#')[0])) ?? false;
    const [isOpen, setIsOpen] = useState(isParentActive);
    const Icon = item.icon;

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors text-base ${
                    isParentActive
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
                <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-4" />
                    <span>{item.label}</span>
                </div>
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {isOpen && (
                <div className="mt-2 space-y-1">
                    {item.submenu?.map(subItem => <NavLink key={subItem.href} item={subItem} isSubmenu />)}
                </div>
            )}
        </div>
    );
}


export default function Sidebar() {
  const [menuItems, setMenuItems] = useState<NavItem[]>([]);

  useEffect(() => {
    // --- PERUBAHAN DI SINI: Gunakan Cookies ---
    // 2. Ambil role dan santriId dari cookies
    const role = Cookies.get('userRole');
    
    if (role === 'wali santri') {
        const santriId = Cookies.get('santriId') || null;
        setMenuItems(waliSantriMenu(santriId));
    } else {
        // Default ke menu admin
        setMenuItems(adminMenu);
    }
  }, []);

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4">
      <div className="text-2xl font-bold text-indigo-600 mb-8">SakuSantri</div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
            item.submenu ? <CollapsibleNavLink key={item.label} item={item} /> : <NavLink key={item.label} item={item} />
        ))}
      </nav>
    </aside>
  );
}