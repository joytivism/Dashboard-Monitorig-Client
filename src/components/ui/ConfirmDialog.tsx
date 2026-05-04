import React from 'react';
import Button from '@/components/ui/Button';
import ModalFrame from '@/components/ui/ModalFrame';
import StateFrame, { type StateTone } from '@/components/ui/StateFrame';

interface ConfirmDialogProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  noteTitle?: React.ReactNode;
  noteDescription?: React.ReactNode;
  confirmLabel: React.ReactNode;
  cancelLabel?: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
  tone?: StateTone;
  confirmVariant?: 'primary' | 'danger';
}

export default function ConfirmDialog({
  title,
  description,
  noteTitle,
  noteDescription,
  confirmLabel,
  cancelLabel = 'Batalkan',
  onConfirm,
  onClose,
  loading = false,
  tone = 'danger',
  confirmVariant = 'danger',
}: ConfirmDialogProps) {
  return (
    <ModalFrame title={title} description={description} onClose={onClose} size="md">
      <div className="space-y-6 px-4 py-5 sm:px-6 sm:py-6">
        {noteTitle || noteDescription ? (
          <StateFrame
            title={noteTitle}
            description={noteDescription}
            tone={tone}
            align="left"
            size="sm"
          />
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="secondary" size="lg" fullWidth onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={confirmVariant} size="lg" fullWidth onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </ModalFrame>
  );
}
