'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Database,
  ExternalLink,
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
    <Link href="/admin" className="flex items-center gap-3 rounded-[var(--radius-md)] px-1 py-1">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-text text-[13px] font-bold tracking-[-0.04em] text-white">
        RA
      </div>
      <div className="min-w-0">
        <div className="truncate text-[15px] font-bold tracking-[-0.02em] text-text">Real Advertise</div>
        <div className="mt-0.5 text-[11px] font-medium text-soft">Admin Console</div>
      </div>
    </Link>
  );

  const collapsedBrand = (
    <Link href="/admin" className="grid h-10 w-10 place-items-center rounded-[12px] bg-text text-[13px] font-bold tracking-[-0.04em] text-white">
      RA
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
      <NavRail brand={brand} collapsedBrand={collapsedBrand} sections={sections} footer={footer} />
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
