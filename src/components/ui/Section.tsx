import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';

interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  surface?: boolean;
  bodyClassName?: string;
}

export default function Section({
  eyebrow,
  title,
  description,
  action,
  surface = false,
  children,
  className,
  bodyClassName,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        surface && 'rounded-[var(--radius-lg)] bg-white p-4 shadow-[var(--shadow-card)] sm:p-5',
        className
      )}
      {...props}
    >
      {title || description || eyebrow || action ? (
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={action}
          className={cn(children ? 'mb-4' : undefined)}
        />
      ) : null}

      {children ? <div className={bodyClassName}>{children}</div> : null}
    </section>
  );
}
