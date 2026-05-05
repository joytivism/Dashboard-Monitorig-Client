'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAppShell } from '@/components/layout/AppShell';
import { cn } from '@/lib/utils';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  active?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface SidebarProps {
  brand: React.ReactNode;
  collapsedBrand?: React.ReactNode;
  sections: NavSection[];
  footer?: React.ReactNode;
  className?: string;
}

export default function Sidebar({
  brand,
  collapsedBrand,
  sections,
  footer,
  className,
}: SidebarProps) {
  const { isSidebarCollapsed, toggleSidebarCollapsed } = useAppShell();
  const CollapseIcon = isSidebarCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 hidden h-screen flex-col bg-sidebar px-3 py-4 transition-[width,padding] duration-200 lg:flex',
        isSidebarCollapsed ? 'w-[var(--sidebar-width-collapsed)] px-2' : 'w-[var(--sidebar-width)]',
        className
      )}
      data-collapsed={isSidebarCollapsed ? 'true' : 'false'}
    >
      <div
        className={cn(
          'mb-7 flex gap-2',
          isSidebarCollapsed ? 'flex-col items-center' : 'items-center justify-between'
        )}
      >
        <div className={cn('min-w-0 overflow-hidden', isSidebarCollapsed ? 'flex justify-center' : 'flex-1')}>
          {isSidebarCollapsed && collapsedBrand ? collapsedBrand : brand}
        </div>

        <button
          type="button"
          onClick={toggleSidebarCollapsed}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-white/65 text-text2 transition-colors hover:bg-white hover:text-text"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <CollapseIcon className="h-4 w-4" />
        </button>
      </div>

      <nav className="no-scrollbar flex-1 space-y-6 overflow-y-auto pb-4" aria-label="Primary navigation">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <div
              className={cn(
                'px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted',
                isSidebarCollapsed && 'sr-only'
              )}
            >
              {section.title}
            </div>

            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block"
                  aria-current={item.active ? 'page' : undefined}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <div
                    className={cn(
                      'ds-nav-item group',
                      isSidebarCollapsed && 'justify-center gap-0 px-0'
                    )}
                    data-active={item.active ? 'true' : 'false'}
                  >
                    {item.prefix ? (
                      <span className="grid shrink-0 place-items-center">{item.prefix}</span>
                    ) : (
                      <item.icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0',
                          item.active ? 'text-text' : 'text-soft group-hover:text-text'
                        )}
                      />
                    )}

                    <span className={cn('min-w-0 flex-1 truncate', isSidebarCollapsed && 'sr-only')}>
                      {item.label}
                    </span>

                    {!isSidebarCollapsed && item.badge ? (
                      <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-text3">
                        {item.badge}
                      </span>
                    ) : null}

                    {!isSidebarCollapsed && item.suffix ? item.suffix : null}
                    {!isSidebarCollapsed && !item.suffix && item.active ? (
                      <ChevronRight className="h-4 w-4 text-text3" />
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {footer ? (
        <div className={cn('mt-auto pt-3', isSidebarCollapsed && 'hidden')}>
          {footer}
        </div>
      ) : null}
    </aside>
  );
}
