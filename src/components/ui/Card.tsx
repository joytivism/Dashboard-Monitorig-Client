import React from 'react';
import { cn } from '@/lib/utils';

type CardTone = 'default' | 'muted' | 'accent' | 'danger' | 'success';
type CardPadding = 'sm' | 'md' | 'lg';

const toneClasses: Record<CardTone, string> = {
  default: 'bg-white border-border-main',
  muted: 'bg-surface2 border-border-main',
  accent: 'bg-white border-accent/15',
  danger: 'bg-rr-bg/55 border-rr-border/70',
  success: 'bg-gg-bg/55 border-gg-border/70',
};

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  padding?: CardPadding;
}

export default function Card({
  className,
  tone = 'default',
  padding = 'md',
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border shadow-[var(--shadow-card)]',
        toneClasses[tone],
        paddingClasses[padding],
        className
      )}
      {...props}
    />
  );
}
