import type { Metadata } from "next";
// 1. Impor Poppins dari next/font/google
import { Poppins } from "next/font/google";
import "./globals.css";

// 2. Konfigurasi font Poppins
// Tentukan weight (ketebalan) dan subset yang Anda butuhkan.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Regular, Medium, SemiBold, Bold
  variable: "--font-poppins", // Menetapkan sebagai CSS variable
});

export const metadata: Metadata = {
  title: "Dashboard SakuSantri",
  description: "Aplikasi manajemen keuangan untuk pondok pesantren",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Terapkan font ke tag <body>
        Kita menggunakan `poppins.variable` untuk membuat CSS variable
        dan `font-sans` agar menjadi font default yang digunakan oleh Tailwind.
      */}
      <body className={`${poppins.variable} font-sans`}>{children}</body>
    </html>
  );
}
