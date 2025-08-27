"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, CheckCircle, Clock, LoaderCircle, Upload, XCircle } from 'lucide-react';
import { createTopUpRequest } from '@/lib/api'; // Pastikan ada fungsi ini di api.ts
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// --- Tipe Data ---
interface TopUpHistory {
    id: string;
    amount: number;
    status: 'pending' | 'success' | 'failed';
    date: string;
}

// --- Komponen-komponen Lokal ---

// Komponen untuk menampilkan item riwayat
const HistoryItem = ({ item }: { item: TopUpHistory }) => {
    const statusInfo = {
        pending: { icon: Clock, color: 'text-yellow-500', text: 'Pending' },
        success: { icon: CheckCircle, color: 'text-green-500', text: 'Berhasil' },
        failed: { icon: XCircle, color: 'text-red-500', text: 'Gagal' },
    };

    const currentStatus = statusInfo[item.status];
    const Icon = currentStatus.icon;

    return (
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center">
                <div className={`p-2 rounded-full ${currentStatus.color.replace('text-', 'bg-')}/10`}>
                    <Icon className={`w-6 h-6 ${currentStatus.color}`} />
                </div>
                <div className="ml-4">
                    <p className="font-semibold text-lg">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.amount)}</p>
                    <p className="text-sm text-gray-500">{new Date(item.date).toLocaleString('id-ID')}</p>
                </div>
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${currentStatus.color.replace('text-', 'bg-')}/10 ${currentStatus.color}`}>
                {currentStatus.text}
            </span>
        </div>
    );
};


// --- Komponen Utama Halaman Transfer ---
export default function WalsanTransferPage() {
    const [amount, setAmount] = useState('');
    const [proof, setProof] = useState<File | null>(null);
    const [history, setHistory] = useState<TopUpHistory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    // Mengambil riwayat top-up
    useEffect(() => {
        const fetchHistory = async () => {
            const santriId = Cookies.get('santriId');
            if (santriId) {
                try {
                    // Ganti dengan fungsi API yang sesuai
                    // const data = await getTopUpHistory(santriId); 
                    // setHistory(data);
                    
                    // Data dummy untuk sementara
                    setHistory([
                        { id: '1', amount: 250000, status: 'success', date: new Date().toISOString() },
                        { id: '2', amount: 100000, status: 'pending', date: new Date().toISOString() },
                        { id: '3', amount: 50000, status: 'failed', date: new Date().toISOString() },
                    ]);

                } catch (error) {
                    toast.error("Gagal mengambil riwayat transfer.");
                } finally {
                    setIsHistoryLoading(false);
                }
            }
        };
        fetchHistory();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProof(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const santriId = Cookies.get('santriId');

        if (!santriId || !amount || !proof) {
            toast.error("Harap isi jumlah dan unggah bukti transfer.");
            return;
        }

        setIsLoading(true);
        const promise = createTopUpRequest({
            santriId,
            amount: parseInt(amount),
            proof,
        });

        toast.promise(promise, {
            loading: 'Mengirim permintaan top-up...',
            success: (newTopUp) => {
                setHistory(prev => [newTopUp, ...prev]);
                setAmount('');
                setProof(null);
                return 'Permintaan top-up berhasil dikirim!';
            },
            error: (err) => `Gagal: ${err.message}`
        }).finally(() => setIsLoading(false));
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Transfer / Top-Up Saldo</h1>
                <p className="mt-1 text-gray-500">Isi saldo untuk anak Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Top-Up */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Formulir Top-Up</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="amount">Jumlah Nominal (Rp)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Contoh: 50000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="proof">Bukti Transfer</Label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="proof-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                            <span>Unggah file</span>
                                            <input id="proof-upload" name="proof-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                        <p className="pl-1">atau seret dan lepas</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {proof ? proof.name : 'PNG, JPG, GIF hingga 10MB'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <LoaderCircle className="w-4 h-4 mr-2 animate-spin"/>}
                            Kirim Permintaan Top-Up
                        </Button>
                    </form>
                </div>

                {/* Riwayat Top-Up */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Riwayat Transfer</h2>
                    <div className="space-y-2">
                        {isHistoryLoading ? (
                            <p>Memuat riwayat...</p>
                        ) : history.length > 0 ? (
                            history.map(item => <HistoryItem key={item.id} item={item} />)
                        ) : (
                            <p className="text-center text-gray-500 py-4">Belum ada riwayat.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}