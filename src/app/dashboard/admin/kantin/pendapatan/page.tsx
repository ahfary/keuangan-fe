/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, ShoppingCart, Users, ChevronDown, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { getSalesHistory } from '@/lib/api';

// --- Tipe Data ---
interface Sale {
  createdAt: string;
  totalAmount: number;
}

interface DailyRevenue {
  date: string;
  total: number;
}

interface Stats {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

type TimeRange = '7days' | '1month' | '6months';

// --- Komponen-komponen Lokal ---

// Kartu Statistik
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

// Tooltip kustom untuk grafik
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
        <p className="label font-semibold text-gray-800 dark:text-white">{label}</p>
        <p className="intro text-indigo-500">{`Pendapatan: ${new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

// --- Komponen Halaman Utama ---

export default function PendapatanPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');

  // Fetch data penjualan dari API
  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      try {
        const salesHistory = await getSalesHistory();
        // Pastikan data adalah array dan urutkan dari yang terbaru
        const sortedSales = Array.isArray(salesHistory)
          ? salesHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          : [];
        setSales(sortedSales);
      } catch (error) {
        toast.error("Gagal memuat data pendapatan.");
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSales();
  }, []);

  // Proses data untuk statistik dan grafik
  const { stats, chartData, tableData } = React.useMemo(() => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let todayRevenue = 0;
    let thisWeekRevenue = 0;
    let thisMonthRevenue = 0;
    const dailyTotals: { [key: string]: number } = {};

    for (const sale of sales) {
      const saleDate = new Date(sale.createdAt);
      saleDate.setHours(0, 0, 0, 0);

      // Kalkulasi statistik
      if (saleDate.getTime() === today.getTime()) {
        todayRevenue += sale.totalAmount;
      }
      if (saleDate >= startOfWeek) {
        thisWeekRevenue += sale.totalAmount;
      }
      if (saleDate >= startOfMonth) {
        thisMonthRevenue += sale.totalAmount;
      }

      // Agregasi data harian untuk tabel dan grafik
      const dateString = saleDate.toISOString().split('T')[0];
      if (!dailyTotals[dateString]) {
        dailyTotals[dateString] = 0;
      }
      dailyTotals[dateString] += sale.totalAmount;
    }
    
    const processedTableData: DailyRevenue[] = Object.entries(dailyTotals).map(([date, total]) => ({ date, total }));

    // Filter data untuk grafik berdasarkan timeRange
    const getChartData = (range: TimeRange): DailyRevenue[] => {
      const endDate = new Date();
      const startDate = new Date();

      if (range === '7days') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (range === '1month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else if (range === '6months') {
        startDate.setMonth(endDate.getMonth() - 6);
      }

      return processedTableData
        .filter(d => new Date(d.date) >= startDate && new Date(d.date) <= endDate)
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(d => ({
          date: new Date(d.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
          total: d.total
        }));
    };

    return {
      stats: { today: todayRevenue, thisWeek: thisWeekRevenue, thisMonth: thisMonthRevenue },
      chartData: getChartData(timeRange),
      tableData: processedTableData
    };
  }, [sales, timeRange]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Rekapitulasi Pendapatan</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Analisis pendapatan kantin secara periodik.</p>
      </div>

      {/* Grid untuk Kartu Statistik */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard 
          title="Pendapatan Hari Ini" 
          value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.today)} 
          icon={<DollarSign className="w-6 h-6 text-green-500" />}
          isLoading={isLoading}
        />
        <StatCard 
          title="Pendapatan Minggu Ini" 
          value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.thisWeek)}
          icon={<ShoppingCart className="w-6 h-6 text-blue-500" />}
          isLoading={isLoading}
        />
        <StatCard 
          title="Pendapatan Bulan Ini" 
          value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.thisMonth)}
          icon={<Users className="w-6 h-6 text-indigo-500" />}
          isLoading={isLoading}
        />
      </div>

      {/* Grafik Pendapatan */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Grafik Pendapatan</h2>
            <div className="flex space-x-2">
                <Button size="sm" variant={timeRange === '7days' ? 'default' : 'outline'} onClick={() => setTimeRange('7days')}>7 Hari</Button>
                <Button size="sm" variant={timeRange === '1month' ? 'default' : 'outline'} onClick={() => setTimeRange('1month')}>1 Bulan</Button>
                <Button size="sm" variant={timeRange === '6months' ? 'default' : 'outline'} onClick={() => setTimeRange('6months')}>6 Bulan</Button>
            </div>
        </div>
        {isLoading ? (
            <div className="flex justify-center items-center h-[350px]">
                <LoaderCircle className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        ) : (
            <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${Number(value) / 1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }} />
                <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            </div>
        )}
      </div>

       {/* Tabel Rincian Pendapatan Harian */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white p-6 border-b dark:border-gray-700">Rincian Pendapatan per Hari</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-right">Total Pendapatan</th>
                <th scope="col" className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center p-8">
                    <LoaderCircle className="w-6 h-6 mx-auto animate-spin" />
                  </td>
                </tr>
              ) : tableData.length > 0 ? (
                tableData.map((row) => (
                  <tr key={row.date} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/20">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {new Date(row.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="outline" size="sm" onClick={() => toast.success('Fitur detail akan datang!')}>
                        Lihat Detail
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr>
                    <td colSpan={3} className="text-center p-8 text-gray-500">
                        Tidak ada data pendapatan untuk ditampilkan.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Tambahkan Paginasi di sini jika datanya sangat banyak */}
       </div>
    </div>
  );
}