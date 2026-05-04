import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title: string;
  breadcrumbs?: string[];
  leading?: React.ReactNode;
  actions?: React.ReactNode;
  statusSlots?: React.ReactNode;
  className?: string;
}

export default function TopBar({
  title,
  breadcrumbs,
  leading,
  actions,
  statusSlots,
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-border-main bg-white/95 supports-[backdrop-filter]:bg-white/82 supports-[backdrop-filter]:backdrop-blur-lg',
        className
      )}
    >
      <div className="flex w-full flex-col gap-3 px-4 py-3 md:px-6 lg:px-8 lg:min-h-[var(--topbar-height)] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {leading ? <div className="shrink-0 pt-0.5 lg:pt-0">{leading}</div> : null}

          <div className="min-w-0 space-y-1">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <div className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-text4 sm:flex">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={`${crumb}-${index}`}>
                    {index > 0 ? <ChevronRight className="h-3 w-3" /> : null}
                    <span>{crumb}</span>
                  </React.Fragment>
                ))}
              </div>
            ) : null}
            <div className="truncate text-[1.05rem] font-semibold text-text md:text-[1.15rem]">
              {title}
            </div>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 md:gap-3 lg:w-auto lg:justify-end">
          {statusSlots ? <div className="hidden items-center gap-2 lg:flex">{statusSlots}</div> : null}
          {actions ? <div className="flex w-full min-w-0 flex-wrap items-center gap-2 md:gap-3 lg:w-auto lg:justify-end">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}
