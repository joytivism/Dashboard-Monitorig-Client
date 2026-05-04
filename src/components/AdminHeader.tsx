'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCheck,
  Clock,
  Info,
  Menu,
  User,
} from 'lucide-react';
import { useAppShell } from '@/components/layout/AppShell';
import TopBar from '@/components/layout/TopBar';
import { supabase } from '@/lib/supabase';
import { useDashboardData } from '@/components/DataProvider';
import { cn, clientWorst } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin', label: 'Admin Hub' },
  { href: '/admin/data', label: 'Input Data' },
  { href: '/admin/activity', label: 'Activity Log' },
  { href: '/admin/clients', label: 'Client Management' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { openMobileNav } = useAppShell();
  const currentItem = NAV_ITEMS.find((item) => item.href === pathname || (item.href !== '/admin' && pathname.startsWith(item.href)));

  const [showNotifications, setShowNotifications] = React.useState(false);
  const { CLIENTS, DATA, PERIODS, CH_DEF } = useDashboardData();
  const [dbStatus, setDbStatus] = React.useState<'online' | 'checking' | 'error'>('checking');
  const [aiStatus, setAiStatus] = React.useState<'ready' | 'checking' | 'error'>('checking');
  const [readIds, setReadIds] = React.useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    const saved = localStorage.getItem('ra_read_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    async function checkHealth() {
      try {
        const { error } = await supabase.from('clients').select('count', { count: 'exact', head: true });
        setDbStatus(error ? 'error' : 'online');
      } catch {
        setDbStatus('error');
      }

      try {
        const { data } = await supabase.from('system_settings').select('value').eq('key', 'openrouter_key').single();
        setAiStatus(data?.value ? 'ready' : 'error');
      } catch {
        setAiStatus('error');
      }
    }

    checkHealth();
  }, []);

  const notifications = React.useMemo(() => {
    const curPeriod = PERIODS[PERIODS.length - 1];
    const alerts: Array<{
      id: string;
      clientKey: string;
      type: 'critical' | 'warning';
      title: string;
      desc: string;
      time: string;
      unread: boolean;
    }> = [];

    CLIENTS.forEach((client) => {
      const status = clientWorst(CH_DEF, CLIENTS, DATA, PERIODS, client.key, curPeriod);
      if (status === 'rr' || status === 'or') {
        const id = `${client.key}-${curPeriod}-${status}`;
        alerts.push({
          id,
          clientKey: client.key,
          type: status === 'rr' ? 'critical' : 'warning',
          title: status === 'rr' ? 'Critical Alert' : 'Performance Warning',
          desc: `Klien ${client.key} memerlukan evaluasi strategi segera.`,
          time: 'Just now',
          unread: !readIds.includes(id),
        });
      }
    });

    return alerts;
  }, [CH_DEF, CLIENTS, DATA, PERIODS, readIds]);

  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const handleMarkAllRead = (event: React.MouseEvent) => {
    event.stopPropagation();
    const allIds = notifications.map((notification) => notification.id);
    const nextReadIds = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(nextReadIds);
    localStorage.setItem('ra_read_notifications', JSON.stringify(nextReadIds));
  };

  const handleNotificationClick = (notification: (typeof notifications)[number]) => {
    if (notification.unread) {
      const nextReadIds = [...readIds, notification.id];
      setReadIds(nextReadIds);
      localStorage.setItem('ra_read_notifications', JSON.stringify(nextReadIds));
    }
    setShowNotifications(false);
    router.push(`/client/${encodeURIComponent(notification.clientKey)}`);
  };

  const statusSlots = (
    <>
      <div className="rounded-full border border-border-main bg-white px-3 py-1 text-[11px] font-medium text-text3 shadow-[var(--shadow-card)]">
        DB: <span className={dbStatus === 'online' ? 'text-gd-text' : dbStatus === 'error' ? 'text-rr-text' : 'text-accent'}>{dbStatus}</span>
      </div>
      <div className="rounded-full border border-border-main bg-white px-3 py-1 text-[11px] font-medium text-text3 shadow-[var(--shadow-card)]">
        AI: <span className={aiStatus === 'ready' ? 'text-gd-text' : aiStatus === 'error' ? 'text-rr-text' : 'text-accent'}>{aiStatus}</span>
      </div>
    </>
  );

  return (
    <>
      <TopBar
        title={currentItem?.label || 'Admin Hub'}
        breadcrumbs={['Admin Console', currentItem?.label || 'Overview']}
        leading={(
          <button
            type="button"
            onClick={openMobileNav}
            className="btn-icon h-10 w-10 lg:hidden"
            aria-label="Buka navigasi admin"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        statusSlots={statusSlots}
        actions={(
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications((value) => !value)}
                className={cn(
                  'ds-toolbar-icon-button relative',
                  showNotifications && 'border-accent/20 bg-accent-light text-accent'
                )}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && !showNotifications ? (
                  <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-accent ring-2 ring-white" />
                ) : null}
              </button>

              {showNotifications ? (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="ds-overlay-panel absolute right-0 z-20 mt-3 w-[min(92vw,360px)]">
                    <div className="flex items-center justify-between border-b border-border-main bg-surface2 px-5 py-4">
                      <div>
                        <div className="text-sm font-semibold text-text">Alerts Center</div>
                        <div className="text-xs text-text3">System and portfolio notifications.</div>
                      </div>
                      {unreadCount > 0 ? <span className="badge badge-accent">{unreadCount} new</span> : null}
                    </div>

                    <div className="max-h-[380px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={cn(
                              'flex w-full items-start gap-3 border-b border-border-main/70 px-5 py-4 text-left transition-colors hover:bg-surface2',
                              !notification.unread && 'opacity-45'
                            )}
                          >
                            <div
                              className={cn(
                                'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]',
                                notification.type === 'critical' ? 'bg-rr-bg text-rr-text' : 'bg-or-bg text-or-text'
                              )}
                            >
                              {notification.type === 'critical' ? <AlertCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <div className="truncate text-sm font-semibold text-text">{notification.title}</div>
                                <div className="flex shrink-0 items-center gap-1 text-[10px] text-text4">
                                  <Clock className="h-3 w-3" />
                                  {notification.time}
                                </div>
                              </div>
                              <p className="mt-1 text-xs leading-relaxed text-text3">{notification.desc}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-8 py-14 text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-surface2 text-text4">
                            <Info className="h-6 w-6" />
                          </div>
                          <div className="mt-4 text-sm font-semibold text-text">Everything is stable</div>
                          <div className="mt-1 text-xs text-text3">No new alerts for the current portfolio snapshot.</div>
                        </div>
                      )}
                    </div>

                    {notifications.length > 0 ? (
                      <div className="border-t border-border-main bg-surface2 p-3">
                        <button
                          onClick={handleMarkAllRead}
                          className="ds-toolbar-control w-full justify-center"
                        >
                          <CheckCheck className="h-4 w-4" />
                          Mark all as read
                        </button>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>

            <div className="ds-toolbar-avatar">
              <div className="hidden text-right sm:block">
                <div className="text-xs font-semibold text-text">Admin User</div>
                <div className="text-[11px] text-text3">Superuser</div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-surface2 text-text2">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}
      />
    </>
  );
}
