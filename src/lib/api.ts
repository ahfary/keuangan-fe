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

// 1. Fungsi untuk mendapatkan semua data santri
export const getSantriList = async (token: string) => {
  // Di aplikasi nyata:
  
  const response = await fetch(`${API_BASE_URL}/santri`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Gagal mengambil data santri');
  return response.json();
  

  // // Simulasi
  // console.log("API: Mengambil daftar santri...");
  // await new Promise(res => setTimeout(res, 500)); // Simulasi delay jaringan
  // return MOCK_SANTRI_DB;
};

// 2. Fungsi untuk mendapatkan detail satu santri berdasarkan ID
export const getSantriDetail = async (id: string, token: string) => {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        throw new Error("ID Santri tidak valid.");
    }

    const response = await fetch(`${API_BASE_URL}/santri/${numericId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    // FIX: Logika error handling yang lebih baik
    if (response.status === 404) {
        throw new Error('Santri tidak ditemukan di database.');
    }
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal mengambil detail santri.');
    }
    return response.json();

  } catch (error) {
    console.error('getSantriDetail API Error:', error);
    throw error;
  }
};

// 3. Fungsi untuk memotong saldo santri
export const deductSantriBalance = async (id: string, amount: number, description: string, token: string) => {
    // Di aplikasi nyata:

    const response = await fetch(`${API_BASE_URL}/santri/${id}/deduct-balance`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, description })
    });
    if (!response.ok) throw new Error('Gagal memotong saldo');
    return response.json();

    // Simulasi
    // console.log(`API: Memotong saldo santri ID: ${id} sejumlah ${amount} untuk '${description}'`);
    // await new Promise(res => setTimeout(res, 1000));
    // const santriIndex = MOCK_SANTRI_DB.findIndex(s => s.id === id);
    // if (santriIndex > -1) {
    //     MOCK_SANTRI_DB[santriIndex].balance -= amount;
    //     return { success: true, newBalance: MOCK_SANTRI_DB[santriIndex].balance };
    // }
    // throw new Error('Gagal memotong saldo');
};


// ==============================================DETAIL SANTRI===============================================

// Mock data untuk transaksi
const MOCK_TRANSACTIONS = {
    '1': [
        { id: 'TRX101', description: 'Beli Indomie Goreng', amount: 3500, date: '2025-07-23' },
        { id: 'TRX102', description: 'Bayar Uang Kas', amount: 10000, date: '2025-07-22' },
    ],
    '2': [
        { id: 'TRX201', description: 'Beli Teh Pucuk', amount: 4000, date: '2025-07-23' },
    ],
    // ... tambahkan data untuk ID lain jika perlu
};

// 4. Fungsi untuk mengupdate data santri
export const updateSantriDetail = async (id: string, data: { name: string, kelas: string }, token: string) => {
    const numericId = parseInt(id, 10);
    // Di aplikasi nyata:
    /*
    const response = await fetch(`${API_BASE_URL}/santri/${numericId}`, {
        method: 'PATCH',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Gagal mengupdate data santri');
    return response.json();
    */
    
    // Simulasi
    console.log(`API: Mengupdate data untuk santri ID: ${id}`, data);
    await new Promise(res => setTimeout(res, 700));
    // Logika mock update bisa ditambahkan di sini jika perlu
    return { success: true, ...data };
};

// 5. Fungsi untuk mendapatkan riwayat transaksi santri
export const getSantriTransactions = async (id: string, token: string) => {
    // Di aplikasi nyata:
    /*
    const response = await fetch(`${API_BASE_URL}/santri/${id}/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Gagal mengambil riwayat transaksi');
    return response.json();
    */

    // Simulasi
    console.log(`API: Mengambil transaksi untuk santri ID: ${id}`);
    await new Promise(res => setTimeout(res, 800));
    return MOCK_TRANSACTIONS[id as keyof typeof MOCK_TRANSACTIONS] || [];
};