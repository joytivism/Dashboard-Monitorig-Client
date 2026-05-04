import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'tonal';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: React.ComponentType<{ className?: string }>;
  trailingIcon?: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border border-text bg-text text-white shadow-[var(--shadow-card)] hover:border-text2 hover:bg-text2',
  secondary: 'border border-border-main bg-white text-text shadow-[var(--shadow-card)] hover:border-border-alt hover:bg-surface2',
  ghost: 'bg-transparent text-text2 border border-transparent hover:bg-surface2 hover:text-text',
  danger: 'border border-rr bg-rr text-white shadow-[var(--shadow-card)] hover:border-rr-text hover:bg-rr-text',
  tonal: 'border border-accent/15 bg-accent-light text-accent shadow-[var(--shadow-card)] hover:border-accent hover:bg-accent hover:text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-[var(--radius-sm)] px-3.5 text-xs',
  md: 'h-10 rounded-[var(--radius-md)] px-4 text-sm',
  lg: 'h-11 rounded-[var(--radius-md)] px-5 text-sm',
};

export default function Button({
  className,
  variant = 'secondary',
  size = 'md',
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  loading = false,
  fullWidth = false,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex min-w-0 items-center justify-center gap-2 font-semibold transition-colors duration-200 outline-none',
        'focus-visible:border-accent focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : LeadingIcon ? <LeadingIcon className="h-4 w-4" /> : null}
      <span className="min-w-0 truncate">{children}</span>
      {!loading && TrailingIcon ? <TrailingIcon className="h-4 w-4" /> : null}
    </button>
  );
}
