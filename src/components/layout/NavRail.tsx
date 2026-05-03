import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  active?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

interface NavSection {
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
      className="fixed left-0 top-0 hidden h-screen w-[var(--sidebar-width)] flex-col border-r border-border-main bg-[#efede7] px-4 pb-4 pt-4 lg:flex"
      style={{ boxShadow: 'inset -1px 0 0 rgba(17,17,16,0.02)' }}
    >
      <div className="mb-4 rounded-[24px] border border-white/70 bg-white/70 p-2 shadow-sm">{brand}</div>

      <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto pb-4">
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
                      <span className="rounded-full bg-surface2 px-2 py-0.5 text-[10px] font-medium text-text3">
                        {item.badge}
                      </span>
                    ) : null}
                    {item.suffix ? item.suffix : item.active ? <ChevronRight className="h-4 w-4 text-text4" /> : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {footer ? <div className="mt-auto rounded-[24px] border border-white/70 bg-white/72 p-2 shadow-sm">{footer}</div> : null}
    </aside>
  );
}
