/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './axios'; // Impor instance axios yang sudah dikonfigurasi

// =========================================
//  FUNGSI SANTRI (CRUD & LAINNYA)
// =========================================
export const getSantriList = () => api.get("/santri");
export const getSantriDetail = (id: string) => api.get(`/santri/detail/${id}`);
export const generateWalsan = (santriId: number) => api.post(`/auth/generate-walsan/${santriId}`);
export const updateSantriDetail = (id: string, santriData: { name: string; kelas: string }) =>
  api.put(`/santri/update/${id}`, santriData);
export const createSantri = (santriData: { name: string; kelas: string; jurusan: string }) =>
  api.post("/santri/create", santriData);
export const updateSantriBulk = (ids: number[], data: any) =>
  api.put(`/santri/update-bulk?id=${ids.join(",")}`, data);
export const deleteSantriBulk = (ids: number[]) =>
  api.delete(`/santri/delete-bulk?id=${ids.join(",")}`);

// =========================================
//  FUNGSI AUTENTIKASI & AKUN
// =========================================
export const loginUser = (email: any, password: any, role: any) =>
  api.post("/auth/login", { email, password, role });
export const createAccount = (data: { name: string; email: string; password: string; role: string; }) =>
  api.post("/auth/register", data);

// =========================================
//  FUNGSI ITEMS (STOK BARANG) & KATEGORI
// =========================================
export const getAllItems = () => api.get("/items");
export const getAllKategori = () => api.get("/kategori");
export const getItems = () => api.get("/items");
export const deleteItem = (id: number) => api.delete(`/items/delete/${id}`);

// Untuk FormData, kita perlu override header default
export const createItem = (itemData: FormData) =>
  api.post('/items/create', itemData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateItem = (id: number, itemData: FormData) =>
  api.put(`/items/update/${id}`, itemData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// =========================================
//  FUNGSI HISTORY & TRANSAKSI
// =========================================
export const getSalesHistory = () => api.get("/history");
export const getHistoryBySantriId = (santriId: string) => api.get(`/history/santri/${santriId}`);
export const getSantriTransactions = (id: string) => api.get(`/transaksi/santri/${id}`);

// =========================================
//  FUNGSI TOP UP & NOTIFIKASI
// =========================================
export const createTopUpRequest = (data: FormData) =>
    api.post('/topup/request', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const getTopUpHistory = (santriId: string) => api.get(`/topup/history/${santriId}`);
export const getNotifications = () => api.get("/notifications");

// =========================================
//  FUNGSI DASHBOARD
// =========================================
export const getTotalSantri = () => api.get("/santri/count");
export const getTotalSaldo = () => api.get("/santri/total-saldo");
export const getTotalHutang = () => api.get("/santri/hutang");
export const getTopBalanceSantri = () => api.get("/santri/saldo-max");

// =========================================
//  FUNGSI WALI SANTRI (WALSAN)
// =========================================
export const getWalsanList = () => api.get("/santri/walsan");
export const deleteWalsanBulk = (ids: number[]) => api.delete(`/santri/walsan/delete-bulk?id=${ids.join(",")}`);