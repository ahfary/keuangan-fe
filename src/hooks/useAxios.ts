/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../lib/axios';
import { AxiosRequestConfig } from 'axios';

type UseAxiosReturn<T> = {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => void;
};

function useAxios<T>(axiosParams: AxiosRequestConfig): UseAxiosReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Gunakan JSON.stringify untuk membuat dependensi yang stabil
  const paramsString = JSON.stringify(axiosParams);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Parse string kembali menjadi objek untuk request
      const params = JSON.parse(paramsString);
      // [FIX] Secara eksplisit beritahu TypeScript bahwa `result` akan bertipe `T`
      // karena interceptor kita sudah menangani ekstraksi data.
      const result = await axiosInstance(params) as T;
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [paramsString]); // Dependensi sekarang stabil

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}

export default useAxios;

