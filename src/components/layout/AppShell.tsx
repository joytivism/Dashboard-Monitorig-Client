'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  variant: 'client' | 'admin';
  sidebar: React.ReactNode;
  topbar?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

interface AppShellContextValue {
  variant: AppShellProps['variant'];
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
}

const AppShellContext = React.createContext<AppShellContextValue | null>(null);

export function useAppShell() {
  const context = React.useContext(AppShellContext);

  if (!context) {
    throw new Error('useAppShell must be used inside AppShell.');
  }

  return context;
}

export default function AppShell({
  variant,
  sidebar,
  topbar,
  children,
  contentClassName,
}: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const openMobileNav = React.useCallback(() => setIsMobileNavOpen(true), []);
  const closeMobileNav = React.useCallback(() => setIsMobileNavOpen(false), []);
  const toggleMobileNav = React.useCallback(() => setIsMobileNavOpen((value) => !value), []);

  const contextValue = React.useMemo<AppShellContextValue>(
    () => ({
      variant,
      isMobileNavOpen,
      openMobileNav,
      closeMobileNav,
      toggleMobileNav,
    }),
    [variant, isMobileNavOpen, openMobileNav, closeMobileNav, toggleMobileNav]
  );

  return (
    <AppShellContext.Provider value={contextValue}>
      <div className="ds-shell flex w-full" data-shell={variant}>
        {sidebar}
        <div className="ds-shell-main flex min-h-screen min-w-0 flex-1 flex-col">
          {topbar}
          <main
            className={cn(
              'flex-1 px-4 pb-10 pt-5 md:px-6 md:pb-12 md:pt-6 lg:px-8',
              contentClassName
            )}
          >
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>
    </AppShellContext.Provider>
  );
}
