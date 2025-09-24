/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';

// 1. Konfigurasi Dasar
const API_BASE_URL = 'https://keuangan-santri-be.vercel.app';

/**
 * Fungsi helper terpusat untuk melakukan fetch request ke API.
 * Secara otomatis menyertakan token otentikasi dan menangani respons.
 */
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = Cookies.get('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (response.status === 204) { // Handle No Content response for DELETE
    return { success: true };
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Terjadi kesalahan pada server.');
  }

  return responseData.data || responseData;
};


// =========================================
//  FUNGSI AUTENTIKASI & AKUN
// =========================================
export const loginUser = (email: any, password: any, role: any) => {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  });
};

export const createAccount = (data: { name: string; email: string; password: string; role: string; }) => {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const generateWalsan = (santriId: number) => {
  return fetchAPI(`/auth/generate-walsan/${santriId}`, {
    method: 'POST',
  });
};

// =========================================
//  FUNGSI DASHBOARD
// =========================================
export const getTotalSantri = () => fetchAPI('/santri/count');
export const getTotalSaldo = () => fetchAPI('/santri/total-saldo');
export const getTotalHutang = () => fetchAPI('/santri/hutang');
export const getTopBalanceSantri = () => fetchAPI('/santri/saldo-max');


// =========================================
//  FUNGSI SANTRI (CRUD & LAINNYA)
// =========================================
export const getSantriList = () => fetchAPI('/santri');
export const getWalsanList = () => fetchAPI('/santri/walsan');
export const getSantriDetail = (id: string) => fetchAPI(`/santri/detail/${id}`);

export const createSantri = (santriData: { name: string; kelas: string; jurusan: string; }) => {
  return fetchAPI('/santri', {
    method: 'POST',
    body: JSON.stringify(santriData),
  });
};

/**
 * [FIXED] Mengubah method menjadi 'PUT' dan endpoint menjadi '/santri/update/:id'
 * agar sesuai dengan backend controller.
 */
export const updateSantriDetail = (id: string, santriData: { name: string, kelas: string }) => {
  return fetchAPI(`/santri/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(santriData),
  });
};

/**
 * [FIXED] Mengubah endpoint menjadi '/santri/delete/:id' agar sesuai dengan backend.
 */
export const deleteSantri = (id: string) => {
  return fetchAPI(`/santri/delete/${id}`, {
    method: 'DELETE',
  });
};

/**
 * [FIXED] Mengubah endpoint menjadi '/santri/deduct-saldo/:id' agar sesuai dengan backend.
 */
export const deductSantriBalance = (id: string, amount: number, description: string) => {
  return fetchAPI(`/santri/deduct-saldo/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ jumlah: amount, deskripsi: description }),
  });
};

export const updateSantriBulk = (ids: number[], data: any) => {
  return fetchAPI(`/santri/update-bulk?id=${ids.join(',')}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteSantriBulk = (ids: number[]) => {
  return fetchAPI(`/santri/delete-bulk?id=${ids.join(',')}`, {
    method: 'DELETE',
  });
};


// =========================================
//  FUNGSI ITEMS (STOK BARANG) & KATEGORI
// =========================================
interface ItemData {
  nama: string;
  harga: number;
  jumlah: number;
  kategori: string;
  gambar?: string;
}

export const getAllItems = () => fetchAPI('/items');
export const getAllKategori = () => fetchAPI('/kategori');

export const createItem = (itemData: ItemData) => {
  return fetchAPI('/items', {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
};

export const updateItem = (id: number, itemData: Partial<ItemData>) => {
  return fetchAPI(`/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(itemData),
  });
};

export const deleteItem = (id: number) => {
  return fetchAPI(`/items/${id}`, {
    method: 'DELETE',
  });
};


// =========================================
//  FUNGSI HISTORY & TRANSAKSI
// =========================================
export const getSalesHistory = () => fetchAPI('/history');
export const getHistoryBySantriId = (santriId: string) => fetchAPI(`/history/santri/${santriId}`);
export const getSantriTransactions = (id: string) => fetchAPI(`/transaksi/santri/${id}`);


// =========================================
//  FUNGSI TOP UP & NOTIFIKASI
// =========================================
export const createTopUpRequest = async (data: { santriId: string; amount: number; proof: File; }) => {
    const formData = new FormData();
    formData.append('santriId', data.santriId);
    formData.append('amount', data.amount.toString());
    formData.append('proof', data.proof);

    const token = Cookies.get('accessToken');
    const response = await fetch(`${API_BASE_URL}/topup/request`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengirim permintaan top-up.');
    }
    return response.json();
};

export const getTopUpHistory = (santriId: string) => fetchAPI(`/topup/history/${santriId}`);
export const getNotifications = () => fetchAPI('/notifications');