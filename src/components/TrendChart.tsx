'use client';

import React, { useState } from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  type ChartData,
  type ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useDashboardData } from './DataProvider';
import { fV, gd, isAware, totals } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TrendChartProps {
  clientKey: string;
}

const METRICS = [
  {
    k: 'revenue',
    l: 'Revenue',
    f: 'rp',
    color: '#ff6301',
    activeClass: 'border-accent bg-accent-light text-accent',
  },
  {
    k: 'roas',
    l: 'ROAS',
    f: 'x',
    color: '#000000',
    activeClass: 'border-text bg-text text-white',
  },
  {
    k: 'spend',
    l: 'Spend',
    f: 'rp',
    color: '#676762',
    activeClass: 'border-border-alt bg-surface2 text-text',
  },
  {
    k: 'reach',
    l: 'Reach',
    f: 'k',
    color: '#00a1a6',
    activeClass: 'border-gd-border bg-gd-bg text-gd-text',
  },
] as const;

export default function TrendChart({ clientKey }: TrendChartProps) {
  const { CLIENTS, PERIODS, PL, DATA, CH_DEF } = useDashboardData();
  const [activeMetrics, setActiveMetrics] = useState<Array<(typeof METRICS)[number]['k']>>(['spend', 'revenue', 'roas']);

  const toggleMetric = (key: (typeof METRICS)[number]['k']) => {
    setActiveMetrics((current) => {
      if (current.includes(key)) {
        return current.length > 1 ? current.filter((item) => item !== key) : current;
      }

      return current.length < 3 ? [...current, key] : current;
    });
  };

  const client = CLIENTS.find((item) => item.key === clientKey);
  if (!client) return null;

  const datasets = activeMetrics.map((metricKey) => {
    const metric = METRICS.find((item) => item.k === metricKey)!;
    const data = PERIODS.map((period) => {
      let value = 0;

      if (metricKey === 'roas') {
        const totalsForPeriod = totals(CH_DEF, CLIENTS, DATA, clientKey, period);
        value = totalsForPeriod.roas || 0;
      } else if (metricKey === 'reach') {
        client.chs
          .filter((channel) => isAware(CH_DEF, channel))
          .forEach((channel) => {
            const entry = gd(DATA, clientKey, channel, period);
            if (entry?.reach) value += entry.reach;
          });
      } else {
        client.chs.forEach((channel) => {
          const entry = gd(DATA, clientKey, channel, period);
          if (!entry) return;

          if (metricKey === 'spend') {
            if (entry.sp) value += entry.sp;
          } else if (metricKey === 'revenue' && !isAware(CH_DEF, channel) && entry.rev) {
            value += entry.rev;
          }
        });
      }

      return Math.round(value * 100) / 100;
    });

    return {
      label: metric.l,
      data,
      borderColor: metric.color,
      backgroundColor: metric.color,
      borderWidth: 2.25,
      tension: 0.34,
      pointBackgroundColor: metric.color,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 1.5,
      pointRadius: 4,
      pointHoverRadius: 6,
      yAxisID: metricKey === 'roas' || metricKey === 'reach' ? `y-${metricKey}` : 'y-rp',
      format: metric.f,
    };
  });

  const chartData: ChartData<'line'> = {
    labels: PERIODS.map((period) => PL[period]),
    datasets,
  };

  const scales: NonNullable<ChartOptions<'line'>['scales']> = {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: '#676762',
        font: { size: 11, family: 'Inter, sans-serif', weight: 500 },
      },
    },
  };

  if (activeMetrics.includes('revenue') || activeMetrics.includes('spend')) {
    scales['y-rp'] = {
      type: 'linear',
      position: 'left',
      grid: { color: '#efefec' },
      border: { display: false },
      ticks: {
        color: '#676762',
        font: { size: 11, family: 'Inter, sans-serif' },
        callback(value: number | string) {
          return Number(value) >= 1e9
            ? `${Number(value) / 1e9}B`
            : Number(value) >= 1e6
              ? `${Number(value) / 1e6}M`
              : value;
        },
      },
    };
  }

  if (activeMetrics.includes('roas')) {
    scales['y-roas'] = {
      type: 'linear',
      position: activeMetrics.includes('revenue') || activeMetrics.includes('spend') ? 'right' : 'left',
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: '#000000',
        font: { size: 11, family: 'Inter, sans-serif' },
        callback(value: number | string) {
          return `${value}x`;
        },
      },
    };
  }

  if (activeMetrics.includes('reach')) {
    scales['y-reach'] = {
      type: 'linear',
      position: 'right',
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: '#00a1a6',
        font: { size: 11, family: 'Inter, sans-serif' },
        callback(value: number | string) {
          return `${Number(value) / 1000}k`;
        },
      },
    };
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111111',
        titleColor: '#ffffff',
        bodyColor: 'rgba(255,255,255,0.92)',
        padding: 12,
        cornerRadius: 10,
        titleFont: { family: 'Inter, sans-serif', size: 12, weight: 600 },
        bodyFont: { family: 'Inter, sans-serif', size: 12 },
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const format = (context.dataset as (typeof datasets)[number]).format;
            return ` ${context.dataset.label}: ${fV(context.raw as number, format)}`;
          },
        },
      },
    },
    scales,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-sm font-semibold text-text">Tren periode</div>
          <div className="text-xs text-text3">Pilih maksimum 3 metrik untuk dibandingkan pada grafik.</div>
        </div>
        <div className="inline-flex w-fit items-center rounded-full border border-border-main bg-surface2 px-3 py-1 text-[11px] font-semibold text-text3">
          {activeMetrics.length}/3 aktif
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {METRICS.map((metric) => {
          const isActive = activeMetrics.includes(metric.k);
          const isDisabled = !isActive && activeMetrics.length >= 3;

          return (
            <button
              key={metric.k}
              onClick={() => toggleMetric(metric.k)}
              disabled={isDisabled}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                isActive
                  ? metric.activeClass
                  : isDisabled
                    ? 'cursor-not-allowed border-border-main bg-surface3 text-text4'
                    : 'border-border-main bg-white text-text2 hover:border-border-alt hover:bg-surface2'
              }`}
            >
              {!isActive ? <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: metric.color }} /> : null}
              {metric.l}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {activeMetrics.map((metricKey) => {
          const metric = METRICS.find((item) => item.k === metricKey)!;
          return (
            <div key={metricKey} className="flex items-center gap-2">
              <span className="h-[2px] w-5 rounded-full" style={{ backgroundColor: metric.color }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">{metric.l}</span>
            </div>
          );
        })}
      </div>

      <div className="rounded-[var(--radius-md)] border border-border-main bg-surface2/20 p-4">
        <div className="relative min-h-[320px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
