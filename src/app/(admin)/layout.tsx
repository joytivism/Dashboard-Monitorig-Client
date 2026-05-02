'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock } from 'lucide-react';
import AdminTopbar from '@/components/AdminTopbar';

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState(false);
  const [checking, setChecking]     = useState(true);
  const [shake, setShake]           = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('ra_admin_auth') === 'true';
    if (isAuth) setAuthorized(true);
    setChecking(false);
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
      <div className="fixed inset-0 flex items-center justify-center p-6 z-[9999] bg-bg">
        {/* Blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

        <div
          className={`relative bg-white rounded-2xl p-8 border border-border-main max-w-sm w-full text-center ${shake ? 'animate-[shake_0.3s_ease]' : ''}`}
          style={{ boxShadow: '0 20px 60px -12px rgba(0,0,0,0.1)' }}
        >
          <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-text mb-1">Admin Access</h1>
          <p className="text-sm text-text3 mb-7">Masukkan password untuk melanjutkan.</p>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? 'text-red-400' : 'text-text4'}`} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className={`w-full h-12 pl-11 pr-4 rounded-xl border text-sm font-semibold focus:outline-none transition-all text-center tracking-widest ${
                  error
                    ? 'border-red-300 bg-red-50 text-red-600 placeholder:text-red-300'
                    : 'border-border-main bg-surface2 text-text focus:border-accent focus:ring-2 focus:ring-accent/10'
                }`}
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all duration-200"
            >
              Masuk ke Admin
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-xs font-semibold mt-4 animate-fade-in">✗ Password salah. Coba lagi.</p>
          )}

          <div className="mt-6 pt-5 border-t border-border-main">
            <Link href="/" className="text-xs text-text3 hover:text-text transition-colors font-medium">
              ← Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Authorized Admin Shell: Topbar + Max-width Content ── */
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg">
      <AdminTopbar onLogout={handleLogout} />
      <main className="flex-1 px-6 py-7 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
