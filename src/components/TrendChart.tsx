'use client';

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useDashboardData } from './DataProvider';
import { totals, gd, isAware, fV } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendChartProps {
  clientKey: string;
}

const TM = [
  { k: 'revenue', l: 'Revenue', f: 'rp', color: '#10B981', activeClass: 'bg-gg text-white border-gg' },
  { k: 'roas', l: 'ROAS', f: 'x', color: '#F59E0B', activeClass: 'bg-or text-white border-or' },
  { k: 'spend', l: 'Spend', f: 'rp', color: '#F43F5E', activeClass: 'bg-rr text-white border-rr' },
  { k: 'reach', l: 'Reach', f: 'k', color: '#0EA5E9', activeClass: 'bg-gd text-white border-gd' },
];

export default function TrendChart({ clientKey }: TrendChartProps) {
  const { CLIENTS, PERIODS, PL, DATA, CH_DEF } = useDashboardData();
  const [activeMetrics, setActiveMetrics] = useState<string[]>(['spend', 'revenue', 'roas']);

  const toggleMetric = (k: string) => {
    if (activeMetrics.includes(k)) {
      if (activeMetrics.length > 1) {
        setActiveMetrics(activeMetrics.filter(m => m !== k));
      }
    } else {
      if (activeMetrics.length < 3) {
        setActiveMetrics([...activeMetrics, k]);
      }
    }
  };

  const client = CLIENTS.find(x => x.key === clientKey);
  if (!client) return null;

  const datasets = activeMetrics.map(mk => {
    const tm = TM.find(x => x.k === mk)!;
    const data = PERIODS.map(p => {
      let v = 0;
      if (mk === 'roas') {
        const t = totals(CH_DEF, CLIENTS, DATA, clientKey, p); v = t.roas || 0;
      } else if (mk === 'reach') {
        client.chs.filter(ch => isAware(CH_DEF, ch)).forEach(ch => { const d = gd(DATA, clientKey, ch, p); if (d?.reach) v += d.reach; });
      } else {
        client.chs.forEach(ch => {
          const d = gd(DATA, clientKey, ch, p); if (!d) return;
          // @ts-ignore
          if (mk === 'spend') { if (d.sp) v += d.sp; }
          // @ts-ignore
          else if (!isAware(CH_DEF, ch) && d[mk]) v += d[mk];
        });
      }
      return Math.round(v * 100) / 100;
    });

    return {
      label: tm.l,
      data,
      borderColor: tm.color,
      backgroundColor: tm.color,
      borderWidth: 2.5,
      tension: 0.4,
      pointBackgroundColor: tm.color,
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      yAxisID: mk === 'roas' || mk === 'reach' ? `y-${mk}` : 'y-rp',
      format: tm.f
    };
  });

  const chartData: ChartData<'line'> = {
    labels: PERIODS.map(p => PL[p]),
    datasets,
  };

  // Setup multiple Y axes
  const scales: any = {
    x: {
      grid: { display: false, drawBorder: false },
      ticks: { color: '#9CA3AF', font: { size: 12, family: 'Inter', weight: 'medium' } }
    }
  };

  if (activeMetrics.includes('revenue') || activeMetrics.includes('spend')) {
    scales['y-rp'] = {
      type: 'linear',
      position: 'left',
      grid: { color: '#F3F4F6', drawBorder: false },
      border: { display: false },
      ticks: { 
        color: '#9CA3AF', 
        font: { size: 11, family: 'Inter' },
        callback: function(value: any) {
          return value >= 1e9 ? (Number(value) / 1e9) + 'B' : value >= 1e6 ? (Number(value) / 1e6) + 'M' : value;
        }
      }
    };
  }
  
  if (activeMetrics.includes('roas')) {
    scales['y-roas'] = {
      type: 'linear',
      position: activeMetrics.includes('revenue') || activeMetrics.includes('spend') ? 'right' : 'left',
      grid: { display: false, drawBorder: false },
      border: { display: false },
      ticks: { 
        color: '#e50000', 
        font: { size: 11, family: 'Inter' },
        callback: function(value: any) { return value + 'x'; }
      }
    };
  }

  if (activeMetrics.includes('reach')) {
    scales['y-reach'] = {
      type: 'linear',
      position: 'right',
      grid: { display: false, drawBorder: false },
      border: { display: false },
      ticks: { 
        color: '#9CA3AF', 
        font: { size: 11, family: 'Inter' },
        callback: function(value: any) { return (Number(value) / 1000) + 'k'; }
      }
    };
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#fff',
        bodyColor: 'rgba(255,255,255,.9)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter', size: 13, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 13 },
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (ctx) => {
            const format = (ctx.dataset as any).format;
            return ` ${ctx.dataset.label}: ${fV(ctx.raw as number, format)}`;
          }
        }
      }
    },
    scales
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text flex items-center gap-2">
          Tren Periode 
          <span className="text-text3 font-medium">· pilih maks. 3 metrik</span>
        </h3>
        <div className="text-xs font-semibold text-text3">
          {activeMetrics.length}/3 aktif
        </div>
      </div>

      {/* Pill Selectors */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {TM.map(m => {
          const isActive = activeMetrics.includes(m.k);
          const isDisabled = !isActive && activeMetrics.length >= 3;
          return (
            <button
              key={m.k}
              onClick={() => toggleMetric(m.k)}
              disabled={isDisabled}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border
                ${isActive 
                  ? m.activeClass 
                  : isDisabled 
                    ? 'border-border-main text-text3/50 bg-surface3 cursor-not-allowed' 
                    : 'border-border-alt text-text2 bg-white hover:bg-surface2 hover:border-border-main'}
              `}
            >
              {!isActive && <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: m.color }}></div>}
              {m.l}
            </button>
          );
        })}
      </div>

      {/* Custom Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-6 px-1">
        {activeMetrics.map(mk => {
          const tm = TM.find(x => x.k === mk)!;
          return (
            <div key={mk} className="flex items-center gap-2">
              <div className="w-4 h-0.5" style={{ backgroundColor: tm.color }}></div>
              <span className="text-[11px] font-bold text-text2 uppercase tracking-wider">{tm.l}</span>
            </div>
          );
        })}
      </div>
      
      {/* Chart Area */}
      <div className="flex-1 relative min-h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
