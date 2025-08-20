"use client";

import React, { useState } from 'react';
import { Users, Wallet, Clock, ArrowUpRight, ArrowDownRight, ChevronDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid } from 'recharts';

// --- Data Tiruan (Mock Data) ---
const stats = {
  totalSantri: 152,
  totalSaldo: 125500000,
  pendingTopUp: 2,
};

const recentActivities = [
  { type: 'top-up', name: 'Ahmad Yusuf', amount: 200000, time: '2 menit yang lalu' },
  { type: 'transaction', name: 'Kantin Blok A', amount: 15000, time: '10 menit yang lalu' },
  { type: 'top-up', name: 'Citra Lestari', amount: 300000, time: '1 jam yang lalu' },
  { type: 'transaction', name: 'Koperasi Pondok', amount: 50000, time: '3 jam yang lalu' },
];

// Data tiruan untuk grafik
const chartData = {
  "7hari": [
    { name: 'Senin', Pemasukan: 400000, Pengeluaran: 240000 },
    { name: 'Selasa', Pemasukan: 300000, Pengeluaran: 139800 },
    { name: 'Rabu', Pemasukan: 200000, Pengeluaran: 980000 },
    { name: 'Kamis', Pemasukan: 278000, Pengeluaran: 390800 },
    { name: 'Jumat', Pemasukan: 189000, Pengeluaran: 480000 },
    { name: 'Sabtu', Pemasukan: 239000, Pengeluaran: 380000 },
    { name: 'Minggu', Pemasukan: 349000, Pengeluaran: 430000 },
  ],
  "1bulan": [
    { name: 'Minggu 1', Pemasukan: 1200000, Pengeluaran: 800000 },
    { name: 'Minggu 2', Pemasukan: 1500000, Pengeluaran: 1000000 },
    { name: 'Minggu 3', Pemasukan: 1700000, Pengeluaran: 1100000 },
    { name: 'Minggu 4', Pemasukan: 1600000, Pengeluaran: 1200000 },
  ],
  "3bulan": [
    { name: 'Januari', Pemasukan: 4000000, Pengeluaran: 2500000 },
    { name: 'Februari', Pemasukan: 4200000, Pengeluaran: 3000000 },
    { name: 'Maret', Pemasukan: 4500000, Pengeluaran: 3200000 },
  ],
  "6bulan": [
    { name: 'Jan', Pemasukan: 4000000, Pengeluaran: 2500000 },
    { name: 'Feb', Pemasukan: 4200000, Pengeluaran: 3000000 },
    { name: 'Mar', Pemasukan: 4500000, Pengeluaran: 3200000 },
    { name: 'Apr', Pemasukan: 4700000, Pengeluaran: 3500000 },
    { name: 'Mei', Pemasukan: 5000000, Pengeluaran: 3700000 },
    { name: 'Jun', Pemasukan: 5300000, Pengeluaran: 4000000 },
  ],
  "12bulan": [
    { name: 'Jan', Pemasukan: 4000000, Pengeluaran: 2500000 },
    { name: 'Feb', Pemasukan: 4200000, Pengeluaran: 3000000 },
    { name: 'Mar', Pemasukan: 4500000, Pengeluaran: 3200000 },
    { name: 'Apr', Pemasukan: 4700000, Pengeluaran: 3500000 },
    { name: 'Mei', Pemasukan: 5000000, Pengeluaran: 3700000 },
    { name: 'Jun', Pemasukan: 5300000, Pengeluaran: 4000000 },
    { name: 'Jul', Pemasukan: 5500000, Pengeluaran: 4200000 },
    { name: 'Agu', Pemasukan: 5700000, Pengeluaran: 4400000 },
    { name: 'Sep', Pemasukan: 5900000, Pengeluaran: 4600000 },
    { name: 'Okt', Pemasukan: 6000000, Pengeluaran: 4700000 },
    { name: 'Nov', Pemasukan: 6200000, Pengeluaran: 4800000 },
    { name: 'Des', Pemasukan: 6500000, Pengeluaran: 5000000 },
  ],
};

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

// --- Tooltip Grafik ---
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

// --- Komponen Grafik ---
function TransactionChart({ data }: { data: any[] }) {
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
  const [range, setRange] = useState<keyof typeof chartData>("7hari");

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
          value={stats.totalSantri.toString()}
          icon={<Users className="w-8 h-8 text-blue-500" />}
        />
        <StatCard
          title="Total Saldo Terkelola"
          value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.totalSaldo)}
          icon={<Wallet className="w-8 h-8 text-green-500" />}
        />
        <StatCard
          title="Top-Up Menunggu Verifikasi"
          value={stats.pendingTopUp.toString()}
          icon={<Clock className="w-8 h-8 text-yellow-500" />}
        />
      </div>

      {/* Grafik + Aktivitas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Grafik */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Aktivitas Keuangan</h2>
            <div className="relative inline-block w-full text-gray-700 dark:text-white">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value as keyof typeof chartData)}
                className="w-full px-4 py-2 pr-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm outline-none appearance-none"
              >
                <option value="7hari">Per Minggu</option>
                <option value="1bulan">Per 1 Bulan</option>
                <option value="3bulan">Per 3 Bulan</option>
                <option value="6bulan">Per 6 Bulan</option>
                <option value="12bulan">Per 12 Bulan</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <TransactionChart data={chartData[range]} />
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Aktivitas Terbaru</h2>
          <ul className="space-y-4">
            {recentActivities.map((activity, index) => (
              <li key={index} className="flex items-center">
                <div className={`p-2 rounded-full ${activity.type === 'top-up' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                  {activity.type === 'top-up'
                    ? <ArrowUpRight className="w-5 h-5 text-green-500" />
                    : <ArrowDownRight className="w-5 h-5 text-red-500" />}
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
                <p className={`text-sm font-semibold ${activity.type === 'top-up' ? 'text-green-600' : 'text-red-600'}`}>
                  {activity.type === 'top-up' ? '+' : '-'}
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(activity.amount)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
