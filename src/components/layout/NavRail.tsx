import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
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

interface NavRailProps {
  brand: React.ReactNode;
  sections: NavSection[];
  footer?: React.ReactNode;
}

export default function NavRail({ brand, sections, footer }: NavRailProps) {
  return (
    <aside
      className="fixed left-0 top-0 hidden h-screen w-[var(--sidebar-width)] flex-col border-r border-border-main bg-surface2 px-3 pb-3 pt-3 lg:flex"
    >
      <div className="mb-4 rounded-[18px] border border-border-main bg-white px-2 py-2">{brand}</div>

      <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto pb-4">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <div className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-text4">{section.title}</div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link key={item.href} href={item.href} className="block">
                  <div className="ds-nav-item" data-active={item.active ? 'true' : 'false'}>
                    {item.prefix ? item.prefix : <item.icon className={cn('h-4 w-4 shrink-0', item.active ? 'text-accent' : 'text-text4')} />}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full bg-surface2 px-1.5 py-0.5 text-[10px] font-medium text-text3">
                        {item.badge}
                      </span>
                    ) : null}
                    {item.suffix ? item.suffix : item.active ? <ChevronRight className="h-4 w-4 text-accent" /> : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {footer ? <div className="mt-auto rounded-[18px] border border-border-main bg-white p-2">{footer}</div> : null}
    </aside>
  );
}
