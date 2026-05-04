'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Database,
  ExternalLink,
  Hexagon,
  LayoutDashboard,
  LogOut,
  Settings2,
  Users,
  Zap,
} from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { useAppShell } from '@/components/layout/AppShell';
import MobileNavDrawer from '@/components/layout/MobileNavDrawer';
import NavRail from '@/components/layout/NavRail';

interface AdminSidebarProps {
  onLogout?: () => void;
}

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Admin Hub' },
  { href: '/admin/data', icon: Database, label: 'Input Data' },
  { href: '/admin/activity', icon: Activity, label: 'Activity Log' },
  { href: '/admin/ai', icon: Zap, label: 'AI Monitoring' },
  { href: '/admin/clients', icon: Users, label: 'Client Management' },
  { href: '/admin/settings', icon: Settings2, label: 'Settings' },
];

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isMobileNavOpen, closeMobileNav } = useAppShell();

  const brand = (
    <Link href="/admin" className="flex items-center gap-3 rounded-[14px] px-3 py-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-text text-white">
        <Hexagon className="h-5 w-5 fill-white" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-text">Real Advertise</div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-text4">Admin Console</div>
      </div>
    </Link>
  );

  const sections = [
    {
      title: 'Operations',
      items: NAV_ITEMS.map((item) => ({
        ...item,
        active: item.href === pathname || (item.href !== '/admin' && pathname.startsWith(item.href)),
      })),
    },
  ];

  const footer = (
    <div className="space-y-3 p-2">
      <div className="rounded-[14px] border border-border-main bg-surface2 p-3">
        <div className="text-sm font-semibold text-text">Admin User</div>
        <div className="mt-1 text-xs text-text3">System owner workspace for portfolio operations.</div>
        <Link
          href="/"
          onClick={closeMobileNav}
          className="mt-3 inline-flex items-center gap-2 rounded-[12px] border border-border-main bg-white px-3 py-2 text-xs font-medium text-text2 transition-colors hover:border-border-alt hover:bg-surface2"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open dashboard
        </Link>
      </div>
      <form action={logout}>
        <button
          type="submit"
          onClick={() => {
            closeMobileNav();
            onLogout?.();
          }}
          className="flex w-full items-center gap-2 rounded-[14px] px-3 py-2.5 text-sm font-medium text-rr-text transition-colors hover:bg-rr-bg"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </form>
    </div>
  );

  return (
    <>
      <NavRail brand={brand} sections={sections} footer={footer} />
      <MobileNavDrawer
        open={isMobileNavOpen}
        onClose={closeMobileNav}
        brand={brand}
        sections={sections}
        footer={footer}
      />
    </>
  );
}
