import Cookies from 'js-cookie';

// 1. Konfigurasi dasar
// Pastikan variabel ini ada di file .env.local Anda
const API_BASE_URL = 'https://keuangan-santri-be.vercel.app/';

/**
 * Fungsi helper terpusat untuk melakukan fetch request ke API.
 * Secara otomatis menyertakan token otentikasi dari cookies.
 * @param endpoint - Path API setelah base URL (misal: '/santri')
 * @param options - Opsi standar untuk fetch (method, body, dll.)
 * @returns {Promise<any>} - Data JSON dari respons API
 */
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = Cookies.get('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Tambahkan header Authorization jika token ada
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  
  // Penanganan respons DELETE yang mungkin tidak memiliki body
  if (response.status === 204) {
    return { success: true };
  }
  
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Terjadi kesalahan pada server.');
  }

  return responseData.data || responseData; // Sesuaikan dengan struktur respons BE
};


// =========================================
//         FUNGSI AUTENTIKASI
// =========================================

export const loginUser = async (email, password, role) => {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  });
};


// =========================================
//         FUNGSI DASHBOARD
// =========================================

export const getDashboardStats = () => {
  return fetchAPI('/santri/stats');
};

export const getTopSantriBySaldo = (limit = 5) => {
  return fetchAPI(`/santri/top-saldo?limit=${limit}`);
};


// =========================================
//           FUNGSI SANTRI
// =========================================

export const getSantriList = () => {
  return fetchAPI('/santri');
};

export const getSantriDetail = (id: string) => {
  return fetchAPI(`/santri/${id}`);
};

export const createSantri = (santriData: { name: string; kelas: string; jurusan: string; }) => {
  return fetchAPI('/santri', {
    method: 'POST',
    body: JSON.stringify(santriData),
  });
};

export const updateSantriDetail = (id: string, santriData: { name: string, kelas: string }) => {
  return fetchAPI(`/santri/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(santriData),
  });
};

export const deleteSantri = (id: string) => {
  return fetchAPI(`/santri/${id}`, {
    method: 'DELETE',
  });
};

export const deductSantriBalance = (id: string, amount: number, description: string) => {
  return fetchAPI(`/santri/${id}/deduct`, {
    method: 'PATCH',
    body: JSON.stringify({ jumlah: amount, deskripsi: description }),
  });
};


// =========================================
//      FUNGSI TRANSAKSI & STOK BARANG
// =========================================

export const getSantriTransactions = (id: string) => {
  return fetchAPI(`/transaksi/santri/${id}`);
};

interface ItemData {
  nama: string;
  harga: number;
  jumlah: number;
  kategori: string;
  gambar?: string;
}

export const getItems = () => {
  return fetchAPI('/items');
};

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