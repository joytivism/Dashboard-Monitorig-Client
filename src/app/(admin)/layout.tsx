'use client';

import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AdminGroupLayout({
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
      <div className="fixed inset-0 flex items-center justify-center p-6 z-[9999]" style={{ background: '#E8EFF6' }}>
        <div className="bg-white rounded-[32px] p-10 shadow-xl shadow-black/5 max-w-md w-full border border-black/[0.04] text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Admin Access</h1>
          <p className="text-gray-400 text-sm font-medium mb-8">Enter your password to access the command center.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className={`w-full h-12 px-4 rounded-2xl border ${error ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'} text-center text-lg font-bold focus:outline-none focus:border-emerald-300 transition-all`}
              autoFocus
            />
            <button 
              type="submit"
              className="w-full h-12 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
            >
              Unlock Dashboard
            </button>
          </form>
          {error && <p className="text-red-500 text-xs font-bold mt-4 animate-bounce">Password salah!</p>}
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
