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
        <div className="text-[10px] font-black text-text3 uppercase tracking-[0.12em]">{title}</div>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${variant === 'accent' ? 'bg-accent/10 text-accent' : 'bg-surface2 text-text'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-2">
        <div className="text-3xl font-bold text-text tracking-tight">{value}</div>
        {growth !== undefined && growth !== null && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black ${isUp ? 'bg-gg-bg text-gg' : 'bg-rr-bg text-rr'} border border-current/10 shadow-sm`}>
            {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(growth).toFixed(1)}%
          </span>
        )}
      </div>
      
      {subtext && (
        <div className="text-xs font-medium text-text4">
          {subtext}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
