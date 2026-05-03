import React from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
type BadgeStyle = 'solid' | 'soft' | 'outline';

const toneClasses: Record<BadgeTone, Record<BadgeStyle, string>> = {
  neutral: {
    solid: 'bg-text text-white border border-text',
    soft: 'bg-surface2 text-text2 border border-border-main/70',
    outline: 'bg-transparent text-text2 border border-border-main',
  },
  accent: {
    solid: 'bg-accent text-white border border-accent',
    soft: 'bg-accent-light text-accent border border-accent/10',
    outline: 'bg-transparent text-accent border border-accent/30',
  },
  success: {
    solid: 'bg-gg text-white border border-gg',
    soft: 'bg-gg-bg text-gg-text border border-gg-border/70',
    outline: 'bg-transparent text-gg-text border border-gg-border',
  },
  warning: {
    solid: 'bg-yy text-white border border-yy',
    soft: 'bg-yy-bg text-yy-text border border-yy-border/70',
    outline: 'bg-transparent text-yy-text border border-yy-border',
  },
  danger: {
    solid: 'bg-rr text-white border border-rr',
    soft: 'bg-rr-bg text-rr-text border border-rr-border/70',
    outline: 'bg-transparent text-rr-text border border-rr-border',
  },
  info: {
    solid: 'bg-gd text-white border border-gd',
    soft: 'bg-gd-bg text-gd-text border border-gd-border/70',
    outline: 'bg-transparent text-gd-text border border-gd-border',
  },
};

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  tone?: BadgeTone;
  style?: BadgeStyle;
}

export default function Badge({
  className,
  tone = 'neutral',
  style = 'soft',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap',
        toneClasses[tone][style],
        className
      )}
      {...props}
    />
  );
}
