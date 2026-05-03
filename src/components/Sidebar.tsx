'use client';

import React, { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Hexagon, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import NavRail from '@/components/layout/NavRail';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst } from '@/lib/utils';

const STATUS_COLOR: Record<string, string> = {
  rr: '#d14343',
  or: '#d77a0d',
  yy: '#b97316',
  nn: '#7e7a74',
  gg: '#1b8f5a',
  gd: '#2f7fd8',
};

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { CLIENTS, DATA, PERIODS, CH_DEF } = useDashboardData();
  const currentPeriod = searchParams.get('period') || PERIODS[PERIODS.length - 1] || '2026-03';
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const sections = [
    {
      title: 'Workspace',
      items: [
        {
          href: `/${queryString}`,
          label: 'Portfolio Overview',
          icon: LayoutDashboard,
          active: pathname === '/',
        },
        {
          href: '/admin',
          label: 'Admin Hub',
          icon: Settings,
          active: pathname.startsWith('/admin'),
        },
      ],
    },
    {
      title: 'Clients',
      items: CLIENTS.map((client) => {
        const status = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, client.key, currentPeriod);
        return {
          href: `/client/${client.key}${queryString}`,
          label: client.name,
          icon: LayoutDashboard,
          active: pathname === `/client/${client.key}`,
          prefix: (
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface2 text-[10px] font-semibold text-text2">
              {client.key.slice(0, 2).toUpperCase()}
              <span
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white"
                style={{ background: STATUS_COLOR[status] || STATUS_COLOR.nn }}
              />
            </div>
          ),
        };
      }),
    },
  ];

  return (
    <NavRail
      brand={(
        <div className="flex items-center gap-3 rounded-[20px] px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-text text-white">
            <Hexagon className="h-5 w-5 fill-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-[-0.02em] text-text">Real Advertise</div>
            <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-text4">Monitoring Client</div>
          </div>
        </div>
      )}
      sections={sections}
      footer={(
        <div className="space-y-3 p-2">
          <div className="rounded-[20px] border border-border-main bg-surface2 p-3">
            <div className="text-sm font-semibold text-text">Real Advertise</div>
            <div className="mt-1 text-xs text-text3">Unified portfolio and performance workspace.</div>
          </div>
          <form action={logout}>
            <button
              type="submit"
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

export default function Sidebar() {
  return (
    <Suspense fallback={<aside className="fixed left-0 top-0 hidden h-screen w-[var(--sidebar-width)] border-r border-border-main bg-[#efede7] lg:block" />}>
      <SidebarContent />
    </Suspense>
  );
}
