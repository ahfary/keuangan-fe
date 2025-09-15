"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Wallet,
  Clock,
  ChevronDown,
  LoaderCircle,
  Trophy,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
} from "recharts";
import { getTotalSantri, getTotalSaldo, getTotalHutang, getTopBalanceSantri } from "@/lib/api";
import toast from "react-hot-toast";

// --- Tipe Data ---
interface Stats {
  totalSantri: number;
  totalSaldo: number;
  totalHutang: number;
}
interface TopSantri {
  id: string;
  name: string;
  kelas: string;
  jurusan: string;
  saldo: number;
}


// Data tiruan untuk grafik
const chartData = {
    "7hari": [
        { name: "Senin", Pemasukan: 400000, Pengeluaran: 240000 },
        { name: "Selasa", Pemasukan: 300000, Pengeluaran: 139800 },
        { name: "Rabu", Pemasukan: 200000, Pengeluaran: 980000 },
        { name: "Kamis", Pemasukan: 278000, Pengeluaran: 390800 },
        { name: "Jumat", Pemasukan: 189000, Pengeluaran: 480000 },
        { name: "Sabtu", Pemasukan: 239000, Pengeluaran: 380000 },
        { name: "Minggu", Pemasukan: 349000, Pengeluaran: 430000 },
    ],
    "1bulan": [
      { name: "Minggu 1", Pemasukan: 1200000, Pengeluaran: 800000 },
      { name: "Minggu 2", Pemasukan: 1500000, Pengeluaran: 1000000 },
      { name: "Minggu 3", Pemasukan: 1700000, Pengeluaran: 1100000 },
      { name: "Minggu 4", Pemasukan: 1600000, Pengeluaran: 1200000 },
    ],
    "3bulan": [
      { name: "Januari", Pemasukan: 4000000, Pengeluaran: 2500000 },
      { name: "Februari", Pemasukan: 4200000, Pengeluaran: 3000000 },
      { name: "Maret", Pemasukan: 4500000, Pengeluaran: 3200000 },
    ],
    "6bulan": [
      { name: "Jan", Pemasukan: 4000000, Pengeluaran: 2500000 },
      { name: "Feb", Pemasukan: 4200000, Pengeluaran: 3000000 },
      { name: "Mar", Pemasukan: 4500000, Pengeluaran: 3200000 },
      { name: "Apr", Pemasukan: 4700000, Pengeluaran: 3500000 },
      { name: "Mei", Pemasukan: 5000000, Pengeluaran: 3700000 },
      { name: "Jun", Pemasukan: 5300000, Pengeluaran: 4000000 },
    ],
    "12bulan": [
      { name: "Jan", Pemasukan: 4000000, Pengeluaran: 2500000 },
      { name: "Feb", Pemasukan: 4200000, Pengeluaran: 3000000 },
      { name: "Mar", Pemasukan: 4500000, Pengeluaran: 3200000 },
      { name: "Apr", Pemasukan: 4700000, Pengeluaran: 3500000 },
      { name: "Mei", Pemasukan: 5000000, Pengeluaran: 3700000 },
      { name: "Jun", Pemasukan: 5300000, Pengeluaran: 4000000 },
      { name: "Jul", Pemasukan: 5500000, Pengeluaran: 4200000 },
      { name: "Agu", Pemasukan: 5700000, Pengeluaran: 4400000 },
      { name: "Sep", Pemasukan: 5900000, Pengeluaran: 4600000 },
      { name: "Okt", Pemasukan: 6000000, Pengeluaran: 4700000 },
      { name: "Nov", Pemasukan: 6200000, Pengeluaran: 4800000 },
      { name: "Des", Pemasukan: 6500000, Pengeluaran: 5000000 },
    ],
};

