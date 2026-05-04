import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastState {
  type: 'success' | 'error';
  text: string;
}

interface ToastProps {
  toast: ToastState | null;
  className?: string;
}

export default function Toast({ toast, className }: ToastProps) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="status"
      className={cn(
        'fixed right-4 top-24 z-[10000] flex w-[min(360px,calc(100vw-2rem))] items-start gap-3 rounded-[var(--radius-lg)] border bg-white px-4 py-3.5 text-sm font-medium shadow-[var(--shadow-popover)] animate-fade-in md:right-6',
        isSuccess ? 'border-gd-border/80 text-gd-text' : 'border-rr-border/80 text-rr-text',
        className
      )}
    >
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
          isSuccess ? 'border-gd-border/70 bg-gd-bg' : 'border-rr-border/70 bg-rr-bg'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <span className="leading-6">{toast.text}</span>
    </div>
  );
}
