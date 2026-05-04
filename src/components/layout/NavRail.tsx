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
      className="fixed left-0 top-0 hidden h-screen w-[var(--sidebar-width)] flex-col border-r border-border-main bg-surface2 px-2 pb-4 pt-4 lg:flex"
    >
      <div className="mb-6 px-3">{brand}</div>

      <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto pb-4">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-text3 uppercase opacity-70">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <Link key={item.href} href={item.href} className="block group">
                  <div 
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                      item.active 
                        ? "bg-border text-text shadow-sm" 
                        : "text-text2 hover:bg-border/50 hover:text-text"
                    )}
                  >
                    {item.prefix ? item.prefix : <item.icon className={cn('h-4 w-4 shrink-0', item.active ? 'text-text' : 'text-text3 group-hover:text-text')} />}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-md bg-surface3 px-1.5 py-0.5 text-[10px] font-bold text-text3">
                        {item.badge}
                      </span>
                    ) : null}
                    {item.suffix ? item.suffix : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {footer ? <div className="mt-auto px-1">{footer}</div> : null}
    </aside>
  );
}
