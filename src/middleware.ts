import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fungsi middleware utama
export function middleware(request: NextRequest) {
  // 1. Ambil cookie 'accessToken' dan 'userRole' dari request
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // 2. Jika salah satu dari token atau role tidak ada
  if (!accessToken && !userRole) {
    // Redirect ke halaman login
    // new URL() digunakan untuk membuat URL absolut dari path relatif
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  return NextResponse.next();
  // 3. Jika token dan role ada, lanjutkan ke halaman yang diminta
}

// Konfigurasi matcher
export const config = {
  /*
   * Cocokkan semua path KECUALI yang memiliki:
   * - api (rute API)
   * - _next/static (file statis)
   * - _next/image (file optimasi gambar)
   * - favicon.ico (file ikon)
   * Ini memastikan middleware hanya berjalan pada halaman yang relevan.
   *
   * Kita akan memproteksi semua rute di bawah /dashboard.
   */
  matcher: "/dashboard/:path*",
};
