"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// BARU: Impor ikon untuk tombol pagination
import {
  Eye,
  Search,
  Copy,
  Check,
  LoaderCircle,
  UserX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { getWalsanList } from "@/lib/api";

// Tipe data sesuai respons API
interface Santri {
  id: number;
  name: string;
}
interface Parent {
  id: number;
  name: string;
  santri: Santri[];
}
interface Walsan {
  id: string;
  email: string;
  name: string;
  parent: Parent;
}

// Modal detail akun walsan (Tidak ada perubahan)
const PasswordDetailModal = ({
  isOpen,
  onClose,
  walsan,
}: {
  isOpen: boolean;
  onClose: () => void;
  walsan: Walsan | null;
}) => {
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);
  const [hasCopiedPassword, setHasCopiedPassword] = useState(false);

  if (!isOpen || !walsan) return null;
  const anakName = walsan.parent?.santri?.[0]?.name || "Santri";

  const copyToClipboard = (text: string, type: "email" | "password") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setHasCopiedEmail(true);
      setTimeout(() => setHasCopiedEmail(false), 2000);
    } else {
      setHasCopiedPassword(true);
      setTimeout(() => setHasCopiedPassword(false), 2000);
    }
    toast.success("Berhasil disalin!");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Detail Akun Walsan
        </h3>
        <p className="text-sm text-gray-500 mb-4">An. {anakName}</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Email</label>
            <div className="flex items-center gap-2">
              <p className="text-sm p-2 bg-gray-100 dark:bg-gray-700 rounded w-full truncate">
                {walsan.email}
              </p>
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(walsan.email, "email")}
              >
                {hasCopiedEmail ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">
              Password Default
            </label>
            <div className="flex items-center gap-2">
              <p className="text-sm p-2 bg-gray-100 dark:bg-gray-700 rounded w-full">
                smkmqbisa
              </p>
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard("smkmqbisa", "password")}
              >
                {hasCopiedPassword ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6 text-right">
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  );
};

// Halaman utama
export default function WalsanListPage() {
  const [walsanList, setWalsanList] = useState<Walsan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWalsan, setSelectedWalsan] = useState<Walsan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // BARU: State dan konstanta untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchWalsan = async () => {
      setIsLoading(true);
      try {
        const response = await getWalsanList();
        setWalsanList(response || []);
      } catch (error) {
        toast.error("Gagal mengambil data walsan.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWalsan();
  }, []);
  
  // BARU: Reset halaman ke 1 jika ada pencarian baru
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredWalsan = useMemo(
    () =>
      walsanList.filter(
        (w) =>
          (w.email &&
            w.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (w.parent?.name &&
            w.parent.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (w.parent?.santri &&
            w.parent.santri.some((s) =>
              s.name.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      ),
    [walsanList, searchTerm]
  );
  
  // BARU: Logika untuk memotong data sesuai halaman aktif
  const totalPages = Math.ceil(filteredWalsan.length / ITEMS_PER_PAGE);
  const paginatedWalsan = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWalsan.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWalsan, currentPage]);


  const handleOpenModal = (walsan: Walsan) => {
    setSelectedWalsan(walsan);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manajemen Akun Walsan</h1>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Cari email, nama walsan, atau nama santri..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-4 font-semibold">Email Walsan</th>
                <th className="p-4 font-semibold">Nama Anak</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center p-8">
                    <LoaderCircle className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                  </td>
                </tr>
              ) : // BARU: Gunakan `paginatedWalsan` untuk me-render data
              paginatedWalsan.length > 0 ? (
                paginatedWalsan.map((walsan) => (
                  <tr
                    key={walsan.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="p-4">{walsan.email}</td>
                    <td className="p-4">
                      {walsan.parent?.santri?.length > 0
                        ? walsan.parent.santri.map((s) => s.name).join(", ")
                        : "Tidak ada data anak"}
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(walsan)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> Detail
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-12">
                    <UserX className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="mt-4 text-gray-500">
                      Belum ada data akun walsan. Coba generate akun baru.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
           {/* BARU: Kontrol untuk navigasi halaman */}
           {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t dark:border-gray-700">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Halaman {currentPage} dari {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                >
                  Berikutnya
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <PasswordDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        walsan={selectedWalsan}
      />
    </>
  );
}