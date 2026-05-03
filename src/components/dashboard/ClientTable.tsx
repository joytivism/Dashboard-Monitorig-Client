import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useDashboardData } from '@/components/DataProvider';
import { STATUS_DOT, LM, type Client, type DataEntry } from '@/lib/data';
import { totals, clientWorst, fRp } from '@/lib/utils';

interface ClientTableProps {
  clients: Client[];
  data: DataEntry[];
  periods: string[];
  currentPeriod: string;
  onClientClick: (clientKey: string) => void;
  search: string;
  setSearch: (v: string) => void;
  filters: {
    cg: string;
    ind: string;
    pic: string;
  };
  setFilter: (key: string, v: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' };
  onSort: (key: string) => void;
  metadata: {
    industries: string[];
    pics: string[];
    channelGroups: string[];
  };
}

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  data,
  periods,
  currentPeriod,
  onClientClick,
  search,
  setSearch,
  filters,
  setFilter,
  sortConfig,
  onSort,
  metadata
}) => {
  const { CH_DEF } = useDashboardData();

  return (
    <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
      {/* Table Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-6 py-5 border-b border-border-main bg-white">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <h2 className="text-sm font-bold text-text shrink-0">Semua Klien</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="w-4 h-4 text-text4 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari klien..."
                className="pl-9 pr-4 h-9 bg-surface2 border border-border-main rounded-xl text-xs font-semibold w-48 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
              />
            </div>

            <div className="h-4 w-px bg-border-main hidden md:block mx-1" />

            {/* Filters */}
            <div className="relative">
              <select
                value={filters.cg}
                onChange={e => setFilter('cg', e.target.value)}
                className="h-9 pl-4 pr-8 bg-surface2 border border-border-main rounded-xl text-[11px] font-bold text-text3 focus:outline-none focus:border-accent appearance-none cursor-pointer hover:bg-surface3 transition-all min-w-[110px]"
              >
                <option value="">Semua CG</option>
                {metadata.channelGroups.map(cg => <option key={cg} value={cg}>{cg}</option>)}
              </select>
              <ChevronRight className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text4 rotate-90" />
            </div>

            <div className="relative">
              <select
                value={filters.ind}
                onChange={e => setFilter('ind', e.target.value)}
                className="h-9 pl-4 pr-8 bg-surface2 border border-border-main rounded-xl text-[11px] font-bold text-text3 focus:outline-none focus:border-accent appearance-none cursor-pointer hover:bg-surface3 transition-all min-w-[130px]"
              >
                <option value="">Semua Industri</option>
                {metadata.industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
              <ChevronRight className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text4 rotate-90" />
            </div>
          </div>
        </div>
        
        <div className="type-overline bg-surface2 px-3 py-1.5 rounded-lg border border-border-main/50">
          Total {clients.length} Klien
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-border-main bg-surface2/30">
              {[
                { label: 'Klien', key: 'key' },
                { label: 'Industri', key: 'ind' },
                { label: 'Status', key: 'status' },
                { label: 'Revenue', key: 'rev' },
                { label: 'Spend', key: 'sp' },
                { label: 'ROAS', key: 'roas' },
                { label: 'Channel', key: 'cg' }
              ].map((h, i) => (
                <th 
                   key={h.key} 
                   onClick={() => onSort(h.key)}
                   className={`py-3 type-overline cursor-pointer hover:text-accent transition-colors ${i === 0 ? 'pl-6' : 'px-4'} ${i === 6 ? 'pr-6 text-right' : ''} ${sortConfig.key === h.key ? 'text-accent' : ''}`}
                >
                  <div className={`flex items-center gap-1.5 ${i === 6 ? 'justify-end' : 'justify-start'}`}>
                    {h.label}
                    {sortConfig.key === h.key && (
                      <span className="text-[8px]">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface2">
            {clients.map((cl) => {
              const t  = totals(CH_DEF, clients, data, cl.key, currentPeriod);
              const wc = clientWorst(CH_DEF, clients, data, periods, cl.key, currentPeriod);
              const dotColor = STATUS_DOT[wc] || STATUS_DOT.nn;
              const bgClass = STATUS_BG[wc] || STATUS_BG.nn;

              return (
                <tr
                  key={cl.key}
                  onClick={() => onClientClick(cl.key)}
                  className="cursor-pointer hover:bg-surface2/70 transition-all duration-150 group"
                >
                  <td className="py-3.5 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xs font-black shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-200">
                        {cl.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-text">{cl.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium text-text3">{cl.ind}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${bgClass}`}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColor }} />
                      {LM[wc]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-medium text-text tabular-nums">{fRp(t.rev)}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-medium text-text3 tabular-nums">{fRp(t.sp)}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-bold text-text tabular-nums">{t.roas ? t.roas.toFixed(2) + 'x' : '—'}</span>
                  </td>
                  <td className="py-3.5 pr-6 text-right">
                    <span className="chip chip-nn uppercase tracking-wider">
                       {cl.cg}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;
