/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, FormEvent, useMemo } from "react";
import Image from "next/image";
import {
  PlusCircle,
  FilePenLine,
  Trash2,
  X,
  LoaderCircle,
  LayoutGrid,
  List,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getItems, createItem, updateItem, deleteItem } from "@/lib/api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import withReactContent from "sweetalert2-react-content";

// --- Tipe Data Disesuaikan dengan Respons API ---
interface Kategori {
  id: number;
  nama: string;
}

interface Item {
  id: number;
  nama: string;
  harga: number;
  jumlah: number;
  kategori: Kategori | null;
  gambar?: string | null;
}

interface ItemFormData {
  id?: number;
  nama: string;
  harga: string;
  jumlah: string;
  kategori: string;
}

const MySwal = withReactContent(Swal);
const ITEMS_PER_PAGE = 8; // Disesuaikan untuk tampilan grid (4x2) dan tabel

// --- Komponen-Komponen Tampilan ---

const TableView = ({
  items,
  onEdit,
  onDelete,
}: {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}) => (
  <table className="w-full text-left">
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
          Nama Barang
        </th>
        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
          Kategori
        </th>
        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
          Jumlah (Stok)
        </th>
        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
          Harga Jual
        </th>
        <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">
          Aksi
        </th>
      </tr>
    </thead>
    <tbody className="divide-y dark:divide-gray-700">
      {items.map((item) => (
        <tr
          key={item.id}
          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <td className="p-4 flex items-center text-gray-900 dark:text-white">
            <Image
              src={
                item.gambar ||
                `https://placehold.co/40x40/E0E7FF/4338CA?text=${item.nama.charAt(
                  0
                )}`
              }
              alt={item.nama}
              width={40}
              height={40}
              className="rounded-md mr-4 object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/40x40/E0E7FF/4338CA?text=${item.nama.charAt(
                  0
                )}`;
              }}
            />
            {item.nama}
          </td>
          <td className="p-4 text-gray-600 dark:text-gray-300">
            {item.kategori?.nama || "Tanpa Kategori"}
          </td>
          <td className="p-4 text-gray-600 dark:text-gray-300">
            {item.jumlah}
          </td>
          <td className="p-4 text-gray-600 dark:text-gray-300">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(item.harga)}
          </td>
          <td className="p-4 flex justify-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
              <FilePenLine className="w-5 h-5 text-blue-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
              <Trash2 className="w-5 h-5 text-red-600" />
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const GridView = ({
  items,
  onEdit,
  onDelete,
}: {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {items.map((item) => (
      <div
        key={item.id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group flex flex-col"
      >
        <div className="relative">
          <Image
            src={
              item.gambar ||
              `https://placehold.co/400x300/E0E7FF/4338CA?text=Gambar`
            }
            alt={item.nama}
            width={400}
            height={300}
            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/400x300/E0E7FF/4338CA?text=Error`;
            }}
          />
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              className="h-8 w-8 bg-white/80 hover:bg-white"
              onClick={() => onEdit(item)}
            >
              <FilePenLine className="w-4 h-4 text-blue-600" />
            </Button>
            <Button
              size="icon"
              className="h-8 w-8 bg-white/80 hover:bg-white"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <p className="text-xs text-indigo-500 font-semibold">
              {item.kategori?.nama || "Tanpa Kategori"}
            </p>
            <h3 className="font-bold text-lg mt-1">{item.nama}</h3>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Stok:{" "}
              <span className="font-bold text-gray-800 dark:text-white">
                {item.jumlah}
              </span>
            </p>
            <p className="font-bold text-indigo-600 text-lg">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(item.harga)}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ItemFormModal = ({
  isOpen,
  onClose,
  onSave,
  itemData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ItemFormData) => void;
  itemData: ItemFormData | null;
}) => {
  const [formData, setFormData] = useState<ItemFormData>({
    nama: "",
    harga: "",
    jumlah: "",
    kategori: "",
  });
  const modalTitle = itemData ? "Edit Data Barang" : "Tambah Barang Baru";

  useEffect(() => {
    if (itemData) setFormData(itemData);
    else setFormData({ nama: "", harga: "", jumlah: "", kategori: "" });
  }, [itemData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-gray-600">
          <h2 className="text-xl font-semibold">{modalTitle}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={24} />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nama">Nama Barang</Label>
            <Input
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="kategori">Kategori</Label>
            <Input
              id="kategori"
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jumlah">Jumlah (Stok)</Label>
              <Input
                id="jumlah"
                name="jumlah"
                type="number"
                value={formData.jumlah}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="harga">Harga Jual (Rp)</Label>
              <Input
                id="harga"
                name="harga"
                type="number"
                value={formData.harga}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Komponen Halaman Utama ---
export default function StokPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormData | null>(null);
  const [view, setView] = useState<"grid" | "table">("grid");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await getItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(`Gagal memuat data: ${error.message}`);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    items.forEach((item) => {
      if (item.kategori?.nama) {
        categories.add(item.kategori.nama);
      }
    });
    return Array.from(categories).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.nama
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory
        ? item.kategori?.nama === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const PaginationControls = ({ isTable = false }: { isTable?: boolean }) => {
    if (totalPages <= 1) return null;

    if (isTable) {
      return (
        <div className="p-4 flex justify-center">
          <div className="flex items-center gap-2">
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
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm">
          Halaman {currentPage} dari {totalPages}
        </span>
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
  };

  const handleOpenModal = (item: Item | null = null) => {
    if (item) {
      setEditingItem({
        ...item,
        harga: String(item.harga),
        jumlah: String(item.jumlah),
        kategori: item.kategori?.nama || "",
      });
    } else {
      setEditingItem(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveItem = async (formData: ItemFormData) => {
    const itemPayload = {
      nama: formData.nama,
      kategori: formData.kategori,
      harga: parseInt(formData.harga, 10),
      jumlah: parseInt(formData.jumlah, 10),
    };
    let promise;
    if (formData.id) {
      promise = updateItem(formData.id, itemPayload);
    } else {
      promise = createItem(itemPayload);
    }
    toast.promise(promise, {
      loading: "Menyimpan data barang...",
      success: () => {
        setIsModalOpen(false);
        fetchItems();
        return formData.id
          ? "Barang berhasil diperbarui!"
          : "Barang baru berhasil ditambahkan!";
      },
      error: (err) => `Gagal: ${err.message}`,
    });
  };

  const handleDeleteItem = (item: Item) => {
    MySwal.fire({
      title: "Apakah Anda Yakin?",
      html: `Anda akan menghapus barang: <br/><strong>${item.nama}</strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      customClass: {
        // Jika menggunakan dark mode, ini membantu agar popup tetap terlihat
        popup: "bg-white dark:bg-gray-800",
        title: "text-gray-900 dark:text-white",
        htmlContainer: "text-gray-600 dark:text-gray-300",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika user menekan tombol "Ya, Hapus!"
        const promise = deleteItem(item.id);

        toast.promise(promise, {
          loading: "Menghapus barang...",
          success: () => {
            // Hapus item dari state untuk memperbarui UI secara langsung
            setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));

            // Tampilkan popup sukses setelah berhasil
            MySwal.fire(
              "Berhasil Dihapus!",
              `Barang '${item.nama}' telah dihapus.`,
              "success"
            );

            // Kita tidak perlu return message lagi di sini karena sudah ditangani Swal
            return `Barang '${item.nama}' berhasil dihapus.`;
          },
          error: (err) => `Gagal menghapus: ${err.message}`,
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">Manajemen Stok Barang</h1>
        <div className="flex items-center gap-2">
          <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded-lg flex">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-2 rounded-md",
                view === "grid" && "bg-white dark:bg-gray-900 shadow"
              )}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "p-2 rounded-md",
                view === "table" && "bg-white dark:bg-gray-900 shadow"
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <PlusCircle className="w-5 h-5 mr-2" />
            Tambah Barang
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Cari nama barang..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="p-2 border rounded-md bg-white dark:bg-gray-700 text-sm w-full sm:w-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoaderCircle className="w-8 h-8 animate-spin" />
          </div>
        ) : paginatedItems.length > 0 ? (
          view === "grid" ? (
            <>
              <GridView
                items={paginatedItems}
                onEdit={handleOpenModal}
                onDelete={handleDeleteItem}
              />
              <PaginationControls />
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
              <TableView
                items={paginatedItems}
                onEdit={handleOpenModal}
                onDelete={handleDeleteItem}
              />
              <PaginationControls isTable={true} />
            </div>
          )
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p>Tidak ada barang yang cocok dengan filter Anda.</p>
          </div>
        )}
      </div>

      <ItemFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        itemData={editingItem}
      />
    </div>
  );
}
