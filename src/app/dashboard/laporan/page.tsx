import React from 'react';
import { Download } from 'lucide-react';

export default function LaporanPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Laporan Keuangan</h1>

      {/* Panel Filter */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Filter Laporan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Laporan</label>
            <select id="reportType" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option>Pemasukan (Top-Up)</option>
              <option>Pengeluaran (Transaksi)</option>
              <option>Laporan Keseluruhan</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Mulai</label>
            <input type="date" id="startDate" className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Selesai</label>
            <input type="date" id="endDate" className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
          </div>
        </div>
        <div className="mt-4 text-right">
          <button className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors ml-auto">
            <Download className="w-5 h-5 mr-2" />
            Generate & Unduh Laporan
          </button>
        </div>
      </div>

      {/* Area Hasil Laporan */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
         <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">Hasil Laporan</h2>
         <p className="text-gray-500 dark:text-gray-400">Hasil laporan akan ditampilkan di sini setelah Anda menekan tombol &apos;Generate&lsquo;.</p>
      </div>
    </div>
  );
}
