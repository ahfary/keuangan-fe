import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';
import React from 'react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <TriangleAlert className="mx-auto h-16 w-16 text-yellow-500" />
        <h1 className="mt-4 text-6xl font-bold text-gray-800 dark:text-white">404</h1>
        <p className="mt-2 text-xl font-medium text-gray-600 dark:text-gray-300">
          Halaman Tidak Ditemukan
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
