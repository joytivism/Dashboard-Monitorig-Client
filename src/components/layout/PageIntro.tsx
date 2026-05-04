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
    <section className={cn('ds-card p-4 sm:p-5 md:p-6', className)}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-3xl space-y-3">
          {eyebrow ? <div className="ds-eyebrow">{eyebrow}</div> : null}
          <div className="space-y-2">
            <h1 className="text-h1">{title}</h1>
            {description ? <p className="max-w-3xl text-body">{description}</p> : null}
          </div>
          {meta ? <div className="flex flex-wrap items-center gap-2.5">{meta}</div> : null}
        </div>
        {actions ? <div className="flex w-full flex-wrap items-center gap-2.5 lg:w-auto lg:justify-end">{actions}</div> : null}
      </div>
    </section>
  );
}
