import React, { useState, useMemo } from 'react';
import { Zap, Target, MessageSquare, Rocket, ArrowRight, Search, Filter } from 'lucide-react';

interface ActivityItem {
  d: string; // raw date
  dLabel?: string; // formatted date
  t: 'p' | 'e' | 'c' | 'l'; // type
  n: string; // note
  c: string; // client
  impact?: 'up' | 'down' | 'neutral'; // optional impact
}

interface ActivityLogProps {
  activities: ActivityItem[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const [filter, setFilter] = useState<'all' | 'p' | 'e' | 'c' | 'l'>('all');
  const [search, setSearch] = useState('');

  const typeConfig = {
    p: { icon: Target, bg: 'bg-gg-bg', text: 'text-gg', label: 'Promo' },
    e: { icon: Zap, bg: 'bg-tofu-bg', text: 'text-tofu', label: 'Event' },
    c: { icon: MessageSquare, bg: 'bg-mofu-bg', text: 'text-mofu', label: 'Content' },
    l: { icon: Rocket, bg: 'bg-rr-bg', text: 'text-rr', label: 'Launch' }
  };

  const filtered = useMemo(() => {
    return activities.filter(a => {
      const matchFilter = filter === 'all' || a.t === filter;
      const matchSearch = a.n.toLowerCase().includes(search.toLowerCase()) || 
                          a.c.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [activities, filter, search]);

  const TABS = [
    { id: 'all', label: 'All Feed' },
    { id: 'p', label: 'Promos' },
    { id: 'c', label: 'Content' },
    { id: 'l', label: 'Launches' },
  ] as const;

  return (
    <div className="w-full flex flex-col h-full bg-white rounded-[2rem] overflow-hidden">
      {/* Interactive Header */}
      <div className="p-6 border-b border-border-main bg-surface2/20 space-y-4">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex bg-white p-1 rounded-xl border border-border-main/50 shadow-sm w-fit">
               {TABS.map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setFilter(tab.id)}
                   className={`px-4 py-1.5 rounded-lg text-[10px] font-bold  tracking-wider transition-all ${
                     filter === tab.id ? 'bg-text text-white shadow-md' : 'text-text3 hover:text-text hover:bg-surface2'
                   }`}
                 >
                   {tab.label}
                 </button>
               ))}
            </div>
            
            <div className="relative group flex-1 max-w-[240px]">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text4 group-focus-within:text-accent transition-colors" />
               <input 
                 type="text"
                 placeholder="Search activity..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 bg-white border border-border-main/60 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/40 transition-all placeholder:text-text4"
               />
            </div>
         </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filtered.length > 0 ? (
          <div className="divide-y divide-border-main/30">
            {filtered.map((a, i) => {
              const config = typeConfig[a.t] || typeConfig.c;
              return (
                <div 
                  key={i} 
                  className="group relative flex gap-6 p-6 hover:bg-surface2/30 transition-all duration-300 items-start cursor-pointer"
                >
                  {/* Timeline Marker */}
                  <div className="absolute left-[3.25rem] top-16 bottom-0 w-px bg-border-main/20 group-last:hidden" />

                  {/* Left Side: Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-border-main shadow-sm flex items-center justify-center group-hover:border-accent/40 group-hover:shadow-lg transition-all duration-500">
                       <span className="text-[11px] font-bold text-text2 tracking-tighter">
                          {a.c.slice(0, 2).toUpperCase()}
                       </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg ${config.bg} ${config.text} flex items-center justify-center shadow-sm border border-white group-hover:scale-110 transition-transform`}>
                       <config.icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Right Side: Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="type-overline !text-text4">{a.dLabel || a.d}</span>
                           <span className="w-1 h-1 rounded-full bg-border-main" />
                           <span className={`type-overline ${config.text}`}>{config.label}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                     </div>
                     
                     <h4 className="text-sm font-bold text-text leading-tight group-hover:text-accent transition-colors truncate">
                        {a.c} Portfolio
                     </h4>
                     <p className="text-sm font-medium text-text3 leading-relaxed">
                        {a.n}
                     </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center px-10">
             <div className="w-16 h-16 rounded-[2rem] bg-surface2 flex items-center justify-center mb-4 border border-dashed border-border-main">
                <Filter className="w-6 h-6 text-text4 opacity-40" />
             </div>
             <p className="text-xs font-bold text-text3  tracking-widest">No matching activities</p>
             <button onClick={() => {setFilter('all'); setSearch('');}} className="mt-4 text-[10px] font-bold text-accent  tracking-widest hover:underline">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
