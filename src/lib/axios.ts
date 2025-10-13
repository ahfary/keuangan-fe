// src/lib/axios.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = "https://keuangan-santri-be.vercel.app";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani respons
axiosInstance.interceptors.response.use(
  (response) => {
    // Kembalikan data dari respons jika ada
    return response.data.data || response.data;
  },
  (error) => {
    // Tangani error secara global
    const message = error.response?.data?.message || error.message || "Terjadi kesalahan pada server.";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;