'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Calendar,
  Filter,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useDashboardData } from '@/components/DataProvider';
import PageIntro from '@/components/layout/PageIntro';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import InputField from '@/components/ui/InputField';
import ModalFrame from '@/components/ui/ModalFrame';
import TableShell from '@/components/ui/TableShell';
import SelectField from '@/components/ui/SelectField';
import Toast from '@/components/ui/Toast';
import useTimedToast from '@/components/ui/useTimedToast';
import { supabase } from '@/lib/supabase';

type ActivityType = 'p' | 'e' | 'c' | 'l';

interface ActivityFormState {
  client_key: string;
  type: ActivityType;
  name: string;
  date: string;
}

const TYPE_MAP: Record<ActivityType, { label: string; badgeTone: 'success' | 'info' | 'warning' | 'danger'; dotClass: string }> = {
  p: { label: 'Promo', badgeTone: 'success', dotClass: 'bg-gd' },
  e: { label: 'Event', badgeTone: 'info', dotClass: 'bg-text4' },
  c: { label: 'Content', badgeTone: 'warning', dotClass: 'bg-accent' },
  l: { label: 'Launching', badgeTone: 'danger', dotClass: 'bg-rr' },
};

const INITIAL_FORM: ActivityFormState = {
  client_key: '',
  type: 'e',
  name: '',
  date: new Date().toISOString().split('T')[0],
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan yang tidak diketahui.';
}

