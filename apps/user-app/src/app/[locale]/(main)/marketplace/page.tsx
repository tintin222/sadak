'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Badge, Card, CardContent } from '@sadak/ui';
import {
  Search,
  Smartphone,
  Car,
  Shield,
  Armchair,
  Zap,
  Clock,
  ChevronRight,
  Sparkles,
  Plane,
} from 'lucide-react';

const CATEGORIES = [
  { icon: Smartphone, name: 'eSIM', desc: 'Stay connected abroad', color: 'bg-blue-50', iconColor: 'text-blue-600', badge: '1 free use', href: '/flows/esim' },
  { icon: Car, name: 'Airport Transfer', desc: 'Ride to/from airport', color: 'bg-green-50', iconColor: 'text-green-600', badge: '10% off', href: '/flows/transfer' },
  { icon: Shield, name: 'Travel Insurance', desc: 'Travel worry-free', color: 'bg-red-50', iconColor: 'text-red-600', badge: null, href: '/flows/insurance' },
  { icon: Armchair, name: 'Airport Lounge', desc: 'Relax before your flight', color: 'bg-purple-50', iconColor: 'text-purple-600', badge: '2 free visits', href: '/flows/lounge' },
  { icon: Zap, name: 'Fast Track', desc: 'Skip the queues', color: 'bg-amber-50', iconColor: 'text-amber-600', badge: null, href: '/flows/fast-track' },
  { icon: Clock, name: 'Coming Soon', desc: 'Parking, Museums, Beach...', color: 'bg-gray-50', iconColor: 'text-gray-400', badge: null, href: null, disabled: true },
];

const CAMPAIGNS = [
  {
    id: '1',
    title: 'Welcome Bonus',
    subtitle: 'First eSIM free for new users',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    id: '2',
    title: 'Berlin Special',
    subtitle: 'Free lounge at BER airport',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: '3',
    title: 'Insurance Bundle',
    subtitle: 'eSIM + Insurance = 25% off',
    gradient: 'from-emerald-600 to-teal-600',
  },
];

const TRIP_RECOMMENDATIONS = [
  { service: 'Germany eSIM', price: '€4.99', provider: 'Airalo' },
  { service: 'BER Airport Lounge', price: 'FREE', provider: 'Priority Pass' },
  { service: 'Airport Transfer', price: 'From €29', provider: 'Uber' },
];

export default function MarketplacePage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 px-4 pt-10 pb-3 md:pt-8">
        <h1 className="text-xl font-bold text-gray-900 mb-3">{t('marketplace.title')}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('marketplace.searchPlaceholder')}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="px-4 flex flex-col gap-5 pb-4">
        {/* Featured Campaigns */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">{t('marketplace.featuredCampaigns')}</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {CAMPAIGNS.map((campaign) => (
              <Card
                key={campaign.id}
                className={`min-w-[260px] border-0 bg-gradient-to-br ${campaign.gradient} text-white shadow-md cursor-pointer`}
              >
                <CardContent className="p-4">
                  <Sparkles className="w-5 h-5 mb-2 opacity-80" />
                  <p className="font-bold text-base mb-1">{campaign.title}</p>
                  <p className="text-sm opacity-80">{campaign.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">{t('marketplace.categories')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map(({ icon: Icon, name, desc, color, iconColor, badge, href, disabled }) => {
              const cardContent = (
                <>
                  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <p className="font-semibold text-sm text-gray-900 mb-0.5">{name}</p>
                  <p className="text-xs text-gray-500 mb-2">{desc}</p>
                  {badge && (
                    <Badge variant="success" className="text-[10px]">
                      {badge}
                    </Badge>
                  )}
                </>
              );

              if (disabled || !href) {
                return (
                  <Card key={name} className="p-4 opacity-50 cursor-not-allowed">
                    {cardContent}
                  </Card>
                );
              }

              return (
                <Link key={name} href={href as '/flows/esim'}>
                  <Card className="p-4 cursor-pointer transition-all hover:shadow-md active:scale-[0.98]">
                    {cardContent}
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Based on your trip */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Plane className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-500">
              {t('marketplace.basedOnTrip')}
            </h2>
          </div>
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4">
              <p className="text-xs text-blue-600 font-medium mb-3">For your Berlin trip on Mar 22:</p>
              <div className="flex flex-col gap-2">
                {TRIP_RECOMMENDATIONS.map((rec) => (
                  <div
                    key={rec.service}
                    className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{rec.service}</p>
                      <p className="text-xs text-gray-400">{rec.provider}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${rec.price === 'FREE' ? 'text-green-600' : 'text-gray-900'}`}>
                        {rec.price}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Providers */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">{t('marketplace.popularProviders')}</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {['Airalo', 'Holafly', 'BiTaksi', 'Uber', 'Allianz', 'AXA', 'Priority Pass'].map((name) => (
              <div key={name} className="flex flex-col items-center gap-2 min-w-[64px]">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                  {name[0]}
                </div>
                <span className="text-[10px] text-gray-500 text-center">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
