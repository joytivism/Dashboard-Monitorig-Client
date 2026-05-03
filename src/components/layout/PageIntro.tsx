import React from 'react';
import { cn } from '@/lib/utils';

interface PageIntroProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}

export default function PageIntro({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className,
}: PageIntroProps) {
  return (
    <section className={cn('ds-card relative overflow-hidden p-6 md:p-7', className)}>
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-1/4 -translate-y-1/4 rounded-full bg-accent/6 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          {eyebrow ? <div className="ds-eyebrow">{eyebrow}</div> : null}
          <div className="space-y-2">
            <h1 className="text-h1">{title}</h1>
            {description ? <p className="max-w-2xl text-body">{description}</p> : null}
          </div>
          {meta ? <div className="flex flex-wrap items-center gap-3">{meta}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
