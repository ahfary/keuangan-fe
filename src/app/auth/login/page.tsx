"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { loginUser } from "@/lib/api";
import Cookies from 'js-cookie';
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin"); // Default role
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = loginUser(email, password, role);

    toast.promise(promise, {
      loading: 'Mencoba masuk...',
      success: (data) => {
        console.log(data);
        if (data.access_token && data.role) {
          Cookies.set("accessToken", data.accessToken, { expires: 1, secure: true });
          Cookies.set("userRole", data.role, { expires: 1, secure: true });
          
          // --- LOGIKA REDIRECT BERDASARKAN PERAN ---
          if (data.role === 'wali santri') {
            if(data.santriId) {
              Cookies.set('santriId', data.santriId, { expires: 1, secure: true });
            }
            router.push("/dashboard/walsan"); // Arahkan ke dashboard walsan
          } else {
            router.push("/dashboard/admin"); // Arahkan ke dashboard admin
          }
          
          return 'Login berhasil!';
        } else {
          throw new Error("Respons server tidak valid.");
        }
      },
      error: (err) => `Gagal: ${err.message || "Gagal terhubung ke server." + console.log(err)}`

    }).finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-[#0B1224] px-8 py-10">
        <div className="flex items-center gap-2 mb-10">
          <Image src="/assets/img/wallet.png" alt="SakuSantri" width={30} height={30} />
          <h1 className="text-2xl font-bold text-[#4F39F6]">SakuSantri</h1>
        </div>

        <p className="text-white mb-10 text-lg text-center">
          Silahkan Masuk terlebih dahulu
        </p>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-8">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-sm block mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukan Email anda"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-transparent border border-white/40 text-white placeholder:text-white/50 rounded-lg px-4 py-4 bg-[#0B1224]/50"
            />
          </div>

          {/* Password */}
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

          {/* Dropdown Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-white text-sm block mb-2">
                Masuk sebagai
            </Label>
            <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading}
                className="w-full h-14 bg-transparent border border-white/40 text-white rounded-lg px-4 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
            >
                <option value="Admin" className="bg-[#0B1224] capitalize">Admin</option>
                <option value="Walisantri" className="bg-[#0B1224]">Wali Santri</option>
            </select>
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