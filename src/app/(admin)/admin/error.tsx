'use client';

import React, { useEffect } from 'react';
import { RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';

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
    <div className="flex min-h-[60vh] items-center justify-center px-6 animate-fade-in">
      <div className="w-full max-w-2xl space-y-6">
        <ErrorState
          title="Sistem mengalami kendala"
          description="Terjadi kesalahan saat memuat data Command Center. Silakan coba segarkan halaman atau kembali ke hub admin."
          action={(
            <>
              <Button variant="primary" size="lg" leadingIcon={RefreshCcw} onClick={() => reset()}>
                Coba lagi
              </Button>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-border-main bg-white px-5 py-3 text-sm font-semibold text-text shadow-[var(--shadow-card)] transition-colors hover:border-border-alt hover:bg-surface2"
              >
                <Home className="h-4 w-4" />
                Kembali ke hub
              </Link>
            </>
          )}
          className="py-10"
        />

        {error.digest ? (
          <p className="text-center text-[10px] font-mono text-text4 opacity-60">
            Error ID: {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  );
}
