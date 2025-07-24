"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Wallet, AlertTriangle, Scissors, LoaderCircle, Edit, History, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button'; // FIX: Path impor diperbaiki
import { Input } from '@/app/components/ui/input';   // FIX: Path impor diperbaiki
import { Label } from '@/app/components/ui/lable';   // FIX: Path impor diperbaiki
import { getSantriDetail, deductSantriBalance, getSantriTransactions, updateSantriDetail } from '@/app/lib/api';
import toast from 'react-hot-toast';

// --- Tipe Data ---
// FIX: Menyesuaikan interface dengan data dari backend
interface SantriDetail {
  id: number;
  name: string;
  kelas: string;
  saldo: number;
  hutang?: number; // FIX: Jadikan 'hutang' opsional
}
interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
}
interface SantriEditData {
    name: string;
    kelas: string;
}

// --- Komponen Modal Edit Santri ---
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
  const [deductionAmount, setDeductionAmount] = useState('');
  const [deductionDesc, setDeductionDesc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken') || '';
        const [santriData, transactionData] = await Promise.all([
            getSantriDetail(id, token),
            getSantriTransactions(id, token)
        ]);
        setSantri(santriData);
        setTransactions(transactionData);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setSantri(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [id]);
  
  const handleDeductBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!santri) return;
    const amount = parseFloat(deductionAmount);
    if (!amount || amount <= 0 || !deductionDesc) { toast.error('Jumlah dan deskripsi harus diisi.'); return; }
    if (amount > santri.saldo) { toast.error('Saldo tidak mencukupi.'); return; }

    setIsProcessing(true);
    const token = localStorage.getItem('accessToken') || '';

    const promise = deductSantriBalance(id, amount, deductionDesc, token);

    toast.promise(promise, {
        loading: 'Memproses pemotongan saldo...',
        success: (updatedSantri) => {
            setSantri(updatedSantri);
            setDeductionAmount('');
            setDeductionDesc('');
            setIsProcessing(false);
            return 'Saldo berhasil dipotong!';
        },
        error: (err) => {
            setIsProcessing(false);
            return `Gagal: ${err.message}`;
        }
    });
  };

  const handleUpdateSantri = async (data: SantriEditData) => {
    if (!santri) return;
    const token = localStorage.getItem('accessToken') || '';
    
    const promise = updateSantriDetail(id, data, token);

    toast.promise(promise, {
        loading: 'Menyimpan perubahan...',
        success: () => {
            setSantri(prev => prev ? { ...prev, ...data } : null);
            setIsEditModalOpen(false);
            return 'Data santri berhasil diperbarui!';
        },
        error: (err) => `Gagal: ${err.message}`
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full pt-20"><LoaderCircle className="w-10 h-10 animate-spin text-indigo-600" /></div>;
  }

  if (!santri) {
    return <div className="text-center pt-20"><h2 className="text-xl font-semibold">Santri Tidak Ditemukan</h2><Link href="/dashboard/santri" className="mt-4 inline-block"><Button><ArrowLeft className="w-4 h-4 mr-2" />Kembali</Button></Link></div>;
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <Link href="/dashboard/santri" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Santri
          </Link>
          <div className="flex items-center justify-between">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{santri.name}</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">{santri.kelas}</p>
            </div>
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center"><Wallet className="w-8 h-8 text-green-500 mr-4" /><div><p className="text-sm text-gray-500">Saldo Saat Ini</p><p className="text-3xl font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.saldo)}</p></div></div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center"><AlertTriangle className="w-8 h-8 text-yellow-500 mr-4" /><div><p className="text-sm text-gray-500">Total Hutang</p><p className="text-3xl font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.hutang ?? 0)}</p></div></div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Aksi Keuangan</h2>
                    <form onSubmit={handleDeductBalance} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="amount">Jumlah Potongan (Rp)</Label><Input id="amount" type="number" placeholder="10000" value={deductionAmount} onChange={e => setDeductionAmount(e.target.value)} disabled={isProcessing} /></div>
                            <div><Label htmlFor="description">Deskripsi</Label><Input id="description" type="text" placeholder="Pembayaran Uang Kas" value={deductionDesc} onChange={e => setDeductionDesc(e.target.value)} disabled={isProcessing} /></div>
                        </div>
                        <div className="text-right"><Button type="submit" disabled={isProcessing}>{isProcessing ? <LoaderCircle className="w-5 h-5 mr-2 animate-spin" /> : <Scissors className="w-5 h-5 mr-2" />}{isProcessing ? 'Memproses...' : 'Potong Saldo'}</Button></div>
                    </form>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 flex items-center"><History className="w-5 h-5 mr-2" />Riwayat Jajan</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {transactions.length > 0 ? transactions.map(tx => (
                        <div key={tx.id} className="flex justify-between items-center border-b pb-2 dark:border-gray-700">
                            <div>
                                <p className="font-medium">{tx.description}</p>
                                <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <p className="font-semibold text-red-600">-{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tx.amount)}</p>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-500 text-center py-8">Belum ada riwayat transaksi.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
      
      {santri && <EditSantriModal santri={santri} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateSantri} />}
    </>
  );
}