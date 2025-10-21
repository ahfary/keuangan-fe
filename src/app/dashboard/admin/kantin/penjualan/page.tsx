/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, LoaderCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import useAxios from '@/hooks/useAxios'; // 1. Impor custom hook

// --- Tipe Data Disesuaikan dengan API ---
interface SaleItemDetail {
  id: number;
  historyId: number;
  itemId: number;
  quantity: number;
  priceAtPurchase: number;
}

interface SaleData {
  id: number;
  santriId: number;
  totalAmount: number;
  status: 'Lunas' | 'Hutang';
  santri: {
    id: number;
    name: string;
    kelas: string;
    jurusan: string;
  };
  items: SaleItemDetail[];
  createdAt: string;
}

interface ItemData {
  nama: string;
  id: number;
  // tambahkan field lain jika perlu
}

const ITEMS_PER_PAGE = 6;

// --- Komponen Utama Halaman Penjualan ---
export default function PenjualanPage() {
  // 2. Gunakan useAxios untuk mengambil data
  const { data: salesData, isLoading: isLoadingSales, error: salesError } = useAxios<SaleData[]>({ url: '/history', method: 'get' });
  const { data: itemsData, isLoading: isLoadingItems, error: itemsError } = useAxios<ItemData[]>({ url: '/items', method: 'get' });
  
  const isLoading = isLoadingSales || isLoadingItems;
  const combinedError = salesError || itemsError;
  const salesList = salesData || [];
  const itemsList = itemsData || [];

  // State UI
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'semua' | 'kelas' | 'jurusan'>('semua');
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (combinedError) {
      toast.error(`Gagal memuat data: ${combinedError}`);
    }
  }, [combinedError]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, selectedKelas, selectedJurusan]);
  
  // --- Logika Filter ---
  const uniqueKelas = useMemo(
    () => Array.from(new Set(salesList.map((s) => s.santri?.kelas).filter(Boolean))).sort(),
    [salesList]
  );
  
  const filteredData = useMemo(() => {
    return salesList.filter((sale) => {
      const santri = sale.santri;
      if (!santri) return false;

      const matchesSearch = santri.name.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterType === "kelas") {
        return matchesSearch && (selectedKelas ? santri.kelas === selectedKelas : true);
      }
      if (filterType === "jurusan") {
        return matchesSearch && (selectedJurusan ? santri.jurusan === selectedJurusan : true);
      }
      return matchesSearch;
    });
  }, [salesList, searchTerm, filterType, selectedKelas, selectedJurusan]);


  // --- Logika Pagination ---
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleToggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  
  const PaginationControls = () => (
    totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
        <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
        >
            <ChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
            key={page}
            size="sm"
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => handlePageChange(page)}
            >
            {page}
            </Button>
        ))}
        <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            <ChevronRight className="w-4 h-4" />
        </Button>
        </div>
    )
  );


  // Helper untuk cari nama item
  const getItemName = (itemId: number) => {
    const item = itemsList.find(i => i.id === itemId);
    return item ? (item.nama || `Item ID: ${itemId}`) : `Item ID: ${itemId}`;
  };

  return (
    <div className="space-y-6">
      {/* --- Header --- */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Data Penjualan</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Lihat riwayat transaksi penjualan dari aplikasi kasir.</p>
      </div>

      {/* --- Panel Pencarian dan Filter --- */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Cari nama santri..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Filter:</span>
            <Button size="sm" variant={filterType === 'semua' ? 'default' : 'outline'} onClick={() => setFilterType('semua')}>Semua</Button>
            <Button size="sm" variant={filterType === 'kelas' ? 'default' : 'outline'} onClick={() => setFilterType('kelas')}>Kelas</Button>
            <Button size="sm" variant={filterType === 'jurusan' ? 'default' : 'outline'} onClick={() => setFilterType('jurusan')}>Jurusan</Button>
          </div>

          {filterType === 'kelas' && (
            <select
              className="p-2 border rounded-md bg-white dark:bg-gray-700 text-sm w-full sm:w-auto"
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
            >
              <option value="">Semua Kelas</option>
              {uniqueKelas.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          )}
          {filterType === 'jurusan' && (
            <select
              className="p-2 border rounded-md bg-white dark:bg-gray-700 text-sm w-full sm:w-auto"
              value={selectedJurusan}
              onChange={(e) => setSelectedJurusan(e.target.value)}
            >
              <option value="">Semua Jurusan</option>
              <option value="RPL">RPL</option>
              <option value="TKJ">TKJ</option>
            </select>
          )}
        </div>
      </div>

      {/* --- Tabel Data Penjualan --- */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                <th scope="col" className="px-6 py-3">Nama Santri</th>
                <th scope="col" className="px-6 py-3">Tanggal</th>
                <th scope="col" className="px-6 py-3">Metode Bayar</th>
                <th scope="col" className="px-6 py-3 text-right">Total Harga</th>
                <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center p-8"><LoaderCircle className="w-6 h-6 mx-auto animate-spin" /></td></tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((sale) => (
                  <React.Fragment key={sale.id}>
                    <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 font-medium">{sale.santri.name}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(sale.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          sale.status === 'Lunas' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        )}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(sale.totalAmount)}</td>
                      <td className="px-6 py-4 text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleRow(sale.id)}>
                          Detail
                          <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform", expandedRow === sale.id && "rotate-180")} />
                        </Button>
                      </td>
                    </tr>
                    {expandedRow === sale.id && (
                      <tr className="bg-gray-50 dark:bg-gray-900/50">
                        <td colSpan={5} className="p-4">
                          <div className="p-4 bg-white dark:bg-gray-800 rounded-md">
                            <h4 className="font-bold mb-2 text-gray-800 dark:text-white">Detail Item (Transaksi ID: {sale.id}):</h4>
                            <ul className="space-y-1">
                              {sale.items.map((item) => (
                                <li key={item.id} className="flex justify-between text-gray-600 dark:text-gray-300 border-b border-dashed last:border-none py-1">
                                  <span>
                                    {getItemName(item.itemId)} <span className="text-gray-400">x{item.quantity}</span>
                                  </span>
                                  <span className="font-mono">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.priceAtPurchase * item.quantity)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500">
                    Tidak ada data yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
            </table>
        </div>
         <div className="p-4 flex justify-start">
            <PaginationControls />
         </div>
      </div>
    </div>
  );
}

