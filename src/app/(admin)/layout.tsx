'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Shield } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

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
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (checking) return null;

  if (!authorized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-6 z-[9999] bg-bg">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-border-main max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-surface2 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-text2" />
          </div>
          <h1 className="text-xl font-bold text-text mb-1">Admin Access</h1>
          <p className="text-sm text-text3 mb-8">Masukkan password untuk lanjut.</p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full h-12 px-4 rounded-xl border text-center text-sm font-semibold focus:outline-none transition-all ${
                error ? 'border-red-300 bg-red-50 text-red-600' : 'border-border-main bg-surface2 text-text focus:border-accent'
              }`}
              autoFocus
            />
            <button type="submit" className="w-full h-12 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all">
              Masuk
            </button>
          </form>
          {error && <p className="text-red-500 text-xs font-semibold mt-3">Password salah.</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen bg-bg">
        <Header />
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </>
  );
}
