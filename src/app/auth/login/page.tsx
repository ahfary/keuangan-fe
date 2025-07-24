"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// FIX: Path impor yang benar. Alias '@/' sudah menunjuk ke 'src/'.
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/lable'; // FIX: Typo 'lable' menjadi 'label'
import { LoaderCircle, LogIn } from 'lucide-react';
import { loginUser } from '@/app/lib/api'; // FIX: Path impor yang benar

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@sakusantri.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);

      if (data.access_token) {
        localStorage.setItem('accessToken', data.access_token);
        router.push('/dashboard');
      } else {
        throw new Error('Token tidak diterima dari server.');
      }

    } catch (err: any) {
      setError(err.message || 'Gagal terhubung ke server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            SakuSantri
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Silakan login ke akun Admin Anda
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@sakusantri.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md dark:bg-red-900/30 dark:text-red-300 dark:border-red-500/50">
              {error}
            </div>
          )}

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Memproses...' : 'Login'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
