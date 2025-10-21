/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  ReceiptText,
  ShoppingCart,
  Calendar,
  Download,
  LoaderCircle,
  SearchX,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import useAxios from "@/hooks/useAxios"; // 1. Impor custom hook

// --- Tipe Data & Komponen Statis (Tidak Berubah) ---
interface DailySale {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: "Lunas" | "Hutang";
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

const ITEMS_PER_PAGE = 5;

const StatCard = ({ title, value, icon, isLoading }: { title: string; value: string; icon: React.ReactNode; isLoading: boolean; }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
      <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {isLoading ? (
           <div className="h-8 w-24 mt-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ) : (
           <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        )}
      </div>
    </div>
);

// --- Komponen Inti ---
function LaporanHarianContent() {
  const searchParams = useSearchParams();
  const tanggalFromUrl = searchParams.get('tanggal');

  // State UI
  const [selectedDate, setSelectedDate] = useState(
    tanggalFromUrl || new Date().toISOString().split("T")[0]
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Gunakan useAxios untuk mengambil data
  const { data: salesHistory, isLoading, error } = useAxios<DailySale[]>({
    url: '/history',
    method: 'get',
  });

  // Tampilkan toast jika ada error
  useEffect(() => {
    if (error) {
      toast.error("Gagal memuat riwayat penjualan.");
    }
  }, [error]);
  
  // Set tanggal dari URL jika ada
  useEffect(() => {
    if (tanggalFromUrl) {
        setSelectedDate(tanggalFromUrl);
    }
  }, [tanggalFromUrl]);

  // 3. Proses data yang sudah diambil menggunakan useMemo
  const reportData = useMemo<DailySummary | null>(() => {
    if (!salesHistory || !selectedDate) return null;

    const filteredSales = salesHistory.filter(sale => new Date(sale.createdAt).toISOString().split('T')[0] === selectedDate);

    if (filteredSales.length > 0) {
      const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      const totalItemsSold = filteredSales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
      return {
        totalRevenue,
        totalTransactions: filteredSales.length,
        totalItemsSold,
        transactions: filteredSales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      };
    }
    return null;
  }, [salesHistory, selectedDate]);

  const totalPages = reportData ? Math.ceil(reportData.transactions.length / ITEMS_PER_PAGE) : 1;
  const paginatedTransactions = useMemo(() => {
    if (!reportData) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return reportData.transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [reportData, currentPage]);


  const handleDownload = () => {
    if (!reportData || reportData.transactions.length === 0) {
        toast.error("Tidak ada data untuk diunduh.");
        return;
      }
  
      setIsDownloading(true);
      
      const doc = new jsPDF();
      const formattedDate = new Date(selectedDate).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
      
      doc.setFontSize(18);
      doc.text("Laporan Harian Kantin", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Tanggal: ${formattedDate}`, 14, 29);
      
      doc.setFontSize(12);
      doc.text("Ringkasan", 14, 45);
      autoTable(doc, {
          startY: 50,
          head: [['Total Pendapatan', 'Total Transaksi', 'Total Item Terjual']],
          body: [[
              new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(reportData.totalRevenue),
              `${reportData.totalTransactions} transaksi`,
              `${reportData.totalItemsSold} item`,
          ]],
          theme: 'grid',
          headStyles: { fillColor: [79, 70, 229] }
      });
  
      const tableBody = reportData.transactions.map(tx => [
          new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          tx.santri.name,
          tx.status,
          new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tx.totalAmount)
      ]);
      
      const finalY = (doc as any).lastAutoTable.finalY || 70;
      doc.text("Rincian Transaksi", 14, finalY + 15);
      autoTable(doc, {
          startY: finalY + 20,
          head: [['Waktu', 'Nama Pembeli', 'Status', 'Total']],
          body: tableBody,
          theme: 'striped',
          headStyles: { fillColor: [79, 70, 229] }
      });
  
      doc.save(`laporan-harian-${selectedDate}.pdf`);
      setIsDownloading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <Link href="/dashboard/admin/kantin" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Menu Kantin
            </Link>
          <h1 className="text-3xl font-bold">Laporan Harian</h1>
          <p className="mt-1 text-gray-500">
            Ringkasan transaksi dan pendapatan per hari.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full md:w-auto dark:bg-gray-700"
          />
          <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? 'Memproses...' : 'Unduh Laporan'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Total Pendapatan"
            value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(reportData?.totalRevenue ?? 0)}
            icon={<DollarSign className="w-6 h-6 text-green-500" />}
            isLoading={isLoading}
        />
        <StatCard 
            title="Total Transaksi"
            value={reportData?.totalTransactions.toString() ?? '0'}
            icon={<ReceiptText className="w-6 h-6 text-blue-500" />}
            isLoading={isLoading}
        />
        <StatCard 
            title="Item Terjual"
            value={reportData?.totalItemsSold.toString() ?? '0'}
            icon={<ShoppingCart className="w-6 h-6 text-indigo-500" />}
            isLoading={isLoading}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white p-6 border-b dark:border-gray-700">Rincian Transaksi</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Waktu</th>
                <th className="px-6 py-3">Nama Pembeli</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="text-center p-8"><LoaderCircle className="w-6 h-6 mx-auto animate-spin" /></td></tr>
              ) : paginatedTransactions.length > 0 ? (
                paginatedTransactions.map(tx => (
                  <tr key={tx.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{tx.santri.name}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2 py-1 text-xs font-medium rounded-full", tx.status === 'Lunas' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200')}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tx.totalAmount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="text-center p-16"><SearchX className="w-12 h-12 mx-auto text-gray-400" /><p className="mt-4 text-gray-500">Tidak ada transaksi pada tanggal yang dipilih.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
            <div className="p-4 flex justify-center items-center gap-4 border-t dark:border-gray-700">
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

// Bungkus dengan Suspense untuk bisa membaca URL params
export default function LaporanHarianPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><LoaderCircle className="w-8 h-8 animate-spin" /></div>}>
            <LaporanHarianContent />
        </Suspense>
    );
}

