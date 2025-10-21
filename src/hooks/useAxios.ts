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

  // Stringify the params to create a stable dependency for hooks
  const paramsString = JSON.stringify(axiosParams);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Parse the string back to an object for the request
      const params = JSON.parse(paramsString);
      const result = await axiosInstance(params);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [paramsString]); // Dependency is now a stable string, preventing re-creation on every render

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}

export default useAxios;
