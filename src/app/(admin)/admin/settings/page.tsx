'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { 
  Save, RefreshCw, AlertCircle, CheckCircle2, Key, Cpu, Settings2, Zap
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { AI_LOGS } = useDashboardData();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [sysSettings, setSysSettings] = useState({ openrouter_key: '', ai_model: 'google/gemini-flash-1.5' });

  // Load Settings
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('system_settings').select('*');
      const mapped = (data || []).reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as any);
      setSysSettings({ 
        openrouter_key: mapped.openrouter_key || '', 
        ai_model: mapped.ai_model || 'google/gemini-flash-1.5' 
      });
    };
    fetchSettings();
  }, []);

  const aiStats = useMemo(() => {
    const totalTokens = AI_LOGS?.reduce((sum, l) => sum + (l.tk || 0), 0) || 0;
    const totalCost = AI_LOGS?.reduce((sum, l) => sum + (l.cost || 0), 0) || 0;
    return { totalTokens, totalCost };
  }, [AI_LOGS]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const payloads = [
        { key: 'openrouter_key', value: sysSettings.openrouter_key },
        { key: 'ai_model', value: sysSettings.ai_model }
      ];
      const { error } = await supabase.from('system_settings').upsert(payloads);
      if (error) throw error;
      setToast({ type: 'success', text: 'System configuration updated successfully!' });
    } catch (err: any) { setToast({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  return (
    <div className="space-y-6 animate-in fade-in">
       {/* Toast */}
       {toast && (
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-6 py-4 rounded-[12px] shadow-main border animate-in slide-in-from-right-full ${toast.type === 'success' ? 'bg-gd-bg border-gd-border text-gd-text' : 'bg-rr-bg border-rr-border text-rr-text'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-[13px] font-bold">{toast.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-8 bg-white rounded-[24px] p-8 shadow-main border border-border-main/50">
            <h2 className="text-base font-bold text-text flex items-center gap-2 mb-2">
              <Settings2 className="w-5 h-5 text-accent" />
              API & AI Configuration
            </h2>
            <p className="text-[12px] font-medium text-text3 mb-8 uppercase tracking-widest">Global connection settings for the command center</p>
            
            <div className="space-y-8">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-extrabold text-text3 uppercase mb-3 ml-1 tracking-widest">
                  <Key className="w-3.5 h-3.5" />
                  OpenRouter API Key
                </label>
                <input 
                  type="password" 
                  value={sysSettings.openrouter_key} 
                  onChange={e => setSysSettings({...sysSettings, openrouter_key: e.target.value})}
                  className="w-full h-12 px-5 rounded-xl border border-border-main bg-surface2 text-sm font-bold focus:bg-white focus:border-accent outline-none transition-all" 
                  placeholder="sk-or-v1-..." 
                />
                <div className="flex items-center gap-2 mt-3 ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <p className="text-[10px] text-text3 font-medium">Kunci ini akan dienkripsi dan disimpan di database.</p>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-extrabold text-text3 uppercase mb-3 ml-1 tracking-widest">
                  <Cpu className="w-3.5 h-3.5" />
                  Primary Analysis Model
                </label>
                <select 
                  value={sysSettings.ai_model} 
                  onChange={e => setSysSettings({...sysSettings, ai_model: e.target.value})}
                  className="w-full h-12 px-5 rounded-xl border border-border-main bg-surface2 text-sm font-bold focus:bg-white focus:border-accent outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="google/gemini-flash-1.5">Google Gemini Flash 1.5 (Fastest)</option>
                  <option value="google/gemini-pro-1.5">Google Gemini Pro 1.5 (Smartest)</option>
                  <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
                  <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                  <option value="nvidia/nemotron-3-super-120b-a12b:free">Nemotron 3 (Free)</option>
                </select>
              </div>

              <div className="pt-8 border-t border-border-main/50 flex justify-end">
                <button onClick={handleSaveSettings} disabled={loading} className="flex items-center gap-3 bg-accent text-white px-10 py-4 rounded-full font-bold text-sm shadow-xl shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Settings
                </button>
              </div>
            </div>
          </div>

          {/* Monitoring Side */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[24px] p-8 shadow-main border border-border-main/50">
              <h3 className="text-sm font-bold text-text mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-gg" />
                AI Health Monitor
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gd-bg/30 border border-gd-border/50">
                  <div className="text-[10px] font-bold text-gd uppercase mb-1">Status</div>
                  <div className="text-sm font-bold text-text">Operational</div>
                </div>
                <div className="p-4 rounded-2xl bg-surface2 border border-border-main">
                  <div className="text-[10px] font-bold text-text3 uppercase mb-1">Total Token Usage</div>
                  <div className="text-sm font-bold text-text">{(aiStats.totalTokens/1000).toFixed(1)}K Tokens</div>
                </div>
                <div className="p-4 rounded-2xl bg-gg-bg/30 border border-gg-border/50">
                  <div className="text-[10px] font-bold text-gg uppercase mb-1">Estimated Cost</div>
                  <div className="text-sm font-bold text-text">${aiStats.totalCost.toFixed(4)}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-8 shadow-main border border-border-main/50">
              <h3 className="text-sm font-bold text-text mb-4">Recent Usage Logs</h3>
              <div className="space-y-3">
                {AI_LOGS?.slice(0, 5).map((l, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-border-main/30 bg-surface2/50 hover:bg-surface2 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[10px] font-black text-accent uppercase tracking-tighter">{l.c}</div>
                      <div className="text-[9px] font-mono text-text3">{new Date(l.d).toLocaleTimeString()}</div>
                    </div>
                    <div className="text-[9px] font-bold text-text2 truncate mb-1">{l.m}</div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-text3">{l.tk} tk</span>
                      <span className="font-bold text-gg">${Number(l.cost).toFixed(5)}</span>
                    </div>
                  </div>
                ))}
                {(!AI_LOGS || AI_LOGS.length === 0) && (
                  <div className="text-center py-6 text-[11px] text-text3 italic">No AI activity found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
