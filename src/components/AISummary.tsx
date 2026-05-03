'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { generateAISummary } from '@/app/actions/ai';

interface AISummaryProps {
  clientName: string;
  metrics: {
    reach: string;
    spend: string;
    revenue: string;
    roas: string;
    cvr: string;
    chk: string;
    growth: number;
  };
}

interface AIResponse {
  status: 'positive' | 'negative' | 'neutral' | 'warning';
  summary: string;
  actions: string[];
}

// Simple in-memory cache to prevent re-fetching when navigating
const aiCache: Record<string, { data: AIResponse, timestamp: number }> = {};

export default function AISummary({ clientName, metrics }: AISummaryProps) {
  const [data, setData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unique key for this specific client and metrics combination
  const cacheKey = `${clientName}-${metrics.roas}-${metrics.revenue}-${metrics.growth}`;

  const fetchSummary = async (force = false) => {
    // 1. Cek Memory Cache
    if (!force && aiCache[cacheKey]) {
      setData(aiCache[cacheKey].data);
      return;
    }

    // 2. Cek Session Storage (Persistent on Refresh)
    if (!force) {
      const stored = sessionStorage.getItem(`ai_cache_${cacheKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
        aiCache[cacheKey] = { data: parsed, timestamp: Date.now() };
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateAISummary(clientName, metrics);
      const parsed: AIResponse = JSON.parse(result);
      
      // Save to Memory & Session Storage
      aiCache[cacheKey] = { data: parsed, timestamp: Date.now() };
      sessionStorage.setItem(`ai_cache_${cacheKey}`, JSON.stringify(parsed));
      
      setData(parsed);
    } catch (err) {
      setError("Gagal memuat insight AI.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Hanya auto-fetch jika SUDAH ada di cache (memory atau session)
    const stored = sessionStorage.getItem(`ai_cache_${cacheKey}`);
    if (aiCache[cacheKey] || stored) {
      fetchSummary();
    } else {
      setData(null); // Reset jika ganti klien dan belum dianalisa
    }
  }, [clientName, cacheKey]);

  const statusConfig = {
    positive: { icon: TrendingUp, label: 'Performa Naik', badgeClass: 'bg-gg-bg text-gg' },
    negative: { icon: TrendingDown, label: 'Perlu Perhatian', badgeClass: 'bg-rr-bg text-rr' },
    neutral: { icon: Minus, label: 'Stabil', badgeClass: 'bg-surface2 text-text2' },
    warning: { icon: AlertCircle, label: 'Perhatian', badgeClass: 'bg-mofu-bg text-mofu' },
  };

  const config = data ? statusConfig[data.status] || statusConfig.neutral : statusConfig.neutral;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden mb-8 group/card transition-all duration-300 hover:shadow-md relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
      
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <Sparkles className="w-6 h-6 fill-white/20 relative z-10" />
            </div>
            <div>
              <h3 className="text-h4">AI Strategy Insights</h3>
              <p className="text-micro !text-text4">Powered by Advanced Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {data && !loading && (
              <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold ${config.badgeClass} border border-current/10 shadow-sm animate-fade-in`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {config.label}
              </span>
            )}
            {data && (
              <button 
                onClick={() => fetchSummary(true)} 
                disabled={loading}
                className="w-10 h-10 flex items-center justify-center hover:bg-surface2 rounded-xl transition-all duration-200 disabled:opacity-50 text-text3 border border-transparent hover:border-border-main"
                title="Re-analyze Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-4 bg-surface2 rounded-full w-full animate-pulse"></div>
              <div className="h-4 bg-surface2 rounded-full w-[80%] animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-20 bg-surface2 rounded-2xl animate-pulse"></div>
              <div className="h-20 bg-surface2 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-rr-bg/30 text-rr text-sm font-bold border border-rr-border/40">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
            <button onClick={() => fetchSummary(true)} className="ml-auto bg-rr text-white px-4 py-1.5 rounded-lg text-xs hover:bg-rr/90 transition-colors">Coba Lagi</button>
          </div>
        ) : data ? (
          <div className="space-y-8 animate-fade-in">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-accent/10 rounded-full"></div>
              <p className="text-lg leading-relaxed text-text font-semibold px-2">
                {data.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-surface2/40 border border-border-main/60 hover:bg-white hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <Zap className="w-4 h-4 text-accent group-hover:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="text-micro mb-1.5 opacity-80">
                      Action Recommendation
                    </div>
                    <p className="text-body font-bold !text-text leading-snug">
                      {action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center text-center animate-fade-in">
            <div className="w-24 h-24 bg-surface2 rounded-3xl flex items-center justify-center mb-8 relative group cursor-pointer" onClick={() => fetchSummary()}>
              <div className="absolute inset-0 bg-accent/10 rounded-3xl group-hover:scale-110 transition-transform duration-500"></div>
              <Sparkles className="w-10 h-10 text-accent relative z-10 group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-white rounded-lg flex items-center justify-center shadow-lg animate-bounce">
                <Zap className="w-3 h-3 fill-current" />
              </div>
            </div>
             <h4 className="text-h4 mb-2">Buka Wawasan Strategis</h4>
            <p className="text-body max-w-[320px] mb-10">
              Analisis cerdas berdasarkan performa periode ini. Dapatkan ringkasan otomatis dan rekomendasi tindakan.
            </p>
            <button 
              onClick={() => fetchSummary()}
              className="flex items-center gap-3 bg-text hover:bg-accent text-white px-10 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-text/10 hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Zap className="w-4 h-4 fill-current" />
              Mulai Analisis AI
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
