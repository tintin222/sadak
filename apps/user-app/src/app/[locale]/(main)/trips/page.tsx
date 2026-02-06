'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Badge, Card, CardContent, Progress } from '@sadak/ui';
import {
  Plus,
  Plane,
  CheckCircle2,
  Clock,
  Square,
  ChevronRight,
  Smartphone,
  Shield,
  Car,
  Armchair,
  Zap,
  FileText,
} from 'lucide-react';

const MOCK_TRIPS = [
  {
    id: '1',
    destination: 'Berlin',
    country: 'Germany',
    flag: '🇩🇪',
    origin: 'Istanbul',
    dates: 'Mar 22 - 28, 2026',
    flightNumber: 'TK1933',
    status: 'upcoming',
    preparationScore: 80,
    services: [
      { type: 'esim', label: 'eSIM Activated', status: 'completed', icon: Smartphone },
      { type: 'insurance', label: 'Insurance Purchased', status: 'completed', icon: Shield },
      { type: 'transfer', label: 'Transfer Booked', status: 'pending', icon: Car },
      { type: 'lounge', label: 'Lounge Access', status: 'available', icon: Armchair },
      { type: 'fast_track', label: 'Fast Track', status: 'available', icon: Zap },
    ],
  },
];

const PAST_TRIPS = [
  {
    id: 'p1',
    destination: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    dates: 'Jan 10 - 15, 2026',
    savings: '€47',
    services: 3,
  },
];

export default function TripsPage() {
  const t = useTranslations();
  const [showPast, setShowPast] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const trip = selectedTrip ? MOCK_TRIPS.find((t) => t.id === selectedTrip) : null;

  if (trip) {
    return <TripDetail trip={trip} onBack={() => setSelectedTrip(null)} t={t} />;
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-10 pb-3 md:pt-8 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t('trips.title')}</h1>
        <Button size="sm" variant="outline" className="gap-1">
          <Plus className="w-4 h-4" />
          {t('trips.addTrip')}
        </Button>
      </div>

      <div className="px-4 flex flex-col gap-4 pb-4">
        {/* Upcoming */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">{t('trips.upcoming')}</h2>
          {MOCK_TRIPS.map((trip) => (
            <Card
              key={trip.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTrip(trip.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{trip.flag}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{trip.destination}</p>
                    <p className="text-xs text-gray-500">{trip.dates}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Plane className="w-3.5 h-3.5" />
                    {trip.flightNumber}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={trip.preparationScore} className="flex-1" />
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {trip.preparationScore}%
                  </span>
                </div>
                <div className="flex gap-1.5 mt-3">
                  {trip.services.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.type}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          s.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : s.status === 'pending'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Past */}
        <div>
          <button
            onClick={() => setShowPast(!showPast)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-3"
          >
            {t('trips.past')}
            <ChevronRight className={`w-4 h-4 transition-transform ${showPast ? 'rotate-90' : ''}`} />
          </button>
          {showPast && (
            <div className="flex flex-col gap-3">
              {PAST_TRIPS.map((trip) => (
                <Card key={trip.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{trip.flag}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{trip.destination}</p>
                        <p className="text-xs text-gray-400">{trip.dates}</p>
                      </div>
                      <Badge variant="success" className="text-[10px]">
                        {t('trips.saved', { amount: trip.savings })}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TripDetail({
  trip,
  onBack,
  t,
}: {
  trip: (typeof MOCK_TRIPS)[0];
  onBack: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex flex-col pb-4">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 pt-10 pb-6 md:pt-8">
        <button onClick={onBack} className="text-sm text-white/80 hover:text-white mb-4">
          ← {t('common.back')}
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{trip.flag}</span>
          <div>
            <p className="text-2xl font-bold">{trip.destination}</p>
            <p className="text-sm text-white/70">{trip.dates}</p>
            <p className="text-xs text-white/50">{trip.flightNumber} · {trip.origin} → {trip.destination}</p>
          </div>
        </div>

        {/* Preparation Score */}
        <div className="mt-4 bg-white/10 rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {t('trips.preparationScore', { score: trip.preparationScore })}
            </span>
            <span className="text-xs text-white/60">{trip.preparationScore}%</span>
          </div>
          <Progress value={trip.preparationScore} className="bg-white/20 [&>div]:bg-white" />
        </div>
      </div>

      {/* Trip Timeline */}
      <div className="px-4 mt-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">Services</h2>
        <div className="flex flex-col gap-1">
          {trip.services.map((service, index) => {
            const Icon = service.icon;
            const isLast = index === trip.services.length - 1;

            return (
              <div key={service.type} className="flex gap-3">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      service.status === 'completed'
                        ? 'bg-green-100'
                        : service.status === 'pending'
                        ? 'bg-amber-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {service.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : service.status === 'pending' ? (
                      <Clock className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  {!isLast && <div className="w-0.5 h-8 bg-gray-200" />}
                </div>

                {/* Content */}
                <Card className="flex-1 mb-2">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{service.label}</span>
                    </div>
                    {service.status === 'available' && (
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        + Add
                      </Button>
                    )}
                    {service.status === 'completed' && (
                      <Badge variant="success" className="text-[10px]">Done</Badge>
                    )}
                    {service.status === 'pending' && (
                      <Badge variant="warning" className="text-[10px]">Booked</Badge>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Documents */}
        <h2 className="text-sm font-semibold text-gray-500 mt-4 mb-3">Documents</h2>
        <div className="flex flex-col gap-2">
          {[
            { name: 'eSIM QR Code', icon: Smartphone },
            { name: 'Insurance Policy', icon: FileText },
          ].map(({ name, icon: Icon }) => (
            <Card key={name} className="p-3 flex items-center gap-3 cursor-pointer hover:shadow-sm">
              <Icon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-700 flex-1">{name}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
