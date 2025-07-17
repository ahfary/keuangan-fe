import React from 'react';
import { PlusCircle, FilePenLine, Trash2 } from 'lucide-react';

// Data tiruan untuk simulasi
const mockSantri = [
  { id: 'ST001', name: 'Ahmad Yusuf', class: '3 Aliyah', dormitory: 'Blok A', balance: 500000 },
  { id: 'ST002', name: 'Budi Santoso', class: '2 Tsanawiyah', dormitory: 'Blok B', balance: 250000 },
  { id: 'ST003', name: 'Citra Lestari', class: '1 Aliyah', dormitory: 'Blok C Putri', balance: 750000 },
  { id: 'ST004', name: 'Dewi Anggraini', class: '3 Tsanawiyah', dormitory: 'Blok D Putri', balance: 150000 },
];

export default function SantriPage() {
  return (
    <div>
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manajemen Data Santri</h1>
        <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
          <PlusCircle className="w-5 h-5 mr-2" />
          Tambah Santri
        </button>
      </div>

      {/* Tabel Data Santri */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Nama</th>
                <th scope="col" className="px-6 py-3">Kelas</th>
                <th scope="col" className="px-6 py-3">Asrama</th>
                <th scope="col" className="px-6 py-3">Saldo</th>
                <th scope="col" className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mockSantri.map((santri) => (
                <tr key={santri.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {santri.name}
                  </th>
                  <td className="px-6 py-4">{santri.class}</td>
                  <td className="px-6 py-4">{santri.dormitory}</td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(santri.balance)}
                  </td>
                  <td className="px-6 py-4 flex justify-center space-x-2">
                    <button className="p-2 text-blue-600 hover:text-blue-800"><FilePenLine className="w-5 h-5" /></button>
                    <button className="p-2 text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
