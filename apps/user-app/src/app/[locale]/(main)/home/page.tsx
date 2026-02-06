'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Badge, Button, Card, CardContent, Progress } from '@sadak/ui';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Smartphone,
  Car,
  Shield,
  Armchair,
  Zap,
  Grid3X3,
  Plane,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

// Mock data for demo
const MOCK_USER = {
  firstName: 'Efe',
  avatar: null,
  activeCompany: { name: 'Denizbank', tier: 'Gold', color: '#F59E0B' },
  notificationCount: 3,
};

const MOCK_TRIP = {
  destination: 'Berlin',
  country: 'Germany',
  flag: '🇩🇪',
  dates: 'Mar 22 - 28',
  flightNumber: 'TK1933',
};

const QUICK_ACTIONS = [
  { icon: Smartphone, labelKey: 'home.buyEsim', color: 'bg-blue-100 text-blue-600', href: '/flows/esim' },
  { icon: Car, labelKey: 'home.bookTransfer', color: 'bg-green-100 text-green-600', href: '/flows/transfer' },
  { icon: Shield, labelKey: 'home.getInsurance', color: 'bg-red-100 text-red-600', href: '/flows/insurance' },
  { icon: Armchair, labelKey: 'home.loungeAccess', color: 'bg-purple-100 text-purple-600', href: '/flows/lounge' },
  { icon: Zap, labelKey: 'home.fastTrack', color: 'bg-amber-100 text-amber-600', href: '/flows/fast-track' },
  { icon: Grid3X3, labelKey: 'home.allServices', color: 'bg-gray-100 text-gray-600', href: '/marketplace' },
];

const MOCK_RECOMMENDATIONS = [
  {
    id: '1',
    title: 'Get eSIM for Berlin',
    subtitle: 'Germany 5GB from €4.99',
    gradient: 'from-blue-500 to-cyan-500',
    icon: Smartphone,
  },
  {
    id: '2',
    title: '2 free lounge visits',
    subtitle: 'Available this month',
    gradient: 'from-purple-500 to-pink-500',
    icon: Armchair,
  },
  {
    id: '3',
    title: 'Travel insurance',
    subtitle: 'From €9.99 per trip',
    gradient: 'from-emerald-500 to-teal-500',
    icon: Shield,
  },
];

const MOCK_ACTIVITY = [
  { id: '1', type: 'esim', title: 'eSIM Activated — Germany', date: 'Mar 20', status: 'completed', amount: '€0.00' },
  { id: '2', type: 'insurance', title: 'Travel Insurance — Allianz', date: 'Mar 18', status: 'completed', amount: '€12.99' },
  { id: '3', type: 'transfer', title: 'Airport Transfer — IST→City', date: 'Mar 15', status: 'completed', amount: '₺120' },
];

const MOCK_PRIVILEGES = [
  { id: '1', title: 'Airport Lounge Access', used: 1, total: 3, period: 'monthly', category: 'lounge' },
  { id: '2', title: 'International eSIM', used: 0, total: 1, period: 'monthly', category: 'esim' },
];

function getGreeting(t: ReturnType<typeof useTranslations>) {
  const hour = new Date().getHours();
  if (hour < 12) return t('home.greeting');
  if (hour < 18) return t('home.greetingAfternoon');
  return t('home.greetingEvening');
}

const activityIcons: Record<string, typeof Smartphone> = {
  esim: Smartphone,
  insurance: Shield,
  transfer: Car,
  lounge: Armchair,
  fast_track: Zap,
};

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col">
      {/* A. Header Bar */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 px-4 pt-10 pb-3 md:pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {MOCK_USER.firstName[0]}
            </div>
            <div>
              <p className="text-sm text-gray-500">{getGreeting(t)}</p>
              <p className="font-semibold text-gray-900">{MOCK_USER.firstName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Company pill */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-sm">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: MOCK_USER.activeCompany.color }}
              />
              <span className="font-medium text-amber-800 text-xs">
                {MOCK_USER.activeCompany.tier}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
            </button>
            {/* Notification bell */}
            <Link href="/notifications" className="relative p-2">
              <Bell className="w-5 h-5 text-gray-600" />
              {MOCK_USER.notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {MOCK_USER.notificationCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-5 pb-4">
        {/* C. Upcoming Trip Card */}
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-blue-200">{t('home.upcomingTrip')}</span>
              <Plane className="w-4 h-4 text-blue-200" />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{MOCK_TRIP.flag}</span>
              <div>
                <p className="text-lg font-bold">{MOCK_TRIP.destination}</p>
                <p className="text-sm text-blue-200">
                  {MOCK_TRIP.dates} · {MOCK_TRIP.flightNumber}
                </p>
              </div>
            </div>
            {/* Quick action chips */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['buyEsim', 'bookTransfer', 'getInsurance', 'loungeAccess'].map((key) => (
                <button
                  key={key}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
                >
                  {t(`home.${key}`)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* D. Quick Actions Grid */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">{t('home.quickActions')}</h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(({ icon: Icon, labelKey, color, href }) => (
              <Link
                key={labelKey}
                href={href}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-colors shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">
                  {t(labelKey)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* E. AI Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500">{t('home.recommendations')}</h2>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {MOCK_RECOMMENDATIONS.map((rec) => {
              const Icon = rec.icon;
              return (
                <Card
                  key={rec.id}
                  className={`min-w-[200px] border-0 bg-gradient-to-br ${rec.gradient} text-white shadow-md cursor-pointer hover:shadow-lg transition-shadow`}
                >
                  <CardContent className="p-4">
                    <Icon className="w-6 h-6 mb-3 opacity-80" />
                    <p className="font-semibold text-sm mb-1">{rec.title}</p>
                    <p className="text-xs opacity-80">{rec.subtitle}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* F. Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500">{t('home.recentActivity')}</h2>
            <button className="text-xs text-blue-600 font-medium">{t('common.seeAll')}</button>
          </div>
          <Card>
            <CardContent className="p-0 divide-y divide-gray-100">
              {MOCK_ACTIVITY.map((activity) => {
                const Icon = activityIcons[activity.type] || Smartphone;
                return (
                  <div key={activity.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <p className="text-xs text-gray-400">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="success" className="text-[10px]">
                        {activity.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.amount}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* G. Privilege Highlights */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500">{t('home.privilegeHighlights')}</h2>
            <Link href="/privileges" className="text-xs text-blue-600 font-medium flex items-center gap-1">
              {t('home.seeAllPrivileges')}
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_PRIVILEGES.map((priv) => (
              <Card key={priv.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm text-gray-900">{priv.title}</p>
                  <Badge variant="secondary" className="text-[10px]">
                    {priv.period}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={(priv.used / priv.total) * 100} className="flex-1" />
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {priv.used}/{priv.total}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
