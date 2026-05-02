'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Settings, Save, Key, MessageSquare, Info, 
  CheckCircle2, AlertCircle, Bot, Sparkles, Terminal,
  Cpu, RotateCcw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Setting {
  key: string;
  value: string;
  description: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [currentModel, setCurrentModel] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('system_settings').select('*');
      if (error) throw error;
      
      if (data) {
        setSettings(data);
        setApiKey(data.find(s => s.key === 'openrouter_key')?.value || '');
        setPrompt(data.find(s => s.key === 'ai_prompt')?.value || '');
        setCurrentModel(data.find(s => s.key === 'ai_model')?.value || 'Not set');
      }
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal memuat pengaturan.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updates = [
        { key: 'openrouter_key', value: apiKey },
        { key: 'ai_prompt', value: prompt },
        { key: 'ai_model', value: currentModel }
      ];

      for (const update of updates) {
        await supabase.from('system_settings').upsert(update, { onConflict: 'key' });
      }

      setToast({ type: 'success', text: 'Pengaturan berhasil diperbarui!' });
      router.refresh();
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Gagal menyimpan pengaturan.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <Settings className="w-10 h-10 text-text4 mb-4" />
        <p className="text-xs font-bold text-text3 uppercase tracking-wider">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Toast Notification */}
      <Toast toast={toast} />

      {/* ── Header Section ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
           <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-sm shrink-0 mt-0.5">
              <Cpu className="w-5 h-5" />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-text tracking-tight leading-tight">Pengaturan Sistem</h1>
              <p className="text-sm font-medium text-text3 mt-0.5">Konfigurasi integrasi AI dan API Key dashboard.</p>
           </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-8 h-11 bg-text text-white rounded-xl font-bold text-sm hover:bg-accent transition-all disabled:opacity-50 min-w-[200px]"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          SIMPAN PERUBAHAN
        </button>
      </div>

      {/* ── Main Configuration ── */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* API Configuration Card */}
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 py-5 border-b border-border-main flex items-center gap-3 bg-surface2/50">
            <Key className="w-4 h-4 text-text3" />
            <h2 className="text-sm font-bold text-text">Konfigurasi API</h2>
          </div>
          <div className="p-8">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text3 uppercase tracking-wider px-1">OpenRouter API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-mono font-bold text-text focus:outline-none focus:border-accent transition-all"
              />
            </div>
          </div>
        </div>

        {/* AI Model Management Card */}
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 py-5 border-b border-border-main flex items-center justify-between bg-surface2/50">
            <div className="flex items-center gap-3">
              <Bot className="w-4 h-4 text-text3" />
              <h2 className="text-sm font-bold text-text">Model AI (LLM)</h2>
            </div>
            <button onClick={() => setCurrentModel('')} className="text-xs font-bold text-text3 hover:text-text">
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          <div className="p-8">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text3 uppercase tracking-wider px-1">Model ID (OpenRouter)</label>
              <input
                type="text"
                value={currentModel}
                onChange={(e) => setCurrentModel(e.target.value)}
                placeholder="google/gemini-pro-1.5..."
                className="w-full h-11 px-4 rounded-xl border border-border-main bg-surface2 text-sm font-mono font-bold text-text focus:outline-none focus:border-accent transition-all"
              />
            </div>
          </div>
        </div>

        {/* AI Prompt Card */}
        <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 py-5 border-b border-border-main flex items-center justify-between bg-surface2/50">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-text3" />
              <h2 className="text-sm font-bold text-text">AI Strategy Prompt</h2>
            </div>
            <Sparkles className="w-4 h-4 text-gd-text" />
          </div>
          <div className="p-8 space-y-6">
            <div className="p-4 rounded-xl bg-surface2 border border-border-main flex flex-wrap gap-2">
              {['{clientName}', '{spend}', '{revenue}', '{roas}', '{growth}', '{status}'].map(tag => (
                <code key={tag} className="text-[10px] bg-white px-2 py-1 rounded border border-border-main text-accent font-bold">
                  {tag}
                </code>
              ))}
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={12}
              className="w-full p-5 rounded-xl border border-border-main bg-surface2 text-sm font-medium leading-relaxed text-text focus:outline-none focus:border-accent transition-all"
              placeholder="Tulis prompt analisis di sini..."
            />
            
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rr-bg/30 border border-rr-border/50">
              <AlertCircle className="w-4 h-4 text-rr-text shrink-0 mt-0.5" />
              <p className="text-xs text-rr-text font-medium leading-relaxed">
                PENTING: Pastikan instruksi format JSON tetap ada di dalam prompt agar analisis AI dapat diproses oleh sistem.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

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
