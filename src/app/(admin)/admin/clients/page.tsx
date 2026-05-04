'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Edit2,
  Grid2X2,
  Hash,
  LayoutList,
  Plus,
  Search,
  Target,
  Trash2,
  User,
} from 'lucide-react';
import { useDashboardData } from '@/components/DataProvider';
import PageIntro from '@/components/layout/PageIntro';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import InputField from '@/components/ui/InputField';
import ModalFrame from '@/components/ui/ModalFrame';
import SectionHeader from '@/components/ui/SectionHeader';
import TableShell from '@/components/ui/TableShell';
import Toast from '@/components/ui/Toast';
import useTimedToast from '@/components/ui/useTimedToast';
import { supabase } from '@/lib/supabase';
import type { Client } from '@/lib/data';

type ViewMode = 'grid' | 'list';

interface ClientFormState {
  client_key: string;
  name: string;
  industry: string;
  pic_name: string;
  account_strategist: string;
  brand_category: string;
  chs: string[];
  troas: Record<string, string>;
}

const INITIAL_FORM: ClientFormState = {
  client_key: '',
  name: '',
  industry: '',
  pic_name: '',
  account_strategist: '',
  brand_category: '',
  chs: [],
  troas: {},
};

const FORM_FIELDS: Array<{
  label: string;
  key: keyof Omit<ClientFormState, 'chs' | 'troas'>;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  span?: boolean;
  required?: boolean;
}> = [
  { label: 'Client Key (ID)', key: 'client_key', placeholder: 'NamaKlien', icon: Hash, span: true, required: true },
  { label: 'Display Name', key: 'name', placeholder: 'Contoh: Nama Klien Resmi', icon: User, span: true, required: true },
  { label: 'Industri', key: 'industry', placeholder: 'Fashion', icon: Briefcase },
  { label: 'PIC Client', key: 'pic_name', placeholder: 'PIC', icon: User },
  { label: 'Account Strategist', key: 'account_strategist', placeholder: 'AS', icon: Target },
  { label: 'Channel Group', key: 'brand_category', placeholder: 'CG', icon: Briefcase },
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan yang tidak diketahui.';
}

