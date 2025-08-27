"use client";

import React, { useState, useEffect } from 'react';
import { getSantriDetail, getSantriTransactions } from '@/lib/api';
import Cookies from 'js-cookie';
import { Wallet, AlertTriangle, History, LoaderCircle, User, SearchX } from 'lucide-react';

// --- Tipe Data ---
interface SantriDetail {
  id: number;
  name: string;
  kelas: string;
  jurusan: string;
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

// --- Komponen-komponen Lokal ---
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

const TransactionList = ({ transactions }) => (
  <div className="space-y-4 h-full overflow-y-auto pr-2">
    {transactions && transactions.length > 0 ? transactions.map(tx => (
      <div key={tx.id} className="flex justify-between items-center border-b pb-2 dark:border-gray-700">
        <div>
          <p className="font-medium capitalize">{tx.description}</p>
          <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <p className="font-semibold text-red-600">-{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tx.amount)}</p>
      </div>
    )) : (
      <p className="text-sm text-gray-500 text-center py-8">Belum ada riwayat transaksi.</p>
    )}
  </div>
);


// --- Komponen Utama Halaman Dashboard Walsan ---
export default function WalsanDashboardPage() {
  const [santri, setSantri] = useState<SantriDetail | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Riwayat Jajan');

  useEffect(() => {
    const fetchWalsanData = async () => {
      const santriId = Cookies.get('santriId');

      if (!santriId) {
        setError("Tidak ada data santri yang terhubung dengan akun Anda.");
        setIsLoading(false);
        return;
      }

      try {
        const [santriData, transactionData] = await Promise.all([
          getSantriDetail(santriId),
          getSantriTransactions(santriId)
        ]);
        setSantri(santriData);
        setTransactions(transactionData);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalsanData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircle className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center pt-20 flex flex-col items-center">
            <SearchX className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold">Gagal Memuat Data</h2>
            <p className="text-gray-500 mt-2">{error}</p>
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
    <div className="flex flex-col h-full space-y-6">
        {/* --- Header --- */}
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Wali Santri</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Selamat datang, Wali dari {santri.name}!</p>
        </div>

        {/* --- Kartu Profil --- */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between flex-shrink-0">
            <div className="flex items-center">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mr-6">
                    <User className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{santri.name}</h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400">{santri.kelas} - {santri.jurusan}</p>
                </div>
            </div>
        </div>

        {/* --- Grid Utama --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
            {/* Kolom Kiri */}
            <div className="md:col-span-1 flex flex-col gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-1 items-center">
                    <Wallet className="w-8 h-8 text-green-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-500">Saldo Saat Ini</p>
                        <p className="text-3xl font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.saldo)}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-1 items-center">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-500">Total Hutang</p>
                        <p className="text-3xl font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.hutang ?? 0)}</p>
                    </div>
                </div>
            </div>

            {/* Kolom Kanan */}
            <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col">
                <h2 className="text-xl font-semibold mb-4 flex items-center flex-shrink-0"><History className="w-5 h-5 mr-3" />Riwayat Transaksi</h2>
                <div className="flex-shrink-0">
                    <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="mt-4 flex-1 overflow-hidden">
                    <TransactionList transactions={filteredTransactions} />
                </div>
            </div>
        </div>
    </div>
  );
}