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
    const avgCost = totalRequests > 0 ? totalCost / totalRequests : 0;
    
    return {
      totalCost: totalCost.toFixed(4),
      totalTokens: totalTokens.toLocaleString('id-ID'),
      totalRequests,
      avgCost: avgCost.toFixed(5)
    };
  }, [AI_LOGS]);

  return (
    <div className="w-full space-y-8 animate-fade-in max-w-7xl mx-auto px-6 py-7">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">AI Monitoring</h1>
          <p className="text-sm text-text3 mt-1 font-medium">Monitoring penggunaan token, biaya, dan performa layanan AI.</p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-border-main shadow-sm">
           <div className="w-2 h-2 rounded-full bg-gg animate-pulse" />
           <span className="text-[10px] font-bold text-text2  tracking-wider">Service: Online</span>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-border-main shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-8">
            <div className="w-8 h-8 rounded-full bg-surface3 flex items-center justify-center text-text2 group-hover:bg-accent group-hover:text-white transition-all">
              <Coins className="w-4 h-4" />
            </div>
            <span className="chip chip-gg">Stable</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-text3  tracking-wider mb-1">Total Expenses</div>
            <div className="text-3xl font-bold text-text tabular-nums tracking-tight">${stats.totalCost}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border-main shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-8">
            <div className="w-8 h-8 rounded-full bg-surface3 flex items-center justify-center text-text2 group-hover:bg-accent group-hover:text-white transition-all">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-text3  tracking-wider mb-1">Total Tokens</div>
            <div className="text-3xl font-bold text-text tabular-nums tracking-tight">{stats.totalTokens}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border-main shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-8">
            <div className="w-8 h-8 rounded-full bg-surface3 flex items-center justify-center text-text2 group-hover:bg-accent group-hover:text-white transition-all">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-text3  tracking-wider mb-1">AI Requests</div>
            <div className="text-3xl font-bold text-text tabular-nums tracking-tight">{stats.totalRequests}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border-main shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-8">
            <div className="w-8 h-8 rounded-full bg-surface3 flex items-center justify-center text-text2 group-hover:bg-accent group-hover:text-white transition-all">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-text3  tracking-wider mb-1">Avg Cost/Req</div>
            <div className="text-3xl font-bold text-text tabular-nums tracking-tight">${stats.avgCost}</div>
          </div>
        </div>
      </div>

      {/* ── Logs Table ── */}
      <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-border-main flex items-center justify-between bg-surface2/30">
           <h3 className="text-sm font-bold text-text">Execution Logs</h3>
           <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text4 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search logs..." 
                  className="pl-9 pr-4 h-9 bg-surface2 border border-border-main rounded-xl text-xs font-medium focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-main bg-surface2/50">
                <th className="py-3 px-6 text-[10px] font-black text-text4  tracking-wider">Timestamp</th>
                <th className="py-3 px-6 text-[10px] font-black text-text4  tracking-wider">Client</th>
                <th className="py-3 px-6 text-[10px] font-black text-text4  tracking-wider">Model</th>
                <th className="py-3 px-6 text-[10px] font-black text-text4  tracking-wider">Tokens</th>
                <th className="py-3 px-6 text-[10px] font-black text-text4  tracking-wider">Cost</th>
                <th className="py-3 px-6 text-[10px] font-black text-text4  tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface2">
              {AI_LOGS.length > 0 ? (
                AI_LOGS.map((log) => {
                  const client = CLIENTS.find(cl => cl.key === log.c);
                  return (
                    <tr key={log.id} className="cursor-pointer hover:bg-surface2/70 transition-all duration-150 group">
                      <td className="py-3.5 px-6">
                        <div className="text-xs font-medium text-text tabular-nums">
                           {new Date(log.d).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-lg bg-surface3 flex items-center justify-center text-text2 text-[10px] font-black group-hover:bg-accent group-hover:text-white transition-all">
                              {log.c.slice(0, 2).toUpperCase()}
                           </div>
                           <span className="text-xs font-bold text-text2 truncate max-w-[120px]">{client?.name || log.c}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="chip chip-nn">
                          {log.m}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="text-xs font-bold text-text tabular-nums">{log.tk.toLocaleString('id-ID')}</span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="text-xs font-bold text-gg tabular-nums">${log.cost.toFixed(4)}</span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-text3 transition-all group-hover:translate-x-0.5">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text3 italic text-xs">
                    No execution logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-main bg-surface2/30 flex items-center justify-between">
           <span className="text-[10px] font-black text-text4  tracking-[0.12em]">Showing {AI_LOGS.length} results</span>
           <div className="flex items-center gap-2">
              <button className="px-3 h-8 rounded-full text-xs font-bold bg-surface2 text-text3 opacity-50 cursor-not-allowed">Previous</button>
              <button className="px-3 h-8 rounded-full text-xs font-bold bg-surface2 text-text3 opacity-50 cursor-not-allowed">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
