'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Badge, Card, Progress, Tabs, TabsList, TabsTrigger, TabsContent } from '@sadak/ui';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Armchair,
  Zap,
  Smartphone,
  Car,
  Shield,
  UtensilsCrossed,
  ShoppingBag,
  Heart,
  Ticket,
  Star,
  Clock,
  Building2,
} from 'lucide-react';
import type { PrivilegeCategory } from '@sadak/shared';

const categoryIcons: Record<PrivilegeCategory, typeof Smartphone> = {
  lounge: Armchair,
  fast_track: Zap,
  esim: Smartphone,
  transfer: Car,
  insurance: Shield,
  dining: UtensilsCrossed,
  shopping: ShoppingBag,
  health: Heart,
  entertainment: Ticket,
  other: Star,
};

const categoryColors: Record<PrivilegeCategory, string> = {
  lounge: 'bg-purple-100 text-purple-600',
  fast_track: 'bg-amber-100 text-amber-600',
  esim: 'bg-blue-100 text-blue-600',
  transfer: 'bg-green-100 text-green-600',
  insurance: 'bg-red-100 text-red-600',
  dining: 'bg-orange-100 text-orange-600',
  shopping: 'bg-pink-100 text-pink-600',
  health: 'bg-teal-100 text-teal-600',
  entertainment: 'bg-indigo-100 text-indigo-600',
  other: 'bg-gray-100 text-gray-600',
};

// Mock privileges data
const MOCK_PRIVILEGES = [
  {
    id: '1',
    title: 'Airport Lounge Access',
    company: 'Denizbank',
    tier: 'Gold',
    category: 'lounge' as PrivilegeCategory,
    usageModel: 'free',
    used: 1,
    total: 3,
    period: 'monthly',
    validUntil: 'Dec 2026',
    provider: 'Priority Pass',
    description: 'Complimentary access to 1,200+ airport lounges worldwide via Priority Pass.',
  },
  {
    id: '2',
    title: 'International eSIM',
    company: 'Denizbank',
    tier: 'Gold',
    category: 'esim' as PrivilegeCategory,
    usageModel: 'free',
    used: 0,
    total: 1,
    period: 'monthly',
    validUntil: 'Dec 2026',
    provider: 'Airalo',
    description: 'Free eSIM data package for international trips.',
  },
  {
    id: '3',
    title: 'Airport Transfer Discount',
    company: 'Denizbank',
    tier: 'Gold',
    category: 'transfer' as PrivilegeCategory,
    usageModel: 'discounted',
    used: 0,
    total: null,
    period: null,
    validUntil: 'Dec 2026',
    provider: 'BiTaksi',
    description: '10% discount on all airport transfer bookings.',
    discount: '10%',
  },
  {
    id: '4',
    title: 'Miles&Smiles Lounge Access',
    company: 'Turkish Airlines',
    tier: 'Elite',
    category: 'lounge' as PrivilegeCategory,
    usageModel: 'free',
    used: 0,
    total: 2,
    period: 'monthly',
    validUntil: 'Dec 2026',
    provider: 'LoungeKey',
    description: 'Access to Turkish Airlines CIP Lounges.',
  },
  {
    id: '5',
    title: 'Priority Fast Track',
    company: 'Turkish Airlines',
    tier: 'Elite',
    category: 'fast_track' as PrivilegeCategory,
    usageModel: 'free',
    used: 0,
    total: null,
    period: null,
    validUntil: 'Dec 2026',
    provider: 'Airport Dimensions',
    description: 'Fast track security access at partner airports.',
  },
];

const DISCOVER_COMPANIES = [
  {
    id: '3',
    name: 'Garanti BBVA',
    description: 'Premium travel benefits for Bonus card holders. Access to 1,200+ lounges, travel insurance, and more.',
    color: '#10B981',
    samplePrivilege: '2 free lounge visits/month',
    requested: false,
  },
];

const CATEGORIES: PrivilegeCategory[] = [
  'lounge', 'fast_track', 'esim', 'transfer', 'insurance', 'dining', 'shopping', 'health', 'entertainment',
];

