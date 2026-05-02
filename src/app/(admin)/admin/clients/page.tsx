'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Users, Plus, Search, Filter, LayoutGrid, List,
  MoreVertical, Edit2, Trash2, X, CheckCircle2,
  AlertCircle, ChevronRight, Hash, User, Briefcase, Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    name: '',
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

  const openNew = () => {
    setEditKey(null);
    setForm({ client_key: '', name: '', industry: '', pic_name: '', account_strategist: '', brand_category: '', chs: [], troas: {} });
    setShowModal(true);
  };

  const openEdit = (c: any) => {
    setEditKey(c.key);
    setForm({
      client_key: c.key,
      name: c.key,
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
      const clientPayload = {
        client_key: form.client_key,
        name: form.name || form.client_key,
        industry: form.industry,
        pic_name: form.pic_name,
        account_strategist: form.account_strategist,
        brand_category: form.brand_category
      };

      const { error: clientError } = await supabase
        .from('clients')
        .upsert(clientPayload, { onConflict: 'client_key' });

      if (clientError) throw clientError;

      const { error: deleteError } = await supabase
        .from('client_channels')
        .delete()
        .eq('client_key', form.client_key);
      
      if (deleteError) throw deleteError;

      if (form.chs.length > 0) {
        const channelsPayload = form.chs.map(ch => ({
          client_key: form.client_key,
          channel_key: ch,
          target_roas: form.troas[ch] ? Number(form.troas[ch]) : null
        }));

        const { error: chError } = await supabase
          .from('client_channels')
          .insert(channelsPayload);
        
        if (chError) throw chError;
      }
      
      setToast({ type: 'success', text: `Klien ${form.client_key} berhasil disimpan!` });
      setShowModal(false);
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal menyimpan klien.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Hapus klien ${key}?`)) return;
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
    { label: 'Client Key (ID)', key: 'client_key', ph: 'NamaKlien', disabled: !!editKey, required: true, span: true, icon: Hash },
    { label: 'Display Name', key: 'name', ph: 'Contoh: Nama Klien Resmi', required: true, span: true, icon: User },
    { label: 'Industri', key: 'industry', ph: 'Fashion', icon: Briefcase },
    { label: 'PIC', key: 'pic_name', ph: 'PIC', icon: User },
    { label: 'AS', key: 'account_strategist', ph: 'AS', icon: Target },
    { label: 'CG', key: 'brand_category', ph: 'CG', icon: Briefcase },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
        <Toast toast={toast} />

        {/* ── Header Area ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-sm">
                  <Users className="w-5 h-5" />
               </div>
               <h1 className="text-2xl font-bold text-text tracking-tight">Manajemen Klien</h1>
            </div>
            <p className="text-sm font-medium text-text3 max-w-md">Kelola ekosistem klien dan konfigurasi channel.</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex bg-surface2 p-1 rounded-xl border border-border-main">
              <button 
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-accent' : 'text-text3 hover:text-text'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-accent' : 'text-text3 hover:text-text'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-6 h-11 bg-accent text-white rounded-xl font-bold text-sm hover:bg-accent-hover transition-all"
            >
              <Plus className="w-4 h-4" /> TAMBAH KLIEN
            </button>
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative max-w-md">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text4" />
           <input
             type="text"
             placeholder="Cari nama klien..."
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full h-11 pl-11 pr-4 rounded-xl border border-border-main bg-white text-sm font-medium text-text focus:outline-none focus:border-accent transition-all shadow-sm"
           />
        </div>

        {/* ── Clients View ── */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(c => (
              <div key={c.key} className="group bg-white rounded-2xl border border-border-main shadow-sm hover:shadow-md hover:border-border-alt transition-all p-6 flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-sm font-black group-hover:bg-accent group-hover:text-white transition-all duration-200">
                    {c.key.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg hover:bg-surface2 flex items-center justify-center text-text3 transition-colors">
                        <Edit2 className="w-4 h-4" />
                     </button>
                     <button onClick={() => handleDelete(c.key)} className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-text3 transition-colors">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-text truncate group-hover:text-accent transition-colors">{c.key}</h3>
                  <p className="text-xs font-semibold text-text3 uppercase tracking-wider">{c.ind}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <span className="text-[10px] font-bold text-text4 uppercase tracking-wider">AS</span>
                      <p className="text-xs font-bold text-text truncate">{c.as || '—'}</p>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[10px] font-bold text-text4 uppercase tracking-wider">PIC</span>
                      <p className="text-xs font-bold text-text truncate">{c.pic || '—'}</p>
                   </div>
                </div>

                <div className="pt-2 border-t border-border-main flex flex-wrap gap-1.5">
                  {c.chs.map((ch: string) => (
                    <span key={ch} className="px-2 py-0.5 rounded bg-surface2 text-[10px] font-bold text-text3">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-surface2/50 border-b border-border-main">
                      <th className="py-3 px-6 text-[10px] font-black text-text4 uppercase tracking-wider">Klien</th>
                      <th className="py-3 px-6 text-[10px] font-black text-text4 uppercase tracking-wider">Industri</th>
                      <th className="py-3 px-6 text-[10px] font-black text-text4 uppercase tracking-wider">AS / PIC</th>
                      <th className="py-3 px-6 text-[10px] font-black text-text4 uppercase tracking-wider text-right">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                   {filtered.map(c => (
                      <tr key={c.key} className="group hover:bg-surface2 transition-colors">
                         <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-[10px] font-black group-hover:bg-accent group-hover:text-white transition-all">
                                  {c.key.slice(0, 2).toUpperCase()}
                               </div>
                               <span className="text-sm font-bold text-text">{c.key}</span>
                            </div>
                         </td>
                         <td className="py-4 px-6 text-xs font-medium text-text2">{c.ind}</td>
                         <td className="py-4 px-6">
                            <div className="text-xs font-bold text-text">{c.as || '—'}</div>
                            <div className="text-[10px] font-bold text-text4">{c.pic || '—'}</div>
                         </td>
                         <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-text3 transition-colors">
                                  <Edit2 className="w-3.5 h-3.5" />
                               </button>
                               <button onClick={() => handleDelete(c.key)} className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-text3 transition-colors hover:text-red-600">
                                  <Trash2 className="w-3.5 h-3.5" />
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
        <>
          {/* Backdrop - Hitam transparan yang mencakup seluruh layar */}
          <div 
            className="fixed inset-0 bg-black/50 z-[10001]" 
            onClick={() => setShowModal(false)} 
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[10002] flex items-center justify-center p-6 pointer-events-none">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-border-main overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto">
              <div className="flex items-center justify-between p-5 border-b border-border-main bg-surface2/50">
                 <h3 className="text-base font-bold text-text">{editKey ? 'Edit Klien' : 'Tambah Klien'}</h3>
                 <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-surface2 flex items-center justify-center text-text3 transition-colors">
                    <X className="w-4 h-4" />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FORM_FIELDS.map(f => (
                    <div key={f.key} className={f.span ? 'md:col-span-2' : ''}>
                      <label className="text-xs font-semibold text-text3 uppercase tracking-wider block mb-2 px-1">{f.label}</label>
                      <input
                        type="text"
                        value={(form as any)[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.ph}
                        disabled={f.disabled}
                        required={f.required}
                        className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-semibold text-text focus:outline-none focus:border-accent transition-all disabled:opacity-50"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-semibold text-text3 uppercase tracking-wider block px-1">Channels & Targets</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                           className={`h-10 rounded-xl border text-xs font-bold transition-all ${
                             active ? 'bg-accent text-white border-accent' : 'bg-surface2 border-border-main text-text3'
                           }`}
                         >
                           {ch}
                         </button>
                       );
                     })}
                  </div>

                  {form.chs.length > 0 && (
                     <div className="bg-surface2 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {form.chs.map(ch => (
                          <div key={ch} className="space-y-1.5">
                             <label className="text-[10px] font-bold text-text3 uppercase">{ch} Target (x)</label>
                             <input
                               type="number"
                               step="0.1"
                               value={form.troas[ch] || ''}
                               onChange={e => setForm({ ...form, troas: { ...form.troas, [ch]: e.target.value } })}
                               placeholder="5.0"
                               className="w-full h-9 px-3 rounded-lg border border-border-main bg-white text-xs font-bold text-text"
                             />
                          </div>
                        ))}
                     </div>
                  )}
                </div>
              </form>

              <div className="p-6 border-t border-border-main bg-surface2/50 flex gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-11 rounded-xl bg-white border border-border-main text-text2 font-bold text-sm">Batal</button>
                 <button onClick={handleSubmit} disabled={loading} className="flex-1 h-11 rounded-xl bg-text text-white font-bold text-sm hover:bg-accent disabled:opacity-50">Simpan</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
