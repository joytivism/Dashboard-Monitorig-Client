'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from "@/components/AdminSidebar";
import { Lock } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('ra_admin_auth') === 'true';
    if (isAuth) setAuthorized(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple check, in production use better auth
    if (password === 'admin123') {
      localStorage.setItem('ra_admin_auth', 'true');
      setAuthorized(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!authorized) {
    return (
      <div className="fixed inset-0 bg-bg flex items-center justify-center p-6 z-[9999]">
        <div className="bg-white rounded-[32px] p-10 shadow-xl max-w-md w-full border border-border-main text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">Admin Access</h1>
          <p className="text-text3 text-sm mb-8">Silakan masukkan password untuk mengakses dashboard manajemen.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className={`w-full h-12 px-4 rounded-xl border ${error ? 'border-rr bg-rr-bg/30' : 'border-border-main'} bg-surface2 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all`}
              autoFocus
            />
            <button 
              type="submit"
              className="w-full h-12 bg-text text-white rounded-xl font-bold hover:bg-text/90 transition-all shadow-lg shadow-black/10"
            >
              Unlock Dashboard
            </button>
          </form>
          {error && <p className="text-rr text-xs font-bold mt-4 animate-bounce">Password salah!</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminSidebar />
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <header className="h-16 border-b border-border-main bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-8 justify-between">
          <div className="text-sm font-bold text-text2 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            Admin Control Center
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('ra_admin_auth');
              setAuthorized(false);
            }}
            className="text-xs font-bold text-text3 hover:text-rr transition-colors"
          >
            Logout Session
          </button>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </>
  );
}
