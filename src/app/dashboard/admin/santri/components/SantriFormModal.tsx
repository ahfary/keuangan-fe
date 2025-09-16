"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface SantriFormData {
  id?: string;
  name: string;
  kelas: string;
  jurusan: string;
}

interface SantriFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SantriFormData) => void;
  initialData?: SantriFormData;
}

export default function SantriFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: SantriFormModalProps) {
  const [formData, setFormData] = useState<SantriFormData>({
    name: "",
    kelas: "",
    jurusan: "",
  });

  // Update form ketika initialData berubah (mode edit)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: "", kelas: "", jurusan: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pastikan jurusan selalu uppercase
    const submitData = {
      ...formData,
      jurusan: formData.jurusan.toUpperCase(),
    };
    onSave(submitData);

    // Reset form jika tambah baru (bukan edit)
    if (!initialData) {
      setFormData({ name: "", kelas: "", jurusan: "" });
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative"
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {initialData ? "Edit Santri" : "Tambah Santri Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="kelas" className="block text-sm font-medium">
                Kelas
              </label>
              <input
                type="text"
                id="kelas"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="jurusan" className="block text-sm font-medium">
                Jurusan
              </label>
              <select
                id="jurusan"
                name="jurusan"
                value={formData.jurusan}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-4 py-2 border rounded-md"
              >
                <option value="">Pilih Jurusan</option>
                <option value="RPL">RPL</option>
                <option value="TKJ">TKJ</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 rounded-md"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
