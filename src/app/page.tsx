"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Wallet,
  Users,
  Trophy, // <-- Impor ikon piala
  LoaderCircle,
  ServerCrash,
} from "lucide-react";
import { getTopBalanceSantri } from "@/lib/api"; // <-- Gunakan API yang benar

// Tipe data untuk santri
interface Santri {
  id: number;
  name: string;
  kelas: string;
  saldo: number;
}

// Komponen untuk ikon piala
const rankIcons = [
  <Trophy key="1" className="w-7 h-7 text-yellow-400" />,
  <Trophy key="2" className="w-7 h-7 text-gray-400" />,
  <Trophy key="3" className="w-7 h-7 text-orange-400" />,
];

export default function LandingPage() {
  const [topSantri, setTopSantri] = useState<Santri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopSantri = async () => {
      try {
        setIsLoading(true);
        const response = await getTopBalanceSantri();
        const santriData = response.data || response;
        // Pastikan hanya menampilkan 5 data teratas
        setTopSantri(santriData.slice(0, 5));
      } catch (err) {
        setError("Gagal memuat data papan peringkat.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopSantri();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header dengan Navigasi */}
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-white dark:bg-gray-950/50 backdrop-blur-sm sticky top-0 z-50">
        <Link href="#" className="flex items-center justify-center">
          <Wallet className="h-6 w-6 text-indigo-600" />
          <span className="ml-2 text-lg font-bold text-gray-800 dark:text-white">
            SakuSantri
          </span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-6">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Fitur
          </Link>
          <Link
            href="#leaderboard"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Peringkat
          </Link>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Login
          </Link>
        </nav>
        <Link href="/auth/login" className="ml-auto md:hidden">
            <Button size="sm">Login</Button>
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-20">
              <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-gray-900 dark:text-white">
                  Modernisasi Keuangan Pesantren Anda
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  SakuSantri adalah platform digital untuk mengelola keuangan
                  santri secara non-tunai, memberikan kemudahan bagi admin dan
                  transparansi penuh bagi wali santri.
                </p>
                <div className="flex">
                  <Link href="/auth/login?role=Admin">
                    <Button size="lg">
                      Masuk Dashboard Admin
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                src="/assets/img/hero.png"
                width={550}
                height={550}
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-contain"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Solusi Keuangan Digital Terintegrasi
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                Dari transaksi harian hingga pemantauan oleh wali, SakuSantri
                menyederhanakan semua aspek keuangan di pesantren.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-950 rounded-lg shadow-md transition-transform hover:scale-105">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mb-4">
                  <Wallet className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Transaksi Cashless</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aman, cepat, dan tercatat. Minimalkan risiko kehilangan uang
                  dan permudah transaksi di kantin.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-950 rounded-lg shadow-md transition-transform hover:scale-105">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mb-4">
                  <ShieldCheck className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Transparansi Penuh</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Wali santri dapat memantau setiap pengeluaran dan sisa saldo
                  anaknya secara real-time.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-950 rounded-lg shadow-md transition-transform hover:scale-105">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mb-4">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Manajemen Terpusat</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Admin dapat mengelola data santri, kantin, dan laporan
                  keuangan dalam satu platform terpusat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Top Santri Leaderboard Section */}
        <section
          id="leaderboard"
          className="w-full py-16 md:py-24 lg:py-32 bg-white dark:bg-gray-950"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Papan Peringkat Santri
                </h2>
                <p className="mt-4 max-w-3xl mx-auto text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                    Apresiasi bagi santri dengan manajemen keuangan terbaik. Mari
                    tingkatkan terus budaya menabung!
                </p>
            </div>
            <div className="mx-auto max-w-3xl">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <LoaderCircle className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center text-center h-40 justify-center">
                  <ServerCrash className="w-10 h-10 text-red-500 mb-2" />
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {topSantri.slice(0, 5).map((santri, index) => (
                    <li
                      key={santri.id}
                      className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm"
                    >
                      {/* --- KODE IKON PIALA --- */}
                      <div className="flex items-center justify-center w-12 h-12 text-xl font-bold mr-4">
                        {index < 3 ? rankIcons[index] : 
                          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600">
                            {index + 1}
                          </span>
                        }
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {santri.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {santri.kelas}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(santri.saldo)}
                        </p>
                        <p className="text-xs text-gray-500">Saldo Saat Ini</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} SakuSantri. All rights reserved.
        </div>
      </footer>
    </div>
  );
}