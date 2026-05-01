'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { CH_DEF } from '@/lib/data';
import { isAware } from '@/lib/utils';
import {
  CheckCircle2, AlertCircle, ChevronRight, Save,
  RotateCcw, TrendingUp, Database, ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type ChannelRow = {
  ch: string;
  rev: string; sp: string; ord: string; vis: string;
  reach: string; impr: string; results: string;
};

const EMPTY_ROW = (): ChannelRow => ({ ch: '', rev: '', sp: '', ord: '', vis: '', reach: '', impr: '', results: '' });

const STAGE_STYLE: Record<string, { header: string; badge: string; label: string }> = {
  tofu: { header: 'bg-tofu-bg border-tofu-border', badge: 'bg-tofu-bg text-tofu border border-tofu-border', label: 'text-tofu' },
  mofu: { header: 'bg-or-bg border-mofu-border',   badge: 'bg-or-bg text-or-text border border-mofu-border',  label: 'text-or-text' },
  bofu: { header: 'bg-gg-bg border-gg-border',     badge: 'bg-gg-bg text-gg-text border border-gg-border',    label: 'text-gg-text'  },
};

function Toast({ toast }: { toast: { type: 'success' | 'error'; text: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-[76px] right-6 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-semibold animate-fade-in ${
      toast.type === 'success' ? 'bg-white border-gg-border text-gg-text' : 'bg-white border-rr-border text-rr-text'
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

  const INPUT_CLS = 'w-full h-10 px-3 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all';

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      <Toast toast={toast} />


      {/* ── Step 1: Client & Period ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
        {/* Step label */}
        <div className="px-6 py-4 border-b border-border-main flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-black shrink-0">1</div>
          <div>
            <div className="text-sm font-bold text-text">Pilih Klien & Periode</div>
            <div className="text-xs text-text3">Tentukan klien dan bulan periode data yang akan diinput.</div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Client */}
            <div>
              <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-2">Klien</label>
              <select
                value={selectedClient}
                onChange={e => setSelectedClient(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
              >
                <option value="">— Pilih Klien —</option>
                {CLIENTS.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
              </select>
              {client && (
                <div className="mt-2 flex items-center gap-2 text-xs text-text3">
                  <div className="w-5 h-5 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-[9px] font-black">
                    {client.key.slice(0, 2).toUpperCase()}
                  </div>
                  {client.chs.length} channel · {client.ind}
                </div>
              )}
            </div>

            {/* Period */}
            <div>
              <label className="text-[11px] font-bold text-text3 uppercase tracking-wide block mb-2">Periode</label>
              <div className="space-y-2">
                <select
                  value={useNewPeriod ? '__new__' : selectedPeriod}
                  onChange={e => {
                    if (e.target.value === '__new__') { setUseNewPeriod(true); }
                    else { setUseNewPeriod(false); setSelectedPeriod(e.target.value); }
                  }}
                  className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                >
                  <option value="">— Pilih Periode —</option>
                  {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                  <option value="__new__">+ Tambah periode baru...</option>
                </select>
                {useNewPeriod && (
                  <input
                    type="month"
                    value={newPeriod}
                    onChange={e => setNewPeriod(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-accent bg-accent/5 text-sm font-semibold text-text focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Status & CTA */}
          {canProceed && (
            <div className="mt-5 flex items-center justify-between gap-4 pt-4 border-t border-border-main">
              <div className="flex items-center gap-2">
                {isUpdateMode ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-gd-bg text-gd-text border border-gd-border">
                    <CheckCircle2 className="w-3 h-3" /> Data ada — mode update
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-surface3 text-text3 border border-border-main">
                    <Database className="w-3 h-3" /> Data baru
                  </span>
                )}
                <span className="text-xs text-text3">
                  <span className="font-bold text-text">{selectedClient}</span> · <span className="font-bold text-text">{periodToUse}</span>
                </span>
              </div>
              <button
                onClick={() => document.getElementById('step2')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-5 h-10 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-hover transition-all shadow-sm"
              >
                Isi Data Channel <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Step 2: Channel Inputs ── */}
      {canProceed && client && rows.length > 0 && (
        <div id="step2" className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
          {/* Step label */}
          <div className="px-6 py-4 border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-black shrink-0">2</div>
              <div>
                <div className="text-sm font-bold text-text">Input Data per Channel</div>
                <div className="text-xs text-text3">
                  <span className="font-semibold text-accent">{selectedClient}</span>
                  {' · '}
                  <span className="font-semibold text-text">{periodToUse}</span>
                  {' · '}
                  {rows.length} channel
                </div>
              </div>
            </div>
            <button
              onClick={() => setRows(client.chs.map(() => EMPTY_ROW()))}
              className="flex items-center gap-1.5 text-xs font-semibold text-text3 hover:text-rr-text px-3 py-2 rounded-xl hover:bg-rr-bg transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="p-5 space-y-4">
            {rows.map((row, i) => {
              const aware = isAware(row.ch);
              const chDef = CH_DEF[row.ch];
              const stage = chDef?.stage || 'bofu';
              const s = STAGE_STYLE[stage] || STAGE_STYLE.bofu;
              const roasVal = !aware && row.sp && row.rev ? Number(row.rev) / Number(row.sp) : null;
              const targetRoas = client?.troas?.[row.ch] || null;
              const roasOk = roasVal && targetRoas ? roasVal >= Number(targetRoas) : null;

              return (
                <div key={row.ch} className="border border-border-main rounded-2xl overflow-hidden">
                  {/* Channel header */}
                  <div className={`flex items-center gap-3 px-5 py-3 border-b ${s.header}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${s.badge}`}>
                      {stage.toUpperCase()}
                    </span>
                    <span className="text-sm font-bold text-text">{chDef?.l || row.ch}</span>
                    <span className="text-xs text-text3 ml-auto">
                      {aware ? 'Isi reach & impresi' : 'Isi revenue & orders'}
                    </span>
                  </div>

                  {/* Fields grid */}
                  <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {/* Spend — always */}
                    <div>
                      <label className="text-[10px] font-bold text-text4 uppercase tracking-wider block mb-1.5">Ad Spend (Rp)</label>
                      <input type="number" value={row.sp} onChange={e => updateRow(i, 'sp', e.target.value)} placeholder="0" className={INPUT_CLS} />
                    </div>

                    {/* Revenue channel fields */}
                    {!aware && <>
                      <div>
                        <label className="text-[10px] font-bold text-text4 uppercase tracking-wider block mb-1.5">Revenue (Rp)</label>
                        <input type="number" value={row.rev} onChange={e => updateRow(i, 'rev', e.target.value)} placeholder="0" className={INPUT_CLS} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-text4 uppercase tracking-wider block mb-1.5">Orders</label>
                        <input type="number" value={row.ord} onChange={e => updateRow(i, 'ord', e.target.value)} placeholder="0" className={INPUT_CLS} />
                      </div>
                      {chDef?.stage === 'mofu' && (
                        <div>
                          <label className="text-[10px] font-bold text-text4 uppercase tracking-wider block mb-1.5">Visitors</label>
                          <input type="number" value={row.vis} onChange={e => updateRow(i, 'vis', e.target.value)} placeholder="0" className={INPUT_CLS} />
                        </div>
                      )}
                    </>}

                    {/* Awareness channel fields */}
                    {aware && <>
                      <div>
                        <label className="text-[10px] font-bold text-text4 uppercase tracking-wider block mb-1.5">Reach</label>
                        <input type="number" value={row.reach} onChange={e => updateRow(i, 'reach', e.target.value)} placeholder="0" className={INPUT_CLS} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-text4 uppercase tracking-wider block mb-1.5">Impressions</label>
                        <input type="number" value={row.impr} onChange={e => updateRow(i, 'impr', e.target.value)} placeholder="0" className={INPUT_CLS} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-text4 uppercase tracking-wider block mb-1.5">Results</label>
                        <input type="number" value={row.results} onChange={e => updateRow(i, 'results', e.target.value)} placeholder="0" className={INPUT_CLS} />
                      </div>
                    </>}

                    {/* Live ROAS preview */}
                    {!aware && roasVal !== null && (
                      <div className="flex items-end">
                        <div className={`h-10 px-3 rounded-xl border text-sm font-bold flex items-center gap-2 w-full justify-center ${
                          roasOk === true  ? 'bg-gg-bg border-gg-border text-gg-text' :
                          roasOk === false ? 'bg-rr-bg border-rr-border text-rr-text' :
                          'bg-accent/10 border-accent/20 text-accent'
                        }`}>
                          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                          {roasVal.toFixed(2)}x
                          {targetRoas && (
                            <span className="text-[10px] opacity-70">/ {targetRoas}x</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit bar */}
          <div className="px-6 py-4 border-t border-border-main bg-surface2/40 flex items-center justify-between gap-4">
            <p className="text-xs text-text3 max-w-sm">
              Data yang sudah ada akan di-<strong>update</strong> (upsert). Kosongkan field yang tidak ada datanya.
            </p>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 h-11 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all disabled:opacity-50 shrink-0 shadow-sm"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />
              }
              Simpan Data
            </button>
          </div>
        </div>
      )}

      {/* Empty state if no client/period yet */}
      {!canProceed && (
        <div className="bg-white rounded-2xl border border-dashed border-border-alt p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-surface3 flex items-center justify-center mx-auto mb-4">
            <Database className="w-6 h-6 text-text4" />
          </div>
          <div className="text-sm font-semibold text-text3 mb-1">Pilih klien dan periode terlebih dahulu</div>
          <div className="text-xs text-text4">Form input data channel akan muncul di sini.</div>
        </div>
      )}
    </div>
  );
}
