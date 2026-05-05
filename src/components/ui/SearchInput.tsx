import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  shortcut?: React.ReactNode;
  containerClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { className, containerClassName, shortcut, placeholder = 'Search...', ...props },
  ref
) {
  return (
    <label className={cn('relative block min-w-0', containerClassName)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        ref={ref}
        type="search"
        placeholder={placeholder}
        className={cn(
          'h-10 w-full rounded-full bg-white py-0 pl-10 pr-4 text-sm font-medium text-text shadow-[inset_0_0_0_1px_rgba(0,0,0,0.055)] outline-none transition-shadow placeholder:text-muted focus:shadow-[var(--focus-ring)]',
          shortcut ? 'pr-16' : undefined,
          className
        )}
        {...props}
      />
      {shortcut ? (
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[8px] bg-surface3 px-2 py-1 text-[11px] font-medium text-muted">
          {shortcut}
        </span>
      ) : null}
    </label>
  );
});

export default SearchInput;