// --- Komponen Kartu Statistik ---
function StatCard({
  title,
  value,
  icon,
  isLoading,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
      <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        {isLoading ? (
          <LoaderCircle className="w-6 h-6 animate-spin mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        )}
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
        <p className="intro text-green-500">{`Pemasukan : ${new Intl.NumberFormat(
          "id-ID",
          { style: "currency", currency: "IDR" }
        ).format(payload[0].value)}`}</p>
        <p className="intro text-red-500">{`Pengeluaran : ${new Intl.NumberFormat(
          "id-ID",
          { style: "currency", currency: "IDR" }
        ).format(payload[1].value)}`}</p>
      </div>
    );
  }
  return null;
};

// --- Komponen Grafik ---
function TransactionChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
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
        <YAxis
          stroke="gray"
          fontSize={12}
          tickFormatter={(value) =>
            new Intl.NumberFormat("id-ID", { notation: "compact" }).format(
              value as number
            )
          }
        />
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="Pemasukan"
          stroke="#10b981"
          fillOpacity={1}
          fill="url(#colorPemasukan)"
        />
        <Area
          type="monotone"
          dataKey="Pengeluaran"
          stroke="#ef4444"
          fillOpacity={1}
          fill="url(#colorPengeluaran)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// --- Komponen Utama ---
export default function DashboardPage() {
  const [range, setRange] = useState<keyof typeof chartData>("7hari");
  const [stats, setStats] = useState<Stats>({ totalSantri: 0, totalSaldo: 0, totalHutang: 0 });
  const [topSantri, setTopSantri] = useState<TopSantri[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [santriData, saldoData, hutangData, topSantriData] = await Promise.all([
          getTotalSantri(),
          getTotalSaldo(),
          getTotalHutang(),
          getTopBalanceSantri(),
        ]);
        setStats({
          totalSantri: santriData || 0,
          totalSaldo: saldoData || 0,
          totalHutang: hutangData || 0,
        });
        setTopSantri(topSantriData || []);
      } catch (error) {
        toast.error("Gagal memuat data dashboard.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const trophyDetails = [
    { iconColor: "text-yellow-400", bgColor: "bg-yellow-400/20" },
    { iconColor: "text-gray-400", bgColor: "bg-gray-400/20" },
    { iconColor: "text-yellow-600", bgColor: "bg-yellow-600/20" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Selamat datang kembali, Admin!
        </p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Santri"
          value={stats.totalSantri.toString()}
          icon={<Users className="w-8 h-8 text-blue-500" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Saldo Terkelola"
          value={new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(stats.totalSaldo)}
          icon={<Wallet className="w-8 h-8 text-green-500" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Hutang Santri"
          value={new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(stats.totalHutang)}
          icon={<Clock className="w-8 h-8 text-yellow-500" />}
          isLoading={isLoading}
        />
      </div>

      {/* Grafik + Saldo Terbanyak */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Grafik */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
              Aktivitas Keuangan
            </h2>
            <div className="relative inline-block w-full text-gray-700 dark:text-white">
              <select
                value={range}
                onChange={(e) =>
                  setRange(e.target.value as keyof typeof chartData)
                }
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
          <TransactionChart data={chartData[range]} />
        </div>

        {/* Saldo Terbanyak */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
            Saldo Terbanyak
          </h2>
          <ul className="space-y-4">
            {isLoading ? (
              <p className="text-center text-gray-500">Memuat data...</p>
            ) : (
              topSantri.slice(0, 7).map((santri, index) => (
                <li key={santri.id} className="flex items-center">
                  <div className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${index < 3 ? trophyDetails[index].bgColor : 'bg-gray-100 dark:bg-gray-700'}`}>
                    {index < 3 ? (
                      <Trophy className={`w-6 h-6 ${trophyDetails[index].iconColor}`} />
                    ) : (
                      <span className="font-bold text-gray-600 dark:text-gray-300">{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {santri.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {santri.kelas} {santri.jurusan}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-green-600">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0
                    }).format(santri.saldo)}
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