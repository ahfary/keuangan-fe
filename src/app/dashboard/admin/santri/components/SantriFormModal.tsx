"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, LoaderCircle } from "lucide-react";

const jurusanOptions = [
  { value: "RPL", label: "RPL" },
  { value: "TKJ", label: "TKJ" },
];

const kelasOptions = ["X", "XI", "XII"];

export default function SantriFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; kelas: string; jurusan: string; nisn: string }) => void;
  initialData?: { name: string; kelas: string; jurusan: string; nisn?: string };
  isLoading?: boolean;
}) {
  const [form, setForm] = useState({
    name: "",
    kelas: "X",
    jurusan: "RPL",
    nisn: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        kelas: initialData.kelas || "X",
        jurusan: initialData.jurusan || "RPL",
        nisn: initialData.nisn || "",
      });
    } else {
      setForm({ name: "", kelas: "X", jurusan: "RPL", nisn: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 relative">
        {/* Tombol Close */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-50"
          onClick={!isLoading ? onClose : undefined}
          type="button"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          {initialData ? "Edit Santri" : "Tambah Santri"}
        </h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400 text-sm">
          {initialData
            ? "Perbarui data santri di bawah ini."
            : "Isi data santri baru dengan lengkap."}
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* NAMA */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Nama Lengkap
            </label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama santri"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          {/* NISN */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="nisn">
              NISN
            </label>
            <Input
              id="nisn"
              name="nisn"
              value={form.nisn}
              onChange={handleChange}
              placeholder="Nomor Induk Siswa Nasional"
              required
              disabled={isLoading}
            />
          </div>

          {/* KELAS & JURUSAN (Dibuat berdampingan agar lebih rapi) */}
          <div className="grid grid-cols-2 gap-4">
            {/* KELAS */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="kelas">
                Kelas
              </label>
              <select
                id="kelas"
                name="kelas"
                value={form.kelas}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                required
                disabled={isLoading}
              >
                {kelasOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* JURUSAN */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="jurusan">
                Jurusan
              </label>
              <select
                id="jurusan"
                name="jurusan"
                value={form.jurusan}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                required
                disabled={isLoading}
              >
                {jurusanOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose} 
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : initialData ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Santri"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}