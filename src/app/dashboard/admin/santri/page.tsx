"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  getSantriList,
  createSantri,
  deleteSantriBulk,
  updateSantriBulk,
} from "@/lib/api";
import SantriFormModal from "./components/SantriFormModal";
import toast from "react-hot-toast";
import BulkEditModal from "./components/BulkEditModal";

interface Santri {
  id: string;
  name: string;
  kelas: string;
  jurusan: "RPL" | "TKJ";
  saldo: number;
}

type SantriFormData = {
  name: string;
  kelas: string;
  jurusan: string;
};

const ITEMS_PER_PAGE = 6;

export default function SantriPage() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);

  const [filterType, setFilterType] = useState<"semua" | "kelas" | "jurusan">(
    "semua"
  );
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Set<string>>(new Set());
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch awal
  useEffect(() => {
    const fetchSantri = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken") || "";
        const data = await getSantriList(token);
        setSantriList(data);
      } catch (error) {
        toast.error("Gagal mengambil data santri.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSantri();
  }, []);

  // --- CREATE ---
  const handleCreateSantri = async (data: SantriFormData) => {
    toast.promise(
      createSantri({
        name: data.name,
        kelas: data.kelas,
        jurusan: (data.jurusan ?? "RPL").toUpperCase() as "TKJ" | "RPL",
      }),
      {
        loading: "Menambahkan santri...",
        success: (newSantri) => {
          setSantriList((prev) => [newSantri, ...prev]);
          setIsModalOpen(false);
          return "Santri berhasil ditambahkan!";
        },
        error: (err) => `Gagal: ${err.message}`,
      }
    );
  };

  // --- UPDATE (single) ---
  const handleUpdateSantri = async (data: SantriFormData) => {
    if (!editingSantri) return;

    toast.promise(
      updateSantriBulk([Number(editingSantri.id)], {
        name: data.name,
        kelas: data.kelas,
        jurusan: data.jurusan.toUpperCase(),
      }),
      {
        loading: "Menyimpan perubahan...",
        success: () => {
          setSantriList((prev) =>
            prev.map((s) =>
              s.id === editingSantri.id
                ? {
                    ...s,
                    ...data,
                    jurusan: data.jurusan.toUpperCase() as "RPL" | "TKJ",
                  }
                : s
            )
          );
          setEditingSantri(null);
          setIsModalOpen(false);
          setSelectedSantri(new Set());
          setIsSelectionMode(false);
          return "Santri berhasil diperbarui!";
        },
        error: (err) => `Gagal: ${err.message}`,
      }
    );
  };

  // --- UPDATE BULK ---
  const handleBulkUpdateSantri = async (kelas?: string, jurusan?: string) => {
    if (selectedSantri.size === 0) {
      toast.error("Tidak ada santri yang dipilih.");
      return;
    }

    const ids = Array.from(selectedSantri).map((id) => Number(id));
    const data: Record<string, string | undefined> = {};
    if (kelas) data.kelas = kelas;
    if (jurusan) data.jurusan = jurusan;

    toast.promise(updateSantriBulk(ids, data), {
      loading: "Menyimpan perubahan...",
      success: () => {
        setSantriList((prev) =>
          prev.map((s) =>
            selectedSantri.has(String(s.id))
              ? {
                  ...s,
                  kelas: kelas ?? s.kelas,
                  jurusan: (jurusan ?? s.jurusan) as "RPL" | "TKJ",
                }
              : s
          )
        );
        setSelectedSantri(new Set());
        setIsSelectionMode(false);
        setIsBulkModalOpen(false);
        return "Santri berhasil diperbarui!";
      },
      error: (err) => `Gagal: ${err.message}`,
    });
  };

  // --- DELETE BULK ---
  const handleBulkDelete = async () => {
    if (selectedSantri.size === 0) {
      toast.error("Tidak ada santri yang dipilih.");
      return;
    }

    const toastId = toast.loading("Menghapus data...", {
      duration: 60000,
    });

    try {
      const ids = Array.from(selectedSantri).map((id) => Number(id));
      await deleteSantriBulk(ids);
      setSantriList((prev) => prev.filter((s) => !selectedSantri.has(s.id)));
      setSelectedSantri(new Set());
      setIsSelectionMode(false);
      toast.success("Santri terpilih berhasil dihapus!", { id: toastId });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Terjadi kesalahan";
      toast.error(`Gagal menghapus: ${errorMessage}`, { id: toastId });
    }
  };

  const handleSelectSantri = (id: string) => {
    const newSelection = new Set(selectedSantri);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedSantri(newSelection);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIdsOnPage = new Set(paginatedSantri.map((s) => s.id));
      setSelectedSantri(new Set([...selectedSantri, ...allIdsOnPage]));
    } else {
      const idsOnPage = new Set(paginatedSantri.map((s) => s.id));
      setSelectedSantri(
        new Set([...selectedSantri].filter((id) => !idsOnPage.has(id)))
      );
    }
  };

  // --- Filter & Pagination ---
  const uniqueKelas = useMemo(
    () => Array.from(new Set(santriList.map((s) => s.kelas))).sort(),
    [santriList]
  );

  const filteredSantri = useMemo(() => {
    return santriList.filter((santri) => {
      const matchesSearch = santri.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (filterType === "kelas") {
        return matchesSearch && (!selectedKelas || santri.kelas === selectedKelas);
      }
      if (filterType === "jurusan") {
        return (
          matchesSearch &&
          (!selectedJurusan || santri.jurusan === selectedJurusan)
        );
      }
      return matchesSearch;
    });
  }, [santriList, searchTerm, filterType, selectedKelas, selectedJurusan]);

  const paginatedSantri = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredSantri.slice(startIndex, endIndex);
  }, [filteredSantri, currentPage]);

  const totalPages = Math.ceil(filteredSantri.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // --- UI ---
  const SelectionActionBar = () => (
    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
      <span className="text-sm font-medium">
        {selectedSantri.size} santri terpilih
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={selectedSantri.size === 0}
          onClick={() => {
            const ids = Array.from(selectedSantri);
            if (ids.length === 1) {
              const first = santriList.find((s) => s.id === ids[0]);
              if (first) {
                setEditingSantri(first);
                setIsModalOpen(true);
              }
            } else if (ids.length > 1) {
              setIsBulkModalOpen(true);
            }
          }}
        >
          <Edit className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
          <Trash2 className="w-4 h-4 mr-2" /> Hapus
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsSelectionMode(false);
            setSelectedSantri(new Set());
          }}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-2 mt-4">
      <Button
        size="sm"
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          size="sm"
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manajemen Santri</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSelectionMode(!isSelectionMode)}
            >
              {isSelectionMode ? "Batalkan Pilihan" : "Pilih Santri"}
            </Button>
            <Button
              onClick={() => {
                setEditingSantri(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Tambah Santri
            </Button>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Cari nama santri..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-600">Filter:</span>
              <Button
                size="sm"
                variant={filterType === "semua" ? "default" : "outline"}
                onClick={() => setFilterType("semua")}
              >
                Semua
              </Button>
              <Button
                size="sm"
                variant={filterType === "kelas" ? "default" : "outline"}
                onClick={() => setFilterType("kelas")}
              >
                Kelas
              </Button>
              <Button
                size="sm"
                variant={filterType === "jurusan" ? "default" : "outline"}
                onClick={() => setFilterType("jurusan")}
              >
                Jurusan
              </Button>
            </div>

            {filterType === "kelas" && (
              <select
                className="p-2 border rounded-md bg-white dark:bg-gray-700 text-sm w-full sm:w-auto"
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
              >
                <option value="">Semua Kelas</option>
                {uniqueKelas.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            )}
            {filterType === "jurusan" && (
              <select
                className="p-2 border rounded-md bg-white dark:bg-gray-700 text-sm w-full sm:w-auto"
                value={selectedJurusan}
                onChange={(e) => setSelectedJurusan(e.target.value)}
              >
                <option value="">Semua Jurusan</option>
                <option value="RPL">RPL</option>
                <option value="TKJ">TKJ</option>
              </select>
            )}
          </div>
        </div>

        {isSelectionMode && selectedSantri.size > 0 && <SelectionActionBar />}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {isSelectionMode && (
                  <th className="p-4 w-12">
                    <Input
                      type="checkbox"
                      className="cursor-pointer"
                      onChange={handleSelectAll}
                      checked={
                        paginatedSantri.length > 0 &&
                        paginatedSantri.every((s) => selectedSantri.has(s.id))
                      }
                    />
                  </th>
                )}

                <th className="p-4 font-semibold">Nama</th>
                <th className="p-4 font-semibold">Kelas</th>
                <th className="p-4 font-semibold">Jurusan</th>
                <th className="p-4 font-semibold">Saldo</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={isSelectionMode ? 6 : 5}
                    className="text-center p-8"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : paginatedSantri.length > 0 ? (
                paginatedSantri.map((santri) => (
                  <tr
                    key={santri.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    {isSelectionMode && (
                      <td className="p-4">
                        <Input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={selectedSantri.has(santri.id)}
                          onChange={() => handleSelectSantri(santri.id)}
                        />
                      </td>
                    )}
                    <td className="p-4 capitalize">{santri.name}</td>
                    <td className="p-4">{santri.kelas}</td>
                    <td className="p-4">{santri.jurusan}</td>
                    <td className="p-4 font-mono">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(santri.saldo)}
                    </td>
                    <td className="p-4 text-center">
                      <Link href={`/dashboard/admin/santri/${santri.id}`}>
                        <Button variant="outline" size="sm">
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isSelectionMode ? 6 : 5}
                    className="text-center p-8 text-gray-500"
                  >
                    Tidak ada data santri
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls />
      </div>

      {/* Modal untuk Tambah/Edit */}
      <SantriFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSantri(null);
        }}
        onSave={(data) =>
          editingSantri ? handleUpdateSantri(data) : handleCreateSantri(data)
        }
        initialData={editingSantri || undefined}
      />

      {/* Modal untuk Bulk Edit */}
      <BulkEditModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedCount={selectedSantri.size}
        onSave={handleBulkUpdateSantri}
      />
    </>
  );
}
