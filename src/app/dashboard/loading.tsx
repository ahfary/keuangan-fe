import { LoaderCircle } from 'lucide-react';
import React from 'react';

export default function Loading() {
  // UI ini akan ditampilkan sebagai fallback saat data halaman dimuat
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoaderCircle className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Memuat data...
        </p>
      </div>
    </div>
  );
}