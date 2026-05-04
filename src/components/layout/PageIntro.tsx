import React from 'react';
import { cn } from '@/lib/utils';

interface PageIntroProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
  isCard?: boolean;
}

export default function PageIntro({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className,
  isCard = false,
}: PageIntroProps) {
  return (
    <section 
      className={cn(
        'relative overflow-hidden',
        isCard ? 'ds-card p-6 sm:p-8 md:p-10' : 'pb-6',
        className
      )}
    >
      {isCard && (
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 opacity-[0.08] pointer-events-none">
          <div className="h-full w-full rounded-full bg-gradient-to-br from-accent via-success to-danger blur-3xl animate-pulse-soft" />
        </div>
      )}

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-3xl space-y-4">
          {eyebrow ? (
            <div className="inline-flex rounded-md bg-panel-subtle px-2 py-1 text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
              {eyebrow}
            </div>
          ) : null}
          <div className="space-y-3">
            <h1 className={cn("tracking-tight font-bold", isCard ? "text-[2.5rem]" : "text-[2rem]")}>
              {title}
            </h1>
            {description ? (
              <p className="max-w-2xl text-[15px] font-medium text-text-secondary leading-relaxed">
                {description}
              </p>
            ) : null}
          </div>
          {meta ? <div className="flex flex-wrap items-center gap-3">{meta}</div> : null}
        </div>
        {actions ? (
          <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
