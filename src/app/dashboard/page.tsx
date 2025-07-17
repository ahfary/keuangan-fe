"use client"; 

import React from 'react';
import { Users, Wallet, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
const chartData = [
  { name: 'Senin', Pemasukan: 400000, Pengeluaran: 240000 },
  { name: 'Selasa', Pemasukan: 300000, Pengeluaran: 139800 },
  { name: 'Rabu', Pemasukan: 200000, Pengeluaran: 980000 },
  { name: 'Kamis', Pemasukan: 278000, Pengeluaran: 390800 },
  { name: 'Jumat', Pemasukan: 189000, Pengeluaran: 480000 },
  { name: 'Sabtu', Pemasukan: 239000, Pengeluaran: 380000 },
  { name: 'Minggu', Pemasukan: 349000, Pengeluaran: 430000 },
];

// --- Komponen-komponen ---

// Komponen untuk Kartu Statistik
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

// Komponen untuk Tooltip Grafik
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

// Komponen Grafik
function TransactionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
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

// --- Komponen Utama Halaman Dashboard ---
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Selamat datang kembali, Admin!</p>
      </div>

      {/* Grid untuk Kartu Statistik */}
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

      {/* Grid untuk Grafik dan Aktivitas Terbaru */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Kolom Grafik (2/3 dari lebar) */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Aktivitas Keuangan (7 Hari Terakhir)</h2>
          <div style={{ width: '100%', height: 300 }}>
            <TransactionChart />
          </div>
        </div>

        {/* Kolom Aktivitas Terbaru (1/3 dari lebar) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Aktivitas Terbaru</h2>
          <ul className="space-y-4">
            {recentActivities.map((activity, index) => (
              <li key={index} className="flex items-center">
                <div className={`p-2 rounded-full ${activity.type === 'top-up' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                  {activity.type === 'top-up' 
                    ? <ArrowUpRight className="w-5 h-5 text-green-500" /> 
                    : <ArrowDownRight className="w-5 h-5 text-red-500" />
                  }
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