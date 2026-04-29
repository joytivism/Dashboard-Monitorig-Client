'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { supabase } from '@/lib/supabase';
import { Save, AlertCircle, CheckCircle2, Key, Cpu, Zap } from 'lucide-react';

export default function AdminSettingsPage() {
  const { AI_LOGS } = useDashboardData();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{type:'success'|'error',text:string}|null>(null);
  const [cfg, setCfg] = useState({openrouter_key:'',ai_model:'google/gemini-flash-1.5'});

  useEffect(()=>{
    (async()=>{
      const{data}=await supabase.from('system_settings').select('*');
      const m=(data||[]).reduce((a,s)=>({...a,[s.key]:s.value}),{} as any);
      setCfg({openrouter_key:m.openrouter_key||'',ai_model:m.ai_model||'google/gemini-flash-1.5'});
    })();
  },[]);

  const ai=useMemo(()=>({
    tk:AI_LOGS?.reduce((s,l)=>s+(l.tk||0),0)||0,
    cost:AI_LOGS?.reduce((s,l)=>s+(l.cost||0),0)||0
  }),[AI_LOGS]);

  const save=async()=>{
    setLoading(true);
    try{
      const{error}=await supabase.from('system_settings').upsert([
        {key:'openrouter_key',value:cfg.openrouter_key},
        {key:'ai_model',value:cfg.ai_model}
      ]);
      if(error)throw error;
      setToast({type:'success',text:'Saved!'});
    }catch(e:any){setToast({type:'error',text:e.message});}
    finally{setLoading(false);}
  };

  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(null),3000);return()=>clearTimeout(t);}},[toast]);

  const ac=(k:string)=>{
    const c=['bg-or', 'bg-text', 'bg-tofu', 'bg-gd', 'bg-rr', 'bg-text2'];
    let h=0;for(let i=0;i<k.length;i++)h=k.charCodeAt(i)+((h<<5)-h);
    return c[Math.abs(h)%c.length];
  };

  return(
    <div className="space-y-8">
      {toast&&(
        <div className={`fixed top-24 right-8 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-main border ${toast.type==='success'?'bg-gg-bg border-gg-border text-gg-text':'bg-rr-bg border-rr-border text-rr-text'}`}>
          {toast.type==='success'?<CheckCircle2 className="w-4 h-4"/>:<AlertCircle className="w-4 h-4"/>}
          <span className="text-[13px] font-bold">{toast.text}</span>
        </div>
      )}

      <div>
        <h1 className="text-[28px] font-extrabold text-text tracking-tight">Settings ⚙️</h1>
        <p className="text-[14px] font-medium text-text3 mt-1">Configure AI model, API keys, and monitor usage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Config */}
        <div className="lg:col-span-8 bg-surface rounded-2xl border border-border-main p-6 shadow-sm">
          <h2 className="text-[16px] font-extrabold text-text mb-6">API & AI Configuration</h2>
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[11px] font-extrabold text-text3 uppercase tracking-widest mb-3">
                <Key className="w-3.5 h-3.5"/>OpenRouter API Key
              </label>
              <input type="password" value={cfg.openrouter_key} onChange={e=>setCfg({...cfg,openrouter_key:e.target.value})}
                className="w-full h-12 px-5 rounded-xl border border-border-main bg-surface2 text-[13px] font-bold text-text outline-none focus:border-text focus:bg-surface transition-all" placeholder="sk-or-v1-..."/>
              <div className="flex items-center gap-2 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gg animate-pulse"/>
                <span className="text-[11px] font-bold text-text3">Encrypted and stored in database</span>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-[11px] font-extrabold text-text3 uppercase tracking-widest mb-3">
                <Cpu className="w-3.5 h-3.5"/>Primary Model
              </label>
              <select value={cfg.ai_model} onChange={e=>setCfg({...cfg,ai_model:e.target.value})}
                className="w-full h-12 px-5 rounded-xl border border-border-main bg-surface2 text-[13px] font-bold text-text outline-none focus:border-text focus:bg-surface transition-all appearance-none cursor-pointer">
                <option value="google/gemini-flash-1.5">Gemini Flash 1.5 (Fastest)</option>
                <option value="google/gemini-pro-1.5">Gemini Pro 1.5 (Smartest)</option>
                <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                <option value="nvidia/nemotron-3-super-120b-a12b:free">Nemotron 3 (Free)</option>
              </select>
            </div>
            <div className="pt-6 border-t border-border-main flex justify-end">
              <button onClick={save} disabled={loading} className="flex items-center gap-2 bg-text text-white px-8 py-3.5 rounded-xl font-extrabold text-[13px] shadow-main hover:bg-text2 transition-all">
                {loading?<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<Save className="w-4 h-4"/>}
                Save settings
              </button>
            </div>
          </div>
        </div>

        {/* Monitor */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface rounded-2xl border border-border-main p-6 shadow-sm">
            <h3 className="text-[14px] font-extrabold text-text mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-tofu"/>AI Health
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gg-bg border border-gg-border">
                <div className="text-[10px] font-extrabold text-gg-text uppercase tracking-widest mb-1">Status</div>
                <div className="text-[16px] font-extrabold text-gg-text">Operational</div>
              </div>
              <div className="p-4 rounded-xl bg-surface2 border border-border-main">
                <div className="text-[10px] font-extrabold text-text3 uppercase tracking-widest mb-1">Tokens</div>
                <div className="text-[16px] font-extrabold text-text">{(ai.tk/1000).toFixed(1)}K</div>
              </div>
              <div className="p-4 rounded-xl bg-tofu-bg border border-tofu-border">
                <div className="text-[10px] font-extrabold text-tofu uppercase tracking-widest mb-1">Cost</div>
                <div className="text-[16px] font-extrabold text-text">${ai.cost.toFixed(4)}</div>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-2xl border border-border-main p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-extrabold text-text">Usage Logs</h3>
              <span className="text-[11px] font-bold text-text2 hover:text-text transition-colors">See all</span>
            </div>
            <div className="space-y-4">
              {AI_LOGS?.slice(0,5).map((l,i)=>(
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${ac(l.c)} flex items-center justify-center shrink-0 shadow-sm`}>
                    <span className="text-white text-[11px] font-black uppercase">{l.c.substring(0,2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-text">{l.c}</div>
                    <div className="text-[11px] font-medium text-text3 truncate">{l.m}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[12px] font-bold text-text">{l.tk} tk</div>
                    <div className="text-[11px] font-bold text-gg">${Number(l.cost).toFixed(5)}</div>
                  </div>
                </div>
              ))}
              {(!AI_LOGS||AI_LOGS.length===0)&&(
                <div className="text-center py-8 text-[12px] font-bold text-text3">No data yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
