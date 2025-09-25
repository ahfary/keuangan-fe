/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Bell, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

// Tipe data untuk notifikasi
interface Notification {
  id: string;
  type: 'Transfer' | 'Stock' | 'Piutang';
  message: string;
  timestamp: string;
  isRead: boolean;
  amount?: number;
}

type TabType = 'Transfer' | 'Stock' | 'Piutang';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("Transfer");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ambil data notifikasi
  useEffect(() => {
    // Hanya fetch jika dropdown terbuka dan data belum ada
    if (isOpen && notifications.length === 0) {
      const fetchNotifications = async () => {
        setIsLoading(true);
        try {
          // Data dummy untuk simulasi karena endpoint belum ada
          const mockData: Notification[] = [
            { id: '1', type: 'Transfer', message: 'Sodikin baru saja Transfer', timestamp: new Date().toISOString(), isRead: false, amount: 2000000 },
            { id: '2', type: 'Transfer', message: 'Emorgan baru saja Transfer', timestamp: new Date().toISOString(), isRead: true, amount: 500000 },
            { id: '3', type: 'Stock', message: 'Stok Kopi Hitam hampir habis', timestamp: new Date().toISOString(), isRead: false },
            { id: '4', type: 'Piutang', message: 'Jatuh tempo hutang Ahmad Yusuf', timestamp: new Date().toISOString(), isRead: true },
          ];
          setNotifications(mockData);
          // Ganti dengan kode di bawah ini jika endpoint /notifications sudah siap
          // const data = await getNotifications();
          // setNotifications(data);
        } catch (error) {
          toast.error("Gagal memuat notifikasi.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchNotifications();
    }
  }, [isOpen, notifications.length]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);
  const filteredNotifications = useMemo(() => notifications.filter(n => n.type === activeTab), [notifications, activeTab]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <Bell className="w-6 h-6 text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b dark:border-gray-700">
            <h3 className="font-semibold text-lg">Notifikasi</h3>
          </div>
          <div className="flex border-b dark:border-gray-700">
            {(['Transfer', 'Stock', 'Piutang'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-2 text-sm font-medium",
                  activeTab === tab ? "border-b-2 border-indigo-500 text-indigo-500" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-24"><LoaderCircle className="w-6 h-6 animate-spin" /></div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div key={notif.id} className={cn("flex items-start gap-3 p-3 border-b dark:border-gray-700", !notif.isRead && "bg-indigo-500/10")}>
                  {!notif.isRead && <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 flex-shrink-0"></div>}
                  <div className="flex-grow">
                    <p className="text-sm">{notif.message}</p>
                    {notif.amount && (
                      <p className="text-sm font-bold text-green-500">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(notif.amount)}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{new Date(notif.timestamp).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-10">Tidak ada notifikasi {activeTab}.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}