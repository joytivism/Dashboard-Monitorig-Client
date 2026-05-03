import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  growth?: number | null;
  subtext?: string;
  className?: string;
  variant?: 'default' | 'accent' | 'gg' | 'rr';
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  growth, 
  subtext,
  className = '',
  variant = 'default'
}) => {
  const isUp = growth !== undefined && growth !== null && growth >= 0;
  
  const variantStyles = {
    default: 'bg-white border-border-main',
    accent: 'bg-white border-accent/20 shadow-accent/5',
    gg: 'bg-white border-gg-border/30 shadow-gg/5',
    rr: 'bg-white border-rr-border/30 shadow-rr/5',
  };

  return (
    <div className={`${variantStyles[variant]} rounded-2xl p-6 border shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="overline">{title}</div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${variant === 'accent' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface2 text-text3 border border-border-main/50'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-2">
        <div className="text-3xl font-bold text-text tracking-tight tabular-nums">{value}</div>
        {growth !== undefined && growth !== null && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${isUp ? 'bg-gg-bg text-gg' : 'bg-rr-bg text-rr'} border border-current/10 shadow-sm animate-fade-in`}>
            {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span className="tabular-nums">{Math.abs(growth).toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      {subtext && (
        <div className="text-xs text-text3 mt-4">
          {subtext}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
