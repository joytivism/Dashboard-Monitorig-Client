'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Minus, RefreshCw, Sparkles, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { generateAISummary } from '@/app/actions/ai';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import { cn } from '@/lib/utils';

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

const aiCache: Record<string, { data: AIResponse; timestamp: number }> = {};

const statusConfig = {
  positive: { icon: TrendingUp, label: 'Performa naik', tone: 'success' as const },
  negative: { icon: TrendingDown, label: 'Perlu perhatian', tone: 'danger' as const },
  neutral: { icon: Minus, label: 'Stabil', tone: 'neutral' as const },
  warning: { icon: AlertCircle, label: 'Perhatian', tone: 'warning' as const },
};

export default function AISummary({ clientName, metrics }: AISummaryProps) {
  const [data, setData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `${clientName}-${metrics.roas}-${metrics.revenue}-${metrics.growth}`;

  const fetchSummary = useCallback(async (force = false) => {
    if (!force && aiCache[cacheKey]) {
      setData(aiCache[cacheKey].data);
      return;
    }

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
      aiCache[cacheKey] = { data: parsed, timestamp: Date.now() };
      sessionStorage.setItem(`ai_cache_${cacheKey}`, JSON.stringify(parsed));
      setData(parsed);
    } catch {
      setError('Gagal memuat insight AI.');
    } finally {
      setLoading(false);
    }
  }, [cacheKey, clientName, metrics]);

  useEffect(() => {
    let cancelled = false;

    async function syncSummary() {
      const stored = sessionStorage.getItem(`ai_cache_${cacheKey}`);
      if (aiCache[cacheKey] || stored) {
        await fetchSummary();
      } else if (!cancelled) {
        setData(null);
      }
    }

    void syncSummary();

    return () => {
      cancelled = true;
    };
  }, [cacheKey, fetchSummary]);

  const config = data ? statusConfig[data.status] || statusConfig.neutral : statusConfig.neutral;
  const StatusIcon = config.icon;

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border-main bg-white shadow-sm">
      <div className="border-b border-border-main px-6 py-5 bg-panel-muted/30">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent animate-pulse-soft" />
              <h3 className="text-[15px] font-bold text-text-primary uppercase tracking-wider">AI Strategy Insights</h3>
            </div>
            <p className="text-[13px] font-medium text-text-tertiary">Real-time performance synthesis and action recommendations.</p>
          </div>
          <div className="flex items-center gap-2">
            {data && !loading ? (
              <Badge tone={config.tone} style="soft" className="px-2 py-0.5 text-[10px] font-bold uppercase">
                {config.label}
              </Badge>
            ) : null}
            {data ? (
              <button
                onClick={() => fetchSummary(true)}
                disabled={loading}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-main bg-white text-text-tertiary hover:text-text-primary transition-colors disabled:opacity-50"
                title="Re-analyze data"
              >
                <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <LoadingState
            title="Analyzing performance data..."
            description="Our AI is processing metrics and synthesizing strategic insights for your account."
            className="py-10"
          />
        ) : error ? (
          <ErrorState
            title="Analysis failed"
            description={error}
            action={(
              <Button variant="danger" size="sm" onClick={() => fetchSummary(true)}>
                Retry Analysis
              </Button>
            )}
            className="py-6"
          />
        ) : data ? (
          <div className="space-y-8 animate-fade-in">
            <div className="rounded-xl border border-border-main bg-panel-muted/50 p-6 shadow-inner">
              <div className="text-[10px] font-bold text-text-quaternary uppercase tracking-[0.2em] mb-3">Executive Summary</div>
              <p className="text-[15px] font-medium leading-relaxed text-text-secondary">{data.summary}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {data.actions.map((action, index) => (
                <div key={index} className="group relative rounded-xl border border-border-main bg-white p-6 transition-all hover:border-accent/40 hover:shadow-md">
                  <div className="absolute top-4 right-4 text-accent/20 group-hover:text-accent/40 transition-colors">
                    <Zap className="h-5 w-5 fill-current" />
                  </div>
                  <div className="text-[10px] font-bold text-text-quaternary uppercase tracking-wider mb-4">Recommended Action</div>
                  <p className="text-[14px] font-bold leading-relaxed text-text-primary group-hover:text-accent transition-colors">{action}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-border-main bg-white p-12 text-center animate-fade-in">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
              <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-accent blur-3xl" />
              <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-success blur-3xl" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-danger blur-3xl" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-panel-muted border border-border-main shadow-sm">
                <Sparkles className="h-7 w-7 text-accent" />
              </div>
              <div className="space-y-2">
                <h4 className="text-[20px] font-bold tracking-tight text-text-primary">Unlock AI-powered insights</h4>
                <p className="mx-auto max-w-md text-[14px] font-medium text-text-tertiary">Get an automated summary of performance trends and a prioritized list of strategic actions for {clientName}.</p>
              </div>
              <button
                onClick={() => fetchSummary()}
                className="inline-flex items-center gap-2 rounded-lg bg-text px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-accent hover:shadow-lg active:scale-95"
              >
                <Zap className="h-4 w-4 fill-white" />
                Analyze Performance
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
