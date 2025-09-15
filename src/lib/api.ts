import Cookies from 'js-cookie';

// 1. Konfigurasi dasar
// Pastikan variabel ini ada di file .env.local Anda
const API_BASE_URL = 'https://keuangan-santri-be.vercel.app'; // Ganti dengan URL backend Anda

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

export const loginUser = async (email : any, password : any, role : any) => {
  // console.log(email, password, role)
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  });
};


// =========================================
//         FUNGSI DASHBOARD
// =========================================

export const getJumlahSantri = () => {
  return fetchAPI('/santri');
}


// =========================================
//           FUNGSI SANTRI
// =========================================

export const getSantriList = () => {
  return fetchAPI('/santri');
};

export const getSantriDetail = (id: string) => {
  // BENARKAN: Ubah endpoint dari /santri/${id} menjadi /santri/detail/${id}
  return fetchAPI(`/santri/detail/${id}`);
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














export const createTopUpRequest = async (data: { santriId: string; amount: number; proof: File; }) => {
    // Karena kita mengirim file, kita gunakan FormData
    const formData = new FormData();
    formData.append('santriId', data.santriId);
    formData.append('amount', data.amount.toString());
    formData.append('proof', data.proof);

    // Kita tidak menggunakan fetchAPI helper karena headernya berbeda
    const token = Cookies.get('accessToken');
    const response = await fetch(`${API_BASE_URL}/topup/request`, { // Asumsi endpoint ini ada di BE
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type' akan diatur otomatis oleh browser untuk FormData
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengirim permintaan top-up.');
    }

    return response.json();
};

// Fungsi untuk mendapatkan riwayat top-up wali santri
export const getTopUpHistory = (santriId: string) => {
    return fetchAPI(`/topup/history/${santriId}`); // Asumsi endpoint ini ada di BE
};


export const createAccount = (data: { name: string; email: string; password: string; role: string; }) => {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}