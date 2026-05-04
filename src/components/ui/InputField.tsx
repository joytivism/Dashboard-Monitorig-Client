import React from 'react';
import { cn } from '@/lib/utils';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string | null;
  icon?: React.ComponentType<{ className?: string }>;
  inputClassName?: string;
  trailing?: React.ReactNode;
}

export default function InputField({
  label,
  hint,
  error,
  icon: Icon,
  className,
  inputClassName,
  trailing,
  id,
  ...props
}: InputFieldProps) {
  const inputId = id || props.name;

  return (
    <div className={cn('min-w-0 space-y-2', className)}>
      {label ? (
        <label htmlFor={inputId} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">
          {label}
        </label>
      ) : null}
      <div className="relative min-w-0">
        {Icon ? <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text4" /> : null}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          className={cn(
            'ds-input',
            Icon ? 'pl-11' : 'pl-3.5',
            trailing ? 'pr-12' : 'pr-3.5',
            error && 'border-rr-border bg-rr-bg/60 text-rr-text placeholder:text-rr-text/60',
            inputClassName
          )}
          {...props}
        />
        {trailing ? <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{trailing}</div> : null}
      </div>
      {error ? <p className="text-xs font-medium text-rr-text">{error}</p> : hint ? <p className="text-xs text-text3">{hint}</p> : null}
    </div>
  );
}
