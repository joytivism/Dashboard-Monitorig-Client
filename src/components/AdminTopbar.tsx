'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Hexagon, LayoutDashboard, Database, Activity, 
  Users, Settings, LogOut, ChevronRight, ExternalLink 
} from 'lucide-react';

interface AdminTopbarProps {
  onLogout: () => void;
}

const NAV_ITEMS = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Hub' },
  { href: '/admin/data',     icon: Database,        label: 'Input' },
  { href: '/admin/activity', icon: Activity,        label: 'Activity' },
  { href: '/admin/clients',  icon: Users,           label: 'Klien' },
  { href: '/admin/settings', icon: Settings,        label: 'Settings' },
];

export default function AdminTopbar({ onLogout }: AdminTopbarProps) {
  const pathname = usePathname();

  // Determine current page label for breadcrumb
  const currentItem = NAV_ITEMS.find(item => 
    item.href === pathname || (item.href !== '/admin' && pathname.startsWith(item.href))
  );

  return (
    <header 
      className="sticky top-0 w-full h-[60px] z-50 flex items-center justify-between px-6 bg-surface/95 backdrop-blur-md border-b border-border-main transition-all duration-300"
    >
      {/* ── Left: Logo & Breadcrumb ── */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Hexagon className="w-4.5 h-4.5 text-white fill-white" />
          </div>
          <span className="text-sm font-bold text-text tracking-tight hidden md:block">Real Advertise</span>
        </Link>
        
        <div className="h-4 w-px bg-border-main hidden md:block" />
        
        <nav className="flex items-center gap-2 hidden md:flex">
          <span className="type-overline">Admin</span>
          <ChevronRight className="w-3 h-3 text-text4" />
          <span className="font-semibold text-text">{currentItem?.label || 'Command Center'}</span>
        </nav>
      </div>

      {/* ── Center: Inline Nav ── */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-surface2 p-1 rounded-[14px] border border-border-main/50">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === pathname || (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl type-overline transition-all duration-200 ${
                isActive 
                  ? 'bg-accent text-white shadow-sm' 
                  : 'text-text2 hover:text-text hover:bg-white/50'
              }`}
            >
              <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-text4'}`} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Right: External & Logout ── */}
      <div className="flex items-center gap-2">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl type-overline text-text2 hover:bg-surface3 hover:text-text transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Dashboard</span>
        </Link>
        
        <div className="w-px h-4 bg-border-main mx-1" />
        
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl type-overline text-text3 hover:bg-rr-bg hover:text-rr transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
}
