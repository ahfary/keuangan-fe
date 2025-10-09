"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  Search,
  Copy,
  Check,
  LoaderCircle,
  UserX,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { getWalsanList, deleteWalsanBulk } from "@/lib/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// ================== TYPES (MODIFIKASI DI SINI) ==================
interface Santri {
  id: number;
  name: string;
}
interface Parent {
  id: number;
  name: string;
  santri: Santri[];
}
// Tambahkan username ke tipe Walsan
interface Walsan {
  id: string; // ID user
  parent: Parent;
  email: string;
  username: string; // <-- Tambahkan ini
  name: string;
}

// ================== MODAL (MODIFIKASI DI SINI) ==================
const PasswordDetailModal = ({
  isOpen,
  onClose,
  walsan,
}: {
  isOpen: boolean;
  onClose: () => void;
  walsan: Walsan | null;
}) => {
  const [hasCopied, setHasCopied] = useState<string | null>(null);

  if (!isOpen || !walsan) return null;
  const anakName = walsan.parent?.santri?.[0]?.name || "Santri";

  const handleCopy = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
    setHasCopied(type);
    toast.success(`${type} berhasil disalin!`);
    setTimeout(() => setHasCopied(null), 1500);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-md p-6 text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon centang hijau */}
        <div className="flex justify-center mb-3">
          <div className="bg-green-500/20 p-3 rounded-full">
            <Check className="text-green-400 w-8 h-8" />
          </div>
        </div>

        {/* Judul dan deskripsi */}
        <h3 className="text-xl font-bold text-center">Informasi Akun Walsan</h3>
        <p className="text-sm text-gray-400 text-center mb-6">
          Berikut adalah kredensial untuk login wali santri.
        </p>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs text-gray-400">Email (untuk Web)</label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                readOnly
                value={walsan.email}
                className="bg-gray-800 border-none text-white"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(walsan.email, "Email")}
                className="border-gray-600"
              >
                {hasCopied === "Email" ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="text-xs text-gray-400">
              Username (untuk Mobile)
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                readOnly
                value={walsan.username || walsan.parent.name}
                className="bg-gray-800 border-none text-white"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  handleCopy(walsan.username || walsan.parent.name, "Username")
                }
                className="border-gray-600"
              >
                {hasCopied === "Username" ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-400">Password Default</label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                readOnly
                value="smkmqbisa"
                className="bg-gray-800 border-none text-white"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy("smkmqbisa", "Password")}
                className="border-gray-600"
              >
                {hasCopied === "Password" ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Tombol bawah */}
        <Button
          onClick={onClose}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
        >
          Selesai
        </Button>
      </div>
    </div>
  );
};

