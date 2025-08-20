"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
// Pastikan nama fungsi di api.ts adalah loginUser atau sesuaikan
import { loginUser } from "@/lib/api"; 
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = loginUser(email, password);

    toast.promise(promise, {
      loading: 'Mencoba masuk...',
      success: (data) => {
        // --- PERUBAHAN LOGIKA DI SINI ---
        if (data.accessToken && data.role) {
            // 1. Simpan accessToken
            localStorage.setItem("accessToken", data.accessToken);
            // 2. Simpan role pengguna
            localStorage.setItem("userRole", data.role);

            // 3. (Opsional) Simpan santriId jika ada untuk wali santri
            if (data.role === 'wali santri' && data.santriId) {
                localStorage.setItem('santriId', data.santriId);
            }
            
            router.push("/dashboard");
            return 'Login berhasil!';
        } else {
            // Jika data tidak sesuai format yang diharapkan
            throw new Error("Respons server tidak valid.");
        }
      },
      error: (err) => {
        setIsLoading(false);
        // Menampilkan pesan error dari server atau pesan default
        return `${err.message || "Gagal terhubung ke server."}`;
      }
    });

    // Reset loading state jika promise selesai (baik sukses atau error)
    promise.finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Form Section (Tampilan tidak berubah) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-[#0B1224] px-8 py-10">
        <div className="flex items-center gap-2 mb-10">
          <Image src="/assets/img/wallet.png" alt="SakuSantri" width={30} height={30} />
          <h1 className="text-2xl font-bold text-[#4F39F6]">SakuSantri</h1>
        </div>

        <p className="text-white mb-10 text-lg text-center">
          Silahkan Masuk terlebih dahulu
        </p>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-sm block mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukan Email anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-transparent border border-white/40 text-white placeholder:text-white/50 rounded-lg px-4 py-4 bg-[#0B1224]/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white text-sm block mb-2">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukan Password anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-transparent border border-white/40 text-white placeholder:text-white/50 rounded-lg px-4 py-4"
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4F39F6] hover:bg-[#3e2fe0] text-white rounded-lg py-4 font-medium"
            >
              {isLoading && <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />}
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </div>
        </form>
      </div>

      {/* Right Image Section (Tampilan tidak berubah) */}
      <div className="hidden md:flex md:w-1/2 bg-[#513CFA] justify-center items-center">
        <Image
          src="/assets/img/hero1.png"
          alt="Illustration"
          width={450}
          height={450}
          priority
        />
      </div>
    </div>
  );
}