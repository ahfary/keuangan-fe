"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Wallet, AlertTriangle, History, LoaderCircle, Edit, User, X, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSantriDetail, getSantriTransactions, updateSantriDetail } from '@/lib/api';
import toast from 'react-hot-toast';

// --- Tipe Data ---
interface SantriDetail {
  id: number;
  name: string;
  kelas: string;
  saldo: number;
  hutang?: number;
}
interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    type: 'jajan' | 'hutang' | 'tarik_tunai';
}
interface SantriEditData {
    name: string;
    kelas: string;
}

// --- Komponen-komponen ---

// Komponen Tabs (tidak berubah)
const Tabs = ({ tabs, activeTab, setActiveTab }: any) => (
  <div className="border-b border-gray-200 dark:border-gray-700">
    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
      {tabs.map((tab: any) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`${
            activeTab === tab.name
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {tab.name}
        </button>
      ))}
    </nav>
  </div>
);

// Komponen Daftar Transaksi (tidak berubah)
const TransactionList = ({ transactions }) => (
  <div className="space-y-4 max-h-96 overflow-y-auto">
    {transactions.length > 0 ? transactions.map(tx => (
      <div key={tx.id} className="flex justify-between items-center border-b pb-2 dark:border-gray-700">
        <div>
          <p className="font-medium capitalize">{tx.description}</p>
          <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <p className="font-semibold text-red-600">-{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tx.amount)}</p>
      </div>
    )) : (
      <p className="text-sm text-gray-500 text-center py-8">Belum ada riwayat.</p>
    )}
  </div>
);

// Komponen Modal Edit Santri (tidak berubah)
const EditSantriModal = ({ santri, isOpen, onClose, onSave }: { santri: SantriDetail; isOpen: boolean; onClose: () => void; onSave: (data: SantriEditData) => void; }) => {
    const [formData, setFormData] = useState<SantriEditData>({ name: santri.name, kelas: santri.kelas });
    
    useEffect(() => {
        setFormData({ name: santri.name, kelas: santri.kelas });
    }, [santri]);

    if (!isOpen) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-gray-600">
                    <h2 className="text-xl font-semibold">Edit Data Santri</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}><X size={24} /></Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="edit-name">Nama Lengkap</Label>
                        <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                        <Label htmlFor="edit-kelas">Kelas</Label>
                        <Input id="edit-kelas" value={formData.kelas} onChange={(e) => setFormData({...formData, kelas: e.target.value})} />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                        <Button type="submit">Simpan Perubahan</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function SantriDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [santri, setSantri] = useState<SantriDetail | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Riwayat Jajan');

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken') || '';
        const santriData = await getSantriDetail(id, token);
        // Data dummy untuk transaksi, sesuaikan dengan API Anda
        const transactionData = [
            { id: '1', description: 'Nasi Goreng', amount: 15000, date: '2024-08-10', type: 'jajan' },
            { id: '2', description: 'Bayar Utang Buku', amount: 50000, date: '2024-08-09', type: 'hutang' },
            { id: '3', description: 'Tarik Tunai', amount: 100000, date: '2024-08-08', type: 'tarik_tunai' },
        ];
        setSantri(santriData);
        setTransactions(transactionData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  const handleUpdateSantri = async (data: SantriEditData) => {
    if (!santri) return;
    const token = localStorage.getItem('accessToken') || '';
    
    const promise = updateSantriDetail(id, data, token);

    toast.promise(promise, {
        loading: 'Menyimpan perubahan...',
        success: (updatedSantri) => {
            setSantri(prev => prev ? { ...prev, ...updatedSantri } : null);
            setIsEditModalOpen(false);
            return 'Data santri berhasil diperbarui!';
        },
        error: (err) => `Gagal memperbarui data: ${err.message}`
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full pt-20"><LoaderCircle className="w-10 h-10 animate-spin text-indigo-600" /></div>;
  }

  if (error) {
    return (
        <div className="text-center pt-20 flex flex-col items-center">
            <SearchX className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold">Gagal Memuat Data</h2>
            <p className="text-gray-500 mt-2">{error}</p>
            <Link href="/dashboard/santri" className="mt-6 inline-block">
                <Button><ArrowLeft className="w-4 h-4 mr-2" />Kembali</Button>
            </Link>
        </div>
    );
  }

  if (!santri) {
    return <div className="text-center pt-20">Data santri tidak ditemukan.</div>;
  }

  const filteredTransactions = transactions.filter(tx => {
      if (activeTab === 'Riwayat Jajan') return tx.type === 'jajan';
      if (activeTab === 'Riwayat Hutang') return tx.type === 'hutang';
      if (activeTab === 'Riwayat Tarik Tunai') return tx.type === 'tarik_tunai';
      return false;
  });
  
  const tabs = [
      { name: 'Riwayat Jajan' },
      { name: 'Riwayat Hutang' },
      { name: 'Riwayat Tarik Tunai' },
  ];

  return (
    <>
      <div className="space-y-6">
        <div>
          <Link href="/dashboard/santri" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Santri
          </Link>
        </div>

        {/* --- Kartu Profil Santri --- */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mr-6">
                    <User className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{santri.name}</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">{santri.kelas}</p>
                </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Data
            </Button>
        </div>

        {/* --- Layout Utama (Grid) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- Kolom Kiri: Info Saldo & Hutang --- */}
          <div className="md:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center">
                  <Wallet className="w-8 h-8 text-green-500 mr-4" />
                  <div>
                      <p className="text-sm text-gray-500">Saldo Saat Ini</p>
                      <p className="text-3xl font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.saldo)}</p>
                  </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 mr-4" />
                  <div>
                      <p className="text-sm text-gray-500">Total Hutang</p>
                      <p className="text-3xl font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.hutang ?? 0)}</p>
                  </div>
              </div>
          </div>

          {/* --- Kolom Kanan: Riwayat Transaksi --- */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center"><History className="w-5 h-5 mr-3" />Riwayat Transaksi</h2>
              <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="mt-4">
                  <TransactionList transactions={filteredTransactions} />
              </div>
          </div>
        </div>
      </div>
      
      {santri && <EditSantriModal santri={santri} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateSantri} />}
    </>
  );
}