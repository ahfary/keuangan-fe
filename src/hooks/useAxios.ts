/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAxios.ts
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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await axiosInstance(axiosParams);
      setData(result as any);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [axiosParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}

export default useAxios;