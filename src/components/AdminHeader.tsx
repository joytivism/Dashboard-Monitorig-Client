'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, Bell, User, CheckCheck } from 'lucide-react';
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
  const { CLIENTS, DATA, PERIODS } = useDashboardData();
  const [dbStatus, setDbStatus] = React.useState<'online' | 'checking' | 'error'>('checking');
  const [aiStatus, setAiStatus] = React.useState<'ready' | 'checking' | 'error'>('checking');
  
  // Track read notifications
  const [readIds, setReadIds] = React.useState<string[]>([]);

  // Load read status from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('ra_read_notifications');
    if (saved) setReadIds(JSON.parse(saved));
  }, []);

  // ── System Health Check ──
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

  // ── Generate Notifications from Data ──
  const notifications = React.useMemo(() => {
    const curPeriod = PERIODS[PERIODS.length - 1];
    const alerts: any[] = [];

    CLIENTS.forEach(cl => {
      const wc = clientWorst(CLIENTS, DATA, PERIODS, cl.key, curPeriod);
      if (wc === 'rr' || wc === 'or') {
        const id = `${cl.key}-${curPeriod}-${wc}`;
        alerts.push({
          id,
          clientKey: cl.key,
          type: wc === 'rr' ? 'critical' : 'warning',
          title: wc === 'rr' ? 'Kritis: Performa Anjlok' : 'Peringatan: Performa Menurun',
          desc: `Klien ${cl.key} memerlukan evaluasi strategi segera.`,
          time: 'Baru saja',
          unread: !readIds.includes(id)
        });
      }
    });

    return alerts;
  }, [CLIENTS, DATA, PERIODS, readIds]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const newReadIds = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(newReadIds);
    localStorage.setItem('ra_read_notifications', JSON.stringify(newReadIds));
  };

  const handleNotificationClick = (n: any) => {
    // Mark as read
    if (n.unread) {
      const newReadIds = [...readIds, n.id];
      setReadIds(newReadIds);
      localStorage.setItem('ra_read_notifications', JSON.stringify(newReadIds));
    }
    // Navigate
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
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'online' ? 'bg-green-500' : dbStatus === 'checking' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'} shadow-[0_0_8px_rgba(34,197,94,0.4)]`} />
          <span className="text-[10px] font-bold text-text3 uppercase tracking-widest">Database: {dbStatus === 'online' ? 'Online' : dbStatus === 'checking' ? 'Connecting...' : 'Offline'}</span>
        </div>
        <div className="w-px h-3 bg-border-main/50" />
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${aiStatus === 'ready' ? 'bg-blue-500' : aiStatus === 'checking' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'} shadow-[0_0_8px_rgba(59,130,246,0.4)]`} />
          <span className="text-[10px] font-bold text-text3 uppercase tracking-widest">AI Engine: {aiStatus === 'ready' ? 'Ready' : aiStatus === 'checking' ? 'Checking...' : 'Disabled'}</span>
        </div>
      </div>

      {/* ── Right Actions ── */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${showNotifications ? 'bg-accent text-white shadow-lg' : 'hover:bg-surface2 text-text3 border border-transparent hover:border-border-main'}`}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && !showNotifications && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-border-main overflow-hidden z-20 animate-fade-in origin-top-right">
                <div className="px-5 py-4 border-b border-border-main flex items-center justify-between bg-surface2/50">
                  <h3 className="text-xs font-black text-text uppercase tracking-widest">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent">{unreadCount} New</span>
                  )}
                </div>
                <div className="max-h-[360px] overflow-y-auto no-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="px-10 py-12 text-center">
                      <div className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-5 h-5 text-text4" />
                      </div>
                      <p className="text-[10px] font-bold text-text4 uppercase tracking-widest">No New Alerts</p>
                    </div>
                  ) : (
                    notifications.map((n, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleNotificationClick(n)}
                        className={`px-5 py-4 border-b border-border-main/50 hover:bg-surface2 transition-all cursor-pointer group flex items-start gap-3 ${!n.unread ? 'opacity-50 grayscale-[0.5]' : ''}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`} />
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-bold text-text group-hover:text-accent transition-colors ${n.unread ? '' : 'font-semibold'}`}>{n.title}</div>
                          <div className="text-[10px] text-text3 leading-relaxed mt-1 font-medium">{n.desc}</div>
                          <div className="text-[9px] text-text4 font-bold uppercase mt-2">{n.time}</div>
                        </div>
                        {n.unread && (
                           <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="px-5 py-3 bg-surface2/50 border-t border-border-main text-center">
                    <button 
                      onClick={handleMarkAllRead}
                      className="flex items-center justify-center gap-2 w-full text-[10px] font-black text-text3 hover:text-accent uppercase tracking-widest transition-colors"
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
            <div className="text-xs font-bold text-text">Admin User</div>
            <div className="text-[9px] font-black text-accent uppercase tracking-widest">Superuser</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-surface3 flex items-center justify-center text-text2 text-[10px] font-black border border-border-main/50 shadow-sm overflow-hidden">
             <User className="w-5 h-5 opacity-40" />
          </div>
        </div>
      </div>
    </header>
  );
}
