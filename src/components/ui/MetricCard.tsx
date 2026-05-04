import React from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number | null;
  growth?: number | null;
  caption?: string;
  subtext?: string;
  tone?: 'default' | 'accent' | 'success' | 'danger';
  variant?: 'default' | 'accent' | 'gg' | 'rr';
  href?: string;
  className?: string;
}

type MetricCardTone = NonNullable<MetricCardProps['tone']>;

const toneClasses: Record<MetricCardTone, string> = {
  default: 'bg-white border-border-main',
  accent: 'bg-white border-accent/20',
  success: 'bg-white border-gd-border/70',
  danger: 'bg-white border-rr-border/60',
};

const hoverClasses: Record<MetricCardTone, string> = {
  default: 'hover:border-border-alt',
  accent: 'hover:border-accent/30',
  success: 'hover:border-gd-border',
  danger: 'hover:border-rr-border',
};

const iconToneClasses: Record<MetricCardTone, string> = {
  default: 'bg-surface2 text-text2 border border-border-main/70',
  accent: 'bg-accent-light text-accent border border-accent/15',
  success: 'bg-gd-bg text-gd-text border border-gd-border/70',
  danger: 'bg-rr-bg text-rr-text border border-rr-border/70',
};

function mapLegacyVariant(variant: MetricCardProps['variant']): MetricCardTone {
  if (variant === 'accent') return 'accent';
  if (variant === 'gg') return 'success';
  if (variant === 'rr') return 'danger';
  return 'default';
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  growth,
  caption,
  subtext,
  tone,
  variant,
  href,
  className,
}: MetricCardProps) {
  const resolvedTone: MetricCardTone = tone ?? mapLegacyVariant(variant);
  const resolvedTrend = trend ?? growth ?? null;
  const resolvedCaption = caption ?? subtext;
  const isUp = resolvedTrend !== null && resolvedTrend >= 0;

  const content = (
    <div
      className={cn(
        'group flex h-full flex-col justify-between rounded-[var(--radius-lg)] border bg-white p-5 transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="truncate text-[13px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">
            {title}
          </span>
          <ChevronRight className="h-3 w-3 text-text-quaternary group-hover:text-text-secondary transition-colors" />
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div className="text-[2rem] font-semibold tracking-tight text-text-primary tabular-nums">
          {value}
        </div>
        
        {/* Decorative Status Line */}
        <div className="relative h-1 w-full rounded-full bg-panel-subtle overflow-hidden">
          <div 
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
              resolvedTone === 'accent' ? "bg-accent w-2/3" : 
              resolvedTone === 'success' ? "bg-success w-full" :
              resolvedTone === 'danger' ? "bg-danger w-1/3" : "bg-text-quaternary w-1/2"
            )}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          {resolvedCaption ? (
            <div className="text-[11px] font-medium text-text-tertiary truncate">
              {resolvedCaption}
            </div>
          ) : <div />}
          
          {resolvedTrend !== null ? (
            <div
              className={cn(
                'flex items-center gap-0.5 text-[11px] font-bold tabular-nums',
                isUp ? 'text-success' : 'text-danger'
              )}
            >
              {isUp ? '+' : '-'}{Math.abs(resolvedTrend).toFixed(1)}%
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
