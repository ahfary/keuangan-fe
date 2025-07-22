import React from 'react';
import Link from 'next/link';
import { Archive, ShoppingCart, BookText, TrendingUp, BookUser, ArrowRight } from 'lucide-react';

// Definisikan data untuk setiap kartu navigasi
const kantinMenu = [
  {
    title: 'Manajemen Stok',
    description: 'Kelola daftar produk, tambah stok, dan atur harga jual.',
    href: '/dashboard/kantin/stok',
    icon: <Archive className="w-10 h-10 text-blue-500" />,
  },
  {
    title: 'Data Penjualan',
    description: 'Lihat riwayat transaksi penjualan dari aplikasi kasir.',
    href: '/dashboard/kantin/penjualan',
    icon: <ShoppingCart className="w-10 h-10 text-green-500" />,
  },
  {
    title: 'Laporan Harian',
    description: 'Akses jurnal akuntansi harian untuk pembukuan.',
    href: '/dashboard/kantin/laporan-harian',
    icon: <BookText className="w-10 h-10 text-yellow-500" />,
  },
  {
    title: 'Rekap Pendapatan',
    description: 'Analisis dan rekapitulasi total pendapatan kantin.',
    href: '/dashboard/kantin/pendapatan',
    icon: <TrendingUp className="w-10 h-10 text-indigo-500" />,
  },
  {
    title: 'Manajemen Piutang',
    description: 'Catat dan kelola piutang dari pelanggan atau santri.',
    href: '/dashboard/kantin/piutang',
    icon: <BookUser className="w-10 h-10 text-red-500" />,
  },
];

export default function KantinOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Modul Toko / Kantin</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Pilih menu di bawah untuk mengelola operasional kantin.</p>
      </div>

      {/* Grid untuk Kartu Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kantinMenu.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {item.icon}
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 transition-colors" />
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}