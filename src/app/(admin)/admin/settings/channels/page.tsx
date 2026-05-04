'use client';

import React, { useMemo, useState } from 'react';
import { Hash, Info, Plus, Save, Trash2, Type } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDashboardData } from '@/components/DataProvider';
import PageIntro from '@/components/layout/PageIntro';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import SectionHeader from '@/components/ui/SectionHeader';
import TableShell from '@/components/ui/TableShell';
import Toast from '@/components/ui/Toast';
import useTimedToast from '@/components/ui/useTimedToast';
import { supabase } from '@/lib/supabase';

interface ChannelConfig {
  key: string;
  label: string;
  stage: string;
  type: string;
  isNew?: boolean;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Gagal memproses perubahan channel.';
}

export default function ChannelSettingsPage() {
  const { CH_DEF } = useDashboardData();
  const router = useRouter();
  const [draftChannels, setDraftChannels] = useState<ChannelConfig[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useTimedToast();
  const [deleteTarget, setDeleteTarget] = useState<{ key: string; label: string } | null>(null);

  const baseChannels = useMemo<ChannelConfig[]>(
    () =>
      Object.entries(CH_DEF).map(([key, value]) => ({
        key,
        label: value.l,
        stage: value.stage,
        type: value.type,
      })),
    [CH_DEF]
  );

  const channels = draftChannels ?? baseChannels;

  const updateChannels = (updater: (current: ChannelConfig[]) => ChannelConfig[]) => {
    setDraftChannels((previous) => updater(previous ?? baseChannels));
  };

  const updateChannelField = (index: number, field: keyof ChannelConfig, value: string | boolean) => {
    updateChannels((current) =>
      current.map((channel, currentIndex) =>
        currentIndex === index ? { ...channel, [field]: value } : channel
      )
    );
  };

  const handleAdd = () => {
    updateChannels((current) => [
      ...current,
      { key: `new-${current.length + 1}`, label: '', stage: 'tofu', type: 'awareness', isNew: true },
    ]);
  };

  const handleRemove = async (key: string, isNew?: boolean) => {
    if (isNew) {
      updateChannels((current) => current.filter((channel) => channel.key !== key));
      return;
    }

    const currentChannel = channels.find((channel) => channel.key === key);
    setDeleteTarget({ key, label: currentChannel?.label || key });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    const { error } = await supabase.from('channels').delete().eq('channel_key', deleteTarget.key);
    if (error) {
      showToast('error', getErrorMessage(error));
    } else {
      showToast('success', 'Channel berhasil dihapus.');
      setDeleteTarget(null);
      setDraftChannels(null);
      router.refresh();
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const invalid = channels.find((channel) => !channel.key || !channel.label);
    if (invalid) {
      showToast('error', 'Semua kolom ID dan Nama harus diisi.');
      return;
    }

    setLoading(true);
    const payload = channels.map((channel) => ({
      channel_key: channel.key,
      label: channel.label,
      stage: channel.stage,
      type: channel.type,
    }));

    const { error } = await supabase.from('channels').upsert(payload);
    if (error) {
      showToast('error', getErrorMessage(error));
    } else {
      showToast('success', 'Konfigurasi channel berhasil disimpan!');
      setDraftChannels(null);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 pb-20 animate-fade-in">
      <Toast toast={toast} />

      <PageIntro
        eyebrow="Admin Console"
        title="Pengaturan Channel"
        description="Kelola definisi, kategori, dan tahap funnel untuk setiap saluran iklan dengan layout yang lebih konsisten."
        meta={(
          <>
            <Badge tone="neutral" style="soft">{channels.length} channels</Badge>
            <Badge tone="accent" style="soft">Stage + type mapping</Badge>
          </>
        )}
        actions={(
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="lg" leadingIcon={Plus} onClick={handleAdd}>
              Tambah channel
            </Button>
            <Button variant="primary" size="lg" leadingIcon={Save} onClick={handleSave} loading={loading}>
              Simpan perubahan
            </Button>
          </div>
        )}
      />

      <TableShell
        eyebrow="Channel directory"
        title="Stage dan type configuration"
        description="Setiap channel memakai ID unik, label tampilan, stage funnel, dan type perhitungan dashboard."
      >
        {channels.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-left">
              <thead>
                <tr className="border-b border-border-main bg-surface2/60">
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text3">ID Channel</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text3">Nama Tampilan</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text3">Stage</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text3">Type</th>
                  <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-text3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/60">
                {channels.map((channel, index) => (
                  <tr key={`${channel.key}-${index}`} className="align-top transition-colors hover:bg-surface2/35">
                    <td className="px-6 py-4">
                      <InputField
                        aria-label={`ID channel ${index + 1}`}
                        icon={Hash}
                        disabled={!channel.isNew}
                        value={channel.isNew && channel.key.startsWith('new-') ? '' : channel.key}
                        onChange={(event) => updateChannelField(index, 'key', event.target.value)}
                        placeholder="e.g. twitter_ads"
                        inputClassName="font-mono"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <InputField
                        aria-label={`Nama channel ${index + 1}`}
                        icon={Type}
                        value={channel.label}
                        onChange={(event) => updateChannelField(index, 'label', event.target.value)}
                        placeholder="e.g. X (Twitter) Ads"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <SelectField
                        aria-label={`Stage channel ${index + 1}`}
                        value={channel.stage}
                        onChange={(event) => updateChannelField(index, 'stage', event.target.value)}
                        options={[
                          { label: 'TOFU (Awareness)', value: 'tofu' },
                          { label: 'MOFU (Consideration)', value: 'mofu' },
                          { label: 'BOFU (Conversion)', value: 'bofu' },
                        ]}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <SelectField
                        aria-label={`Type channel ${index + 1}`}
                        value={channel.type}
                        onChange={(event) => updateChannelField(index, 'type', event.target.value)}
                        options={[
                          { label: 'Performance / Revenue', value: 'revenue' },
                          { label: 'Assisted / Conversion', value: 'assist' },
                          { label: 'Awareness / Reach', value: 'awareness' },
                        ]}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemove(channel.key, channel.isNew)}
                          className="btn-icon h-9 w-9 hover:border-rr-border hover:text-rr-text"
                          aria-label={`Hapus ${channel.label || channel.key}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-6">
            <EmptyState
              title="Belum ada channel yang dikonfigurasi"
              description="Tambahkan channel baru untuk mulai membangun definisi stage dan type."
              className="py-14"
            />
          </div>
        )}
      </TableShell>

      <Card tone="muted" className="space-y-4">
        <SectionHeader
          eyebrow="Panduan"
          title="Aturan konfigurasi"
          description="Gunakan mapping yang konsisten agar semua data performa tetap terbaca benar di dashboard."
          icon={Info}
        />
        <p className="text-sm leading-6 text-text3">
          Tipe <strong className="text-text">Performance/Revenue</strong> akan dihitung ke dalam ROAS global. Tipe <strong className="text-text">Awareness</strong> hanya akan dihitung spend dan reach-nya. Pastikan ID Channel unik dan sesuai dengan data yang diunggah.
        </p>
      </Card>

      {deleteTarget ? (
        <ConfirmDialog
          title="Hapus channel?"
          description={`Channel "${deleteTarget.label}" akan dihapus dari konfigurasi dashboard.`}
          onClose={() => !loading && setDeleteTarget(null)}
          onConfirm={confirmDelete}
          loading={loading}
          noteTitle="Periksa keterkaitan data performa"
          noteDescription="Data performa yang sudah memakai ID channel ini bisa menjadi tidak terbaca jika penghapusan dilakukan."
          confirmLabel="Ya, hapus"
        />
      ) : null}
    </div>
  );
}
