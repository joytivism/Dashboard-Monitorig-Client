import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { StateTone } from '@/components/ui/StateFrame';
import StateFrame from '@/components/ui/StateFrame';

interface ErrorStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  tone?: StateTone;
  className?: string;
}

export default function ErrorState({
  title,
  description,
  action,
  tone = 'danger',
  className,
}: ErrorStateProps) {
  return (
    <StateFrame
      icon={AlertCircle}
      title={title}
      description={description}
      action={action}
      tone={tone}
      className={className}
    />
  );
}
