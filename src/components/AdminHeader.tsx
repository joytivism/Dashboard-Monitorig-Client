'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ChevronRight, Bell, User, CheckCheck, 
  AlertCircle, AlertTriangle, Info, Clock 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useDashboardData } from '@/components/DataProvider';
import { clientWorst } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin',          label: 'Admin Hub' },
  { href: '/admin/data',     label: 'Input Data' },
  { href: '/admin/activity', label: 'Activity Log' },
  { href: '/admin/clients',  label: 'Kelola Klien' },
  { href: '/admin/settings', label: 'Pengaturan' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const currentItem = NAV_ITEMS.find(item => 
    item.href === pathname || (item.href !== '/admin' && pathname.startsWith(item.href))
  );

  const [showNotifications, setShowNotifications] = React.useState(false);
  const { CLIENTS, DATA, PERIODS, CH_DEF } = useDashboardData();
  const [dbStatus, setDbStatus] = React.useState<'online' | 'checking' | 'error'>('checking');
  const [aiStatus, setAiStatus] = React.useState<'ready' | 'checking' | 'error'>('checking');
  
  const [readIds, setReadIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('ra_read_notifications');
    if (saved) setReadIds(JSON.parse(saved));
  }, []);

  React.useEffect(() => {
    async function checkHealth() {
      try {
        const { error } = await supabase.from('clients').select('count', { count: 'exact', head: true });
        setDbStatus(error ? 'error' : 'online');
      } catch { setDbStatus('error'); }

      try {
        const { data } = await supabase.from('system_settings').select('value').eq('key', 'openrouter_key').single();
        setAiStatus(data?.value ? 'ready' : 'error');
      } catch { setAiStatus('error'); }
    }
    checkHealth();
  }, []);

  const notifications = React.useMemo(() => {
    const curPeriod = PERIODS[PERIODS.length - 1];
    const alerts: any[] = [];

    CLIENTS.forEach(cl => {
      const wc = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, cl.key, curPeriod);
      if (wc === 'rr' || wc === 'or') {
        const id = `${cl.key}-${curPeriod}-${wc}`;
        alerts.push({
          id,
          clientKey: cl.key,
          type: wc === 'rr' ? 'critical' : 'warning',
          title: wc === 'rr' ? 'Critical Alert' : 'Performance Warning',
          desc: `Klien ${cl.key} memerlukan evaluasi strategi segera.`,
          time: 'Just now',
          unread: !readIds.includes(id)
        });
      }
    });

    return alerts;
  }, [CLIENTS, DATA, PERIODS, readIds]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const allIds = notifications.map(n => n.id);
    const newReadIds = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(newReadIds);
    localStorage.setItem('ra_read_notifications', JSON.stringify(newReadIds));
  };

  const handleNotificationClick = (n: any) => {
    if (n.unread) {
      const newReadIds = [...readIds, n.id];
      setReadIds(newReadIds);
      localStorage.setItem('ra_read_notifications', JSON.stringify(newReadIds));
    }
    setShowNotifications(false);
    router.push(`/client/${encodeURIComponent(n.clientKey)}`);
  };

  return (
    <header 
      className="h-[60px] w-full sticky top-0 z-50 flex items-center justify-between px-6 transition-all duration-300 border-b border-border-main"
      style={{ 
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <span className="text-text3">Admin CC</span>
        <ChevronRight className="w-3 h-3 text-text4" />
        <span className="text-text font-semibold">{currentItem?.label || 'Dashboard'}</span>
      </div>

      {/* ── Center: System Health ── */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface2 border border-border-main/40">
          <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'online' ? 'bg-green-500' : dbStatus === 'checking' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'} shadow-[0_0_8px_rgba(34,197,94,0.4)]`} />
          <span className="text-[9px] font-black text-text3  tracking-[0.1em]">DB: {dbStatus === 'online' ? 'Online' : dbStatus === 'checking' ? 'Wait' : 'Off'}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface2 border border-border-main/40">
          <div className={`w-1.5 h-1.5 rounded-full ${aiStatus === 'ready' ? 'bg-blue-500' : aiStatus === 'checking' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'} shadow-[0_0_8px_rgba(59,130,246,0.4)]`} />
          <span className="text-[9px] font-black text-text3  tracking-[0.1em]">AI: {aiStatus === 'ready' ? 'Ready' : aiStatus === 'checking' ? 'Wait' : 'Off'}</span>
        </div>
      </div>

      {/* ── Right Actions ── */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${showNotifications ? 'bg-accent text-white shadow-lg shadow-accent/20 scale-95' : 'hover:bg-surface2 text-text3 border border-border-main/50'}`}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && !showNotifications && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-border-main overflow-hidden z-20 animate-fade-in origin-top-right">
                <div className="px-5 py-4 border-b border-border-main/50 flex items-center justify-between bg-surface2/30">
                   <div className="flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-accent" />
                      <h3 className="text-[10px] font-bold text-text tracking-wider">Alerts Center</h3>
                   </div>
                  {unreadCount > 0 && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-accent text-white shadow-sm">
                       {unreadCount} New
                    </span>
                  )}
                </div>

                <div className="max-h-[380px] overflow-y-auto no-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="px-10 py-14 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-surface2 flex items-center justify-center mx-auto mb-4 border border-border-main/50">
                        <Info className="w-6 h-6 text-text4 opacity-30" />
                      </div>
                      <p className="text-[10px] font-bold text-text4 tracking-wider">Everything is optimal</p>
                    </div>
                  ) : (
                    notifications.map((n, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleNotificationClick(n)}
                        className={`px-5 py-4 border-b border-border-main/40 hover:bg-surface2/50 transition-all cursor-pointer group flex items-start gap-4 ${!n.unread ? 'opacity-40 grayscale-[0.8]' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${
                          n.type === 'critical' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-orange-50 border-orange-100 text-orange-500'
                        }`}>
                          {n.type === 'critical' ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold text-text group-hover:text-accent transition-colors truncate pr-2">{n.title}</span>
                            <div className="flex items-center gap-1 text-[9px] font-bold text-text4  shrink-0">
                               <Clock className="w-2.5 h-2.5" /> {n.time}
                            </div>
                          </div>
                          <p className="text-[10px] text-text3 leading-relaxed font-medium line-clamp-2">{n.desc}</p>
                        </div>
                        {n.unread && (
                           <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5 shadow-[0_0_8px_rgba(255,99,1,0.5)]" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 bg-surface2/20 border-t border-border-main/50">
                    <button 
                      onClick={handleMarkAllRead}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border-main/60 bg-white text-[9px] font-bold text-text3 hover:text-accent hover:border-accent/30 hover:shadow-sm tracking-wider transition-all"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all as read
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="h-5 w-px bg-border-main/50" />

        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-text leading-none mb-1">Admin User</div>
            <div className="text-[9px] font-bold text-accent  tracking-wider">Superuser</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-surface3 flex items-center justify-center text-text2 text-[10px] font-black border border-border-main/50 shadow-sm group cursor-pointer hover:border-accent/40 transition-all">
             <User className="w-5 h-5 opacity-30 group-hover:opacity-60 transition-opacity" />
          </div>
        </div>
      </div>
    </header>
  );
}
