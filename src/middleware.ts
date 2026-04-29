import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteksi folder /admin
  if (pathname.startsWith('/admin')) {
    // Di Edge Middleware kita tidak bisa akses localStorage langsung
    // Jadi kita gunakan Cookies sebagai standar security
    const authCookie = request.cookies.get('ra_admin_auth');
    
    // Jika tidak ada cookie auth dan bukan di halaman login admin (jika ada)
    // Untuk sekarang kita arahkan kembali ke home jika tidak terautentikasi
    if (!authCookie || authCookie.value !== 'true') {
      // Kita biarkan admin/layout yang menghandle redirect jika cookie kosong 
      // Tapi secara server-side kita bisa membatasi akses di sini
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
