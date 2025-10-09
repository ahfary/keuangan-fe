/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";

// 1. Konfigurasi Dasar
const API_BASE_URL = "https://keuangan-santri-be.vercel.app";

/**
 * Fungsi helper terpusat untuk melakukan fetch request ke API.
 */
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = Cookies.get("accessToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return { success: true };
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Terjadi kesalahan pada server.");
  }

  return responseData.data || responseData;
};

// =========================================
//  FUNGSI SANTRI (CRUD & LAINNYA)
// =========================================
export const getSantriList = () => fetchAPI("/santri");
export const getSantriDetail = (id: string) => fetchAPI(`/santri/detail/${id}`);
export const generateWalsan = (santriId: number) => {
  return fetchAPI(`/auth/generate-walsan/${santriId}`, {
    method: "POST",
  });
};
export const updateSantriDetail = (
  id: string,
  santriData: { name: string; kelas: string }
) => {
  return fetchAPI(`/santri/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(santriData),
  });
};

/**
 * [FIXED] The endpoint is changed from '/santri' to '/santri/create'
 * to match the backend controller.
 */
export const createSantri = (santriData: {
  name: string;
  kelas: string;
  jurusan: string;
}) => {
  return fetchAPI("/santri/create", {
    method: "POST",
    body: JSON.stringify(santriData),
  });
};

export const updateSantriBulk = (ids: number[], data: any) => {
  return fetchAPI(`/santri/update-bulk?id=${ids.join(",")}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * [FIXED] The endpoint is changed from '/santri/delete-bulk' to '/santri/delete-bulk'
 * to match the backend controller.
 */
export const deleteSantriBulk = (ids: number[]) => {
  return fetchAPI(`/santri/delete-bulk?id=${ids.join(",")}`, {
    method: "DELETE",
  });
};

// ... (The rest of your api.ts file remains the same)
// =========================================
// 	FUNGSI AUTENTIKASI & AKUN
// =========================================
export const loginUser = (email: any, password: any, role: any) => {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  });
};

// =========================================
//  FUNGSI ITEMS (STOK BARANG) & KATEGORI
// =========================================
interface ItemData {
  nama: string;
  harga: number;
  jumlah: number;
  kategoriId: string;
  gambar?: File;
}

export const getAllItems = () => fetchAPI("/items");
export const getAllKategori = () => fetchAPI("/kategori");

export const createItem = async (itemData: FormData) => {
  const token = Cookies.get("accessToken");
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/items/create`, {
    method: "POST",
    headers,
    body: itemData,
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || "Gagal menambahkan barang.");
  }
  return responseData.data || responseData;
};

export const updateItem = async (id: number, itemData: FormData) => {
  const token = Cookies.get("accessToken");
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/items/update/${id}`, {
    method: "PUT",
    headers,
    body: itemData,
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || "Gagal memperbarui barang.");
  }
  return responseData.data || responseData;
};

export const deleteItem = (id: number) => {
  return fetchAPI(`/items/delete/${id}`, {
    method: "DELETE",
  });
};

export const getItems = () => {
  return fetchAPI("/items");
};

// =========================================
//  FUNGSI HISTORY & TRANSAKSI
// =========================================
export const getSalesHistory = () => fetchAPI("/history");
export const getHistoryBySantriId = (santriId: string) =>
  fetchAPI(`/history/santri/${santriId}`);
export const getSantriTransactions = (id: string) =>
  fetchAPI(`/transaksi/santri/${id}`);

// =========================================
//  FUNGSI TOP UP & NOTIFIKASI
// =========================================
export const createTopUpRequest = async (data: {
  santriId: string;
  amount: number;
  proof: File;
}) => {
  const formData = new FormData();
  formData.append("santriId", data.santriId);
  formData.append("amount", data.amount.toString());
  formData.append("proof", data.proof);

  const token = Cookies.get("accessToken");
  const response = await fetch(`${API_BASE_URL}/topup/request`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal mengirim permintaan top-up.");
  }
  return response.json();
};

export const getTopUpHistory = (santriId: string) =>
  fetchAPI(`/topup/history/${santriId}`);
export const getNotifications = () => fetchAPI("/notifications");

// =========================================
//  FUNGSI DASHBOARD
// =========================================
export const getTotalSantri = () => fetchAPI("/santri/count");
export const getTotalSaldo = () => fetchAPI("/santri/total-saldo");
export const getTotalHutang = () => fetchAPI("/santri/hutang");
export const getTopBalanceSantri = () => fetchAPI("/santri/saldo-max");

// walsann

export const deleteWalsanBulk = (ids: number[]) => {
  return fetchAPI(`/santri/walsan/delete-bulk?id=${ids.join(",")}`, {
    method: "DELETE",
  });
};

export const getWalsanList = () => fetchAPI("/santri/walsan");

// akun
export const createAccount = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  return fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
