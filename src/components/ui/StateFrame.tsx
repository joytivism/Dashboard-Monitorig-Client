import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StateTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
type StateAlign = 'center' | 'left';
type StateSize = 'sm' | 'md' | 'lg';
type StateSurface = 'soft' | 'plain';
type StateBorderStyle = 'solid' | 'dashed';

const toneClasses: Record<
  StateTone,
  {
    surface: string;
    icon: string;
    description: string;
  }
> = {
  neutral: {
    surface: 'border-border-main bg-surface2/40',
    icon: 'border-border-main bg-white text-text3',
    description: 'text-text3',
  },
  accent: {
    surface: 'border-accent/20 bg-accent-light/65',
    icon: 'border-accent/15 bg-white text-accent',
    description: 'text-text2',
  },
  success: {
    surface: 'border-gd-border/80 bg-gd-bg/55',
    icon: 'border-gd-border/70 bg-white text-gd-text',
    description: 'text-text2',
  },
  warning: {
    surface: 'border-or-border/80 bg-or-bg/55',
    icon: 'border-or-border/70 bg-white text-or-text',
    description: 'text-text2',
  },
  danger: {
    surface: 'border-rr-border/80 bg-rr-bg/50',
    icon: 'border-rr-border/70 bg-white text-rr-text',
    description: 'text-rr-text/90',
  },
  info: {
    surface: 'border-gd-border/80 bg-gd-bg/55',
    icon: 'border-gd-border/70 bg-white text-gd-text',
    description: 'text-text2',
  },
};

const sizeClasses: Record<StateSize, string> = {
  sm: 'gap-3.5 px-4 py-4',
  md: 'gap-4 px-4 py-6 sm:px-6 sm:py-8',
  lg: 'gap-5 px-5 py-8 sm:px-8 sm:py-10',
};

const iconSizeClasses: Record<StateSize, string> = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
};

interface StateFrameProps {
  icon?: LucideIcon;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  tone?: StateTone;
  align?: StateAlign;
  size?: StateSize;
  surface?: StateSurface;
  borderStyle?: StateBorderStyle;
  className?: string;
  iconClassName?: string;
}

export default function StateFrame({
  icon: Icon,
  title,
  description,
  action,
  children,
  tone = 'neutral',
  align = 'center',
  size = 'md',
  surface = 'soft',
  borderStyle = 'solid',
  className,
  iconClassName,
}: StateFrameProps) {
  const toneClass = toneClasses[tone];

  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)]',
        sizeClasses[size],
        align === 'center' ? 'flex flex-col items-center text-center' : 'flex flex-col items-start text-left',
        surface === 'soft' && 'border',
        surface === 'soft' && toneClass.surface,
        borderStyle === 'dashed' && 'border-dashed',
        className
      )}
    >
      {Icon ? (
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-[var(--radius-md)] border',
            iconSizeClasses[size],
            toneClass.icon
          )}
        >
          <Icon className={cn(size === 'lg' ? 'h-6 w-6' : 'h-5 w-5', iconClassName)} />
        </div>
      ) : null}

      {(title || description || children || action) ? (
        <div className={cn('w-full space-y-2', align === 'center' ? 'max-w-xl' : '')}>
          {title ? <div className="text-sm font-semibold text-text">{title}</div> : null}
          {description ? <p className={cn('text-sm leading-6', toneClass.description)}>{description}</p> : null}
          {children}
          {action ? (
            <div className={cn('flex flex-wrap gap-3 pt-1', align === 'center' ? 'justify-center' : 'justify-start')}>
              {action}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
