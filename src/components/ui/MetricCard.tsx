import React from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
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

const toneClasses = {
  default: 'bg-white border-border-main',
  accent: 'bg-white border-accent/15',
  success: 'bg-white border-gg-border/60',
  danger: 'bg-white border-rr-border/60',
};

const iconToneClasses = {
  default: 'bg-surface2 text-text2 border border-border-main/70',
  accent: 'bg-accent text-white border border-accent shadow-[0_12px_24px_rgba(255,106,26,0.18)]',
  success: 'bg-gg-bg text-gg-text border border-gg-border/70',
  danger: 'bg-rr-bg text-rr-text border border-rr-border/70',
};

function mapLegacyVariant(variant: MetricCardProps['variant']): MetricCardProps['tone'] {
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
  const resolvedTone = tone || mapLegacyVariant(variant);
  const resolvedTrend = trend ?? growth ?? null;
  const resolvedCaption = caption ?? subtext;
  const isUp = resolvedTrend !== null && resolvedTrend >= 0;

  const content = (
    <div
      className={cn(
        'group flex h-full flex-col justify-between rounded-[var(--radius-lg)] border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-popover)]',
        toneClasses[resolvedTone],
        className
      )}
    >
      <div className="mb-8 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="ds-eyebrow">{title}</div>
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-105', iconToneClasses[resolvedTone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="ds-kpi">{value}</div>
          {resolvedTrend !== null ? (
            <div
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                isUp ? 'bg-gg-bg text-gg-text' : 'bg-rr-bg text-rr-text'
              )}
            >
              {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              <span className="tabular-nums">{Math.abs(resolvedTrend).toFixed(1)}%</span>
            </div>
          ) : null}
        </div>

        {resolvedCaption ? <div className="text-label">{resolvedCaption}</div> : null}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
