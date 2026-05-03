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
  Palette,
  Settings2,
  Users,
  Zap,
} from 'lucide-react';
import { logout } from '@/app/actions/auth';
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
  { href: '/admin/design-system', icon: Palette, label: 'Design System' },
];

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <NavRail
      brand={(
        <Link href="/admin" className="flex items-center gap-3 rounded-[20px] px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-text text-white">
            <Hexagon className="h-5 w-5 fill-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-[-0.02em] text-text">Real Advertise</div>
            <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-text4">Admin Console</div>
          </div>
        </Link>
      )}
      sections={[
        {
          title: 'Operations',
          items: NAV_ITEMS.map((item) => ({
            ...item,
            active: item.href === pathname || (item.href !== '/admin' && pathname.startsWith(item.href)),
          })),
        },
      ]}
      footer={(
        <div className="space-y-3 p-2">
          <div className="rounded-[20px] border border-border-main bg-surface2 p-3">
            <div className="text-sm font-semibold text-text">Admin User</div>
            <div className="mt-1 text-xs text-text3">System owner workspace for portfolio operations.</div>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border-main bg-white px-3 py-2 text-xs font-medium text-text2 transition-all hover:border-accent/30 hover:text-accent"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open dashboard
            </Link>
          </div>
          <form action={logout}>
            <button
              type="submit"
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium text-rr-text transition-colors hover:bg-rr-bg"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    />
  );
}
