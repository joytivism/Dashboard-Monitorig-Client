import React from 'react';
import { Loader2 } from 'lucide-react';
import type { StateTone } from '@/components/ui/StateFrame';
import StateFrame from '@/components/ui/StateFrame';

interface LoadingStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: StateTone;
  className?: string;
}

export default function LoadingState({
  title,
  description,
  tone = 'neutral',
  className,
}: LoadingStateProps) {
  return (
    <StateFrame
      icon={Loader2}
      title={title}
      description={description}
      tone={tone}
      className={className}
      iconClassName="animate-spin"
    />
  );
}
