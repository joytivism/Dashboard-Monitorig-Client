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
  default: 'from-white to-surface2',
  accent: 'from-white to-accent-light/45',
  success: 'from-white to-gd-bg/65',
  danger: 'from-white to-rr-bg/65',
};

const iconToneClasses: Record<MetricCardTone, string> = {
  default: 'bg-surface3 text-soft',
  accent: 'bg-accent-light text-accent',
  success: 'bg-gd-bg text-gd-text',
  danger: 'bg-rr-bg text-rr-text',
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
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;

  const content = (
    <div
      className={cn(
        'group flex min-h-[128px] h-full flex-col justify-between rounded-[var(--radius-lg)] bg-gradient-to-b p-5 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5',
        toneClasses[resolvedTone],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">
            {title}
          </div>
          <div className="mt-3 text-[clamp(1.55rem,2vw,1.9rem)] font-bold leading-none tracking-[-0.035em] text-text tabular-nums">
            {value}
          </div>
        </div>

        <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-md)]', iconToneClasses[resolvedTone])}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="mt-4 flex min-w-0 items-center gap-2 text-[13px] text-muted">
        {resolvedTrend !== null ? (
          <span
            className={cn(
              'inline-flex h-6 shrink-0 items-center gap-1 rounded-[7px] px-2 text-[12px] font-semibold tabular-nums',
              isUp ? 'bg-gd-bg text-gd-text' : 'bg-or-bg text-or-text'
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {isUp ? '+' : '-'}{Math.abs(resolvedTrend).toFixed(1)}%
          </span>
        ) : null}
        {resolvedCaption ? <span className="min-w-0 truncate">{resolvedCaption}</span> : null}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
