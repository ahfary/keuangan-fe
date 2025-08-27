"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Tipe data untuk props dan form
interface SantriData {
  id?: string;
  name: string;
  class: string;
  dormitory: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (santri: SantriData) => void;
  santriData: SantriData | null;
}

export default function SantriFormModal({ isOpen, onClose, onSave, santriData }: ModalProps) {
  // State untuk menampung data dari input form
  const [formData, setFormData] = useState<SantriData>({
    name: '',
    class: '',
    dormitory: '',
  });

  // Judul modal akan berubah tergantung mode (tambah/edit)
  const modalTitle = santriData ? 'Edit Data Santri' : 'Tambah Santri Baru';

  // useEffect untuk mengisi form saat mode edit
  useEffect(() => {
    if (santriData) {
      setFormData(santriData);
    } else {
      // Reset form saat mode tambah
      setFormData({ name: '', class: '', dormitory: '' });
    }
  }, [santriData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    // Overlay
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
    >
      {/* Modal Content */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{modalTitle}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kelas</label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="dormitory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asrama</label>
              <input
                type="text"
                id="dormitory"
                name="dormitory"
                value={formData.dormitory}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}