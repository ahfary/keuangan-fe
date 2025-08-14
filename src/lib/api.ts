// 1. Konfigurasi dasar
// URL ini harus menunjuk ke backend Nest.js Anda yang sedang berjalan.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// 2. Fungsi untuk Login User
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan saat login.');
    }

    return data;

  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};


// =========================================SANTRI===========================================================

export const getSantriList = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/santri`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const responseData = await response.json(); // Ambil data JSON dari respons

  if (!response.ok) {
    throw new Error(responseData.message || 'Gagal mengambil data santri');
  }
  // FIX: Kembalikan properti 'data' dari objek respons, bukan seluruh objeknya
  return responseData.data;
};

export const getSantriDetail = async (id: string, token: string) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) throw new Error("ID Santri tidak valid.");
  
  const response = await fetch(`${API_BASE_URL}/santri/${numericId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const responseData = await response.json(); // Ambil data JSON dari respons

  if (!response.ok) {
    throw new Error(responseData.message || 'Gagal mengambil detail santri.');
  }
  // FIX: Kembalikan properti 'data' dari objek respons
  return responseData.data;
};

export const createSantri = async (santriData: { name: string; kelas: string; }, token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/santri`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(santriData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal menambahkan santri');
  }
  return response.json();
};

// Fungsi untuk menghapus santri
export const deleteSantri = async (id: string, token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/santri/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gagal menghapus santri');
  }
  // Biasanya DELETE request tidak mengembalikan body, cukup cek status OK
  return { message: 'Santri berhasil dihapus' };
};


export const deductSantriBalance = async (id: string, amount: number, description: string, token: string) => {
    const numericId = parseInt(id, 10);
    const body = { jumlah: amount, deskripsi: description };

    const response = await fetch(`${API_BASE_URL}/santri/${numericId}/deduct`, {
        method: 'PATCH',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const responseData = await response.json(); // Ambil data JSON dari respons

    if (!response.ok) {
        throw new Error(responseData.message || 'Gagal memotong saldo.');
    }
    // FIX: Kembalikan properti 'data' dari objek respons
    return responseData.data;
};

// ... (fungsi updateSantriDetail dan getSantriTransactions jika ada)
export const updateSantriDetail = async (id: string, data: { name: string, kelas: string }, token: string) => {
    // Implementasi API call untuk update
    return { success: true }; // Placeholder
};

export const getSantriTransactions = async (id: string, token: string) => {
    // Implementasi API call untuk transaksi
    return []; // Placeholder
};

// =========================================STOK BARANG===========================================================

// Tipe data untuk item baru atau yang diupdate
interface ItemData {
  nama: string;
  harga: number;
  jumlah: number;
  kategori: string;
  gambar?: string; // Opsional
}

// 1. Fungsi untuk mendapatkan semua data barang
export const getItems = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/items`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const res = await response.json();
  if (!response.ok) throw new Error(res.message || 'Gagal mengambil data barang.');
  return res.data; // Mengembalikan array of items
};

// 2. Fungsi untuk membuat barang baru
export const createItem = async (itemData: ItemData, token: string) => {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemData),
  });
  const res = await response.json();
  if (!response.ok) throw new Error(res.message || 'Gagal menambah barang baru.');
  return res.data;
};

// 3. Fungsi untuk mengupdate data barang
export const updateItem = async (id: number, itemData: Partial<ItemData>, token: string) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemData),
  });
  const res = await response.json();
  if (!response.ok) throw new Error(res.message || 'Gagal mengupdate barang.');
  return res.data;
};

// 4. Fungsi untuk menghapus barang
export const deleteItem = async (id: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (response.status !== 204 && response.status !== 200) { // DELETE bisa mengembalikan 204 No Content
    const res = await response.json();
    throw new Error(res.message || 'Gagal menghapus barang.');
  }
  return { success: true };
};