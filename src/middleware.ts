import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // if (!accessToken || !userRole) {
  //   // Arahkan kembali ke halaman login jika tidak ada token/role
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // }

  // // Logika tambahan: pastikan role sesuai dengan path
  // const { pathname } = request.nextUrl;
  // if (userRole === 'admin' && !pathname.startsWith('/dashboard/admin')) {
  //     return NextResponse.redirect(new URL('/dashboard/admin', request.url));
  // }
  // if (userRole === 'wali santri' && !pathname.startsWith('/dashboard/walsan')) {
  //     return NextResponse.redirect(new URL('/dashboard/walsan', request.url));
  // }

  return NextResponse.next();
}

// Konfigurasi ini sudah benar
export const config = {
  matcher: "/dashboard/:path*",
};
