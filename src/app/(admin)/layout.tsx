'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Lock, Hexagon, LayoutDashboard, Database, Activity, Users, LogOut, ChevronRight } from 'lucide-react';

/* ── Breadcrumb path → label map ── */
const PAGE_LABEL: Record<string, string> = {
  '/admin': 'Command Center',
  '/admin/data': 'Input Data Performa',
  '/admin/activity': 'Kelola Activity Log',
  '/admin/clients': 'Manajemen Klien',
};

function AdminTopbar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const NAV = [
    { href: '/admin',          icon: LayoutDashboard, label: 'Hub' },
    { href: '/admin/data',     icon: Database,        label: 'Input Data' },
    { href: '/admin/activity', icon: Activity,        label: 'Activity' },
    { href: '/admin/clients',  icon: Users,           label: 'Klien' },
  ];

  const crumbs = [
    { label: 'Admin', href: '/admin' },
    ...(pathname !== '/admin' ? [{ label: PAGE_LABEL[pathname] || pathname.split('/').pop()!, href: pathname }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b border-border-main"
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
      <div className="flex items-center justify-between h-[60px] px-6 max-w-7xl mx-auto">

        {/* Left: Logo + Breadcrumb */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-sm">
              <Hexagon className="w-4.5 h-4.5 text-white fill-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-text leading-none">Real Advertise</div>
              <div className="text-[9px] font-bold text-text3 uppercase tracking-widest leading-tight mt-0.5">Admin</div>
            </div>
          </Link>

          {/* Divider */}
          <div className="h-5 w-px bg-border-main hidden sm:block" />

          {/* Breadcrumb */}
          <nav className="hidden sm:flex items-center gap-1 text-xs text-text3">
            {crumbs.map((c, i) => (
              <React.Fragment key={c.href}>
                {i > 0 && <ChevronRight className="w-3 h-3 text-text4" />}
                {i < crumbs.length - 1
                  ? <Link href={c.href} className="hover:text-text transition-colors font-medium">{c.label}</Link>
                  : <span className="font-semibold text-text">{c.label}</span>
                }
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center: Nav links */}
        <nav className="flex items-center gap-1">
          {NAV.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text2 hover:bg-surface2 hover:text-text'
                }`}
              >
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Go to dashboard + Logout */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-text2 hover:bg-surface2 hover:text-text transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-text3 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);
  const [shake, setShake] = useState(false);

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
      setShake(true);
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
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div
          className={`relative bg-white rounded-2xl p-8 border border-border-main max-w-sm w-full text-center transition-transform ${shake ? 'animate-[shake_0.3s_ease]' : ''}`}
          style={{ boxShadow: '0 20px 60px -12px rgba(0,0,0,0.1)' }}
        >
          {/* Icon */}
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
              className="w-full h-12 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all duration-200 flex items-center justify-center gap-2"
            >
              Masuk ke Admin
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-xs font-semibold mt-4 animate-fade-in">
              ✗ Password salah. Coba lagi.
            </p>
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

  /* ── Authorized: admin shell WITHOUT global Sidebar/Header ── */
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg">
      <AdminTopbar onLogout={handleLogout} />
      <main className="flex-1 px-6 py-7 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
