import React from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

// Data tiruan untuk simulasi
const mockTopUps = [
  { id: 'TU001', santriName: 'Ahmad Yusuf', parentName: 'Bapak Abdullah', amount: 200000, time: '2 jam yang lalu' },
  { id: 'TU002', santriName: 'Citra Lestari', parentName: 'Ibu Fatimah', amount: 300000, time: '5 jam yang lalu' },
];

export default function TopUpPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Verifikasi Top-Up Saldo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTopUps.length > 0 ? (
          mockTopUps.map((topup) => (
            <div key={topup.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{topup.time}</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2">{topup.santriName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">dari {topup.parentName}</p>
                <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-4">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(topup.amount)}
                </p>
              </div>
              <div className="mt-6 space-y-2">
                <button className="w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  <Eye className="w-5 h-5 mr-2" /> Lihat Bukti Transfer
                </button>
                <div className="flex space-x-2">
                  <button className="w-full flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                    <XCircle className="w-5 h-5 mr-2" /> Tolak
                  </button>
                  <button className="w-full flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    <CheckCircle className="w-5 h-5 mr-2" /> Setuju
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full">Tidak ada permintaan top-up saat ini.</p>
        )}
      </div>
    </div>
  );
}
