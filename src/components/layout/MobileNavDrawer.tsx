'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavSection } from '@/components/layout/NavRail';

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  brand: React.ReactNode;
  sections: NavSection[];
  footer?: React.ReactNode;
}

export default function MobileNavDrawer({
  open,
  onClose,
  brand,
  sections,
  footer,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const previousPathname = React.useRef(pathname);

  React.useEffect(() => {
    if (!open) {
      previousPathname.current = pathname;
      return;
    }

    if (previousPathname.current !== pathname) {
      onClose();
    }

    previousPathname.current = pathname;
  }, [pathname, open, onClose]);

  React.useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu navigasi">
      <button
        type="button"
        className="absolute inset-0 bg-black/28"
        onClick={onClose}
        aria-label="Tutup menu navigasi"
      />

      <aside className="absolute inset-y-0 left-0 flex w-[min(88vw,22rem)] flex-col border-r border-border-main bg-white shadow-[var(--shadow-popover)]">
        <div className="flex items-start justify-between gap-3 border-b border-border-main px-4 py-4">
          <div className="min-w-0 flex-1">{brand}</div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon h-10 w-10 shrink-0"
            aria-label="Tutup menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-text4">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link key={item.href} href={item.href} className="block" onClick={onClose}>
                    <div className="ds-nav-item min-h-11" data-active={item.active ? 'true' : 'false'}>
                      {item.prefix ? (
                        item.prefix
                      ) : (
                        <item.icon className={cn('h-4 w-4 shrink-0', item.active ? 'text-accent' : 'text-text4')} />
                      )}
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

        {footer ? <div className="border-t border-border-main bg-surface2/55 p-3">{footer}</div> : null}
      </aside>
    </div>
  );
}
