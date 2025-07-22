"use client";

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { PlusCircle, CheckCircle } from 'lucide-react';

// Data tiruan untuk piutang
const initialPiutangList = [
  { id: 'PI001', name: 'Santri A', date: '2023-10-25', amount: 50000, status: 'Belum Lunas' },
  { id: 'PI002', name: 'Santri B', date: '2023-10-24', amount: 25000, status: 'Belum Lunas' },
  { id: 'PI003', name: 'Pengurus C', date: '2023-10-22', amount: 75000, status: 'Lunas' },
];

export default function PiutangPage() {
  const [piutangList, setPiutangList] = useState(initialPiutangList);

  const handleMarkAsPaid = (id: string) => {
    setPiutangList(piutangList.map(p => p.id === id ? { ...p, status: 'Lunas' } : p));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manajemen Piutang</h1>
        <Button>
          <PlusCircle className="w-5 h-5 mr-2" />
          Tambah Piutang
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">Tanggal</th>
              <th scope="col" className="px-6 py-3">Jumlah</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {piutangList.map((piutang) => (
              <tr key={piutang.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{piutang.name}</td>
                <td className="px-6 py-4">{piutang.date}</td>
                <td className="px-6 py-4">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(piutang.amount)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${piutang.status === 'Lunas' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {piutang.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {piutang.status === 'Belum Lunas' && (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkAsPaid(piutang.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Tandai Lunas
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}