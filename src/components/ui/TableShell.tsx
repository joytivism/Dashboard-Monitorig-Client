import React from 'react';
import type { LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import SectionHeader from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';

type TableShellTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

interface TableShellProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  tone?: TableShellTone;
  action?: React.ReactNode;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  toolbarClassName?: string;
  footerClassName?: string;
}

export default function TableShell({
  eyebrow,
  title,
  description,
  icon,
  tone = 'neutral',
  action,
  toolbar,
  footer,
  children,
  className,
  bodyClassName,
  toolbarClassName,
  footerClassName,
}: TableShellProps) {
  return (
    <Card className={cn('overflow-hidden p-0', className)}>
      <div className="border-b border-border-main px-4 py-4 sm:px-6 sm:py-5">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          icon={icon}
          tone={tone}
          action={action}
        />
        {toolbar ? <div className={cn('mt-5', toolbarClassName)}>{toolbar}</div> : null}
      </div>

      <div className={bodyClassName}>{children}</div>

      {footer ? (
        <div className={cn('border-t border-border-main bg-surface2/35 px-4 py-4 sm:px-6', footerClassName)}>
          {footer}
        </div>
      ) : null}
    </Card>
  );
}
