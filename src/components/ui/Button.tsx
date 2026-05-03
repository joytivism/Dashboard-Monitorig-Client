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
  primary: 'bg-text text-white border border-text hover:bg-accent hover:border-accent shadow-sm',
  secondary: 'bg-white text-text border border-border-main hover:border-accent/30 hover:text-accent hover:shadow-sm',
  ghost: 'bg-transparent text-text2 border border-transparent hover:bg-surface2 hover:text-text',
  danger: 'bg-rr text-white border border-rr hover:opacity-90',
  tonal: 'bg-accent-light text-accent border border-accent/10 hover:bg-accent hover:text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 rounded-xl text-xs',
  md: 'h-11 px-4.5 rounded-2xl text-sm',
  lg: 'h-12 px-5 rounded-2xl text-sm',
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
        'inline-flex items-center justify-center gap-2.5 font-semibold transition-all duration-200 outline-none',
        'focus-visible:border-accent/30 focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : LeadingIcon ? <LeadingIcon className="h-4 w-4" /> : null}
      <span>{children}</span>
      {!loading && TrailingIcon ? <TrailingIcon className="h-4 w-4" /> : null}
    </button>
  );
}
