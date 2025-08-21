"use client";

import React from 'react';
import { Users, Wallet, AlertTriangle, BarChart2, ChevronDown, Award } from 'lucide-react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';
import { getDashboardStats, getTopSantriBySaldo } from '@/lib/api'; // Asumsi fungsi API ini ada
import Cookies from 'js-cookie';

// Tipe data untuk statistik
interface DashboardStats {
  totalSantri: number;
  totalSaldo: number;
  totalHutang: number;
}
// Tipe data untuk santri dengan saldo terbanyak
interface TopSantri {
    name: string;
    saldo: number;
}


// --- Komponen Kartu Statistik ---
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
      <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

// --- Tooltip & Komponen Grafik (Tidak Berubah) ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
        <p className="label font-bold text-gray-800 dark:text-white">{`${label}`}</p>
        <p className="intro text-green-500">{`Pemasukan : ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payload[0].value)}`}</p>
        <p className="intro text-red-500">{`Pengeluaran : ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payload[1].value)}`}</p>
      </div>
    );
  }
  return null;
};
function TransactionChart({ data }: { data: any[] }) {
    // Data dummy untuk grafik, bisa disesuaikan dengan API
    const chartData = { "7hari": [ /* ... data ... */ ] }; 
    const [range, setRange] = useState<keyof typeof chartData>("7hari");

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="gray" fontSize={12} />
                <YAxis stroke="gray" fontSize={12} tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value as number)} />
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Pemasukan" stroke="#10b981" fillOpacity={1} fill="url(#colorPemasukan)" />
                <Area type="monotone" dataKey="Pengeluaran" stroke="#ef4444" fillOpacity={1} fill="url(#colorPengeluaran)" />
            </AreaChart>
        </ResponsiveContainer>
    );
}


// --- Komponen Utama ---
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topSantri, setTopSantri] = useState<TopSantri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data dummy untuk grafik, bisa diganti dengan data dari API
  const chartData = { "7hari": [ { name: 'Sen', Pemasukan: 4000, Pengeluaran: 2400 }, { name: 'Sel', Pemasukan: 3000, Pengeluaran: 1398 } ] };
  const [range, setRange] = useState<keyof typeof chartData>("7hari");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = Cookies.get('accessToken') || '';
      try {
        const [statsData, topSantriData] = await Promise.all([
          getDashboardStats(token),
          getTopSantriBySaldo(token)
        ]);
        setStats(statsData);
        setTopSantri(topSantriData);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Selamat datang kembali, Admin!</p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Santri"
          value={isLoading ? '...' : stats?.totalSantri.toString() ?? '0'}
          icon={<Users className="w-8 h-8 text-blue-500" />}
        />
        <StatCard
          title="Total Saldo Terkelola"
          value={isLoading ? '...' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats?.totalSaldo ?? 0)}
          icon={<Wallet className="w-8 h-8 text-green-500" />}
        />
        <StatCard
          title="Total Hutang Santri"
          value={isLoading ? '...' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats?.totalHutang ?? 0)}
          icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
        />
      </div>

      {/* Grafik + Saldo Terbanyak */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Grafik */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Aktivitas Keuangan</h2>
            <div className="relative">
                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value as keyof typeof chartData)}
                    className="px-4 py-2 pr-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm outline-none appearance-none"
                >
                    <option value="7hari">7 Hari Terakhir</option>
                    {/* Tambahkan opsi lain jika perlu */}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <TransactionChart data={chartData[range]} />
          </div>
        </div>

        {/* Saldo Terbanyak */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Santri Saldo Terbanyak</h2>
          <ul className="space-y-4">
            {isLoading ? ( <p>Memuat...</p> ) : (
                topSantri.map((santri, index) => (
                  <li key={index} className="flex items-center">
                    <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Award className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{santri.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.saldo)}
                    </p>
                  </li>
                ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}