export default function ClientsAdminPage() {
  const { CLIENTS, CH_DEF } = useDashboardData();
  const router = useRouter();
  const [view, setView] = useState<ViewMode>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useTimedToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ key: string; name?: string } | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<ClientFormState>(INITIAL_FORM);

  const channelOptions = useMemo(
    () => Object.entries(CH_DEF).map(([key, value]) => ({ key, label: value.l })),
    [CH_DEF]
  );

  const filteredClients = useMemo(
    () =>
      CLIENTS.filter(
        (client) =>
          client.key.toLowerCase().includes(search.toLowerCase()) ||
          client.ind.toLowerCase().includes(search.toLowerCase()) ||
          client.name.toLowerCase().includes(search.toLowerCase())
      ),
    [CLIENTS, search]
  );

  const openNew = () => {
    setEditKey(null);
    setForm(INITIAL_FORM);
    setShowModal(true);
  };

  const openEdit = (client: Client) => {
    setEditKey(client.key);
    setForm({
      client_key: client.key,
      name: client.name,
      industry: client.ind,
      pic_name: client.pic,
      account_strategist: client.as,
      brand_category: client.cg,
      chs: [...client.chs],
      troas: Object.fromEntries(Object.entries(client.troas).map(([key, value]) => [key, String(value)])),
    });
    setShowModal(true);
  };

  const handleDelete = (key: string, name?: string) => {
    setDeleteTarget({ key, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('clients').delete().eq('client_key', deleteTarget.key);
      if (error) throw error;

      showToast('success', `Klien ${deleteTarget.name || deleteTarget.key} berhasil dihapus.`);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      showToast('error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const clientPayload = {
        client_key: form.client_key,
        name: form.name || form.client_key,
        industry: form.industry,
        pic_name: form.pic_name,
        account_strategist: form.account_strategist,
        brand_category: form.brand_category,
      };

      const { error: clientError } = await supabase.from('clients').upsert(clientPayload, { onConflict: 'client_key' });
      if (clientError) throw clientError;

      const { error: deleteError } = await supabase.from('client_channels').delete().eq('client_key', form.client_key);
      if (deleteError) throw deleteError;

      if (form.chs.length > 0) {
        const channelsPayload = form.chs.map((channel) => ({
          client_key: form.client_key,
          channel_key: channel,
          target_roas: form.troas[channel] ? Number(form.troas[channel]) : null,
        }));

        const { error: channelError } = await supabase.from('client_channels').insert(channelsPayload);
        if (channelError) throw channelError;
      }

      showToast('success', `Klien ${form.client_key} berhasil disimpan.`);
      setShowModal(false);
      setForm(INITIAL_FORM);
      router.refresh();
    } catch (error) {
      showToast('error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const selectedChannels = form.chs.map((channel) => ({
    key: channel,
    label: CH_DEF[channel]?.l || channel,
  }));

  return (
    <>
      <Toast toast={toast} />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 pb-20 animate-fade-in">
        <PageIntro
          eyebrow="Admin Console"
          title="Client management"
          description="Kelola identitas klien, ownership, dan channel aktif dari satu panel yang lebih rapi dan mudah dipindai."
          meta={(
            <>
              <Badge tone="neutral" style="soft">{CLIENTS.length} klien aktif</Badge>
              <Badge tone="accent" style="soft">{channelOptions.length} channel option</Badge>
            </>
          )}
          actions={(
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-[var(--radius-md)] border border-border-main bg-surface2/70 p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors ${
                    view === 'grid' ? 'border border-border-main bg-white text-text shadow-[var(--shadow-card)]' : 'text-text3 hover:text-text'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid2X2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors ${
                    view === 'list' ? 'border border-border-main bg-white text-text shadow-[var(--shadow-card)]' : 'text-text3 hover:text-text'
                  }`}
                  aria-label="List view"
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
              <Button variant="primary" size="lg" leadingIcon={Plus} onClick={openNew}>
                Tambah klien
              </Button>
            </div>
          )}
        />

        <TableShell
          eyebrow="Directory"
          title="Search and browse"
          description="Cari account, cek ownership, lalu buka editor yang sama untuk update detail dan channel aktif."
          action={<Badge tone="neutral" style="soft">{filteredClients.length} ditampilkan</Badge>}
          toolbar={(
            <div className="w-full max-w-md">
              <InputField
                placeholder="Cari nama klien, brand, atau industri..."
                icon={Search}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          )}
        >
          {view === 'grid' ? (
            <div className="p-6">
              {filteredClients.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredClients.map((client) => (
                    <Card key={client.key} className="flex h-full flex-col justify-between gap-5 transition-colors hover:border-border-alt hover:bg-surface2/30">
                      <div className="space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-border-main bg-surface2 text-sm font-semibold text-text2">
                              {client.key.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-text">{client.name}</div>
                              <div className="mt-1 flex flex-wrap gap-2">
                                <Badge tone="accent" style="soft">{client.cg || 'N/A'}</Badge>
                                <Badge tone="neutral" style="soft">{client.ind || '—'}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEdit(client)} className="btn-icon h-9 w-9">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(client.key, client.name)} className="btn-icon h-9 w-9 hover:border-rr-border hover:text-rr-text">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <Card tone="muted" padding="sm" className="space-y-1.5">
                            <div className="text-micro">Account strategist</div>
                            <div className="text-sm font-semibold text-text">{client.as || '—'}</div>
                          </Card>
                          <Card tone="muted" padding="sm" className="space-y-1.5">
                            <div className="text-micro">PIC client</div>
                            <div className="text-sm font-semibold text-text">{client.pic || '—'}</div>
                          </Card>
                        </div>
                      </div>

                      <div className="border-t border-border-main pt-4">
                        <div className="mb-3 text-micro">Assigned channels</div>
                        <div className="flex flex-wrap gap-2">
                          {client.chs.length > 0 ? (
                            client.chs.map((channel) => (
                              <Badge key={channel} tone="neutral" style="soft">
                                {CH_DEF[channel]?.l || channel}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs italic text-text4">No channels assigned</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Tidak ada klien ditemukan"
                  description="Coba ubah kata kunci pencarian untuk menampilkan kembali daftar account."
                  className="py-14"
                />
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full border-collapse bg-white text-left">
                <thead>
                  <tr className="bg-surface2/70">
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">Client</th>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">Industry</th>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">AS / PIC</th>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">Channels</th>
                    <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/60">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr key={client.key} className="transition-colors hover:bg-surface2/55">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-border-main bg-surface2 text-xs font-semibold text-text2">
                              {client.key.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-text">{client.name}</div>
                              <div className="text-xs text-text3">{client.key}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text2">{client.ind}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-text">{client.as || '—'}</div>
                          <div className="text-xs text-text3">{client.pic || '—'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {client.chs.slice(0, 3).map((channel) => (
                              <Badge key={channel} tone="neutral" style="soft">
                                {CH_DEF[channel]?.l || channel}
                              </Badge>
                            ))}
                            {client.chs.length > 3 ? <Badge tone="neutral" style="soft">+{client.chs.length - 3}</Badge> : null}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(client)} className="btn-icon h-9 w-9">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(client.key, client.name)} className="btn-icon h-9 w-9 hover:border-rr-border hover:text-rr-text">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16">
                        <EmptyState
                          title="Tidak ada klien ditemukan"
                          description="Coba ubah kata kunci pencarian untuk menampilkan kembali daftar account."
                          className="mx-auto max-w-md"
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TableShell>
      </div>

      {showModal ? (
        <ModalFrame
          title={editKey ? 'Edit klien' : 'Tambah klien'}
          description="Atur identitas klien, ownership, dan channel aktif dari panel yang sama."
          onClose={() => setShowModal(false)}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                {FORM_FIELDS.map((field) => (
                  <InputField
                    key={field.key}
                    label={field.label}
                    icon={field.icon}
                    required={field.required}
                    disabled={field.key === 'client_key' && !!editKey}
                    placeholder={field.placeholder}
                    className={field.span ? 'md:col-span-2' : ''}
                    value={form[field.key]}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <SectionHeader
                  eyebrow="Channels & targets"
                  title="Assign active channels"
                  description="Pilih channel yang aktif untuk klien ini dan isi target ROAS bila diperlukan."
                />
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {channelOptions.map((channel) => {
                    const active = form.chs.includes(channel.key);
                    return (
                      <button
                        key={channel.key}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            chs: active
                              ? current.chs.filter((value) => value !== channel.key)
                              : [...current.chs, channel.key],
                          }))
                        }
                        className={`rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm font-medium transition-colors ${
                          active
                            ? 'border-accent bg-accent-light text-accent'
                            : 'border-border-main bg-white text-text2 hover:border-border-alt hover:bg-surface2'
                        }`}
                      >
                        {channel.label}
                      </button>
                    );
                  })}
                </div>

                {selectedChannels.length > 0 ? (
                  <div className="grid gap-4 rounded-[var(--radius-lg)] border border-border-main bg-surface2/70 p-5 md:grid-cols-2">
                    {selectedChannels.map((channel) => (
                      <InputField
                        key={channel.key}
                        label={`${channel.label} Target (x)`}
                        type="number"
                        step="0.1"
                        placeholder="5.0"
                        value={form.troas[channel.key] || ''}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            troas: { ...current.troas, [channel.key]: event.target.value },
                          }))
                        }
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-border-main bg-surface2/70 px-6 py-5 sm:flex-row">
              <Button type="button" variant="secondary" size="lg" fullWidth onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                Simpan klien
              </Button>
            </div>
          </form>
        </ModalFrame>
      ) : null}

      {showDeleteModal ? (
        <ConfirmDialog
          title="Hapus client?"
          description={`Klien "${deleteTarget?.name || deleteTarget?.key}" akan dihapus dari dashboard dan relasi channel aktifnya.`}
          onClose={() => !loading && setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          loading={loading}
          noteTitle="Pastikan tidak ada workflow aktif"
          noteDescription="Pastikan tidak ada workflow operasional yang masih memakai data klien ini sebelum menghapusnya."
          confirmLabel="Ya, hapus permanen"
        />
      ) : null}
    </>
  );
}