export default function PrivilegesPage() {
  const t = useTranslations();
  const [activeCategory, setActiveCategory] = useState<PrivilegeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrivileges = MOCK_PRIVILEGES.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 px-4 pt-10 pb-3 md:pt-8">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">{t('privileges.title')}</h1>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
            Denizbank Gold
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('privileges.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Source Tabs & Category Filters */}
      <div className="px-4">
        <Tabs defaultValue="all">
          <TabsList className="mb-3">
            <TabsTrigger value="all">{t('privileges.all')}</TabsTrigger>
            <TabsTrigger value="denizbank">Denizbank</TabsTrigger>
            <TabsTrigger value="tk">Turkish Airlines</TabsTrigger>
            <TabsTrigger value="discover">{t('privileges.discover')}</TabsTrigger>
          </TabsList>

          {/* Category filter chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 -mx-4 px-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {t('privileges.all')}
            </button>
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat === activeCategory ? 'all' : cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {t(`privileges.categories.${cat}`)}
                </button>
              );
            })}
          </div>

          {/* Privileges list */}
          <TabsContent value="all" className="mt-0">
            <PrivilegesList privileges={filteredPrivileges} t={t} />
          </TabsContent>
          <TabsContent value="denizbank" className="mt-0">
            <PrivilegesList
              privileges={filteredPrivileges.filter((p) => p.company === 'Denizbank')}
              t={t}
            />
          </TabsContent>
          <TabsContent value="tk" className="mt-0">
            <PrivilegesList
              privileges={filteredPrivileges.filter((p) => p.company === 'Turkish Airlines')}
              t={t}
            />
          </TabsContent>
          <TabsContent value="discover" className="mt-0">
            <DiscoverTab t={t} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PrivilegesList({
  privileges,
  t,
}: {
  privileges: typeof MOCK_PRIVILEGES;
  t: ReturnType<typeof useTranslations>;
}) {
  if (privileges.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">{t('privileges.noPrivileges')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-4">
      {privileges.map((priv) => {
        const Icon = categoryIcons[priv.category];
        const colorClass = categoryColors[priv.category];
        const isLimitReached = priv.total !== null && priv.used >= priv.total;

        return (
          <Link key={priv.id} href={`/privileges/${priv.id}`}>
            <Card className={`p-4 transition-all hover:shadow-md ${isLimitReached ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm text-gray-900 truncate">{priv.title}</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {priv.provider} · {priv.company} {priv.tier}
                  </p>
                  {priv.total !== null && (
                    <div className="flex items-center gap-2">
                      <Progress value={(priv.used / priv.total) * 100} className="flex-1 h-1.5" />
                      <span className="text-[10px] text-gray-400">
                        {priv.used}/{priv.total}
                      </span>
                    </div>
                  )}
                  {isLimitReached && (
                    <Badge variant="destructive" className="text-[10px] mt-1.5">
                      {t('privileges.limitReached')}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge
                    variant={priv.usageModel === 'free' ? 'success' : priv.usageModel === 'discounted' ? 'warning' : 'secondary'}
                    className="text-[10px]"
                  >
                    {t(`privileges.usageModel.${priv.usageModel}`)}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-gray-300 mt-1" />
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function DiscoverTab({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [requested, setRequested] = useState<string[]>([]);

  return (
    <div className="pb-4">
      <p className="text-sm text-gray-500 mb-4">{t('privileges.discoverSubtitle')}</p>
      {DISCOVER_COMPANIES.map((company) => (
        <Card key={company.id} className="p-4">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ backgroundColor: company.color }}
            >
              {company.name[0]}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 mb-1">{company.name}</p>
              <p className="text-xs text-gray-500 mb-2">{company.description}</p>
              <p className="text-xs text-blue-600 mb-3">{company.samplePrivilege}</p>
              {requested.includes(company.id) ? (
                <div className="flex items-center gap-1.5 text-xs text-amber-600">
                  <Clock className="w-3.5 h-3.5" />
                  {t('onboarding.companyDiscovery.requestPending')}
                </div>
              ) : (
                <button
                  onClick={() => setRequested([...requested, company.id])}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  {t('onboarding.companyDiscovery.requestMembership')}
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Gift(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="8" width="18" height="4" rx="1" /><rect x="3" y="12" width="18" height="8" rx="1" /><path d="M12 8v12" /><path d="M19 12v-2a2 2 0 0 0-2-2c-2 0-3.5 1.5-5 3 1.5-1.5 3-3 5-3a2 2 0 0 1 2 2Z" /><path d="M5 12v-2a2 2 0 0 1 2-2c2 0 3.5 1.5 5 3-1.5-1.5-3-3-5-3a2 2 0 0 0-2 2Z" />
    </svg>
  );
}
