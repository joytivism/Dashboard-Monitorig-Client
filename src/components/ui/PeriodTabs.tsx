'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface PeriodTabItem {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

interface PeriodTabsProps {
  value: string;
  periods?: string[];
  tabs?: PeriodTabItem[];
  getLabel?: (period: string) => React.ReactNode;
  onChange: (value: string) => void;
  className?: string;
  tabClassName?: string;
  ariaLabel?: string;
}

export default function PeriodTabs({
  value,
  periods,
  tabs,
  getLabel,
  onChange,
  className,
  tabClassName,
  ariaLabel = 'Period selection',
}: PeriodTabsProps) {
  const items: PeriodTabItem[] = tabs ?? (periods?.map((period) => ({
    value: period,
    label: getLabel ? getLabel(period) : period,
  })) ?? []);

  return (
    <div
      className={cn('no-scrollbar flex items-center gap-2 overflow-x-auto py-0.5', className)}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={item.disabled}
            onClick={() => onChange(item.value)}
            className={cn(
              'inline-flex h-10 shrink-0 items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              active
                ? 'bg-text text-white'
                : 'bg-white text-soft shadow-[var(--shadow-sm)] hover:bg-surface2 hover:text-text',
              tabClassName
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
