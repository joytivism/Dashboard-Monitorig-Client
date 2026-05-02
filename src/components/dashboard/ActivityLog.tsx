import React from 'react';
import { Clock, Zap, Target, MessageSquare, Rocket, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

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
  compact?: boolean;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities, compact = false }) => {
  const typeConfig = {
    p: { icon: Target, bg: 'bg-gg-bg', text: 'text-gg', label: 'Promo', shadow: 'shadow-gg/10' },
    e: { icon: Zap, bg: 'bg-tofu-bg', text: 'text-tofu', label: 'Event', shadow: 'shadow-tofu/10' },
    c: { icon: MessageSquare, bg: 'bg-mofu-bg', text: 'text-mofu', label: 'Content', shadow: 'shadow-mofu/10' },
    l: { icon: Rocket, bg: 'bg-rr-bg', text: 'text-rr', label: 'Launch', shadow: 'shadow-rr/10' }
  };

  const impactConfig = {
    up: { icon: TrendingUp, color: 'text-gg', bg: 'bg-gg/10' },
    down: { icon: TrendingDown, color: 'text-rr', bg: 'bg-rr/10' },
    neutral: { icon: ArrowRight, color: 'text-text4', bg: 'bg-surface3' }
  };

  return (
    <div className="w-full flex flex-col">
      {activities.length > 0 ? (
        <div className="divide-y divide-border-main/40">
          {activities.map((a, i) => {
            const config = typeConfig[a.t] || typeConfig.c;
            const impact = impactConfig[a.impact || 'neutral'];
            
            return (
              <div 
                key={i} 
                className="group relative flex gap-6 p-6 hover:bg-surface2/40 transition-all duration-300 items-start"
              >
                {/* Visual Connector Line */}
                <div className="absolute left-[3.25rem] top-16 bottom-0 w-px bg-border-main/30 group-last:hidden" />

                {/* Left Side: Avatar & Icon */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border-main shadow-sm flex items-center justify-center group-hover:border-accent/40 group-hover:shadow-md transition-all duration-500 overflow-hidden">
                     <span className="text-[11px] font-bold text-text2 tracking-tighter">
                        {a.c.slice(0, 2).toUpperCase()}
                     </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg ${config.bg} ${config.text} flex items-center justify-center shadow-sm border border-white group-hover:scale-110 transition-transform`}>
                     <config.icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Right Side: Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                   {/* Meta Row */}
                   <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-bold text-text4 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {a.dLabel || a.d}
                         </span>
                         <span className="w-1 h-1 rounded-full bg-border-main" />
                         <span className={`text-[9px] font-bold uppercase tracking-wider ${config.text}`}>
                            {config.label}
                         </span>
                      </div>
                      
                      {/* Impact Badge */}
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${impact.bg} ${impact.color} border border-current/10`}>
                         <impact.icon className="w-2.5 h-2.5" />
                         <span className="text-[9px] font-bold uppercase tracking-tight">Active</span>
                      </div>
                   </div>

                   {/* Activity Text */}
                   <div>
                      <h4 className="text-sm font-bold text-text leading-tight mb-1 group-hover:text-accent transition-colors truncate">
                         {a.c} Portfolio Update
                      </h4>
                      <p className="text-sm font-medium text-text3 leading-relaxed">
                         {a.n}
                      </p>
                   </div>

                   {/* Footer Actions / Tags */}
                   <div className="flex items-center gap-3 pt-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-text4/60 uppercase tracking-widest bg-surface2 px-2 py-0.5 rounded-md">
                         #strategy
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-text4/60 uppercase tracking-widest bg-surface2 px-2 py-0.5 rounded-md">
                         #execution
                      </div>
                      <button className="ml-auto flex items-center gap-1 text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">
                         View Analytics <ArrowRight className="w-3 h-3" />
                      </button>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center opacity-40">
           <div className="w-20 h-20 rounded-[2rem] bg-surface2 flex items-center justify-center mb-6 border border-dashed border-border-main">
              <Zap className="w-10 h-10 text-text4" />
           </div>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Operational silence</p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
