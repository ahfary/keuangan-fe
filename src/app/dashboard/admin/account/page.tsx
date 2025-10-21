/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { createAccount } from "@/lib/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Admin"); // Default role
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("Admin");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      toast.error("Password tidak cocok!");
      setIsLoading(false);
      return;
    }

    try {
      await createAccount({ name, email, password, role });
      
      MySwal.fire({
        title: "Berhasil!",
        text: "Akun baru telah berhasil dibuat.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
           popup: 'bg-white dark:bg-gray-800',
           title: 'text-gray-900 dark:text-white',
           htmlContainer: 'text-gray-600 dark:text-gray-300'
        }
      });

      resetForm(); // Reset form setelah berhasil
    } catch (err: any) {
      const errorMessage = err.message || "Gagal mendaftar.";
      setError(errorMessage);
      toast.error(`Gagal: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[87vh] flex">
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-[#0B1224] px-8 py-10">
        <div className="flex items-center gap-2 mb-10">
          <Image src="/assets/img/wallet.png" alt="SakuSantri" width={30} height={30} />
          <h1 className="text-2xl font-bold text-[#4F39F6]">SakuSantri</h1>
        </div>

        <p className="text-white mb-10 text-lg text-center">
          Silahkan buat akun anda
        </p>

        <form onSubmit={handleRegister} className="w-full max-w-sm space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm rounded-lg p-3 text-center">
              <p>{error}</p>
            </div>
          )}
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white text-sm block mb-2">
              Nama Lengkap
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Masukan nama lengkap anda"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="bg-transparent border border-white/40 text-white placeholder:text-white/50 rounded-lg px-4 py-3"
            />
          </div>

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
              className="bg-transparent border border-white/40 text-white placeholder:text-white/50 rounded-lg px-4 py-3"
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
              className="bg-transparent border border-white/40 text-white placeholder:text-white/50 rounded-lg px-4 py-3"
              required
            />
          </div>
          
          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white text-sm block mb-2">
              Konfirmasi Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Konfirmasi Password anda"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="bg-transparent border border-white/40 text-white placeholder:text-white/50 rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Dropdown Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-white text-sm block mb-2">
                Daftar sebagai
            </Label>
            <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading}
                className="w-full h-12 bg-transparent border border-white/40 text-white rounded-lg px-4 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
            >
                <option value="Admin" className="bg-[#0B1224] capitalize">Admin</option>
                <option value="Kasir" className="bg-[#0B1224] capitalize">Kasir</option>
                <option value="Walisantri" className="bg-[#0B1224]">Wali Santri</option>
            </select>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4F39F6] hover:bg-[#3e2fe0] text-white rounded-lg py-3 font-medium"
            >
              {isLoading && <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />}
              {isLoading ? "Memproses..." : "Daftar"}
            </Button>
          </div>
        </form>
      </div>

      <div className="hidden md:flex md:w-1/2 justify-center items-center">
        <Image
          src="/assets/img/proyek.png"
          alt="Illustration"
          className="w-full object-cover h-full object-center"
          width={450}
          height={450}
          priority
        />
      </div>
    </div>
  );
}