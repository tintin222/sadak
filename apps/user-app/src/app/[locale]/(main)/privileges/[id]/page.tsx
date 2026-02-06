'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import {
  Button,
  Badge,
  Card,
  CardContent,
  Progress,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@sadak/ui';
import { ArrowLeft, Armchair, MapPin, Users, Calendar, CheckCircle2 } from 'lucide-react';

// Mock data for the privilege detail
const MOCK_PRIVILEGE = {
  id: '1',
  title: 'Airport Lounge Access',
  company: 'Denizbank',
  tier: 'Gold',
  category: 'lounge',
  usageModel: 'free',
  used: 1,
  total: 3,
  period: 'monthly',
  validStart: 'Jan 2026',
  validEnd: 'Dec 2026',
  provider: { name: 'Priority Pass', logo: null },
  description:
    'Enjoy complimentary access to over 1,200 airport lounges in 140+ countries. Relax before your flight with premium food, beverages, Wi-Fi, and comfortable seating.',
  guestPolicy: '+1 guest included for Gold tier and above',
  locations: [
    'Istanbul Airport (IST) — Terminal 1',
    'Sabiha Gokcen (SAW) — International Terminal',
    'Berlin Brandenburg (BER) — Terminal 1',
    'London Heathrow (LHR) — Terminal 2, 3, 5',
    'Dubai International (DXB) — Terminal 1, 3',
  ],
  howToUse: [
    'Open SADAK and navigate to your privilege',
    'Tap "Use Now" to generate an access pass',
    'Show the QR code at the lounge reception',
    'Enjoy your lounge experience!',
  ],
  terms:
    'Access is limited to the quota allocated for your tier. Guest access is subject to availability. Maximum stay is 3 hours per visit. Some premium areas within lounges may not be included. Blackout dates may apply during peak travel periods.',
};

export default function PrivilegeDetailPage() {
  const t = useTranslations();
  const router = useRouter();
  const priv = MOCK_PRIVILEGE;
  const quotaPercentage = priv.total ? (priv.used / priv.total) * 100 : 0;

  return (
    <div className="flex flex-col pb-24">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 text-white px-4 pt-10 pb-8 md:pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">{t('common.back')}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Armchair className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold mb-1">{priv.title}</h1>
            <p className="text-sm text-white/70">
              {priv.provider.name} · {priv.company} {priv.tier}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-3">
        {/* Quota Card */}
        <Card className="mb-4 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                {t('privileges.quota', { used: priv.used, total: priv.total })}
              </span>
              <Badge variant={priv.used >= priv.total! ? 'destructive' : 'success'}>
                {priv.total! - priv.used} remaining
              </Badge>
            </div>
            <Progress value={quotaPercentage} />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">
                {t('privileges.validUntil', { date: priv.validEnd })}
              </span>
              <span className="text-xs text-gray-400">{priv.period}</span>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 leading-relaxed">{priv.description}</p>
          </CardContent>
        </Card>

        {/* Info sections */}
        <Card className="mb-4">
          <CardContent className="p-0">
            {/* Guest Policy */}
            <div className="flex items-start gap-3 px-4 py-3 border-b border-gray-100">
              <Users className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-0.5">{t('privileges.guestPolicy')}</p>
                <p className="text-xs text-gray-500">{priv.guestPolicy}</p>
              </div>
            </div>
            {/* Locations */}
            <div className="flex items-start gap-3 px-4 py-3 border-b border-gray-100">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">{t('privileges.eligibleLocations')}</p>
                <div className="flex flex-col gap-1">
                  {priv.locations.map((loc) => (
                    <p key={loc} className="text-xs text-gray-500">{loc}</p>
                  ))}
                </div>
              </div>
            </div>
            {/* Validity */}
            <div className="flex items-start gap-3 px-4 py-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-0.5">Validity Period</p>
                <p className="text-xs text-gray-500">{priv.validStart} — {priv.validEnd}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Use */}
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="how-to-use" className="border rounded-2xl px-4">
            <AccordionTrigger className="text-sm font-semibold">
              {t('privileges.howToUse')}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3">
                {priv.howToUse.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-600 pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="terms" className="border rounded-2xl px-4 mt-2">
            <AccordionTrigger className="text-sm font-semibold">
              {t('privileges.termsConditions')}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-gray-500 leading-relaxed">{priv.terms}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Fixed bottom CTAs */}
      <div className="fixed bottom-20 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-[402px] bg-white border-t border-gray-200 p-4 flex gap-3 z-30">
        <Button variant="outline" className="flex-1">
          {t('privileges.addToTrip')}
        </Button>
        <Button className="flex-1">
          {t('privileges.useNow')}
        </Button>
      </div>
    </div>
  );
}
