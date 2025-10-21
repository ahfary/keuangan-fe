/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, ShoppingCart, Banknote, LoaderCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';
import useAxios from '@/hooks/useAxios'; // 1. Impor custom hook

// --- Tipe Data ---
interface Sale {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: 'Lunas' | 'Hutang';
}

interface DailyData {
  date: string;
  lunas: number;
  hutang: number;
  total: number;
  transaksi: number;
}

type StatusFilter = 'semua' | 'lunas' | 'hutang';
const ITEMS_PER_PAGE = 5;

// --- Komponen Lokal ---
const StatCard = ({ title, value, icon, isLoading }: { title: string; value: string; icon: React.ReactNode, isLoading: boolean }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      {icon}
    </div>
    {isLoading ? (
      <div className="mt-2 h-9 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    ) : (
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    )}
  </div>
);

// --- Komponen Utama ---
export default function PendapatanPage() {
  // 2. Gunakan useAxios untuk mengambil data
  const { data: sales, isLoading, error } = useAxios<Sale[]>({ url: '/history', method: 'get' });
  const salesList = sales || []; // Fallback ke array kosong

  // State UI
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Tampilkan toast jika ada error
  useEffect(() => {
    if (error) {
      toast.error("Gagal memuat data pendapatan.");
    }
  }, [error]);
  
  // 3. Proses data yang sudah diambil menggunakan useMemo
  const { stats, tableData } = useMemo(() => {
    const dailyTotals: { [key: string]: { lunas: number; hutang: number; transaksi: number } } = {};
    
    // Urutkan data sekali di awal
    const sortedSales = [...salesList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    for (const sale of sortedSales) {
      const localDate = new Date(sale.createdAt);
      const dateString = localDate.toISOString().split('T')[0];

      if (!dailyTotals[dateString]) {
        dailyTotals[dateString] = { lunas: 0, hutang: 0, transaksi: 0 };
      }
      
      dailyTotals[dateString].transaksi++;
      if (sale.status === 'Lunas') {
        dailyTotals[dateString].lunas += sale.totalAmount;
      } else {
        dailyTotals[dateString].hutang += sale.totalAmount;
      }
    }
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayRevenue = dailyTotals[todayStr]?.lunas || 0;
    let thisWeekRevenue = 0;
    let thisMonthRevenue = 0;

    Object.entries(dailyTotals).forEach(([dateStr, data]) => {
        const date = new Date(dateStr);
        if (date >= startOfWeek) thisWeekRevenue += data.lunas;
        if (date >= startOfMonth) thisMonthRevenue += data.lunas;
    });

    const processedTableData: DailyData[] = Object.entries(dailyTotals).map(([date, data]) => ({ 
      date, 
      ...data,
      total: data.lunas + data.hutang,
    }));

    const filteredTableData = processedTableData.filter(data => {
        if (statusFilter === 'lunas') return data.lunas > 0;
        if (statusFilter === 'hutang') return data.hutang > 0;
        return true;
    });

    return {
      stats: { today: todayRevenue, thisWeek: thisWeekRevenue, thisMonth: thisMonthRevenue },
      tableData: filteredTableData,
    };
  }, [salesList, statusFilter]);
  
  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return tableData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [tableData, currentPage]);


  const handleDetailClick = (date: string) => {
    router.push(`/dashboard/admin/kantin/laporan-harian?tanggal=${date}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/admin/kantin" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Menu Kantin
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Rekapitulasi Pendapatan</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Analisis pendapatan lunas dan piutang (kasbon) dari kantin.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Pendapatan Lunas (Hari Ini)" value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.today)} icon={<DollarSign className="w-6 h-6 text-green-500" />} isLoading={isLoading}/>
        <StatCard title="Pendapatan Lunas (Minggu Ini)" value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.thisWeek)} icon={<ShoppingCart className="w-6 h-6 text-blue-500" />} isLoading={isLoading}/>
        <StatCard title="Pendapatan Lunas (Bulan Ini)" value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.thisMonth)} icon={<Banknote className="w-6 h-6 text-indigo-500" />} isLoading={isLoading}/>
      </div>
      
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Rincian Pemasukan per Hari</h2>
             <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <Button size="sm" variant={statusFilter === 'semua' ? 'default' : 'ghost'} className="dark:text-white" onClick={() => setStatusFilter('semua')}>Semua</Button>
                <Button size="sm" variant={statusFilter === 'lunas' ? 'default' : 'ghost'} className="dark:text-white" onClick={() => setStatusFilter('lunas')}>Lunas</Button>
                <Button size="sm" variant={statusFilter === 'hutang' ? 'default' : 'ghost'} className="dark:text-white" onClick={() => setStatusFilter('hutang')}>Hutang</Button>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Total Transaksi</th>
                <th className="px-6 py-3 text-right">Pendapatan Lunas</th>
                <th className="px-6 py-3 text-right">Pendapatan Hutang</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center p-8"><LoaderCircle className="w-6 h-6 mx-auto animate-spin" /></td></tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.date} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {new Date(row.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">{row.transaksi} Transaksi</td>
                    <td className="px-6 py-4 text-right font-semibold text-green-600">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.lunas)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-yellow-600">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.hutang)}</td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="outline" size="sm" onClick={() => handleDetailClick(row.date)}>Lihat Detail</Button>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr><td colSpan={5} className="text-center p-8 text-gray-500">Tidak ada data untuk filter yang dipilih.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
            <div className="p-4 flex justify-center items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                   Halaman {currentPage} dari {totalPages}
                </span>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        )}
       </div>
    </div>
  );
}
