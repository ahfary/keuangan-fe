"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const jurusanOptions = [
  { value: "RPL", label: "RPL" },
  { value: "TKJ", label: "TKJ" },
];

export default function SantriFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; kelas: string; jurusan: string }) => void;
  initialData?: { name: string; kelas: string; jurusan: string };
}) {
  const [form, setForm] = useState({
    name: "",
    kelas: "",
    jurusan: "RPL",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        kelas: initialData.kelas || "",
        jurusan: initialData.jurusan || "RPL",
      });
    } else {
      setForm({ name: "", kelas: "", jurusan: "RPL" });
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
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white"
          onClick={onClose}
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          {initialData ? "Edit Santri" : "Tambah Santri"}
        </h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400 text-sm">
          {initialData
            ? "Perbarui data santri di bawah ini."
            : "Isi data santri baru dengan lengkap."}
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="kelas">
              Kelas
            </label>
            <Input
              id="kelas"
              name="kelas"
              value={form.kelas}
              onChange={handleChange}
              placeholder="Kelas (misal: X TKJ 1)"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="jurusan">
              Jurusan
            </label>
            <select
              id="jurusan"
              name="jurusan"
              value={form.jurusan}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
              required
            >
              {jurusanOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {initialData ? "Simpan Perubahan" : "Tambah Santri"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
