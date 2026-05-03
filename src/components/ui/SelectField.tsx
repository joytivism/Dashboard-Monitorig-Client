import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string | null;
  icon?: React.ComponentType<{ className?: string }>;
  options: SelectOption[];
  selectClassName?: string;
}

export default function SelectField({
  label,
  hint,
  error,
  icon: Icon,
  className,
  selectClassName,
  options,
  id,
  ...props
}: SelectFieldProps) {
  const selectId = id || props.name;

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <label htmlFor={selectId} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {Icon ? <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text4" /> : null}
        <select
          id={selectId}
          className={cn(
            'ds-select appearance-none',
            Icon ? 'pl-11' : 'pl-4',
            'pr-11',
            error && 'border-rr-border bg-rr-bg/40 text-rr-text',
            selectClassName
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text4" />
      </div>
      {error ? <p className="text-xs font-medium text-rr-text">{error}</p> : hint ? <p className="text-xs text-text3">{hint}</p> : null}
    </div>
  );
}
