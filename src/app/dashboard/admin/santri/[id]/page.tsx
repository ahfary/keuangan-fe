"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
// --- MODIFIKASI: Tambahkan useRouter ---
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
  // --- MODIFIKASI: Tambahkan ikon baru ---
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// --- MODIFIKASI: Tambahkan getWalsanList ---
import {
  getSantriDetail,
  getHistoryBySantriId,
  updateSantriDetail,
  generateWalsan,
  getWalsanList, // Pastikan fungsi ini ada di api.ts
} from "@/lib/api";
import toast from "react-hot-toast";

// --- Tipe Data (Tidak ada perubahan) ---
interface SantriDetail {
  id: number;
  name: string;
  kelas: string;
  saldo: number;
  hutang?: number;
}
interface HistoryItem {
  id: string;
  itemName: string;
  quantity: number;
  priceAtPurchase: number;
}
interface Transaction {
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

// --- Komponen Tabs (Tidak ada perubahan) ---
const Tabs = ({ tabs, activeTab, setActiveTab }: any) => (
  <div className="border-b border-gray-200 dark:border-gray-700">
    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
      {tabs.map((tab: any) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`${
            activeTab === tab.name
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {tab.name}
        </button>
      ))}
    </nav>
  </div>
);

// --- Komponen Daftar Transaksi (Tidak ada perubahan) ---
const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  const flatItems = transactions.flatMap((tx) =>
    tx.items
      ? tx.items.map((item) => ({
          id: `${tx.id}-${item.id}`,
          description: item.itemName,
          amount: item.priceAtPurchase * item.quantity,
          date: tx.createdAt,
        }))
      : []
  );

  return (
    <div className="space-y-4 h-full overflow-y-auto pr-2">
      {flatItems.length > 0 ? (
        flatItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-2 dark:border-gray-700"
          >
            <div>
              <p className="font-medium capitalize">{item.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(item.date).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <p className="font-semibold text-red-600">
              -
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(item.amount)}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 text-center py-8">
          Belum ada riwayat untuk kategori ini.
        </p>
      )}
    </div>
  );
};

// --- Komponen Modal Edit Santri (Tidak ada perubahan) ---
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="edit-kelas">Kelas</Label>
            <Input
              id="edit-kelas"
              value={formData.kelas}
              onChange={(e) =>
                setFormData({ ...formData, kelas: e.target.value })
              }
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

// --- Komponen Modal Info Akun Walsan (Tidak ada perubahan) ---
const WalsanInfoModal = ({
  isOpen,
  onClose,
  credentials,
}: {
  isOpen: boolean;
  onClose: () => void;
  credentials: { email: string; password?: string } | null;
}) => {
  const router = useRouter();
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);
  const [hasCopiedPassword, setHasCopiedPassword] = useState(false);

  if (!isOpen || !credentials) return null;

  const copyToClipboard = (text: string, type: "email" | "password") => {
    navigator.clipboard.writeText(text);
    if (type === "email") setHasCopiedEmail(true);
    else setHasCopiedPassword(true);

    toast.success(`${type === "email" ? "Email" : "Password"} berhasil disalin!`);

    setTimeout(() => {
      if (type === "email") setHasCopiedEmail(false);
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
            Berikut adalah email dan password untuk login wali santri.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <Label>Email</Label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={credentials.email}
                className="truncate"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(credentials.email, "email")}
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
            <Label>Password Default</Label>
            <div className="flex items-center gap-2">
              <Input readOnly value="smkmqbisa" />
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

        <Button onClick={handleSuccessRedirect} className="mt-6 w-full">
          Berhasil
        </Button>
      </div>
    </div>
  );
};

// --- Halaman Detail Santri ---
export default function SantriDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [santri, setSantri] = useState<SantriDetail | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Riwayat Jajan");

  const [isWalsanInfoModalOpen, setIsWalsanInfoModalOpen] = useState(false);
  const [generatedWalsanCreds, setGeneratedWalsanCreds] = useState<{
    email: string;
    password?: string;
  } | null>(null);

  useEffect(() => {
    const fetchSantriData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken") || "";
        const santriData = await getSantriDetail(id, token);
        setSantri(santriData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSantriData();
  }, [id]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!id) return;
      setIsTxLoading(true);
      try {
        const token = localStorage.getItem("accessToken") || "";
        let status: "Lunas" | "Hutang" | undefined = undefined;

        if (activeTab === "Riwayat Jajan") {
          status = "Lunas";
        } else if (activeTab === "Riwayat Hutang") {
          status = "Hutang";
        }

        if (activeTab !== "Riwayat Tarik Tunai") {
          const transactionData = await getHistoryBySantriId(id, token, status);
          setTransactions(transactionData);
        } else {
          setTransactions([]);
        }
      } catch (err: any) {
        if (err.message && !err.message.includes("404")) {
          toast.error(`Gagal memuat riwayat: ${err.message}`);
        }
        setTransactions([]);
      } finally {
        setIsTxLoading(false);
      }
    };
    fetchTransactions();
  }, [id, activeTab]);
  
  const handleUpdateSantri = async (data: SantriEditData) => {
    if (!santri) return;
    const token = localStorage.getItem("accessToken") || "";
    const promise = updateSantriDetail(id, data, token);
    toast.promise(promise, {
      loading: "Menyimpan perubahan...",
      success: (updatedSantri) => {
        setSantri((prev) => (prev ? { ...prev, ...updatedSantri } : null));
        setIsEditModalOpen(false);
        return "Data santri berhasil diperbarui!";
      },
      error: (err) => `Gagal memperbarui data: ${err.message}`,
    });
  };

  // --- MODIFIKASI: Fungsi generate walsan yang lebih cerdas ---
  const handleGenerateWalsan = async () => {
    if (!santri) return;

    const token = localStorage.getItem("accessToken") || "";
    const loadingToastId = toast.loading("Memproses permintaan...");

    try {
      // 1. Coba buat akun baru
      const response = await generateWalsan(santri.id, token);
      toast.dismiss(loadingToastId);
      
      const email = response?.data?.user?.email || response?.user?.email;
      if (!email) {
          throw new Error("Email tidak ditemukan dalam respons API.");
      }

      // Jika berhasil, tampilkan popup dengan data baru
      setGeneratedWalsanCreds({ email, password: "smkmqbisa" });
      setIsWalsanInfoModalOpen(true);
      toast.success(`Akun baru untuk ${email} berhasil dibuat!`);

    } catch (error: any) {
      toast.dismiss(loadingToastId);

      // 2. Jika errornya adalah 409 Conflict (akun sudah ada)
      if (error.message && error.message.includes('sudah memiliki walsan')) {
        const loadingDetailsToast = toast.loading('Akun sudah ada, mengambil detail...');
        
        try {
          // 3. Ambil seluruh daftar walsan
          const walsanList = await getWalsanList();
          
          // 4. Cari walsan yang terkait dengan santri ini
          const existingWalsan = walsanList.find((w: any) =>
            w.parent?.santri?.some((s: any) => s.id === santri.id)
          );
          
          toast.dismiss(loadingDetailsToast);

          if (existingWalsan) {
            // 5. Jika ketemu, tampilkan popup dengan data yang sudah ada
            setGeneratedWalsanCreds({ email: existingWalsan.email, password: "smkmqbisa" });
            setIsWalsanInfoModalOpen(true);
            toast.success('Menampilkan data akun yang sudah ada.');
          } else {
            toast.error('Gagal mengambil detail akun yang sudah ada.');
          }
        } catch (fetchError: any) {
          toast.dismiss(loadingDetailsToast);
          toast.error(`Gagal mengambil daftar walsan: ${fetchError.message}`);
        }
      } else {
        // 6. Jika error lain, tampilkan pesan error seperti biasa
        toast.error(`Gagal memproses: ${error.message}`);
      }
    }
  };

  // --- Render Logic (Tidak ada perubahan) ---
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
  if (!santri)
    return <div className="text-center pt-20">Data santri tidak ditemukan.</div>;

  const tabs = [
    { name: "Riwayat Jajan" },
    { name: "Riwayat Hutang" },
    { name: "Riwayat Tarik Tunai" },
  ];

  return (
    <>
      <div className="flex flex-col h-full space-y-6">
        {/* Header dan Info Santri */}
        <div>
          <Link
            href="/dashboard/admin/santri"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Santri
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mr-6">
              <User className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {santri.name}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                {santri.kelas}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Data
            </Button>
            {/* --- Tombol ini sekarang menggunakan logika baru --- */}
            <Button variant="default" onClick={handleGenerateWalsan}>
              Generate Akun Walsan
            </Button>
          </div>
        </div>

        {/* Saldo dan Riwayat Transaksi */}
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
            <h2 className="text-xl font-semibold mb-4 flex items-center flex-shrink-0">
              <History className="w-5 h-5 mr-3" />
              Riwayat Transaksi
            </h2>
            <div className="flex-shrink-0">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
            <div className="mt-4 flex-1 overflow-hidden">
              {isTxLoading ? (
                <div className="flex justify-center items-center h-full">
                  <LoaderCircle className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <TransactionList transactions={transactions} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render Modals */}
      {santri && (
        <EditSantriModal
          santri={santri}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateSantri}
        />
      )}

      <WalsanInfoModal
        isOpen={isWalsanInfoModalOpen}
        onClose={() => setIsWalsanInfoModalOpen(false)}
        credentials={generatedWalsanCreds}
      />
    </>
  );
} 