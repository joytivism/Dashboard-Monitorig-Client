'use client';

import React, { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import MobileNavDrawer from '@/components/layout/MobileNavDrawer';
import NavRail from '@/components/layout/NavRail';
import { useAppShell } from '@/components/layout/AppShell';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst } from '@/lib/utils';

const STATUS_COLOR: Record<string, string> = {
  rr: '#e50000',
  or: '#ff6301',
  yy: '#ff6301',
  nn: '#7c7c76',
  gg: '#00a1a6',
  gd: '#00a1a6',
};

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isMobileNavOpen, closeMobileNav } = useAppShell();
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

  const brand = (
    <div className="flex items-center gap-3 rounded-[var(--radius-md)] px-1 py-1">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-text text-[13px] font-bold tracking-[-0.04em] text-white">
        RA
      </div>
      <div className="min-w-0">
        <div className="truncate text-[15px] font-bold tracking-[-0.02em] text-text">Real Advertise</div>
        <div className="mt-0.5 truncate text-[11px] font-medium text-soft">Command Center</div>
      </div>
    </div>
  );

  const collapsedBrand = (
    <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-text text-[13px] font-bold tracking-[-0.04em] text-white">
      RA
    </div>
  );

  const footer = (
    <div className="space-y-2 p-1">
      <div className="rounded-[16px] bg-white/58 p-3 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]">
        <div className="text-[13px] font-semibold text-text">Real Advertise</div>
        <div className="mt-0.5 text-[11px] text-text3 leading-normal">Unified portfolio and performance workspace.</div>
      </div>
      <form action={logout}>
        <button
          type="submit"
          onClick={closeMobileNav}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-text3 transition-colors hover:bg-danger-soft hover:text-danger"
        >
          <LogOut className="h-3.5 w-3.5" />
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

export default function Sidebar() {
  return (
    <Suspense fallback={<aside className="fixed left-0 top-0 hidden h-screen w-[var(--sidebar-width)] border-r border-border-main bg-surface2 lg:block" />}>
      <SidebarContent />
    </Suspense>
  );
}
