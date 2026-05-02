import React from 'react';

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
    p: 'bg-gg-bg text-gg',
    e: 'bg-tofu-bg text-tofu',
    c: 'bg-mofu-bg text-mofu',
    l: 'bg-rr-bg text-rr'
  };

  const typeLabels = {
    p: 'Promo',
    e: 'Event',
    c: 'Konten',
    l: 'Launching'
  };

  return (
    <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-surface2/50 border-b border-border-main">
            <th className="py-4 px-6 text-[10px] font-black text-text4 uppercase tracking-wider">Tanggal</th>
            <th className="py-4 px-6 text-[10px] font-black text-text4 uppercase tracking-wider">Kategori</th>
            <th className="py-4 px-6 text-[10px] font-black text-text4 uppercase tracking-wider">Keterangan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-main/20">
          {activities.map((a, i) => (
            <tr key={i} className="hover:bg-surface2/50 transition-colors group">
              <td className="py-4 px-6 text-sm text-text2 font-medium whitespace-nowrap tracking-tight">{a.dLabel || a.d}</td>
              <td className="py-4 px-6">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${typeStyles[a.t]} border border-current/10 shadow-sm`}>
                  {typeLabels[a.t]}
                </span>
              </td>
              <td className="py-4 px-6 text-sm text-text font-medium leading-relaxed">{a.n}</td>
            </tr>
          ))}
          {activities.length === 0 && (
            <tr>
              <td colSpan={3} className="py-12 text-center text-sm text-text3 font-medium">
                Belum ada aktivitas yang dicatat
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLog;
