import React from 'react';
import { cn } from '@/lib/utils';

type CardTone = 'default' | 'muted' | 'accent' | 'danger' | 'success';
type CardPadding = 'sm' | 'md' | 'lg';

const toneClasses: Record<CardTone, string> = {
  default: 'bg-white border-transparent',
  muted: 'bg-surface2 border-transparent',
  accent: 'bg-white border-transparent shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_34px_rgba(255,99,1,0.08)]',
  danger: 'bg-rr-bg/70 border-transparent',
  success: 'bg-gd-bg/60 border-transparent',
};

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
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