export default function ActivityPage() {
  const { CLIENTS, ACTIVITY } = useDashboardData();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useTimedToast();
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; title: string } | null>(null);
  const [form, setForm] = useState<ActivityFormState>(INITIAL_FORM);

  const filtered = useMemo(
    () =>
      ACTIVITY.filter((item) => {
        const matchesSearch =
          !search ||
          item.n.toLowerCase().includes(search.toLowerCase()) ||
          item.c.toLowerCase().includes(search.toLowerCase());
        const matchesClient = selectedClient === 'all' || item.c === selectedClient;
        return matchesSearch && matchesClient;
      }),
    [ACTIVITY, search, selectedClient]
  );

  const clientOptions = [
    { label: 'Semua klien', value: 'all' },
    ...CLIENTS.map((client) => ({ label: client.key, value: client.key })),
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.client_key || !form.name || !form.date) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('activity_logs').insert({
        client_key: form.client_key,
        log_type: form.type,
        note: form.name,
        log_date: form.date,
      });
      if (error) throw error;

      showToast('success', 'Activity berhasil ditambahkan.');
      setShowModal(false);
      setForm(INITIAL_FORM);
      router.refresh();
    } catch (error) {
      showToast('error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id: string | number | undefined, title: string) => {
    if (!id) return;
    setDeleteTarget({ id, title });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('activity_logs').delete().eq('id', deleteTarget.id);
      if (error) throw error;

      showToast('success', 'Activity berhasil dihapus.');
      setShowDeleteModal(false);
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      showToast('error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast toast={toast} />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 pb-20 animate-fade-in">
        <PageIntro
          eyebrow="Admin Console"
          title="Activity log"
          description="Kelola catatan promo, event, content, dan launching dari seluruh klien dalam satu feed yang lebih mudah dipindai."
          meta={(
            <>
              <Badge tone="neutral" style="soft">{ACTIVITY.length} total activities</Badge>
              <Badge tone="accent" style="soft">{CLIENTS.length} client sources</Badge>
            </>
          )}
          actions={(
            <Button variant="primary" size="lg" leadingIcon={Plus} onClick={() => setShowModal(true)}>
              Tambah activity
            </Button>
          )}
        />

        <TableShell
          eyebrow="Timeline"
          title="Recent activity feed"
          description="Catatan operasional terbaru yang sudah masuk ke database dan siap ditinjau tim."
          action={<Badge tone="neutral" style="soft">{filtered.length} ditampilkan</Badge>}
          toolbar={(
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <InputField
                placeholder="Cari aktivitas atau klien..."
                icon={Search}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <SelectField
                icon={Filter}
                value={selectedClient}
                onChange={(event) => setSelectedClient(event.target.value)}
                options={clientOptions}
              />
            </div>
          )}
        >
          {filtered.length === 0 ? (
            <div className="px-6 py-6">
              <EmptyState
                title="Tidak ada aktivitas ditemukan"
                description="Coba ubah filter atau tambahkan activity baru untuk mengisi feed operasional."
                className="py-14"
              />
            </div>
          ) : (
            <div className="divide-y divide-border-main/60">
              {filtered.map((item, index) => {
                const type = TYPE_MAP[item.t as ActivityType] || TYPE_MAP.e;
                const isLast = index === filtered.length - 1;

                return (
                  <div key={`${item.id ?? `${item.c}-${item.d}-${index}`}`} className="group flex gap-4 px-6 py-5 transition-colors hover:bg-surface2/45">
                    <div className="flex shrink-0 flex-col items-center pt-1">
                      <div className={`h-2.5 w-2.5 rounded-full ${type.dotClass}`} />
                      {!isLast ? <div className="mt-2 w-px flex-1 bg-border-main" /> : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={type.badgeTone} style="soft">{type.label}</Badge>
                        <Badge tone="neutral" style="soft">{item.c}</Badge>
                        <span className="ml-auto text-[11px] font-medium uppercase tracking-[0.1em] text-text4">{item.d}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-text">{item.n}</p>
                    </div>

                    <button
                      onClick={() => requestDelete(item.id, item.n)}
                      disabled={!item.id}
                      className="btn-icon h-9 w-9 shrink-0 opacity-100 transition-all disabled:cursor-not-allowed disabled:opacity-30 hover:border-rr-border hover:text-rr-text sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </TableShell>
      </div>

      {showModal ? (
        <ModalFrame
          title="Tambah activity"
          description="Buat catatan operasional baru untuk promo, event, content, atau launching."
          onClose={() => setShowModal(false)}
          size="md"
        >
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="space-y-5 px-6 py-6">
              <SelectField
                label="Klien"
                value={form.client_key}
                onChange={(event) => setForm((current) => ({ ...current, client_key: event.target.value }))}
                options={[
                  { label: 'Pilih klien', value: '' },
                  ...CLIENTS.map((client) => ({ label: client.key, value: client.key })),
                ]}
              />

              <div className="space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">Tipe aktivitas</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(TYPE_MAP).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, type: key as ActivityType }))}
                      className={`rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm font-medium transition-colors ${
                        form.type === key
                          ? 'border-accent bg-accent-light text-accent'
                          : 'border-border-main bg-white text-text2 hover:border-border-alt hover:bg-surface2'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{value.label}</span>
                        <Badge tone={value.badgeTone} style="soft">{value.label}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <InputField
                label="Nama aktivitas / catatan"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Contoh: Launching promo buy 1 get 1"
                icon={Activity}
              />

              <InputField
                label="Tanggal"
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                icon={Calendar}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-border-main bg-surface2/70 px-6 py-5 sm:flex-row">
              <Button type="button" variant="secondary" size="lg" fullWidth onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                Simpan activity
              </Button>
            </div>
          </form>
        </ModalFrame>
      ) : null}

      {showDeleteModal ? (
        <ConfirmDialog
          title="Hapus activity?"
          description={`Catatan "${deleteTarget?.title}" akan dihapus secara permanen dari activity feed.`}
          onClose={() => !loading && setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          loading={loading}
          noteTitle="Penghapusan bersifat permanen"
          noteDescription="Activity yang sudah dihapus tidak bisa dipulihkan. Pastikan catatan ini memang tidak lagi dibutuhkan tim."
          confirmLabel="Ya, hapus"
        />
      ) : null}
    </>
  );
}
