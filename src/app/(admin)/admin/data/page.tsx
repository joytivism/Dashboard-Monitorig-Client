'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, Calendar, Database, Info, LayoutGrid, Layers, RotateCcw, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDashboardData } from '@/components/DataProvider';
import PageIntro from '@/components/layout/PageIntro';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import InputField from '@/components/ui/InputField';
import MetricCard from '@/components/ui/MetricCard';
import SectionHeader from '@/components/ui/SectionHeader';
import SelectField from '@/components/ui/SelectField';
import StateFrame from '@/components/ui/StateFrame';
import Toast from '@/components/ui/Toast';
import useTimedToast from '@/components/ui/useTimedToast';
import { supabase } from '@/lib/supabase';
import { isAware } from '@/lib/utils';

type ChannelRow = {
  ch: string;
  rev: string;
  sp: string;
  ord: string;
  vis: string;
  reach: string;
  impr: string;
  results: string;
};

const EMPTY_ROW = (channel = ''): ChannelRow => ({
  ch: channel,
  rev: '',
  sp: '',
  ord: '',
  vis: '',
  reach: '',
  impr: '',
  results: '',
});

const STAGE_META: Record<string, { label: string; tone: 'info' | 'warning' | 'success' }> = {
  tofu: { label: 'TOFU', tone: 'info' },
  mofu: { label: 'MOFU', tone: 'warning' },
  bofu: { label: 'BOFU', tone: 'success' },
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Gagal menyimpan data.';
}

