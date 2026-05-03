import React from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  variant: 'client' | 'admin';
  sidebar: React.ReactNode;
  topbar?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

export default function AppShell({
  variant,
  sidebar,
  topbar,
  children,
  contentClassName,
}: AppShellProps) {
  return (
    <div className={cn('ds-shell flex w-full', variant === 'admin' ? 'bg-[#f4f3ef]' : 'bg-bg')}>
      {sidebar}
      <div className="ds-shell-main min-w-0 flex-1">
        {topbar}
        <main className={cn('min-h-screen px-5 py-6 md:px-7 md:py-7 lg:px-8', contentClassName)}>{children}</main>
      </div>
    </div>
  );
}
