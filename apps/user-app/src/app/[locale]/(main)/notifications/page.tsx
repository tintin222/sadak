'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Card, CardContent } from '@sadak/ui';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Smartphone,
  Car,
  Shield,
  Armchair,
  Zap,
  Plane,
  Crown,
  Megaphone,
} from 'lucide-react';

type NotificationType =
  | 'privilege_unlocked'
  | 'trip_reminder'
  | 'transaction_complete'
  | 'membership_update'
  | 'campaign';

interface MockNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  href: string;
  icon: typeof Bell;
  iconBg: string;
}

const now = new Date();
const today = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600000);
const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000);

const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: '1',
    type: 'transaction_complete',
    title: 'eSIM Activated',
    body: 'Your Germany 5GB eSIM is now active. Valid for 30 days.',
    read: false,
    createdAt: today(1),
    href: '/flows/esim',
    icon: Smartphone,
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    id: '2',
    type: 'trip_reminder',
    title: 'Berlin Trip in 3 Days',
    body: 'Your trip to Berlin is coming up! Make sure your travel essentials are ready.',
    read: false,
    createdAt: today(3),
    href: '/trips',
    icon: Plane,
    iconBg: 'bg-indigo-100 text-indigo-600',
  },
  {
    id: '3',
    type: 'campaign',
    title: '50% Off eSIM Plans',
    body: 'Limited time offer: Get 50% off all European eSIM packages this week.',
    read: false,
    createdAt: today(5),
    href: '/marketplace',
    icon: Megaphone,
    iconBg: 'bg-pink-100 text-pink-600',
  },
  {
    id: '4',
    type: 'privilege_unlocked',
    title: 'New Privilege Unlocked',
    body: 'You now have access to Fast Track Security at Istanbul Airport.',
    read: true,
    createdAt: daysAgo(1),
    href: '/privileges',
    icon: Zap,
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    id: '5',
    type: 'transaction_complete',
    title: 'Insurance Policy Issued',
    body: 'Your Allianz travel insurance policy POL-AX29KM3N is now active.',
    read: true,
    createdAt: daysAgo(1),
    href: '/flows/insurance',
    icon: Shield,
    iconBg: 'bg-red-100 text-red-600',
  },
  {
    id: '6',
    type: 'membership_update',
    title: 'Gold Tier Renewed',
    body: 'Your Denizbank Gold membership has been renewed for another year.',
    read: true,
    createdAt: daysAgo(3),
    href: '/profile',
    icon: Crown,
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    id: '7',
    type: 'transaction_complete',
    title: 'Transfer Confirmed',
    body: 'Your airport transfer from IST to city center is confirmed for Mar 22.',
    read: true,
    createdAt: daysAgo(4),
    href: '/flows/transfer',
    icon: Car,
    iconBg: 'bg-green-100 text-green-600',
  },
  {
    id: '8',
    type: 'privilege_unlocked',
    title: 'Lounge Access Available',
    body: 'You have 2 free lounge visits remaining this month. Use them before they expire!',
    read: true,
    createdAt: daysAgo(6),
    href: '/flows/lounge',
    icon: Armchair,
    iconBg: 'bg-purple-100 text-purple-600',
  },
];

function getTimeLabel(date: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '1d ago';
  return `${diffDays}d ago`;
}

function getGroup(date: Date, t: ReturnType<typeof useTranslations>): string {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);

  if (date >= startOfToday) return t('notifications.today');
  if (date >= startOfYesterday) return t('notifications.yesterday');
  return t('notifications.earlier');
}

export default function NotificationsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleTap = (notif: MockNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    router.push(notif.href);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Group notifications
  const groups: { label: string; items: MockNotification[] }[] = [];
  for (const notif of notifications) {
    const label = getGroup(notif.createdAt, t);
    const existing = groups.find((g) => g.label === label);
    if (existing) {
      existing.items.push(notif);
    } else {
      groups.push({ label, items: [notif] });
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 px-4 pt-10 pb-3 md:pt-8 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/home')} className="p-1 -ml-1">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              {t('notifications.title')}
              {unreadCount > 0 && (
                <span className="ml-2 text-sm font-medium text-blue-600">({unreadCount})</span>
              )}
            </h1>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600"
            >
              <CheckCheck className="w-4 h-4" />
              {t('notifications.markAllRead')}
            </button>
          )}
        </div>
      </div>

      {/* Notification list */}
      <div className="flex-1 px-4 py-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bell className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">{t('notifications.empty')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <div key={group.label}>
                <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  {group.label}
                </h2>
                <Card>
                  <CardContent className="p-0 divide-y divide-gray-50">
                    {group.items.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <button
                          key={notif.id}
                          onClick={() => handleTap(notif)}
                          className={`flex items-start gap-3 px-4 py-3.5 w-full text-left transition-colors hover:bg-gray-50 ${
                            !notif.read ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl ${notif.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm truncate ${!notif.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {notif.body}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {getTimeLabel(notif.createdAt)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
