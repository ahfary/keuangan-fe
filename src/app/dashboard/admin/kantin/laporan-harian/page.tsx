"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, ReceiptText, ShoppingCart, Calendar, Download, LoaderCircle } from 'lucide-react';
import { getDailyReport } from '@/lib/api';
import toast from 'react-hot-toast';

// --- Tipe Data ---
interface DailySale {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: 'Lunas' | 'Hutang';
  santri: {
    name: string;
  };
  items: {
    quantity: number;
  }[];
}

interface DailySummary {
  totalRevenue: number;
  totalTransactions: number;
  totalItemsSold: number;
  transactions: DailySale[];
}

// --- Komponen-komponen Lokal ---
const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">{icon}</div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// --- Komponen Utama Halaman ---
export default function LaporanHarianPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        // Data dummy untuk simulasi
        const mockData: DailySummary = {
            totalRevenue: 86000,
            totalTransactions: 5,
            totalItemsSold: 9,
            transactions: [
                 { id: 1, createdAt: "2025-09-17T10:15:00.000Z", totalAmount: 30000, status: 'Lunas', santri: { name: 'Ahmad Yusuf' }, items: [{ quantity: 2 }, { quantity: 2 }] },
                 { id: 2, createdAt: "2025-09-17T10:20:00.000Z", totalAmount: 8000, status: 'Lunas', santri: { name: 'Pembeli Tunai' }, items: [{ quantity: 1 }] },
                 { id: 3, createdAt: "2025-09-17T10:30:00.000Z", totalAmount: 15000, status: 'Hutang', santri: { name: 'Citra Lestari' }, items: [{ quantity: 1 }, { quantity: 1 }] },
                 { id: 4, createdAt: "2025-09-17T11:05:00.000Z", totalAmount: 5000, status: 'Lunas', santri: { name: 'Pembeli Tunai' }, items: [{ quantity: 1 }] },
                 { id: 5, createdAt: "2025-09-17T11:15:00.000Z", totalAmount: 18000, status: 'Lunas', santri: { name: 'Eko Prasetyo' }, items: [{ quantity: 1 }, { quantity: 1 }] },
            ]
        };
        setReportData(mockData);
        // Uncomment baris ini jika endpoint sudah siap
        // const data = await getDailyReport(selectedDate);
        // setReportData(data);
      } catch (error) {
        toast.error("Gagal memuat laporan harian.");
        setReportData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [selectedDate]);
  
  const summary = useMemo(() => {
    if (!reportData) return { totalRevenue: 0, totalTransactions: 0, totalItemsSold: 0 };
    return {
      totalRevenue: reportData.totalRevenue,
      totalTransactions: reportData.totalTransactions,
      totalItemsSold: reportData.totalItemsSold,
    }
  }, [reportData]);

  return (
    <div className="space-y-6">
      {/* --- Header & Filter Tanggal --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Laporan Harian</h1>
          <p className="mt-1 text-gray-500">Ringkasan transaksi dan pendapatan per hari.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full md:w-auto"
          />
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Unduh Laporan
          </Button>
        </div>
      </div>
    </div>
  );
}