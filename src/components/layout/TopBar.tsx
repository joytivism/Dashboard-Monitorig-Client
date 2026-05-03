import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title: string;
  breadcrumbs?: string[];
  actions?: React.ReactNode;
  statusSlots?: React.ReactNode;
  className?: string;
}

export default function TopBar({
  title,
  breadcrumbs,
  actions,
  statusSlots,
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex min-h-[var(--topbar-height)] items-center border-b border-border-main/70 bg-[rgba(245,245,242,0.82)] px-5 backdrop-blur-xl md:px-7 lg:px-8',
        className
      )}
    >
      <div className="flex w-full items-center justify-between gap-6">
        <div className="min-w-0 space-y-1">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-text4">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={`${crumb}-${index}`}>
                  {index > 0 ? <ChevronRight className="h-3 w-3" /> : null}
                  <span>{crumb}</span>
                </React.Fragment>
              ))}
            </div>
          ) : null}
          <div className="truncate text-[1.15rem] font-semibold tracking-[-0.03em] text-text">{title}</div>
        </div>

        <div className="flex items-center gap-3">
          {statusSlots ? <div className="hidden items-center gap-2 lg:flex">{statusSlots}</div> : null}
          {actions}
        </div>
      </div>
    </header>
  );
}
