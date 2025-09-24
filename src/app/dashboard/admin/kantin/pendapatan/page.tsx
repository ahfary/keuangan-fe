"use client"; // Diperlukan untuk komponen grafik (recharts)

import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { DollarSign, ShoppingBag, Users } from "lucide-react";

// Data tiruan untuk statistik dan grafik
const stats = {
  today: 1250000,
  thisWeek: 7800000,
  thisMonth: 31200000,
};

const chartData = [
  { date: "Senin", total: 1100000 },
  { date: "Selasa", total: 1350000 },
  { date: "Rabu", total: 950000 },
  { date: "Kamis", total: 1500000 },
  { date: "Jumat", total: 1800000 },
  { date: "Sabtu", total: 650000 },
  { date: "Minggu", total: 450000 },
];

export default function PendapatanPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Rekapitulasi Pendapatan</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Analisis pendapatan kantin secara periodik.</p>
      </div>

      {/* Grid untuk Kartu Statistik */}
      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pendapatan Hari Ini</p>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.today)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pendapatan Minggu Ini</p>
            <ShoppingBag className="w-5 h-5 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.thisWeek)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pendapatan Bulan Ini</p>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats.thisMonth)}
          </p>
        </div>
      </div> */}

      {/* Grafik Pendapatan */}
      {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Grafik Pendapatan Mingguan</h2>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${Number(value) / 1000}k`} />
              <Tooltip cursor={{ fill: 'rgba(238, 242, 255, 0.5)' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
              <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}
    </div>
  );
}