"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Trash2, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSantriList, createSantri, deleteSantri } from '@/lib/api';
import SantriFormModal from './components/SantriFormModal';
import toast from 'react-hot-toast';

// Tipe data untuk Santri, DITAMBAHKAN jurusan
interface Santri {
  id: string;
  name: string;
  kelas: string;
  jurusan: 'RPL' | 'TKJ'; // Menambahkan jurusan
  saldo: number;
}

// Tipe data untuk form
type SantriFormData = {
  name: string;
  kelas: string;
  jurusan: string; // Jurusan juga ditambahkan di form
};

export default function SantriPage() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State untuk filter
  const [filterType, setFilterType] = useState<'semua' | 'kelas' | 'jurusan'>('semua');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState('');

  // --- State untuk mode seleksi ---
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Set<string>>(new Set());

  // Fetch data awal
  useEffect(() => {
    const fetchSantri = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken') || '';
        // Asumsi API sekarang mengembalikan data dengan `jurusan`
        const data = await getSantriList(token); 
        setSantriList(data);
      } catch (error) {
        toast.error('Gagal mengambil data santri.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSantri();
  }, []);
  
  // --- Fungsi Aksi (Create, Delete) ---

  const handleCreateSantri = async (data: SantriFormData) => {
    const token = localStorage.getItem('accessToken') || '';
    toast.promise(createSantri(data, token), {
      loading: 'Menambahkan santri...',
      success: (newSantri) => {
        setSantriList(prev => [newSantri, ...prev]);
        setIsModalOpen(false);
        return 'Santri berhasil ditambahkan!';
      },
      error: (err) => `Gagal: ${err.message}`
    });
  };
  
  const handleBulkDelete = () => {
    if (selectedSantri.size === 0) return;

    toast((t) => (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-semibold">
          Yakin ingin menghapus {selectedSantri.size} santri terpilih?
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              const token = localStorage.getItem('accessToken') || '';
              const deletePromises = Array.from(selectedSantri).map(id => deleteSantri(id, token));
              
              toast.promise(Promise.all(deletePromises), {
                  loading: 'Menghapus data...',
                  success: () => {
                      setSantriList(prev => prev.filter(s => !selectedSantri.has(s.id)));
                      setSelectedSantri(new Set());
                      setIsSelectionMode(false);
                      toast.dismiss(t.id);
                      return 'Santri terpilih berhasil dihapus!';
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

  // --- Logika Seleksi ---

  const handleSelectSantri = (id: string) => {
    const newSelection = new Set(selectedSantri);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedSantri(newSelection);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(filteredSantri.map(s => s.id));
      setSelectedSantri(allIds);
    } else {
      setSelectedSantri(new Set());
    }
  };


  // --- Logika Filter ---

  const uniqueKelas = useMemo(() => Array.from(new Set(santriList.map(s => s.kelas))).sort(), [santriList]);
  
  const filteredSantri = useMemo(() => {
    return santriList.filter(santri => {
      const matchesSearch = santri.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterType === 'kelas') {
        return matchesSearch && (selectedKelas ? santri.kelas === selectedKelas : true);
      }
      if (filterType === 'jurusan') {
        return matchesSearch && (selectedJurusan ? santri.jurusan === selectedJurusan : true);
      }
      return matchesSearch;
    });
  }, [santriList, searchTerm, filterType, selectedKelas, selectedJurusan]);


  // Komponen untuk Aksi saat item dipilih
  const SelectionActionBar = () => (
    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
        <span className="text-sm font-medium">{selectedSantri.size} santri terpilih</span>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={selectedSantri.size !== 1}>
                <Edit className="w-4 h-4 mr-2"/> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2"/> Hapus
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { setIsSelectionMode(false); setSelectedSantri(new Set())}}>
                <X className="w-5 h-5"/>
            </Button>
        </div>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manajemen Santri</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsSelectionMode(!isSelectionMode)}>
                {isSelectionMode ? 'Batalkan Pilihan' : 'Pilih Santri'}
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Tambah Santri
            </Button>
          </div>
        </div>

        {/* --- Bagian Filter dan Search --- */}
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
                <select className="p-2 border rounded-md bg-white dark:bg-gray-700 text-sm w-full sm:w-auto" value={selectedKelas} onChange={(e) => setSelectedKelas(e.target.value)}>
                  <option value="">Semua Kelas</option>
                  {uniqueKelas.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              )}
              {filterType === 'jurusan' && (
                <select className="p-2 border rounded-md bg-white dark:bg-gray-700 text-sm w-full sm:w-auto" value={selectedJurusan} onChange={(e) => setSelectedJurusan(e.target.value)}>
                  <option value="">Semua Jurusan</option>
                  <option value="RPL">RPL</option>
                  <option value="TKJ">TKJ</option>
                </select>
              )}
          </div>
        </div>
        
        {/* --- Action Bar (muncul saat item dipilih) --- */}
        {isSelectionMode && selectedSantri.size > 0 && <SelectionActionBar />}

        {/* --- Tabel Data Santri --- */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {isSelectionMode && (
                            <th className="p-4 w-12">
                                <Input type="checkbox" className="cursor-pointer" onChange={handleSelectAll} checked={filteredSantri.length > 0 && selectedSantri.size === filteredSantri.length} />
                            </th>
                        )}
                        <th className="p-4 font-semibold">Nama</th>
                        <th className="p-4 font-semibold">Kelas</th>
                        <th className="p-4 font-semibold">Jurusan</th>
                        <th className="p-4 font-semibold">Saldo</th>
                        <th className="p-4 font-semibold text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr><td colSpan={isSelectionMode ? 6 : 5} className="text-center p-8">Memuat data...</td></tr>
                    ) : filteredSantri.length > 0 ? (
                        filteredSantri.map(santri => (
                            <tr key={santri.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                {isSelectionMode && (
                                    <td className="p-4">
                                        <Input type="checkbox" className="cursor-pointer" checked={selectedSantri.has(santri.id)} onChange={() => handleSelectSantri(santri.id)} />
                                    </td>
                                )}
                                <td className="p-4 capitalize">{santri.name}</td>
                                <td className="p-4">{santri.kelas}</td>
                                <td className="p-4">{santri.jurusan}</td>
                                <td className="p-4 font-mono">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.saldo)}</td>
                                <td className="p-4 text-center">
                                    <Link href={`/dashboard/admin/santri/${santri.id}`}>
                                      <Button variant="outline" size="sm">Detail</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={isSelectionMode ? 6 : 5} className="text-center p-8 text-gray-500">Tidak ada data yang cocok.</td></tr>
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