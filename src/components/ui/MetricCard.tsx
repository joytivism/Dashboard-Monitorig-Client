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
        'group flex h-full flex-col justify-between rounded-[var(--radius-lg)] border p-5 transition-colors duration-200',
        toneClasses[resolvedTone],
        hoverClasses[resolvedTone],
        className
      )}
    >
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="ds-eyebrow">{title}</div>
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]', iconToneClasses[resolvedTone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="ds-kpi">{value}</div>
          {resolvedTrend !== null ? (
            <div
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                isUp ? 'border-gd-border/70 bg-gd-bg text-gd-text' : 'border-rr-border/70 bg-rr-bg text-rr-text'
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
