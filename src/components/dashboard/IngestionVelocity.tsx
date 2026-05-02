import React from 'react';
import Link from 'next/link';
import { ClipboardCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface IngestionStats {
  updatedCount: number;
  total: number;
  progress: number;
  pending: any[];
  curPeriod: string;
}

export const IngestionVelocity: React.FC<IngestionStats> = ({ 
  updatedCount, 
  total, 
  progress, 
  pending, 
  curPeriod 
}) => {
  return (
    <div className="bg-white rounded-3xl border border-border-main shadow-sm overflow-hidden flex flex-col lg:grid lg:grid-cols-5 min-h-[220px] group hover:shadow-lg transition-all duration-300">
      {/* Left Side: Progress Overview */}
      <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-center space-y-7 border-b lg:border-b-0 lg:border-r border-border-main bg-gradient-to-br from-white to-surface2/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-text tracking-tight">Data Ingestion Velocity</h2>
              <span className="text-[10px] font-black text-accent bg-accent/5 px-2 py-0.5 rounded-full border border-accent/10">{curPeriod}</span>
            </div>
            <p className="text-xs text-text3 font-medium mt-0.5">Monitoring kelengkapan data portfolio bulan berjalan.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[32px] font-black text-text leading-none">{updatedCount}</span>
                <span className="text-[10px] font-black text-text4 uppercase tracking-widest mt-1">Clients Ready</span>
              </div>
              <div className="h-8 w-px bg-border-main" />
              <div className="flex flex-col">
                <span className="text-[32px] font-black text-text4/30 leading-none">{total}</span>
                <span className="text-[10px] font-black text-text4 uppercase tracking-widest mt-1">Total Target</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-accent">{progress.toFixed(0)}%</span>
              <span className="text-[9px] font-black text-text4 uppercase tracking-wider">Completion Rate</span>
            </div>
          </div>
          
          <div className="relative h-2.5 bg-surface3 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-accent rounded-full transition-all duration-1000 ease-out relative ${progress === 0 ? 'opacity-20' : 'shadow-[0_0_15px_rgba(255,99,1,0.3)]'}`}
              style={{ width: progress === 0 ? '2%' : `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Actionable Audit */}
      <div className="lg:col-span-2 p-8 lg:p-10 bg-surface2/40 backdrop-blur-sm flex flex-col justify-between gap-8">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rr" />
              <span className="text-[10px] font-black text-text2 uppercase tracking-[0.18em]">Pending Actions</span>
            </div>
            <span className="text-[10px] font-bold text-rr-text bg-rr-bg px-2.5 py-1 rounded-lg border border-rr-border/40 uppercase">
              {pending.length} Tertunda
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {pending.length > 0 ? (
              pending.slice(0, 8).map(cl => (
                <div key={cl.key} className="flex items-center gap-2.5 px-3 py-2 bg-white border border-border-main rounded-xl hover:border-accent/40 hover:shadow-sm transition-all group/chip cursor-default">
                  <div className="w-5 h-5 rounded-lg bg-surface3 flex items-center justify-center text-[9px] font-black text-text3 group-hover/chip:bg-accent group-hover/chip:text-white transition-colors">
                    {cl.key.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-text truncate">{cl.key}</span>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-4 flex flex-col items-center justify-center gap-2 bg-gd-bg/30 border border-dashed border-gd-border rounded-2xl">
                <CheckCircle2 className="w-6 h-6 text-gd" />
                <span className="text-[10px] font-black text-gd-text uppercase tracking-widest text-center">Portfolio Audit Complete</span>
              </div>
            )}
            {pending.length > 8 && (
              <div className="col-span-2 text-center">
                <span className="text-[10px] font-bold text-text4 uppercase tracking-widest">+ {pending.length - 8} lainnya</span>
              </div>
            )}
          </div>
        </div>

        <Link 
          href="/admin/data" 
          className="h-14 flex items-center justify-center gap-3 w-full rounded-2xl bg-text text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-accent transition-all duration-300 shadow-xl shadow-text/10 active:scale-[0.98] group/btn"
        >
          Lanjutkan Input Data
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default IngestionVelocity;
