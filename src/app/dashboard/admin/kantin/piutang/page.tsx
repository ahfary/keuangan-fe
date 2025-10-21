"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useAxios from '@/hooks/useAxios'; // 1. Impor custom hook

// --- Tipe Data untuk Santri yang Berhutang ---
interface SantriHutang {
  id: string;
  name: string;
  kelas: string;
  jurusan: 'RPL' | 'TKJ';
  hutang: number;
}

const ITEMS_PER_PAGE = 6;

export default function ManajemenHutangPage() {
  // 2. Gunakan useAxios untuk mengambil semua data santri
  const { data: allSantri, isLoading, error } = useAxios<SantriHutang[]>({
    url: '/santri',
    method: 'get'
  });

  // State UI
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'semua' | 'kelas' | 'jurusan'>('semua');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Tampilkan toast jika ada error
  useEffect(() => {
    if (error) {
        toast.error("Gagal mengambil data piutang santri.");
    }
  }, [error]);

  // 3. Proses data yang sudah diambil untuk memfilter yang punya hutang
  const dataHutang = useMemo(() => {
    if (!allSantri) return [];
    return allSantri.filter((santri) => santri.hutang > 0);
  }, [allSantri]);


  // --- Logika Filter (Tidak berubah) ---
  const uniqueKelas = useMemo(
    () => Array.from(new Set(dataHutang.map((s) => s.kelas))).sort(),
    [dataHutang]
  );

  const filteredData = useMemo(() => {
    return dataHutang.filter(santri => {
      const matchesSearch = santri.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (filterType === 'kelas') {
        return matchesSearch && (selectedKelas ? santri.kelas === selectedKelas : true);
      }
      if (filterType === 'jurusan') {
        return matchesSearch && (selectedJurusan ? santri.jurusan === selectedJurusan : true);
      }
      return matchesSearch;
    });
  }, [dataHutang, searchTerm, filterType, selectedKelas, selectedJurusan]);

  // --- Logika Pagination (Tidak berubah) ---
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const PaginationControls = () => (
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
  );

  return (
    <div className="space-y-6">
      {/* --- Header Halaman --- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manajemen Hutang Santri</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Cek, filter, dan kelola data hutang santri.</p>
        </div>
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
              <Button
                size="sm"
                variant={filterType === "semua" ? "default" : "outline"}
                onClick={() => setFilterType("semua")}
              >
                Semua
              </Button>
              <Button
                size="sm"
                variant={filterType === "kelas" ? "default" : "outline"}
                onClick={() => setFilterType("kelas")}
              >
                Kelas
              </Button>
              <Button
                size="sm"
                variant={filterType === "jurusan" ? "default" : "outline"}
                onClick={() => setFilterType("jurusan")}
              >
                Jurusan
              </Button>
            </div>

            {filterType === "kelas" && (
              <select
                className="p-2 border rounded-md bg-white dark:bg-gray-700 text-sm w-full sm:w-auto"
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
              >
                <option value="">Semua Kelas</option>
                {uniqueKelas.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            )}
            {filterType === "jurusan" && (
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

      {/* --- Tabel Data Hutang --- */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Nama</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Kelas</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Jurusan</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Hutang</th>
              <th className="p-4 font-semibold text-center text-gray-600 dark:text-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center p-8"><LoaderCircle className="w-6 h-6 animate-spin mx-auto" /></td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map(santri => (
              <tr key={santri.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="p-4 capitalize text-gray-900 dark:text-white">{santri.name}</td>
                <td className="p-4 text-gray-600 dark:text-gray-300">{santri.kelas}</td>
                <td className="p-4 text-gray-600 dark:text-gray-300">{santri.jurusan}</td>
                <td className="p-4 font-mono text-red-500 dark:text-red-400">
                  - {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.hutang)}
                </td>
                <td className="p-4 text-center">
                  <Link href={`/dashboard/admin/santri/${santri.id}`}>
                    <Button variant="outline" size="sm">Detail</Button>
                  </Link>
                </td>
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-500">
                    Tidak ada data hutang yang cocok dengan pencarian Anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="p-4 flex justify-start">
            <PaginationControls />
          </div>
        )}
      </div>
    </div>
  );
}

