"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Trash2, Edit, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSantriList, createSantri, deleteSantri } from '@/lib/api';
import SantriFormModal from './components/SantriFormModal';
import toast from 'react-hot-toast';

interface Santri {
  id: string;
  name: string;
  kelas: string;
  saldo: number;
}

export default function SantriPage() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSantri = async () => {
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

  const handleCreateSantri = async (data: { name: string; kelas: string; }) => {
    const token = localStorage.getItem('accessToken') || '';
    const promise = createSantri(data, token);

    toast.promise(promise, {
      loading: 'Menambahkan santri baru...',
      success: (newSantri) => {
        setSantriList(prev => [newSantri, ...prev]);
        setIsModalOpen(false);
        return 'Santri berhasil ditambahkan!';
      },
      error: (err) => `Gagal: ${err.message}`
    });
  };

  const handleDeleteSantri = (id: string) => {
    // Konfirmasi sebelum menghapus
    toast((t) => (
      <div className="flex flex-col items-center gap-4">
        <p className="font-semibold">Anda yakin ingin menghapus santri ini?</p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              const token = localStorage.getItem('accessToken') || '';
              const promise = deleteSantri(id, token);
              toast.promise(promise, {
                  loading: 'Menghapus...',
                  success: () => {
                      setSantriList(prev => prev.filter(s => s.id !== id));
                      toast.dismiss(t.id);
                      return 'Santri berhasil dihapus!';
                  },
                  error: (err) => `Gagal: ${err.message}`
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


  const filteredSantri = santriList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Cari nama atau kelas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="p-4 font-semibold">Nama</th>
                        <th className="p-4 font-semibold">Kelas</th>
                        <th className="p-4 font-semibold">Saldo</th>
                        <th className="p-4 font-semibold text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr><td colSpan={4} className="text-center p-8">Memuat data...</td></tr>
                    ) : filteredSantri.length > 0 ? (
                        filteredSantri.map(santri => (
                            <tr key={santri.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4">{santri.name}</td>
                                <td className="p-4">{santri.kelas}</td>
                                <td className="p-4 font-mono">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.saldo)}</td>
                                <td className="p-4 flex justify-center items-center gap-2">
                                    <Link href={`/dashboard/santri/${santri.id}`}>
                                      <Button variant="outline" size="sm">Detail</Button>
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteSantri(santri.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={4} className="text-center p-8">Tidak ada data santri.</td></tr>
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