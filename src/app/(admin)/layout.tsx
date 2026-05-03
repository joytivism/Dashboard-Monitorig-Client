'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import AppShell from '@/components/layout/AppShell';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import InputField from '@/components/ui/InputField';

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState(false);
  const [checking, setChecking]     = useState(true);
  const [shake, setShake]           = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const isAuth = localStorage.getItem('ra_admin_auth') === 'true';
      if (isAuth) setAuthorized(true);
      setChecking(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('ra_admin_auth', 'true');
      setAuthorized(true);
    } else {
      setError(true); setShake(true);
      setTimeout(() => { setError(false); setShake(false); }, 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ra_admin_auth');
    setAuthorized(false);
    setPassword('');
  };

  if (checking) return null;

  /* ── Login gate ── */
  if (!authorized) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg p-6">
        <Card
          className={`w-full max-w-md border-white/70 bg-white/90 p-8 text-center backdrop-blur ${shake ? 'animate-[shake_0.3s_ease]' : ''}`}
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[24px] bg-accent-light text-accent">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-h3 mb-1">Admin Access</h1>
          <p className="mb-7 text-body">Masukkan password internal untuk melanjutkan ke admin console.</p>
          <form onSubmit={handleLogin} className="space-y-3">
            <InputField
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoFocus
              icon={Lock}
              error={error ? 'Password salah. Coba lagi.' : null}
              inputClassName="text-center tracking-[0.18em]"
            />
            <Button type="submit" variant="primary" size="lg" fullWidth>
              Masuk ke Admin
            </Button>
          </form>

          <div className="mt-6 border-t border-border-main pt-5">
            <Link href="/" className="text-xs font-medium text-text3 transition-colors hover:text-text">
              ← Kembali ke Dashboard
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <AppShell
      variant="admin"
      sidebar={<AdminSidebar onLogout={handleLogout} />}
      topbar={<AdminHeader />}
      contentClassName="pb-20"
    >
      {children}
    </AppShell>
  );
}
