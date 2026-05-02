'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF } from '@/lib/data';
import { isAware } from '@/lib/utils';
import {
  CheckCircle2, AlertCircle, ChevronRight, Save,
  RotateCcw, TrendingUp, Database, ArrowRight, Info,
  LayoutGrid, CalendarClock, Building2, Layers
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type ChannelRow = {
  ch: string;
  rev: string; sp: string; ord: string; vis: string;
  reach: string; impr: string; results: string;
};

const EMPTY_ROW = (): ChannelRow => ({ ch: '', rev: '', sp: '', ord: '', vis: '', reach: '', impr: '', results: '' });

const STAGE_STYLE: Record<string, { header: string; badge: string; label: string }> = {
  tofu: { header: 'bg-gd-bg/10 border-gd-border/20', badge: 'badge badge-gd', label: 'text-gd-text' },
  mofu: { header: 'bg-or-bg/10 border-or-border/20',   badge: 'badge badge-or',  label: 'text-or-text' },
  bofu: { header: 'bg-gg-bg/10 border-gg-border/20',     badge: 'badge badge-gg',    label: 'text-gg-text'  },
};

function Toast({ toast }: { toast: { type: 'success' | 'error'; text: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-semibold animate-fade-in ${
      toast.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-600'
    }`}>
      {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      {toast.text}
    </div>
  );
}

export default function DataInputPage() {
  const { CLIENTS, PERIODS, DATA } = useDashboardData();
  const router = useRouter();

  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [newPeriod, setNewPeriod] = useState('');
  const [useNewPeriod, setUseNewPeriod] = useState(false);
  const [rows, setRows] = useState<ChannelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const client = CLIENTS.find(c => c.key === selectedClient);
  const periodToUse = useNewPeriod ? newPeriod : selectedPeriod;
  const canProceed = selectedClient && periodToUse.length === 7 && /^\d{4}-\d{2}$/.test(periodToUse);
  const isUpdateMode = DATA.some(d => d.c === selectedClient && d.p === periodToUse);

  useEffect(() => {
    if (!client) { setRows([]); return; }
    const prefilled = client.chs.map(ch => {
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
      if (useNewPeriod && newPeriod) {
        await supabase.from('periods').upsert({
          period_key: newPeriod,
          label: new Date(newPeriod + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        });
      }
      const upsertData = rows.map(r => ({
        client_key: selectedClient, channel_key: r.ch, period_key: periodToUse,
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
      setToast({ type: 'success', text: `Data ${selectedClient} · ${periodToUse} berhasil disimpan!` });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal menyimpan data.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <Toast toast={toast} />

      {/* ── Header Area ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
           <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-sm shrink-0 mt-0.5">
              <Database className="w-5 h-5" />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-text tracking-tight leading-tight">Input Data Performa</h1>
              <p className="text-sm font-medium text-text3 mt-0.5">Masukkan data metrik iklan harian atau bulanan ke database utama.</p>
           </div>
        </div>
      </div>

      {/* ── Step 1: Configuration ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-6 py-5 border-b border-border-main flex items-center justify-between bg-surface2/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center text-xs font-bold">1</div>
             <h2 className="text-sm font-bold text-text">Pilih Klien & Periode</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text3 uppercase tracking-wider px-1">Pilih Klien</label>
              <div className="relative">
                 <select
                    value={selectedClient}
                    onChange={e => setSelectedClient(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text appearance-none focus:outline-none focus:border-accent transition-all"
                 >
                    <option value="">— Klik untuk memilih klien —</option>
                    {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
                 </select>
                 <ChevronRight className="w-4 h-4 text-text4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* Period Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text3 uppercase tracking-wider px-1">Periode Laporan</label>
              <div className="space-y-3">
                <div className="relative">
                   <select
                      value={useNewPeriod ? '__new__' : selectedPeriod}
                      onChange={e => {
                        if (e.target.value === '__new__') { setUseNewPeriod(true); }
                        else { setUseNewPeriod(false); setSelectedPeriod(e.target.value); }
                      }}
                      className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text appearance-none focus:outline-none focus:border-accent transition-all"
                   >
                      <option value="">— Pilih Bulan —</option>
                      {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                      <option value="__new__">+ Tambah Periode Baru...</option>
                   </select>
                   <ChevronRight className="w-4 h-4 text-text4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>
                {useNewPeriod && (
                  <input
                    type="month"
                    value={newPeriod}
                    onChange={e => setNewPeriod(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-accent bg-accent-light text-sm font-bold text-accent focus:outline-none transition-all animate-fade-in"
                  />
                )}
              </div>
            </div>
          </div>

          {canProceed && (
            <div className="mt-8 pt-6 border-t border-border-main flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                {isUpdateMode ? (
                  <span className="badge badge-gg">Data Ditemukan</span>
                ) : (
                  <span className="badge badge-or">Data Baru</span>
                )}
                <p className="text-sm font-medium text-text2">
                   {selectedClient} · {periodToUse}
                </p>
              </div>
              <button
                onClick={() => document.getElementById('step2')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 h-11 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-hover transition-all"
              >
                Lanjutkan <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Step 2: Channel Inputs ── */}
      {canProceed && client && rows.length > 0 && (
        <div id="step2" className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-5 border-b border-border-main flex items-center justify-between bg-surface2/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center text-xs font-bold">2</div>
              <h2 className="text-sm font-bold text-text">Input Data per Channel</h2>
            </div>
            <button
              onClick={() => setRows(client.chs.map(() => EMPTY_ROW()))}
              className="text-xs font-bold text-text3 hover:text-text transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="p-8 space-y-6">
            {rows.map((row, i) => {
              const aware = isAware(row.ch);
              const chDef = CH_DEF[row.ch];
              const stage = chDef?.stage || 'bofu';
              const s = STAGE_STYLE[stage] || STAGE_STYLE.bofu;
              const roasVal = !aware && row.sp && row.rev ? Number(row.rev) / Number(row.sp) : null;
              const targetRoas = client?.troas?.[row.ch] || null;
              const roasOk = roasVal && targetRoas ? roasVal >= Number(targetRoas) : null;

              return (
                <div key={row.ch} className="border border-border-main rounded-2xl overflow-hidden bg-white shadow-sm hover:border-border-alt transition-colors">
                  {/* Channel Header */}
                  <div className={`flex items-center gap-4 px-6 py-4 border-b ${s.header}`}>
                    <span className={s.badge}>{stage}</span>
                    <h3 className="text-sm font-bold text-text">{chDef?.l || row.ch}</h3>
                    <div className="ml-auto hidden sm:block">
                       <span className="text-[10px] font-bold text-text3 uppercase tracking-wider">
                        {aware ? 'Awareness' : 'Performance'}
                      </span>
                    </div>
                  </div>

                  {/* Input Fields Grid */}
                  <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 bg-surface2/30">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Ad Spend (Rp)</label>
                      <input type="number" value={row.sp} onChange={e => updateRow(i, 'sp', e.target.value)} placeholder="0" className="w-full h-10 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                    </div>

                    {!aware ? (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Revenue (Rp)</label>
                          <input type="number" value={row.rev} onChange={e => updateRow(i, 'rev', e.target.value)} placeholder="0" className="w-full h-10 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Orders</label>
                          <input type="number" value={row.ord} onChange={e => updateRow(i, 'ord', e.target.value)} placeholder="0" className="w-full h-10 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Results/Visits</label>
                           <input type="number" value={row.vis} onChange={e => updateRow(i, 'vis', e.target.value)} placeholder="0" className="w-full h-10 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Reach</label>
                          <input type="number" value={row.reach} onChange={e => updateRow(i, 'reach', e.target.value)} placeholder="0" className="w-full h-10 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Impressions</label>
                          <input type="number" value={row.impr} onChange={e => updateRow(i, 'impr', e.target.value)} placeholder="0" className="w-full h-10 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-text3 uppercase tracking-wider block px-1">Results</label>
                          <input type="number" value={row.results} onChange={e => updateRow(i, 'results', e.target.value)} placeholder="0" className="w-full h-10 px-4 rounded-xl border border-border-main bg-white text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Action Bar */}
          <div className="px-8 py-6 border-t border-border-main bg-surface2/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-3 max-w-lg">
              <div className="w-6 h-6 rounded-full bg-white border border-border-main flex items-center justify-center shrink-0">
                 <Info className="w-3.5 h-3.5 text-text3" />
              </div>
              <p className="text-xs text-text3 font-medium leading-relaxed">
                Sistem akan memperbarui data jika kombinasi klien, channel, dan periode sudah ada.
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-10 h-11 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all disabled:opacity-50 min-w-[240px]"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              SIMPAN SEMUA DATA
            </button>
          </div>
        </div>
      )}

      {/* ── Empty Initial State ── */}
      {!canProceed && (
        <div className="bg-white rounded-2xl border border-dashed border-border-alt p-20 text-center animate-fade-in shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-surface2 flex items-center justify-center mx-auto mb-6">
            <LayoutGrid className="w-8 h-8 text-text4" />
          </div>
          <h3 className="text-base font-bold text-text mb-2">Klien & Periode Belum Ditentukan</h3>
          <p className="text-sm text-text3 max-w-sm mx-auto font-medium">Pilih klien dan tentukan periode bulan di bagian atas untuk membuka form input data.</p>
        </div>
      )}
    </div>
  );
}