// ================== MAIN PAGE (KODE ASLI ANDA, TANPA PERUBAHAN) ==================
export default function WalsanListPage() {
  const [walsanList, setWalsanList] = useState<Walsan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWalsan, setSelectedWalsan] = useState<Walsan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // bulk delete
  const [selectedWalsanIds, setSelectedWalsanIds] = useState<Set<number>>(
    new Set()
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5; // kecilin biar gampang tes

  const fetchWalsan = async () => {
    setIsLoading(true);
    try {
      const response = await getWalsanList();
      setWalsanList(Array.isArray(response) ? response : []);
    } catch (error) {
      toast.error("Gagal mengambil data walsan.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalsan();
  }, []);

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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredWalsan.length / ITEMS_PER_PAGE)
  );
  const paginatedWalsan = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWalsan.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWalsan, currentPage]);

  // bulk delete helpers
  const handleSelectWalsan = (parentId: number) => {
    const newSelection = new Set(selectedWalsanIds);
    if (newSelection.has(parentId)) {
      newSelection.delete(parentId);
    } else {
      newSelection.add(parentId);
    }
    setSelectedWalsanIds(newSelection);
  };

  const handleSelectAllOnPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allIdsOnPage = paginatedWalsan.map((w) => w.parent.id);
    if (e.target.checked) {
      setSelectedWalsanIds((prev) => new Set([...prev, ...allIdsOnPage]));
    } else {
      const newSelection = new Set(selectedWalsanIds);
      allIdsOnPage.forEach((id) => newSelection.delete(id));
      setSelectedWalsanIds(newSelection);
    }
  };

  // ===== FIXED handleBulkDelete: SweetAlert2 confirm + debug logs =====
  const handleBulkDelete = async () => {
    if (selectedWalsanIds.size === 0) {
      toast.error("Tidak ada akun walsan yang dipilih.");
      return;
    }

    // Konfirmasi dengan SweetAlert2 (lebih baik UX)
    const res = await MySwal.fire({
      title: `Hapus ${selectedWalsanIds.size} akun walsan?`,
      text: "Tindakan ini tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      focusCancel: true,
    });

    if (!res.isConfirmed) return;

    const ids = Array.from(selectedWalsanIds);
    console.log("Requesting deleteWalsanBulk with ids:", ids); // <-- debug

    try {
      setIsDeletingBulk(true);

      await toast.promise(
        // deleteWalsanBulk harus mengirim: /santri/delete-bulk-walsan?id=40,41
        deleteWalsanBulk(ids),
        {
          loading: "Menghapus akun...",
          success: (data: any) => {
            // sukses: refresh, reset seleksi
            fetchWalsan();
            setSelectedWalsanIds(new Set());
            setIsSelectionMode(false);
            return (
              data?.message || `${ids.length} akun walsan berhasil dihapus.`
            );
          },
          error: (err: any) => {
            console.error("deleteWalsanBulk error:", err);
            // Jika server mengembalikan object error, coba tampilkan pesannya
            const msg =
              err?.message ||
              err?.response?.message ||
              "Terjadi kesalahan saat menghapus.";
            return `Gagal: ${msg}`;
          },
        }
      );
    } catch (err) {
      console.error("Unexpected error on bulk delete:", err);
      toast.error("Terjadi kesalahan saat menghapus.");
    } finally {
      setIsDeletingBulk(false);
    }
  };
  // ================================================================

  const isAllOnPageSelected =
    paginatedWalsan.length > 0 &&
    paginatedWalsan.every((w) => selectedWalsanIds.has(w.parent.id));

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manajemen Akun Walsan</h1>
          {isSelectionMode ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">{selectedWalsanIds.size} dipilih</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={selectedWalsanIds.size === 0 || isDeletingBulk}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeletingBulk ? "Menghapus..." : "Hapus"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedWalsanIds(new Set());
                }}
                disabled={isDeletingBulk}
              >
                Batal
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsSelectionMode(true)}>
              Pilih Akun
            </Button>
          )}
        </div>

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
                {isSelectionMode && (
                  <th className="p-4 w-12">
                    <Input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={isAllOnPageSelected}
                      onChange={handleSelectAllOnPage}
                    />
                  </th>
                )}
                <th className="p-4 font-semibold">Email Walsan</th>
                <th className="p-4 font-semibold">Nama Anak</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={isSelectionMode ? 4 : 3}
                    className="text-center p-8"
                  >
                    <LoaderCircle className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                  </td>
                </tr>
              ) : paginatedWalsan.length > 0 ? (
                paginatedWalsan.map((walsan) => (
                  <tr key={walsan.id} className="border-b dark:border-gray-700">
                    {isSelectionMode && (
                      <td className="p-4">
                        <Input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={selectedWalsanIds.has(walsan.parent.id)}
                          onChange={() => handleSelectWalsan(walsan.parent.id)}
                        />
                      </td>
                    )}
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
                        onClick={() => {
                          setSelectedWalsan(walsan);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" /> Detail
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isSelectionMode ? 4 : 3}
                    className="text-center p-12"
                  >
                    <UserX className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="mt-4 text-gray-500">
                      Belum ada data akun walsan.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
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
