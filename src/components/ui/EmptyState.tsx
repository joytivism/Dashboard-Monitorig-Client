import React from 'react';
import { Inbox } from 'lucide-react';
import type { StateTone } from '@/components/ui/StateFrame';
import StateFrame from '@/components/ui/StateFrame';

interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  tone?: StateTone;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  action,
  tone = 'neutral',
  className,
}: EmptyStateProps) {
  return (
    <StateFrame
      icon={Inbox}
      title={title}
      description={description}
      action={action}
      tone={tone}
      borderStyle="dashed"
      className={className}
    />
  );
}
