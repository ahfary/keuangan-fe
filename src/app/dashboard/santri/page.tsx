"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSantriList, createSantri, deleteSantri } from '@/lib/api';
import SantriFormModal from './components/SantriFormModal';
import toast from 'react-hot-toast';

// Tipe data untuk Santri
interface Santri {
  id: string;
  name: string;
  kelas: string;
  saldo: number;
  // Jika ada jurusan, tambahkan di sini: jurusan?: string;
}

// Tipe data untuk form
type SantriFormData = {
  name: string;
  kelas: string;
};

export default function SantriPage() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State untuk filter
  const [filterType, setFilterType] = useState<'semua' | 'kelas'>('semua');
  const [selectedKelas, setSelectedKelas] = useState('');

  // Fetch data awal
  useEffect(() => {
    const fetchSantri = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken') || '';
        const data = await getSantriList(token);
        setSantriList(data);
      } catch (error) {
        console.error("Gagal mengambil data santri:", error);
        toast.error('Gagal mengambil data santri.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSantri();
  }, []);

  // --- FUNGSI CREATE & DELETE ---

  const handleCreateSantri = async (data: SantriFormData) => {
    const token = localStorage.getItem('accessToken') || '';
    const promise = createSantri(data, token);

    toast.promise(promise, {
      loading: 'Menambahkan santri baru...',
      success: (newSantri) => {
        // Tambahkan santri baru ke daftar & reset filter
        setSantriList(prev => [newSantri, ...prev]);
        setIsModalOpen(false);
        setSearchTerm('');
        setFilterType('semua');
        return 'Santri berhasil ditambahkan!';
      },
      error: (err) => `Gagal menambahkan: ${err.message}`
    });
  };
  
  const handleDeleteSantri = (id: string, name: string) => {
    toast((t) => (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-semibold">
          Anda yakin ingin menghapus <br/> <span className="text-indigo-600">{name}</span>?
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              const token = localStorage.getItem('accessToken') || '';
              const promise = deleteSantri(id, token);
              
              toast.promise(promise, {
                  loading: 'Menghapus data...',
                  success: () => {
                      setSantriList(prev => prev.filter(s => s.id !== id));
                      toast.dismiss(t.id);
                      return 'Santri berhasil dihapus!';
                  },
                  error: (err) => `Gagal menghapus: ${err.message}`
              });
            }}
          >
            Ya, Hapus
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.dismiss(t.id)}>
            Batal
          </Button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  // --- LOGIKA FILTER ---

  const uniqueKelas = useMemo(() => {
    const kelasSet = new Set(santriList.map(s => s.kelas));
    return Array.from(kelasSet).sort();
  }, [santriList]);

  const filteredSantri = useMemo(() => {
    return santriList.filter(santri => {
      const matchesSearch = santri.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterType === 'kelas') {
        const matchesKelas = selectedKelas ? santri.kelas === selectedKelas : true;
        return matchesSearch && matchesKelas;
      }
      
      // Catatan: Jika ingin menambah filter jurusan, logikanya bisa ditambahkan di sini
      // if (filterType === 'jurusan') { ... }

      return matchesSearch; // Default 'semua'
    });
  }, [santriList, searchTerm, filterType, selectedKelas]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manajemen Santri</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Santri
          </Button>
        </div>

        {/* --- Bagian Filter dan Search --- */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Cari nama santri..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Filter:</span>
                <Button size="sm" variant={filterType === 'semua' ? 'default' : 'outline'} onClick={() => setFilterType('semua')}>Semua</Button>
                <Button size="sm" variant={filterType === 'kelas' ? 'default' : 'outline'} onClick={() => setFilterType('kelas')}>Kelas</Button>
                {/* <Button size="sm" variant={filterType === 'jurusan' ? 'default' : 'outline'} onClick={() => setFilterType('jurusan')}>Jurusan</Button> */}
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
          </div>
        </div>

        {/* --- Tabel Data Santri --- */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="p-4 font-semibold">Nama</th>
                        <th className="p-4 font-semibold">Kelas</th>
                        <th className="p-4 font-semibold">Jurusan</th>
                        <th className="p-4 font-semibold">Saldo</th>
                        <th className="p-4 font-semibold text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr><td colSpan={4} className="text-center p-8">Memuat data santri...</td></tr>
                    ) : filteredSantri.length > 0 ? (
                        filteredSantri.map(santri => (
                            <tr key={santri.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4 capitalize">{santri.name}</td>
                                <td className="p-4">{santri.kelas}</td>
                                <td className="p-4">{santri.jurusan}</td>
                                <td className="p-4 font-mono">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.saldo)}</td>
                                <td className="p-4 flex justify-center items-center gap-2">
                                    <Link href={`/dashboard/santri/${santri.id}`}>
                                      <Button variant="outline" size="sm">Detail</Button>
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteSantri(santri.id, santri.name)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={4} className="text-center p-8 text-gray-500">Tidak ada data yang cocok.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <SantriFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateSantri}
      />
    </>
  );
}