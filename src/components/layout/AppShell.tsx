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
  isSidebarCollapsed: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  toggleSidebarCollapsed: () => void;
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      return window.localStorage.getItem('ra-sidebar-collapsed') === '1';
    } catch {
      return false;
    }
  });
  const openMobileNav = React.useCallback(() => setIsMobileNavOpen(true), []);
  const closeMobileNav = React.useCallback(() => setIsMobileNavOpen(false), []);
  const toggleMobileNav = React.useCallback(() => setIsMobileNavOpen((value) => !value), []);
  const setSidebarCollapsed = React.useCallback((value: boolean) => {
    setIsSidebarCollapsed(value);
    try {
      window.localStorage.setItem('ra-sidebar-collapsed', value ? '1' : '0');
    } catch {
      // localStorage can be unavailable in private or restricted contexts.
    }
  }, []);
  const toggleSidebarCollapsed = React.useCallback(() => {
    setIsSidebarCollapsed((value) => {
      const nextValue = !value;
      try {
        window.localStorage.setItem('ra-sidebar-collapsed', nextValue ? '1' : '0');
      } catch {
        // localStorage can be unavailable in private or restricted contexts.
      }
      return nextValue;
    });
  }, []);

  const contextValue = React.useMemo<AppShellContextValue>(
    () => ({
      variant,
      isMobileNavOpen,
      isSidebarCollapsed,
      openMobileNav,
      closeMobileNav,
      toggleMobileNav,
      setSidebarCollapsed,
      toggleSidebarCollapsed,
    }),
    [
      variant,
      isMobileNavOpen,
      isSidebarCollapsed,
      openMobileNav,
      closeMobileNav,
      toggleMobileNav,
      setSidebarCollapsed,
      toggleSidebarCollapsed,
    ]
  );

  return (
    <AppShellContext.Provider value={contextValue}>
      <div
        className="ds-shell flex w-full"
        data-shell={variant}
        data-sidebar-collapsed={isSidebarCollapsed ? 'true' : 'false'}
      >
        {sidebar}
        <div className="ds-shell-main flex min-h-screen min-w-0 flex-1 flex-col">
          {topbar}
          <main
            className={cn(
              'flex-1 px-4 pb-10 pt-5 md:px-6 md:pb-12 md:pt-6 lg:px-8',
              contentClassName
            )}
          >
            <div className="mx-auto w-full max-w-[var(--content-max)]">{children}</div>
          </main>
        </div>
      </div>
    </AppShellContext.Provider>
  );
}
