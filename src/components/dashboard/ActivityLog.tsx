import React from 'react';
import { Clock, Tag, ExternalLink } from 'lucide-react';

interface ActivityItem {
  d: string; // raw date
  dLabel?: string; // formatted date
  t: 'p' | 'e' | 'c' | 'l'; // type
  n: string; // note
  c: string; // client
}

interface ActivityLogProps {
  activities: ActivityItem[];
  compact?: boolean;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities, compact = false }) => {
  const typeStyles = {
    p: { bg: 'bg-gg-bg', text: 'text-gg', border: 'border-gg-border/30', label: 'Promo' },
    e: { bg: 'bg-tofu-bg', text: 'text-tofu', border: 'border-tofu-border/30', label: 'Event' },
    c: { bg: 'bg-mofu-bg', text: 'text-mofu', border: 'border-mofu-border/30', label: 'Konten' },
    l: { bg: 'bg-rr-bg', text: 'text-rr', border: 'border-rr-border/30', label: 'Launch' }
  };

  return (
    <div className="w-full flex flex-col divide-y divide-border-main/30">
      {activities.length > 0 ? (
        activities.map((a, i) => {
          const style = typeStyles[a.t] || typeStyles.c;
          return (
            <div 
              key={i} 
              className="group flex items-start gap-5 p-6 hover:bg-surface2/40 transition-all duration-300 relative overflow-hidden"
            >
              {/* Timeline Marker */}
              <div className="absolute left-[3.25rem] top-16 bottom-0 w-px bg-border-main/40 group-last:hidden" />
              
              {/* Client Avatar / Initial */}
              <div className="w-11 h-11 rounded-2xl bg-white border border-border-main shadow-sm flex items-center justify-center shrink-0 group-hover:border-accent/40 group-hover:shadow-md transition-all duration-300 relative z-10">
                 <span className="text-[11px] font-black text-text2 uppercase tracking-tighter group-hover:text-accent transition-colors">
                    {a.c.slice(0, 2)}
                 </span>
                 <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-gg shadow-sm" />
              </div>

              {/* Content Container */}
              <div className="flex-1 min-w-0 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                   <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${style.bg} ${style.text} ${style.border}`}>
                         {style.label}
                      </span>
                      <span className="text-[10px] font-bold text-text4 uppercase tracking-widest flex items-center gap-1.5">
                         <Clock className="w-3 h-3" />
                         {a.dLabel || a.d}
                      </span>
                   </div>
                   <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white rounded-lg border border-transparent hover:border-border-main text-text4 hover:text-accent">
                      <ExternalLink className="w-3.5 h-3.5" />
                   </button>
                </div>

                <div className="relative">
                   <p className="text-sm font-medium text-text leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                      {a.n}
                   </p>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold text-text4/60 uppercase tracking-widest">
                   <span className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      Portfolio Activity
                   </span>
                   <span className="w-1 h-1 rounded-full bg-border-main" />
                   <span className="text-accent/60">Verified Admin</span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
           <div className="w-16 h-16 rounded-3xl bg-surface2 flex items-center justify-center mb-4 border border-dashed border-border-main">
              <Clock className="w-8 h-8 text-text4" />
           </div>
           <p className="text-xs font-bold uppercase tracking-widest">No activity recorded</p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
