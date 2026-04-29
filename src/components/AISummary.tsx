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

export default function AISummary({ clientName, metrics }: AISummaryProps) {
  const [data, setData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateAISummary(clientName, metrics);
      const parsed: AIResponse = JSON.parse(result);
      setData(parsed);
    } catch (err) {
      setError("Gagal memuat insight AI.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [clientName]);

  const statusConfig = {
    positive: {
      icon: TrendingUp,
      label: 'Performa Naik',
      badgeClass: 'bg-gg-bg text-gg',
      barClass: 'bg-gg',
    },
    negative: {
      icon: TrendingDown,
      label: 'Perlu Perhatian',
      badgeClass: 'bg-rr-bg text-rr',
      barClass: 'bg-rr',
    },
    neutral: {
      icon: Minus,
      label: 'Stabil',
      badgeClass: 'bg-surface2 text-text2',
      barClass: 'bg-text3',
    },
    warning: {
      icon: AlertCircle,
      label: 'Perhatian',
      badgeClass: 'bg-mofu-bg text-mofu',
      barClass: 'bg-mofu',
    },
  };

  const config = data ? statusConfig[data.status] || statusConfig.neutral : statusConfig.neutral;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-[24px] shadow-main overflow-hidden mb-8">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">AI Strategy Insights</h3>
              <p className="text-[11px] text-text3 font-medium">Powered by NVIDIA Nemotron</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data && !loading && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${config.badgeClass}`}>
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </span>
            )}
            <button 
              onClick={fetchSummary}
              disabled={loading}
              className="p-2 hover:bg-surface2 rounded-xl transition-all duration-200 disabled:opacity-50"
              title="Refresh AI Insights"
            >
              <RefreshCw className={`w-4 h-4 text-text3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            <div className="space-y-2.5">
              <div className="h-4 bg-surface2 rounded-lg w-full animate-pulse"></div>
              <div className="h-4 bg-surface2 rounded-lg w-[85%] animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <div className="h-16 bg-surface2 rounded-2xl animate-pulse"></div>
              <div className="h-16 bg-surface2 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rr-bg/50 text-rr text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        ) : data ? (
          <div className="space-y-5">
            {/* Summary */}
            <p className="text-[14px] leading-[1.85] text-text/85 font-medium">
              {data.summary}
            </p>

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.actions.map((action, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-4 rounded-2xl bg-surface2/60 border border-border-main hover:bg-surface2 transition-colors duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-text3 uppercase tracking-widest mb-1">
                      Tindakan {i + 1}
                    </div>
                    <p className="text-[13px] text-text font-medium leading-snug">
                      {action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
