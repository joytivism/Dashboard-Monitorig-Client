'use client';

import React, { useMemo } from 'react';
import { useDashboardData } from '@/components/DataProvider';
import { Zap, Cpu, Coins, Activity, Search, Calendar, ChevronRight } from 'lucide-react';

export default function AIMonitoringPage() {
  const { AI_LOGS, CLIENTS } = useDashboardData();

  const stats = useMemo(() => {
    const totalCost = AI_LOGS.reduce((acc, log) => acc + (Number(log.cost) || 0), 0);
    const totalTokens = AI_LOGS.reduce((acc, log) => acc + (log.tk || 0), 0);
    const totalRequests = AI_LOGS.length;
    
    // Average cost per request
    const avgCost = totalRequests > 0 ? totalCost / totalRequests : 0;
    
    return {
      totalCost: totalCost.toFixed(4),
      totalTokens: totalTokens.toLocaleString('id-ID'),
      totalRequests,
      avgCost: avgCost.toFixed(5)
    };
  }, [AI_LOGS]);

  return (
    <div className="w-full space-y-8 animate-fade-in max-w-7xl mx-auto px-6 py-10">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text tracking-tighter">AI Monitoring</h1>
          <p className="text-sm text-text3 mt-1.5 font-medium">Monitoring penggunaan token, biaya, dan performa layanan AI.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-surface rounded-xl p-1.5 border border-border-main shadow-sm">
           <div className="px-4 py-2 bg-accent/5 text-accent rounded-lg flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="type-overline !text-accent">Service Status: Online</span>
           </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-2xl p-6 border border-border-main shadow-sm flex flex-col justify-between group hover:border-accent/20 transition-all">
          <div className="flex items-center justify-between mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <span className="badge badge-gg">Stable</span>
          </div>
          <div>
            <div className="type-overline mb-1">Total Expenses</div>
            <div className="text-3xl font-bold text-text tabular-nums">${stats.totalCost}</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border-main shadow-sm flex flex-col justify-between group hover:border-accent/20 transition-all">
          <div className="flex items-center justify-between mb-8">
            <div className="w-10 h-10 rounded-xl bg-tofu-bg text-tofu flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="type-overline mb-1">Total Tokens</div>
            <div className="text-3xl font-bold text-text tabular-nums">{stats.totalTokens}</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border-main shadow-sm flex flex-col justify-between group hover:border-accent/20 transition-all">
          <div className="flex items-center justify-between mb-8">
            <div className="w-10 h-10 rounded-xl bg-gg-bg text-gg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="type-overline mb-1">AI Requests</div>
            <div className="text-3xl font-bold text-text tabular-nums">{stats.totalRequests}</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border-main shadow-sm flex flex-col justify-between group hover:border-accent/20 transition-all">
          <div className="flex items-center justify-between mb-8">
            <div className="w-10 h-10 rounded-xl bg-surface3 text-text2 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="type-overline mb-1">Avg Cost/Req</div>
            <div className="text-3xl font-bold text-text tabular-nums">${stats.avgCost}</div>
          </div>
        </div>
      </div>

      {/* ── Logs Table ── */}
      <div className="bg-surface rounded-2xl border border-border-main shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-border-main flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h3 className="type-overline">Execution Logs</h3>
           <div className="relative group w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text4 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="w-full pl-10 pr-4 py-2 bg-surface2 border border-border-main rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface2/50 border-b border-border-main">
                <th className="px-6 py-3 type-overline">Timestamp</th>
                <th className="px-6 py-3 type-overline">Client</th>
                <th className="px-6 py-3 type-overline">Model</th>
                <th className="px-6 py-3 type-overline">Tokens</th>
                <th className="px-6 py-3 type-overline">Cost</th>
                <th className="px-6 py-3 type-overline text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              {AI_LOGS.length > 0 ? (
                AI_LOGS.map((log) => {
                  const client = CLIENTS.find(cl => cl.key === log.c);
                  return (
                    <tr key={log.id} className="hover:bg-surface2/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                           <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center">
                              <Calendar className="w-3.5 h-3.5 text-text3" />
                           </div>
                           <span className="text-xs font-semibold text-text tabular-nums">
                              {new Date(log.d).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-text2">{client?.name || log.c}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-surface3 rounded-md text-[10px] font-black text-text3 uppercase">
                          {log.m}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-text tabular-nums">{log.tk.toLocaleString('id-ID')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-gg tabular-nums">${log.cost.toFixed(4)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-accent/5 hover:text-accent text-text4 rounded-lg transition-all group-hover:translate-x-0.5">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-text3 italic text-sm">
                    No execution logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-6 py-4 border-t border-border-main bg-surface2/30 flex items-center justify-between">
           <span className="text-[10px] font-bold text-text3 uppercase">Showing {AI_LOGS.length} results</span>
           <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-border-main text-[10px] font-bold text-text4 cursor-not-allowed">Previous</button>
              <button className="px-3 py-1.5 rounded-lg border border-border-main text-[10px] font-bold text-text4 cursor-not-allowed">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