export default function DataInputPage() {
  const { CLIENTS, PERIODS, DATA, CH_DEF } = useDashboardData();
  const router = useRouter();

  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [newPeriod, setNewPeriod] = useState('');
  const [useNewPeriod, setUseNewPeriod] = useState(false);
  const [rowDraft, setRowDraft] = useState<{ key: string; rows: ChannelRow[] }>({ key: '', rows: [] });
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useTimedToast();

  const client = CLIENTS.find((item) => item.key === selectedClient);
  const periodToUse = useNewPeriod ? newPeriod : selectedPeriod;
  const canProceed = Boolean(selectedClient && periodToUse.length === 7 && /^\d{4}-\d{2}$/.test(periodToUse));
  const isUpdateMode = DATA.some((item) => item.c === selectedClient && item.p === periodToUse);
  const draftKey = `${selectedClient}::${periodToUse}`;

  const baseRows = useMemo<ChannelRow[]>(() => {
    if (!client) return [];

    return client.chs.map((channel) => {
      const existing = DATA.find((item) => item.c === selectedClient && item.ch === channel && item.p === periodToUse);
      return {
        ch: channel,
        rev: existing?.rev ? String(existing.rev) : '',
        sp: existing?.sp ? String(existing.sp) : '',
        ord: existing?.ord ? String(existing.ord) : '',
        vis: existing?.vis ? String(existing.vis) : '',
        reach: existing?.reach ? String(existing.reach) : '',
        impr: existing?.impr ? String(existing.impr) : '',
        results: existing?.results ? String(existing.results) : '',
      };
    });
  }, [DATA, client, periodToUse, selectedClient]);

  const rows = rowDraft.key === draftKey ? rowDraft.rows : baseRows;

  const updateRows = (updater: (current: ChannelRow[]) => ChannelRow[]) => {
    setRowDraft((previous) => {
      const currentRows = previous.key === draftKey ? previous.rows : baseRows;
      return {
        key: draftKey,
        rows: updater(currentRows),
      };
    });
  };

  const updateRow = (index: number, field: keyof ChannelRow, value: string) => {
    updateRows((current) => current.map((row, currentIndex) => (currentIndex === index ? { ...row, [field]: value } : row)));
  };

  const handleSubmit = async () => {
    if (!selectedClient || !periodToUse) return;
    setLoading(true);

    try {
      if (useNewPeriod && newPeriod) {
        await supabase.from('periods').upsert({
          period_key: newPeriod,
          label: new Date(`${newPeriod}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        });
      }

      const upsertData = rows.map((row) => ({
        client_key: selectedClient,
        channel_key: row.ch,
        period_key: periodToUse,
        revenue: row.rev ? Number(row.rev) : null,
        spend: row.sp ? Number(row.sp) : null,
        orders: row.ord ? Number(row.ord) : null,
        visitors: row.vis ? Number(row.vis) : null,
        reach: row.reach ? Number(row.reach) : null,
        impressions: row.impr ? Number(row.impr) : null,
        results: row.results ? Number(row.results) : null,
      }));

      const { error } = await supabase
        .from('channel_performance')
        .upsert(upsertData, { onConflict: 'client_key,channel_key,period_key' });

      if (error) throw error;

      showToast('success', `Data ${selectedClient} · ${periodToUse} berhasil disimpan!`);
      setRowDraft({ key: '', rows: [] });
      router.refresh();
    } catch (error) {
      showToast('error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const awarenessCount = client?.chs.filter((channel) => isAware(CH_DEF, channel)).length || 0;
  const performanceCount = (client?.chs.length || 0) - awarenessCount;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 pb-20 animate-fade-in">
      <Toast toast={toast} />

      <PageIntro
        eyebrow="Admin Console"
        title="Input Data Performa"
        description="Masukkan data metrik iklan harian atau bulanan ke database utama dengan struktur yang lebih rapi dan konsisten."
        meta={(
          <>
            <Badge tone="neutral" style="soft">{CLIENTS.length} clients</Badge>
            <Badge tone="neutral" style="soft">{PERIODS.length} periods</Badge>
            {canProceed ? (
              <Badge tone={isUpdateMode ? 'success' : 'warning'} style="soft">
                {isUpdateMode ? 'Update mode' : 'Data baru'}
              </Badge>
            ) : null}
          </>
        )}
      />

      <Card className="space-y-5">
        <SectionHeader
          eyebrow="Langkah 1"
          title="Pilih klien dan periode"
          description="Tentukan kombinasi klien dan bulan pelaporan sebelum form input channel dibuka."
          icon={Database}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SelectField
            label="Pilih klien"
            icon={Database}
            value={selectedClient}
            onChange={(event) => setSelectedClient(event.target.value)}
            options={[
              { label: '— Klik untuk memilih klien —', value: '' },
              ...CLIENTS.map((item) => ({ label: item.key, value: item.key })),
            ]}
          />

          <div className="space-y-4">
            <SelectField
              label="Periode laporan"
              icon={Calendar}
              value={useNewPeriod ? '__new__' : selectedPeriod}
              onChange={(event) => {
                if (event.target.value === '__new__') {
                  setUseNewPeriod(true);
                } else {
                  setUseNewPeriod(false);
                  setSelectedPeriod(event.target.value);
                }
              }}
              options={[
                { label: '— Pilih Bulan —', value: '' },
                ...PERIODS.map((period) => ({ label: period, value: period })),
                { label: '+ Tambah Periode Baru...', value: '__new__' },
              ]}
            />

            {useNewPeriod ? (
              <InputField
                label="Periode baru"
                type="month"
                value={newPeriod}
                onChange={(event) => setNewPeriod(event.target.value)}
              />
            ) : null}
          </div>
        </div>

        {canProceed ? (
          <div className="flex flex-col gap-4 border-t border-border-main pt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={isUpdateMode ? 'success' : 'warning'} style="soft">
                {isUpdateMode ? 'Data ditemukan' : 'Data baru'}
              </Badge>
              <Badge tone="neutral" style="soft">
                {selectedClient} · {periodToUse}
              </Badge>
            </div>
            <Button
              variant="secondary"
              size="lg"
              trailingIcon={ArrowRight}
              onClick={() => document.getElementById('step2')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Lanjutkan
            </Button>
          </div>
        ) : null}
      </Card>

      {canProceed && client ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricCard title="Active channels" value={client.chs.length} icon={Layers} caption="Channel aktif pada klien terpilih" />
            <MetricCard title="Awareness" value={awarenessCount} icon={LayoutGrid} caption="Channel reach / awareness" tone="success" />
            <MetricCard title="Performance" value={performanceCount} icon={Database} caption="Channel revenue / conversion" tone="accent" />
          </div>

          <Card id="step2" className="space-y-5">
            <SectionHeader
              eyebrow="Langkah 2"
              title="Input data per channel"
              description="Isi metrik yang relevan untuk setiap channel aktif. Sistem akan meng-upsert data bila kombinasi yang sama sudah ada."
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  leadingIcon={RotateCcw}
                  onClick={() => updateRows(() => client.chs.map((channel) => EMPTY_ROW(channel)))}
                >
                  Reset
                </Button>
              }
            />

            <div className="space-y-4">
              {rows.map((row, index) => {
                const aware = isAware(CH_DEF, row.ch);
                const channelDefinition = CH_DEF[row.ch];
                const stage = channelDefinition?.stage || 'bofu';
                const stageMeta = STAGE_META[stage] || STAGE_META.bofu;
                const targetRoas = client.troas?.[row.ch];

                return (
                  <Card key={row.ch} className="space-y-5">
                    <SectionHeader
                      eyebrow="Channel"
                      title={channelDefinition?.l || row.ch}
                      description={aware ? 'Awareness metrics: spend, reach, impressions, dan results.' : 'Performance metrics: spend, revenue, orders, dan visitors/results.'}
                      action={
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={stageMeta.tone} style="soft">{stageMeta.label}</Badge>
                          <Badge tone="neutral" style="soft">{aware ? 'Awareness' : 'Performance'}</Badge>
                          {!aware && targetRoas ? <Badge tone="accent" style="soft">Target ROAS {targetRoas}x</Badge> : null}
                        </div>
                      }
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <InputField
                        label="Ad Spend (Rp)"
                        type="number"
                        value={row.sp}
                        onChange={(event) => updateRow(index, 'sp', event.target.value)}
                        placeholder="0"
                        inputClassName="tabular-nums"
                      />

                      {!aware ? (
                        <>
                          <InputField
                            label="Revenue (Rp)"
                            type="number"
                            value={row.rev}
                            onChange={(event) => updateRow(index, 'rev', event.target.value)}
                            placeholder="0"
                            inputClassName="tabular-nums"
                          />
                          <InputField
                            label="Orders"
                            type="number"
                            value={row.ord}
                            onChange={(event) => updateRow(index, 'ord', event.target.value)}
                            placeholder="0"
                            inputClassName="tabular-nums"
                          />
                          <InputField
                            label="Results / Visits"
                            type="number"
                            value={row.vis}
                            onChange={(event) => updateRow(index, 'vis', event.target.value)}
                            placeholder="0"
                            inputClassName="tabular-nums"
                          />
                        </>
                      ) : (
                        <>
                          <InputField
                            label="Reach"
                            type="number"
                            value={row.reach}
                            onChange={(event) => updateRow(index, 'reach', event.target.value)}
                            placeholder="0"
                            inputClassName="tabular-nums"
                          />
                          <InputField
                            label="Impressions"
                            type="number"
                            value={row.impr}
                            onChange={(event) => updateRow(index, 'impr', event.target.value)}
                            placeholder="0"
                            inputClassName="tabular-nums"
                          />
                          <InputField
                            label="Results"
                            type="number"
                            value={row.results}
                            onChange={(event) => updateRow(index, 'results', event.target.value)}
                            placeholder="0"
                            inputClassName="tabular-nums"
                          />
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 border-t border-border-main pt-5 lg:flex-row lg:items-start lg:justify-between">
              <StateFrame
                icon={Info}
                title="Mode upsert aktif"
                description="Sistem akan memperbarui data jika kombinasi klien, channel, dan periode sudah ada."
                tone="info"
                align="left"
                size="sm"
                className="max-w-xl"
              />
              <Button variant="primary" size="lg" leadingIcon={Save} onClick={handleSubmit} loading={loading}>
                Simpan semua data
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <StateFrame
          icon={LayoutGrid}
          title="Klien & periode belum ditentukan"
          description="Pilih klien dan tentukan periode bulan di bagian atas untuk membuka form input data."
          className="min-h-[240px] justify-center"
        />
      )}
    </div>
  );
}
