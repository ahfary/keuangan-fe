"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, DollarSign, ShoppingCart, BarChart2, ChevronDown, ChevronRight, Circle, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  submenu?: NavItem[];
}

// --- KONFIGURASI MENU DENGAN ROUTE BARU ---
const adminMenu: NavItem[] = [
  { href: '/dashboard/admin', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/admin/santri', icon: Users, label: 'Santri' },
  { href: '/dashboard/admin/topup', icon: DollarSign, label: 'Top Up' },
  { href: '/dashboard/admin/kantin', icon: ShoppingCart, label: 'Kantin' },
  { href: '/dashboard/admin/laporan', icon: BarChart2, label: 'Laporan' },
];

const waliSantriMenu = (santriId: string | null): NavItem[] => [
  { href: '/dashboard/walsan', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/walsan/transfer', icon: DollarSign, label: 'Riwayat Transfer' },
  {
    href: '#', // Tautan utama tidak aktif
    icon: Users,
    label: 'Santri',
    submenu: santriId ? [
      { href: `/dashboard/walsan/santri/${santriId}#jajan`, icon: Circle, label: 'Riwayat Jajan' },
      { href: `/dashboard/walsan/santri/${santriId}#hutang`, icon: Circle, label: 'Riwayat Hutang' },
      { href: `/dashboard/walsan/santri/${santriId}#tunai`, icon: Circle, label: 'Riwayat Tarik Tunai' },
    ] : [],
  },
];

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
  const router = useRouter();

  useEffect(() => {
    const role = Cookies.get('userRole');
    
    if (role === 'Walisantri') {
        const santriId = Cookies.get('santriId') || null;
        setMenuItems(waliSantriMenu(santriId));
    } else {
        setMenuItems(adminMenu);
    }
  }, []);

  const handleLogout = () => {
      Cookies.remove('accessToken');
      Cookies.remove('userRole');
      Cookies.remove('santriId');
      router.push('/auth/login');
  };

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col justify-between">
      <div>
        <div className="text-2xl font-bold text-indigo-600 mb-8">SakuSantri</div>
        <nav className="space-y-2">
            {menuItems.map((item) => (
                item.submenu ? <CollapsibleNavLink key={item.label} item={item} /> : <NavLink key={item.label} item={item} />
            ))}
        </nav>
      </div>
      <div>
        <button 
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg text-gray-600 hover:bg-red-100 dark:text-gray-300 dark:hover:bg-red-900/50 transition-colors"
        >
            <LogOut className="w-5 h-5 mr-4"/>
            <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}