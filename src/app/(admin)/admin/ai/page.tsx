'use client';

import React, { useMemo } from 'react';
import { Activity, ChevronRight, Coins, Cpu, Search, Zap } from 'lucide-react';
import { useDashboardData } from '@/components/DataProvider';
import PageIntro from '@/components/layout/PageIntro';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import InputField from '@/components/ui/InputField';
import MetricCard from '@/components/ui/MetricCard';
import TableShell from '@/components/ui/TableShell';

export default function AIMonitoringPage() {
  const { AI_LOGS, CLIENTS } = useDashboardData();

  const stats = useMemo(() => {
    const totalCost = AI_LOGS.reduce((accumulator, log) => accumulator + (Number(log.cost) || 0), 0);
    const totalTokens = AI_LOGS.reduce((accumulator, log) => accumulator + (log.tk || 0), 0);
    const totalRequests = AI_LOGS.length;
    const avgCost = totalRequests > 0 ? totalCost / totalRequests : 0;

    return {
      totalCost: totalCost.toFixed(4),
      totalTokens: totalTokens.toLocaleString('id-ID'),
      totalRequests,
      avgCost: avgCost.toFixed(5),
    };
  }, [AI_LOGS]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 pb-20 animate-fade-in">
      <PageIntro
        eyebrow="Admin Console"
        title="AI Monitoring"
        description="Monitoring penggunaan token, biaya, dan performa layanan AI dalam satu dashboard yang lebih rapi dan mudah dipindai."
        meta={(
          <>
            <Badge tone="success" style="soft">Service online</Badge>
            <Badge tone="neutral" style="soft">{AI_LOGS.length} execution logs</Badge>
            <Badge tone="accent" style="soft">{CLIENTS.length} client sources</Badge>
          </>
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Expenses" value={`$${stats.totalCost}`} icon={Coins} caption="Akumulasi biaya seluruh request" tone="accent" />
        <MetricCard title="Total Tokens" value={stats.totalTokens} icon={Cpu} caption="Total token yang sudah dipakai" />
        <MetricCard title="AI Requests" value={stats.totalRequests} icon={Zap} caption="Jumlah request yang tercatat" />
        <MetricCard title="Avg Cost / Req" value={`$${stats.avgCost}`} icon={Activity} caption="Rata-rata biaya per request" tone="success" />
      </div>

      <TableShell
        eyebrow="Execution logs"
        title="Recent AI activity"
        description="Daftar request AI terbaru untuk meninjau model, token, biaya, dan client source yang terlibat."
        action={<div className="w-full max-w-xs"><InputField placeholder="Search logs..." icon={Search} /></div>}
        bodyClassName="overflow-x-auto"
        footer={(
          <>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text3">
              Showing {AI_LOGS.length} results
            </span>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-border-main bg-white px-3 py-1.5 text-xs font-semibold text-text4 opacity-60" disabled>
                Previous
              </button>
              <button className="rounded-full border border-border-main bg-white px-3 py-1.5 text-xs font-semibold text-text4 opacity-60" disabled>
                Next
              </button>
            </div>
          </>
        )}
        footerClassName="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-border-main bg-surface2/60">
                <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text3">Timestamp</th>
                <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text3">Client</th>
                <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text3">Model</th>
                <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text3">Tokens</th>
                <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text3">Cost</th>
                <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-text3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/60">
              {AI_LOGS.length > 0 ? (
                AI_LOGS.map((log) => {
                  const client = CLIENTS.find((item) => item.key === log.c);
                  return (
                    <tr key={log.id} className="group transition-colors hover:bg-surface2/45">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-text tabular-nums">
                          {new Date(log.d).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-border-main bg-surface2 text-[10px] font-semibold text-text2">
                            {log.c.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="max-w-[180px] truncate text-sm font-semibold text-text">{client?.name || log.c}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge tone="neutral" style="soft">
                          {log.m}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-text tabular-nums">
                        {log.tk.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gd-text tabular-nums">
                        ${log.cost.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="btn-icon ml-auto h-9 w-9 group-hover:border-border-alt group-hover:text-text">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <EmptyState
                      title="No execution logs found"
                      description="Belum ada aktivitas AI yang tercatat untuk ditampilkan pada tabel ini."
                      className="mx-auto max-w-md"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </TableShell>
    </div>
  );
}
