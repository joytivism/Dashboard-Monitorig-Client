import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ModalSize = 'md' | 'lg' | 'xl';

interface ModalFrameProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-4xl',
};

export default function ModalFrame({
  title,
  description,
  onClose,
  children,
  size = 'lg',
  className,
}: ModalFrameProps) {
  return (
    <>
      <div className="fixed inset-0 z-[10001] bg-black/32 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-0 z-[10002] overflow-y-auto p-4 md:p-6">
        <div className="flex min-h-full items-center justify-center">
          <div
            className={cn('ds-overlay-panel flex w-full flex-col p-0', sizeClasses[size], className)}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border-main px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0 space-y-2">
                <h3 className="text-h4">{title}</h3>
                {description ? <p className="text-sm leading-6 text-text3">{description}</p> : null}
              </div>
              <button onClick={onClose} className="btn-icon h-9 w-9 shrink-0" aria-label="Tutup modal">
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
