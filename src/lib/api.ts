import Cookies from 'js-cookie';

// 1. Konfigurasi dasar
const API_BASE_URL = 'https://keuangan-santri-be.vercel.app';

/**
 * Helper fetch API
 */
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = Cookies.get('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  
  if (response.status === 204) return { success: true };

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Terjadi kesalahan pada server.');
  }

  return responseData.data || responseData;
};

// =========================================
//         FUNGSI AUTENTIKASI
// =========================================

export const loginUser = async (email: any, password: any, role: any) => {
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

// =========================================
//         FUNGSI DASHBOARD
// =========================================

export const getJumlahSantri = () => fetchAPI('/santri');
export const getTotalSantri = () => fetchAPI('/santri/count');
export const getTotalSaldo = () => fetchAPI('/santri/total-saldo');
export const getTotalHutang = () => fetchAPI('/santri/hutang');
export const getTopBalanceSantri = () => fetchAPI('/santri/saldo-max');

// =========================================
//           FUNGSI SANTRI
// =========================================

export const getSantriList = () => {
  return fetchAPI('/santri');
};

export const getSantriDetail = (id: string) => {
  return fetchAPI(`/santri/detail/${id}`);
};

// Versi endpoint baru dari branch kedua (gunakan endpoint '/create')
export const createSantri = (santriData: {
  name: string;
  kelas: string;
  jurusan: 'TKJ' | 'RPL';
}) => {
  return fetchAPI('/santri/create', {
    method: 'POST',
    body: JSON.stringify(santriData),
  });
};

// Update versi baru (PUT + endpoint '/update/{id}')
export const updateSantriDetail = (
  id: string,
  santriData: { name?: string; kelas?: string; jurusan?: 'TKJ' | 'RPL' }
) => {
  return fetchAPI(`/santri/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(santriData),
  });
};

// Delete versi baru (endpoint '/delete/{id}')
export const deleteSantri = (id: string) => {
  return fetchAPI(`/santri/delete/${id}`, {
    method: 'DELETE',
  });
};

// Tambahan dari branch kedua
export const deleteSantriBulk = (ids: number[]) => {
  return fetchAPI(`/santri/delete-bulk?id=${ids.join(',')}`, {
    method: 'DELETE',
  });
};

export const updateSantriBulk = async (ids: number[], data: any) => {
  const res = await fetch(`${API_BASE_URL}/santri/update-bulk?id=${ids.join(',')}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
};

// Fungsi lain tetap dipertahankan
export const deductSantriBalance = (id: string, amount: number, description: string) => {
  return fetchAPI(`/santri/${id}/deduct`, {
    method: 'PATCH',
    body: JSON.stringify({ jumlah: amount, deskripsi: description }),
  });
};

export const getSantriWithHutang = async () => {
  const allSantri = await fetchAPI('/santri');
  return allSantri.filter((santri: any) => santri.hutang > 0);
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

export const getItems = () => fetchAPI('/items');

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

export const getTopUpHistory = (santriId: string) => {
  return fetchAPI(`/topup/history/${santriId}`);
};


// =========================================
// Generate walsan
// =========================================


export const generateWalsan = (santriId: number) => {
  return fetchAPI(`/auth/generate-walsan/${santriId}`, {
    method: "POST",
  });
};