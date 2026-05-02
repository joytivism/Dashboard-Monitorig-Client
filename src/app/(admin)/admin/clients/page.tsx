'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Users, Plus, Search, Filter, LayoutGrid, List,
  MoreVertical, Edit2, Trash2, X, CheckCircle2,
  AlertCircle, ChevronRight, Target, Globe, Phone,
  User, Briefcase, Hash, Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function Toast({ toast }: { toast: { type: 'success' | 'error'; text: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-[76px] right-6 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-bold animate-fade-in ${
      toast.type === 'success' ? 'bg-white border-gg-border text-gg-text' : 'bg-white border-rr-border text-rr-text'
    }`}>
      {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      {toast.text}
    </div>
  );
}

export default function ClientsAdminPage() {
  const { CLIENTS } = useDashboardData();
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [search, setSearch] = useState('');
  
  const [form, setForm] = useState({
    client_key: '',
    industry: '',
    pic_name: '',
    account_strategist: '',
    brand_category: '',
    chs: [] as string[],
    troas: {} as Record<string, string>
  });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filtered = CLIENTS.filter(c => 
    c.key.toLowerCase().includes(search.toLowerCase()) || 
    c.ind.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: CLIENTS.length,
    industries: new Set(CLIENTS.map(c => c.ind)).size,
    totalChannels: CLIENTS.reduce((acc, c) => acc + c.chs.length, 0),
    activeThisMonth: CLIENTS.length // simplified
  };

  const openNew = () => {
    setEditKey(null);
    setForm({ client_key: '', industry: '', pic_name: '', account_strategist: '', brand_category: '', chs: [], troas: {} });
    setShowModal(true);
  };

  const openEdit = (c: any) => {
    setEditKey(c.key);
    setForm({
      client_key: c.key,
      industry: c.ind,
      pic_name: c.pic,
      account_strategist: c.as,
      brand_category: c.cg,
      chs: [...c.chs],
      troas: { ...c.troas }
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        client_key: form.client_key,
        industry: form.industry,
        pic_name: form.pic_name,
        account_strategist: form.account_strategist,
        brand_category: form.brand_category,
        channels: form.chs,
        target_roas: form.troas
      };

      const { error } = await supabase
        .from('clients')
        .upsert(payload, { onConflict: 'client_key' });

      if (error) throw error;
      
      setToast({ type: 'success', text: `Klien ${form.client_key} berhasil ${editKey ? 'diperbarui' : 'ditambahkan'}!` });
      setShowModal(false);
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal menyimpan klien.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Hapus klien ${key}? Seluruh data performa terkait juga akan hilang.`)) return;
    try {
      const { error } = await supabase.from('clients').delete().eq('client_key', key);
      if (error) throw error;
      setToast({ type: 'success', text: 'Klien berhasil dihapus.' });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal menghapus.' });
    }
  };

  const CHANNELS = ['FB', 'IG', 'TikTok', 'Google', 'Shopee', 'Tokopedia', 'Lazada', 'Website'];

  const FORM_FIELDS = [
    { label: 'Client Key', key: 'client_key', ph: 'NamaKlien', disabled: !!editKey, required: true, span: true, icon: Hash },
    { label: 'Industri', key: 'industry', ph: 'Contoh: Fashion / Kecantikan', icon: Briefcase },
    { label: 'PIC', key: 'pic_name', ph: 'Contoh: Joy', icon: User },
    { label: 'Account Strategist', key: 'account_strategist', ph: 'Contoh: Fahmi', icon: Target },
    { label: 'Brand Category (CG)', key: 'brand_category', ph: 'Contoh: Dica / Bara', icon: Briefcase },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
        <Toast toast={toast} />

        {/* ── Top Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Users className="w-6 h-6" />
               </div>
               <h1 className="text-2xl font-bold text-text tracking-tight uppercase tracking-widest">Manajemen Klien</h1>
            </div>
            <p className="text-sm text-text3 max-w-md font-medium">Kelola ekosistem klien, konfigurasi channel, dan parameter target performa.</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex bg-surface2 p-1.5 rounded-2xl border border-border-main shadow-inner">
              <button 
                onClick={() => setView('grid')}
                className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-white shadow-md text-accent' : 'text-text4 hover:text-text2'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-white shadow-md text-accent' : 'text-text4 hover:text-text2'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-2.5 px-8 h-12 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent/90 transition-all shadow-xl shadow-accent/20"
            >
              <Plus className="w-5 h-5" /> TAMBAH KLIEN
            </button>
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Klien', value: stats.total, icon: Users, color: 'text-accent', bg: 'bg-accent/5' },
            { label: 'Industri Unik', value: stats.industries, icon: Globe, color: 'text-gd-text', bg: 'bg-gd-bg/30' },
            { label: 'Channel Aktif', value: stats.totalChannels, icon: Target, color: 'text-or-text', bg: 'bg-or-bg/30' },
            { label: 'Updated Period', value: stats.activeThisMonth, icon: CheckCircle2, color: 'text-gg-text', bg: 'bg-gg-bg/30' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-border-main shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-text tracking-tight">{s.value}</div>
                <div className="text-[10px] font-black text-text4 uppercase tracking-widest">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search Bar ── */}
        <div className="relative group max-w-md">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4 group-focus-within:text-accent transition-colors" />
           <input
             type="text"
             placeholder="Cari nama klien atau industri..."
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-main bg-white text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all shadow-sm"
           />
        </div>

        {/* ── Clients Grid ── */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(c => (
              <div key={c.key} className="group bg-white rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative">
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg bg-white shadow-md border border-border-main flex items-center justify-center text-text2 hover:text-accent transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                   </button>
                   <button onClick={() => handleDelete(c.key)} className="w-8 h-8 rounded-lg bg-white shadow-md border border-border-main flex items-center justify-center text-text2 hover:text-rr-text transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                   </button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-base font-black shrink-0 shadow-inner group-hover:bg-accent group-hover:text-white transition-all duration-300">
                      {c.key.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-text truncate group-hover:text-accent transition-colors">{c.key}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-black text-text4 uppercase tracking-widest mt-0.5">
                         <span className="truncate">{c.ind}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <div className="text-[9px] font-black text-text4 uppercase tracking-widest">Account Strategist</div>
                        <div className="text-xs font-bold text-text2 truncate">{c.as || '—'}</div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-[9px] font-black text-text4 uppercase tracking-widest">PIC Brand</div>
                        <div className="text-xs font-bold text-text2 truncate">{c.pic || '—'}</div>
                     </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-[9px] font-black text-text4 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Target className="w-3 h-3" /> Channel Aktif ({c.chs.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.chs.map((ch: string) => (
                        <span key={ch} className="px-2 py-1 rounded-md bg-surface2 border border-border-main text-[10px] font-bold text-text3">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto p-4 bg-surface1/30 border-t border-border-main flex items-center justify-between">
                   <div className="text-[10px] font-black text-text4 uppercase tracking-widest">Target ROAS</div>
                   <div className="flex gap-2">
                      {Object.entries(c.troas || {}).slice(0, 2).map(([ch, val]) => (
                        <span key={ch} className="text-[10px] font-black text-accent bg-accent/5 px-2 py-0.5 rounded border border-accent/10">
                           {ch}: {val}x
                        </span>
                      ))}
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-border-main shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-surface2/50 border-b border-border-main">
                      <th className="py-4 px-8 text-[10px] font-black text-text4 uppercase tracking-widest">Klien</th>
                      <th className="py-4 px-6 text-[10px] font-black text-text4 uppercase tracking-widest">Industri</th>
                      <th className="py-4 px-6 text-[10px] font-black text-text4 uppercase tracking-widest">AS / PIC</th>
                      <th className="py-4 px-6 text-[10px] font-black text-text4 uppercase tracking-widest">Channels</th>
                      <th className="py-4 px-8 text-[10px] font-black text-text4 uppercase tracking-widest text-right">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border-main/30">
                   {filtered.map(c => (
                      <tr key={c.key} className="group hover:bg-surface1 transition-colors">
                         <td className="py-5 px-8">
                            <div className="flex items-center gap-4">
                               <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-[10px] font-black shrink-0">
                                  {c.key.slice(0, 2).toUpperCase()}
                               </div>
                               <span className="text-sm font-bold text-text">{c.key}</span>
                            </div>
                         </td>
                         <td className="py-5 px-6">
                            <span className="text-xs font-semibold text-text2">{c.ind}</span>
                         </td>
                         <td className="py-5 px-6">
                            <div className="text-xs font-semibold text-text2">{c.as || '—'}</div>
                            <div className="text-[10px] font-bold text-text4 mt-0.5">{c.pic || '—'}</div>
                         </td>
                         <td className="py-5 px-6">
                            <div className="flex gap-1.5 overflow-x-auto no-scrollbar max-w-[200px]">
                               {c.chs.map((ch: string) => (
                                  <span key={ch} className="px-2 py-0.5 rounded-md bg-surface2 border border-border-main text-[9px] font-bold text-text3 shrink-0">
                                     {ch}
                                  </span>
                               ))}
                            </div>
                         </td>
                         <td className="py-5 px-8 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-text4 hover:text-accent transition-all">
                                  <Edit2 className="w-4 h-4" />
                               </button>
                               <button onClick={() => handleDelete(c.key)} className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-text4 hover:text-rr-text transition-all">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* ── Modal Form ── */}
      {showModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-border-main overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border-main bg-surface1/30 shrink-0">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                     {editKey ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <h3 className="text-base font-bold text-text tracking-tight uppercase tracking-wider">{editKey ? 'Edit Data Klien' : 'Tambah Klien Baru'}</h3>
               </div>
               <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-xl hover:bg-surface2 flex items-center justify-center text-text3 transition-all">
                  <X className="w-5 h-5" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
              {/* Basic Info Grid */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                   <div className="w-6 h-6 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                   </div>
                   <h4 className="text-xs font-black text-text uppercase tracking-widest">Informasi Utama</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FORM_FIELDS.map(f => (
                    <div key={f.key} className={f.span ? 'md:col-span-2' : ''}>
                      <label className="text-[11px] font-bold text-text3 uppercase tracking-[0.1em] block mb-2 px-1">{f.label}</label>
                      <div className="relative">
                         <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4" />
                         <input
                           type="text"
                           value={(form as any)[f.key]}
                           onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                           placeholder={f.ph}
                           disabled={f.disabled}
                           required={f.required}
                           className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all disabled:opacity-50"
                         />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channels & ROAS Selection */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                   <div className="w-6 h-6 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                      <Target className="w-3.5 h-3.5" />
                   </div>
                   <h4 className="text-xs font-black text-text uppercase tracking-widest">Konfigurasi Channel & Target</h4>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {CHANNELS.map(ch => {
                     const active = form.chs.includes(ch);
                     return (
                       <button
                         key={ch}
                         type="button"
                         onClick={() => {
                           const nextChs = active ? form.chs.filter(c => c !== ch) : [...form.chs, ch];
                           setForm({ ...form, chs: nextChs });
                         }}
                         className={`h-11 rounded-xl border text-xs font-bold transition-all flex items-center justify-center px-4 ${
                           active ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'bg-surface2 border-border-main text-text3 hover:bg-gray-100'
                         }`}
                       >
                         {ch}
                       </button>
                     );
                   })}
                </div>

                {/* Target ROAS Inputs */}
                {form.chs.length > 0 && (
                   <div className="bg-surface2 rounded-2xl border border-border-main p-6 space-y-4 animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                         <Info className="w-4 h-4 text-accent" />
                         <span className="text-[10px] font-bold text-text2 uppercase tracking-widest">Tentukan Target ROAS per Channel</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                         {form.chs.map(ch => (
                           <div key={ch} className="space-y-1.5">
                              <label className="text-[10px] font-bold text-text3 uppercase">{ch} Target (x)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={form.troas[ch] || ''}
                                onChange={e => setForm({ ...form, troas: { ...form.troas, [ch]: e.target.value } })}
                                placeholder="E.g. 5.0"
                                className="w-full h-10 px-3 rounded-lg border border-border-main bg-white text-xs font-bold text-text focus:outline-none focus:border-accent"
                              />
                           </div>
                         ))}
                      </div>
                   </div>
                )}
              </div>
            </form>

            <div className="p-8 border-t border-border-main bg-surface1/30 shrink-0 flex gap-4">
               <button
                 type="button"
                 onClick={() => setShowModal(false)}
                 className="flex-1 h-12 rounded-xl bg-white border border-border-main text-text2 font-bold text-sm hover:bg-gray-50 transition-all"
               >
                 Batal
               </button>
               <button
                 onClick={handleSubmit}
                 disabled={loading}
                 className="flex-[2] h-12 rounded-xl bg-text text-white font-bold text-sm hover:bg-accent transition-all shadow-lg shadow-text/10 disabled:opacity-50 flex items-center justify-center gap-2"
               >
                 {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                 SIMPAN DATA KLIEN
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
