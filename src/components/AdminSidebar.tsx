'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Database, 
  Settings, 
  Users, 
  Home, 
  Activity, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

function AdminSidebarContent() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard Admin', href: '/admin', icon: Activity },
    { name: 'Manajemen Klien', href: '/admin/clients', icon: Users },
    { name: 'API Configuration', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white flex flex-col p-4 z-40 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.04)]">
      {/* Logo Admin */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-8 h-8 rounded-lg bg-text flex items-center justify-center text-white shrink-0">
          <ShieldCheck className="w-5 h-5 fill-current" />
        </div>
        <div>
          <span className="text-base font-bold text-text leading-tight block">RA Admin</span>
          <span className="text-[10px] font-medium text-text3 block tracking-wide uppercase">System Management</span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <div className="text-xs font-bold text-text3 mb-3 px-3 uppercase tracking-wider">Main Menu</div>
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-text text-white shadow-md shadow-black/10' 
                      : 'text-text2 hover:bg-surface2 hover:text-text'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-border-main">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-text3 hover:bg-surface2 hover:text-text transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Client View
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default function AdminSidebar() {
  return (
    <Suspense fallback={<div className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-border-main" />}>
      <AdminSidebarContent />
    </Suspense>
  );
}
