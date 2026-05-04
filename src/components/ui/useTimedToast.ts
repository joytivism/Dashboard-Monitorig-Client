'use client';

import { useEffect, useState } from 'react';
import type { ToastState } from '@/components/ui/Toast';

interface UseTimedToastOptions {
  duration?: number;
}

export default function useTimedToast(options?: UseTimedToastOptions) {
  const duration = options?.duration ?? 4000;
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, duration);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [duration, toast]);

  const showToast = (type: ToastState['type'], text: string) => {
    setToast({ type, text });
  };

  const clearToast = () => {
    setToast(null);
  };

  return { toast, setToast, showToast, clearToast };
}
