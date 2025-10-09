/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, FormEvent, useMemo, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wallet,
  AlertTriangle,
  History,
  LoaderCircle,
  Edit,
  User,
  X,
  SearchX,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  getSantriDetail,
  updateSantriDetail,
  generateWalsan,
  getHistoryBySantriId,
  getAllItems,
  getWalsanList,
} from "@/lib/api";
import toast from "react-hot-toast";

// --- Tipe Data
interface SantriDetail {
  id: number;
  name: string;
  kelas: string;
  saldo: number;
  hutang?: number;
}
interface Item {
  id: number;
  nama: string;
  [key: string]: any;
}
interface HistoryItem {
  itemId: number;
  quantity: number;
  priceAtPurchase: number;
  item?: Item;
}
interface TransactionHistory {
  id: string;
  totalAmount: number;
  createdAt: string;
  status: "Lunas" | "Hutang";
  items: HistoryItem[];
}
interface SantriEditData {
  name: string;
  kelas: string;
}

// Walsan minimal type (untuk check apakah sudah ada)
interface WalsanMinimal {
  id: string;
  email: string;
  parent: {
    id: number;
    name: string;
    santri: { id: number; name?: string }[];
  };
}

// --- Komponen TransactionList
const TransactionList = ({
  transactions,
  itemsMap,
}: {
  transactions: TransactionHistory[];
  itemsMap: Map<number, Item>;
}) => (
  <div className="space-y-4 h-full overflow-y-auto pr-2">
    {transactions.length > 0 ? (
      transactions.map((tx) => (
        <div key={tx.id} className="border-b pb-3 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium capitalize">{tx.status}</p>
              <p className="text-xs text-gray-500">
                {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <p className="font-semibold text-red-600">
              -
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(tx.totalAmount)}
            </p>
          </div>
          <ul className="pl-4 text-sm">
            {tx.items.map((item) => {
              const itemName = itemsMap.get(item.itemId)?.nama || `Item ID: ${item.itemId}`;
              return (
                <li
                  key={`${tx.id}-${item.itemId}`}
                  className="flex justify-between text-gray-600 dark:text-gray-400"
                >
                  <span>
                    {itemName} (x{item.quantity})
                  </span>
                  <span>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(item.priceAtPurchase * item.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <History className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-gray-500">Belum ada riwayat transaksi.</p>
      </div>
    )}
  </div>
);

// --- Komponen EditSantriModal
const EditSantriModal = ({
  santri,
  isOpen,
  onClose,
  onSave,
}: {
  santri: SantriDetail;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SantriEditData) => void;
}) => {
  const [formData, setFormData] = useState<SantriEditData>({
    name: santri.name,
    kelas: santri.kelas,
  });
  useEffect(() => {
    setFormData({ name: santri.name, kelas: santri.kelas });
  }, [santri]);
  if (!isOpen) return null;
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
          <h2 className="text-xl font-semibold">Edit Data Santri</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={24} />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Nama Lengkap</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-kelas">Kelas</Label>
            <Input
              id="edit-kelas"
              value={formData.kelas}
              onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Komponen WalsanInfoModal (MODIFIKASI DI SINI) ---
const WalsanInfoModal = ({
  isOpen,
  onClose,
  credentials,
}: {
  isOpen: boolean;
  onClose: () => void;
  // Tambahkan username ke tipe credentials
  credentials: { email: string; username: string; password?: string } | null;
}) => {
  const router = useRouter();
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);
  const [hasCopiedUsername, setHasCopiedUsername] = useState(false);
  const [hasCopiedPassword, setHasCopiedPassword] = useState(false);

  if (!isOpen || !credentials) return null;

  const copyToClipboard = (text: string, type: "email" | "username" | "password") => {
    navigator.clipboard.writeText(text);
    if (type === "email") setHasCopiedEmail(true);
    else if (type === "username") setHasCopiedUsername(true);
    else setHasCopiedPassword(true);

    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} berhasil disalin!`);

    setTimeout(() => {
      if (type === "email") setHasCopiedEmail(false);
      else if (type === "username") setHasCopiedUsername(false);
      else setHasCopiedPassword(false);
    }, 2000);
  };

  const handleSuccessRedirect = () => {
    onClose();
    router.push("/dashboard/admin/walsan");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="text-center">
          <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full h-16 w-16 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Informasi Akun Walsan
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Berikut adalah kredensial untuk login wali santri.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <Label>Email (untuk Web)</Label>
            <div className="flex items-center gap-2">
              <Input readOnly value={credentials.email} className="truncate" />
              <Button size="icon" variant="outline" onClick={() => copyToClipboard(credentials.email, "email")}>
                {hasCopiedEmail ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          {/* --- BLOK BARU UNTUK USERNAME --- */}
          <div>
            <Label>Username (untuk Mobile)</Label>
            <div className="flex items-center gap-2">
              <Input readOnly value={credentials.username} className="truncate" />
              <Button size="icon" variant="outline" onClick={() => copyToClipboard(credentials.username, "username")}>
                {hasCopiedUsername ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          {/* ---------------------------------- */}
          <div>
            <Label>Password Default</Label>
            <div className="flex items-center gap-2">
              <Input readOnly value="smkmqbisa" />
              <Button size="icon" variant="outline" onClick={() => copyToClipboard("smkmqbisa", "password")}>
                {hasCopiedPassword ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        <Button onClick={handleSuccessRedirect} className="mt-6 w-full">
          Selesai
        </Button>
      </div>
    </div>
  );
};

// --- Halaman Detail Santri ---
const ITEMS_PER_PAGE = 4;

export default function SantriDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [santri, setSantri] = useState<SantriDetail | null>(null);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [itemsMap, setItemsMap] = useState<Map<number, Item>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGeneratingWalsan, setIsGeneratingWalsan] = useState(false);

  // states for walsan check & walsan info modal
  const [hasWalsan, setHasWalsan] = useState(false);
  const [existingWalsanEmail, setExistingWalsanEmail] = useState<string | null>(null);
  const [isWalsanInfoModalOpen, setIsWalsanInfoModalOpen] = useState(false);
  // Modifikasi state untuk menampung username
  const [generatedWalsanCreds, setGeneratedWalsanCreds] = useState<{ email: string; username: string; password?: string } | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch santri detail, history, items
  const fetchAllData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [santriData, historyData, itemsData] = await Promise.all([
        getSantriDetail(id),
        getHistoryBySantriId(id),
        getAllItems(),
      ]);

      const newItemsMap = new Map<number, Item>();
      if (Array.isArray(itemsData)) {
        itemsData.forEach((item: Item) => newItemsMap.set(item.id, item));
      }

      setSantri(santriData);
      const sortedHistory = Array.isArray(historyData)
        ? historyData.sort((a: TransactionHistory, b: TransactionHistory) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : [];
      setTransactions(sortedHistory);
      setItemsMap(newItemsMap);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Fetch whether this santri already has walsan account
  const checkWalsanExists = useCallback(async () => {
    if (!id) return;
    try {
      const walsanList = await getWalsanList(); // returns array
      if (Array.isArray(walsanList)) {
        const found = (walsanList as WalsanMinimal[]).find((w) =>
          Array.isArray(w.parent?.santri) && w.parent.santri.some((s) => Number(s.id) === Number(id))
        );
        if (found) {
          setHasWalsan(true);
          setExistingWalsanEmail(found.email || null);
        } else {
          setHasWalsan(false);
          setExistingWalsanEmail(null);
        }
      } else {
        setHasWalsan(false);
        setExistingWalsanEmail(null);
      }
    } catch (err) {
      setHasWalsan(false);
      setExistingWalsanEmail(null);
      console.error("Gagal mengecek walsan:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchAllData();
    checkWalsanExists();
  }, [fetchAllData, checkWalsanExists]);

  // pagination for transactions
  const totalPages = Math.max(1, Math.ceil(transactions.length / ITEMS_PER_PAGE));
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage]);

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleUpdateSantri = async (data: SantriEditData) => {
    if (!santri) return;
    const promise = updateSantriDetail(id, data);
    toast.promise(promise, {
      loading: "Menyimpan perubahan...",
      success: async (updatedSantri) => {
        setSantri((prev) => (prev ? { ...prev, ...(updatedSantri as any) } : null));
        setIsEditModalOpen(false);
        await fetchAllData();
        return "Data santri berhasil diperbarui!";
      },
      error: (err: any) => `Gagal memperbarui data: ${err?.message || err}`,
    });
  };

  // Handler untuk generate walsan (MODIFIKASI DI SINI)
  const handleGenerateWalsan = async () => {
    if (!santri) return;
    if (hasWalsan) {
      toast.error("Akun walsan sudah ada untuk santri ini.");
      return;
    }

    setIsGeneratingWalsan(true);
    try {
      const res = await generateWalsan(santri.id);

      // Ekstrak email dan username dari response API
      const email = res?.data?.user?.email || res?.user?.email || null;
      const username = res?.data?.user?.username || res?.user?.username || null;

      if (!email || !username) {
        throw new Error("Respons dari server tidak valid.");
      }
      
      // Set state dengan email dan username
      setGeneratedWalsanCreds({ email, username, password: "smkmqbisa" });
      setIsWalsanInfoModalOpen(true);
      setHasWalsan(true);
      setExistingWalsanEmail(email);
      
      checkWalsanExists();
    } catch (err: any) {
      toast.error(`Gagal: ${err?.message || "Terjadi kesalahan."}`);
    } finally {
      setIsGeneratingWalsan(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <LoaderCircle className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );

  if (error)
    return (
      <div className="text-center pt-20 flex flex-col items-center">
        <SearchX className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Gagal Memuat Data</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <Link href="/dashboard/admin/santri" className="mt-6 inline-block">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
      </div>
    );

  if (!santri) return <div className="text-center pt-20">Data santri tidak ditemukan.</div>;

  return (
    <>
      <div className="flex flex-col h-full space-y-6">
        {/* Header & breadcrumb */}
        <div>
          <Link href="/dashboard/admin/santri" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Santri
          </Link>
        </div>

        {/* Profil card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mr-6">
              <User className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{santri.name}</h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">{santri.kelas}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              <span>Edit Data</span>
            </Button>

            <div className="flex flex-col items-start">
              <Button
                variant={hasWalsan ? "outline" : "default"}
                size="sm"
                onClick={handleGenerateWalsan}
                disabled={isGeneratingWalsan || hasWalsan}
                className={hasWalsan ? "opacity-60" : ""}
              >
                {isGeneratingWalsan ? (
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    <span>Membuat...</span>
                  </div>
                ) : (
                  <span>Generate Akun Walsan</span>
                )}
              </Button>

              {hasWalsan && existingWalsanEmail && (
                <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">Akun walsan sudah dibuat: {existingWalsanEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Grid Info & Transaksi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-1 items-center">
              <Wallet className="w-8 h-8 text-green-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Saldo Saat Ini</p>
                <p className="text-3xl font-bold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(santri.saldo)}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-1 items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Hutang</p>
                <p className="text-3xl font-bold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(santri.hutang ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h2 className="text-xl font-semibold flex items-center">
                <History className="w-5 h-5 mr-3" />
                Riwayat Transaksi
              </h2>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">{currentPage} / {totalPages}</span>
                  <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              <TransactionList transactions={paginatedTransactions} itemsMap={itemsMap} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {santri && (
        <EditSantriModal santri={santri} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateSantri} />
      )}

      <WalsanInfoModal isOpen={isWalsanInfoModalOpen} onClose={() => setIsWalsanInfoModalOpen(false)} credentials={generatedWalsanCreds} />
    </>
  );
}