import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type SectionHeaderTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

interface SectionHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  tone?: SectionHeaderTone;
  action?: React.ReactNode;
  className?: string;
}

const toneClasses: Record<SectionHeaderTone, string> = {
  neutral: 'border-border-main bg-surface2 text-text2',
  accent: 'border-accent/15 bg-accent-light text-accent',
  success: 'border-gd-border/70 bg-gd-bg text-gd-text',
  warning: 'border-or-border/70 bg-or-bg text-or-text',
  danger: 'border-rr-border/70 bg-rr-bg text-rr-text',
  info: 'border-gd-border/70 bg-gd-bg text-gd-text',
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  tone = 'neutral',
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('ds-section-header flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className="flex min-w-0 items-start gap-3.5">
        {Icon ? (
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border',
              toneClasses[tone]
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
        ) : null}

        <div className="min-w-0 space-y-1.5">
          {eyebrow ? <div className="ds-eyebrow">{eyebrow}</div> : null}
          <div className="space-y-1">
            <h2 className="text-h4">{title}</h2>
            {description ? <p className="max-w-3xl text-sm leading-6 text-text3">{description}</p> : null}
          </div>
        </div>
      </div>

      {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}
