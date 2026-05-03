'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Admin Dashboard Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-rr-bg flex items-center justify-center mb-8 shadow-lg shadow-rr/10">
        <AlertCircle className="w-10 h-10 text-rr" />
      </div>
      
      <h1 className="text-2xl font-bold text-text mb-3 tracking-tight">Sistem Mengalami Kendala</h1>
      <p className="text-text3 max-w-md mb-10 font-medium leading-relaxed">
        Terjadi kesalahan saat memuat data Command Center. Silakan coba segarkan halaman atau kembali ke beranda.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2.5 bg-text hover:bg-accent text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-text/10 hover:shadow-accent/20"
        >
          <RefreshCcw className="w-4 h-4" />
          Coba Lagi
        </button>
        
        <Link
          href="/admin"
          className="flex items-center gap-2.5 bg-surface2 hover:bg-surface3 text-text2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all border border-border-main"
        >
          <Home className="w-4 h-4" />
          Kembali ke Hub
        </Link>
      </div>
      
      {error.digest && (
        <p className="mt-12 text-[10px] font-mono text-text4 opacity-50">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
