'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF } from '@/lib/data';
import { isAware } from '@/lib/utils';
import { CheckCircle2, AlertCircle, ChevronRight, Save, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ChannelRow = {
  ch: string;
  rev: string; sp: string; ord: string; vis: string;
  reach: string; impr: string; results: string;
};

const EMPTY_ROW = (): ChannelRow => ({ ch: '', rev: '', sp: '', ord: '', vis: '', reach: '', impr: '', results: '' });

export default function DataInputPage() {
  const { CLIENTS, PERIODS, DATA } = useDashboardData();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [newPeriod, setNewPeriod] = useState('');
  const [useNewPeriod, setUseNewPeriod] = useState(false);
  const [rows, setRows] = useState<ChannelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const client = CLIENTS.find(c => c.key === selectedClient);
  const periodToUse = useNewPeriod ? newPeriod : selectedPeriod;

  // Pre-fill rows when client selected
  useEffect(() => {
    if (!client) { setRows([]); return; }
    const prefilled = client.chs.map(ch => {
      // Try to pre-fill from existing data
      const existing = DATA.find(d => d.c === selectedClient && d.ch === ch && d.p === periodToUse);
      return {
        ch,
        rev: existing?.rev ? String(existing.rev) : '',
        sp: existing?.sp ? String(existing.sp) : '',
        ord: existing?.ord ? String(existing.ord) : '',
        vis: existing?.vis ? String(existing.vis) : '',
        reach: existing?.reach ? String(existing.reach) : '',
        impr: existing?.impr ? String(existing.impr) : '',
        results: existing?.results ? String(existing.results) : '',
      };
    });
    setRows(prefilled);
  }, [client, periodToUse]);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }
  }, [toast]);

  const updateRow = (i: number, field: keyof ChannelRow, val: string) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };

  const handleSubmit = async () => {
    if (!selectedClient || !periodToUse) return;
    setLoading(true);
    try {
      // Ensure period exists
      if (useNewPeriod && newPeriod) {
        await supabase.from('periods').upsert({
          period_key: newPeriod,
          label: new Date(newPeriod + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
        });
      }

      // Upsert channel performance rows
      const upsertData = rows.map(r => ({
        client_key: selectedClient,
        channel_key: r.ch,
        period_key: periodToUse,
        revenue: r.rev ? Number(r.rev) : null,
        spend: r.sp ? Number(r.sp) : null,
        orders: r.ord ? Number(r.ord) : null,
        visitors: r.vis ? Number(r.vis) : null,
        reach: r.reach ? Number(r.reach) : null,
        impressions: r.impr ? Number(r.impr) : null,
        results: r.results ? Number(r.results) : null,
      }));

      const { error } = await supabase
        .from('channel_performance')
        .upsert(upsertData, { onConflict: 'client_key,channel_key,period_key' });

      if (error) throw error;
      setToast({ type: 'success', text: `Data ${selectedClient} untuk ${periodToUse} berhasil disimpan!` });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal menyimpan data.' });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = selectedClient && (periodToUse.length === 7) && /^\d{4}-\d{2}$/.test(periodToUse);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-semibold ${
          toast.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-text3 mb-2">
          <span>Admin</span><ChevronRight className="w-3.5 h-3.5" /><span className="text-text font-semibold">Input Data Performa</span>
        </div>
        <h1 className="text-2xl font-bold text-text tracking-tight">Input Data Performa</h1>
        <p className="text-sm text-text3 mt-1">Tambah atau update data iklan bulanan per klien dan channel.</p>
      </div>

      {/* Step 1: Select Client & Period */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm p-6">
        <h2 className="text-base font-semibold text-text mb-5">1. Pilih Klien & Periode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client Select */}
          <div>
            <label className="text-xs font-semibold text-text3 uppercase tracking-wide block mb-2">Klien</label>
            <select
              value={selectedClient}
              onChange={e => { setSelectedClient(e.target.value); setStep(1); }}
              className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all"
            >
              <option value="">— Pilih Klien —</option>
              {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
            </select>
          </div>

          {/* Period Select */}
          <div>
            <label className="text-xs font-semibold text-text3 uppercase tracking-wide block mb-2">Periode</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={useNewPeriod ? '__new__' : selectedPeriod}
                  onChange={e => {
                    if (e.target.value === '__new__') { setUseNewPeriod(true); }
                    else { setUseNewPeriod(false); setSelectedPeriod(e.target.value); }
                  }}
                  className="flex-1 h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all"
                >
                  <option value="">— Pilih Periode —</option>
                  {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                  <option value="__new__">+ Tambah periode baru</option>
                </select>
              </div>
              {useNewPeriod && (
                <input
                  type="month"
                  value={newPeriod}
                  onChange={e => setNewPeriod(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-accent bg-accent/5 text-sm font-semibold text-text focus:outline-none transition-all"
                  placeholder="YYYY-MM"
                />
              )}
            </div>
          </div>
        </div>

        {canProceed && (
          <button
            onClick={() => setStep(2)}
            className="mt-4 flex items-center gap-2 px-5 h-10 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent/90 transition-all"
          >
            Lanjut Isi Data <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Step 2: Channel Data Input */}
      {step === 2 && client && (
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text">2. Input Data Channel</h2>
              <p className="text-xs text-text3 mt-0.5">
                <span className="font-bold text-accent">{selectedClient}</span> · Periode <span className="font-bold text-text">{periodToUse}</span>
                {DATA.some(d => d.c === selectedClient && d.p === periodToUse) && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold">Data sudah ada — update mode</span>
                )}
              </p>
            </div>
            <button
              onClick={() => setRows(client.chs.map(() => EMPTY_ROW()))}
              className="flex items-center gap-1.5 text-xs text-text3 hover:text-text px-3 py-1.5 rounded-lg hover:bg-surface2 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Form
            </button>
          </div>

          <div className="p-5 space-y-4">
            {rows.map((row, i) => {
              const aware = isAware(row.ch);
              const chDef = CH_DEF[row.ch];
              return (
                <div key={row.ch} className="border border-border-main rounded-xl overflow-hidden">
                  {/* Channel Header */}
                  <div className={`flex items-center gap-3 px-4 py-3 ${
                    chDef?.stage === 'tofu' ? 'bg-blue-50' :
                    chDef?.stage === 'mofu' ? 'bg-orange-50' : 'bg-green-50'
                  }`}>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      chDef?.stage === 'tofu' ? 'bg-blue-100 text-blue-700' :
                      chDef?.stage === 'mofu' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {chDef?.stage?.toUpperCase()}
                    </span>
                    <span className="text-sm font-bold text-text">{chDef?.l || row.ch}</span>
                    <span className="text-xs text-text3">{aware ? 'Awareness channel — isi reach & impresi' : 'Revenue channel — isi revenue & orders'}</span>
                  </div>

                  {/* Fields */}
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {/* Spend (semua channel) */}
                    <div>
                      <label className="text-[10px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Ad Spend (Rp)</label>
                      <input
                        type="number"
                        value={row.sp}
                        onChange={e => updateRow(i, 'sp', e.target.value)}
                        placeholder="0"
                        className="w-full h-10 px-3 rounded-lg border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all"
                      />
                    </div>

                    {!aware && <>
                      <div>
                        <label className="text-[10px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Revenue (Rp)</label>
                        <input type="number" value={row.rev} onChange={e => updateRow(i, 'rev', e.target.value)} placeholder="0"
                          className="w-full h-10 px-3 rounded-lg border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Orders</label>
                        <input type="number" value={row.ord} onChange={e => updateRow(i, 'ord', e.target.value)} placeholder="0"
                          className="w-full h-10 px-3 rounded-lg border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                      </div>
                      {chDef?.stage === 'mofu' && (
                        <div>
                          <label className="text-[10px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Visitors</label>
                          <input type="number" value={row.vis} onChange={e => updateRow(i, 'vis', e.target.value)} placeholder="0"
                            className="w-full h-10 px-3 rounded-lg border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                        </div>
                      )}
                    </>}

                    {aware && <>
                      <div>
                        <label className="text-[10px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Reach</label>
                        <input type="number" value={row.reach} onChange={e => updateRow(i, 'reach', e.target.value)} placeholder="0"
                          className="w-full h-10 px-3 rounded-lg border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Impressions</label>
                        <input type="number" value={row.impr} onChange={e => updateRow(i, 'impr', e.target.value)} placeholder="0"
                          className="w-full h-10 px-3 rounded-lg border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-text3 uppercase tracking-wide block mb-1.5">Results</label>
                        <input type="number" value={row.results} onChange={e => updateRow(i, 'results', e.target.value)} placeholder="0"
                          className="w-full h-10 px-3 rounded-lg border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                      </div>
                    </>}

                    {/* ROAS Preview */}
                    {!aware && row.sp && row.rev && (
                      <div className="flex items-center gap-2 col-span-1">
                        <div className="h-10 px-3 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm font-bold flex items-center gap-1.5 w-full justify-center">
                          ROAS: {(Number(row.rev) / Number(row.sp)).toFixed(2)}x
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="px-5 pb-5 flex items-center justify-between gap-4">
            <p className="text-xs text-text3">
              Data yang sudah ada akan di-update (upsert). Kosongkan field yang tidak ada datanya.
            </p>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 h-12 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all disabled:opacity-50 shrink-0"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
