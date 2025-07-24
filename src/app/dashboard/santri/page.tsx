// File: src/app/dashboard/santri/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/app/components/ui/input'; // FIX: Path impor diperbaiki
import { Button } from '@/app/components/ui/button'; // FIX: Path impor diperbaiki
import { Eye, UserPlus, LoaderCircle } from 'lucide-react';
import { getSantriList } from '@/app/lib/api'; // FIX: Path impor diperbaiki

// Definisikan tipe data Santri yang sesuai dengan data dari backend
interface Santri {
  id: number; // ID dari database biasanya number
  name: string;
  kelas: string; // FIX: Menggunakan 'kelas'
  saldo: number; // FIX: Menggunakan 'saldo'
}

export default function SantriListPage() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');

  // Efek untuk mengambil data saat komponen dimuat
  useEffect(() => {
    const fetchSantri = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken') || '';
        const data = await getSantriList(token);
        setSantriList(data);
      } catch (error) {
        console.error("Gagal mengambil data santri:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSantri();
  }, []);

  // Dapatkan daftar kelas unik dari data santri
  const uniqueClasses = useMemo(() => {
    // FIX: Menggunakan properti 'kelas'
    const classes = new Set(santriList.map(s => s.kelas));
    return ['Semua', ...Array.from(classes)];
  }, [santriList]);

  // Logika untuk memfilter santri
  const filteredSantri = useMemo(() => {
    // Pastikan santri dan propertinya ada sebelum diakses
    return santriList.filter(santri => {
      const matchesSearch = santri.name && santri.name.toLowerCase().includes(searchTerm.toLowerCase());
      // FIX: Menggunakan properti 'kelas'
      const matchesClass = selectedClass === 'Semua' || santri.kelas === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [santriList, searchTerm, selectedClass]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manajemen Santri</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Cari, filter, dan kelola data keuangan santri.</p>
        </div>
        <Button>
          <UserPlus className="w-5 h-5 mr-2" />
          Tambah Santri Baru
        </Button>
      </div>

      {/* Panel Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Cari nama santri..."
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          className="max-w-full md:max-w-xs"
        />
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="flex h-10 w-full md:max-w-xs items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {uniqueClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
        </select>
      </div>

      {/* Tabel Data */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoaderCircle className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="ml-4 text-gray-500">Memuat data santri...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Kelas</th>
                  <th className="px-6 py-3">Saldo</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {filteredSantri.length > 0 ? filteredSantri.map((santri) => (
                  <tr key={santri.id} className="hover:bg-gray-50 dark:hover:bg-gray-600/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{santri.name}</td>
                    {/* FIX: Menggunakan properti 'kelas' */}
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{santri.kelas}</td>
                    {/* FIX: Menggunakan properti 'saldo' */}
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.saldo)}</td>
                    <td className="px-6 py-4 text-center">
                      <Link href={`/dashboard/santri/${santri.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                      Data tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
