'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button, Badge, Card, CardContent, Progress, Input } from '@sadak/ui';
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
  X,
} from 'lucide-react';

// Country flag lookup for demo
const COUNTRY_FLAGS: Record<string, string> = {
  germany: '🇩🇪', berlin: '🇩🇪', munich: '🇩🇪', frankfurt: '🇩🇪',
  turkey: '🇹🇷', istanbul: '🇹🇷', ankara: '🇹🇷', izmir: '🇹🇷', antalya: '🇹🇷',
  'united kingdom': '🇬🇧', london: '🇬🇧', manchester: '🇬🇧',
  france: '🇫🇷', paris: '🇫🇷',
  spain: '🇪🇸', madrid: '🇪🇸', barcelona: '🇪🇸',
  italy: '🇮🇹', rome: '🇮🇹', milan: '🇮🇹',
  netherlands: '🇳🇱', amsterdam: '🇳🇱',
  usa: '🇺🇸', 'new york': '🇺🇸', 'los angeles': '🇺🇸',
  japan: '🇯🇵', tokyo: '🇯🇵',
  uae: '🇦🇪', dubai: '🇦🇪',
  greece: '🇬🇷', athens: '🇬🇷',
  portugal: '🇵🇹', lisbon: '🇵🇹',
};

function getFlagForCity(city: string): string {
  const lower = city.toLowerCase().trim();
  return COUNTRY_FLAGS[lower] || '🌍';
}

interface Trip {
  id: string;
  destination: string;
  country: string;
  flag: string;
  origin: string;
  dates: string;
  flightNumber: string;
  status: string;
  preparationScore: number;
  services: {
    type: string;
    label: string;
    status: string;
    icon: typeof Smartphone;
    href: string;
  }[];
}

const DEFAULT_SERVICES = [
  { type: 'esim', label: 'eSIM', status: 'available', icon: Smartphone, href: '/flows/esim' },
  { type: 'insurance', label: 'Travel Insurance', status: 'available', icon: Shield, href: '/flows/insurance' },
  { type: 'transfer', label: 'Airport Transfer', status: 'available', icon: Car, href: '/flows/transfer' },
  { type: 'lounge', label: 'Lounge Access', status: 'available', icon: Armchair, href: '/flows/lounge' },
  { type: 'fast_track', label: 'Fast Track', status: 'available', icon: Zap, href: '/flows/fast-track' },
];

const INITIAL_TRIPS: Trip[] = [
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
      { type: 'esim', label: 'eSIM Activated', status: 'completed', icon: Smartphone, href: '/flows/esim' },
      { type: 'insurance', label: 'Insurance Purchased', status: 'completed', icon: Shield, href: '/flows/insurance' },
      { type: 'transfer', label: 'Transfer Booked', status: 'pending', icon: Car, href: '/flows/transfer' },
      { type: 'lounge', label: 'Lounge Access', status: 'available', icon: Armchair, href: '/flows/lounge' },
      { type: 'fast_track', label: 'Fast Track', status: 'available', icon: Zap, href: '/flows/fast-track' },
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

function formatDateRange(departure: string, returnDate: string): string {
  const dep = new Date(departure);
  const ret = new Date(returnDate);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[dep.getMonth()]} ${dep.getDate()} - ${ret.getDate()}, ${dep.getFullYear()}`;
}

export default function TripsPage() {
  const t = useTranslations();
  const [showPast, setShowPast] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);

  const trip = selectedTrip ? trips.find((tr) => tr.id === selectedTrip) : null;

  const handleAddTrip = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setShowAddModal(false);
  };

  if (trip) {
    return <TripDetail trip={trip} onBack={() => setSelectedTrip(null)} t={t} />;
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-10 pb-3 md:pt-8 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t('trips.title')}</h1>
        <Button size="sm" variant="outline" className="gap-1" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          {t('trips.addTrip')}
        </Button>
      </div>

      <div className="px-4 flex flex-col gap-4 pb-4">
        {/* Upcoming */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">{t('trips.upcoming')}</h2>
          {trips.length === 0 ? (
            <Card className="p-8 text-center">
              <Plane className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">{t('trips.noTrips')}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 gap-1"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4" />
                {t('trips.addFirstTrip')}
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {trips.map((tr) => (
                <Card
                  key={tr.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTrip(tr.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{tr.flag}</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{tr.destination}</p>
                        <p className="text-xs text-gray-500">{tr.dates}</p>
                      </div>
                      {tr.flightNumber && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Plane className="w-3.5 h-3.5" />
                          {tr.flightNumber}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={tr.preparationScore} className="flex-1" />
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {tr.preparationScore}%
                      </span>
                    </div>
                    <div className="flex gap-1.5 mt-3">
                      {tr.services.map((s) => {
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
          )}
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
              {PAST_TRIPS.map((tr) => (
                <Card key={tr.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tr.flag}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{tr.destination}</p>
                        <p className="text-xs text-gray-400">{tr.dates}</p>
                      </div>
                      <Badge variant="success" className="text-[10px]">
                        {t('trips.saved', { amount: tr.savings })}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Trip Modal */}
      {showAddModal && (
        <AddTripModal
          t={t}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTrip}
        />
      )}
    </div>
  );
}

// ─── Add Trip Modal ─────────────────────────────────────────

function AddTripModal({
  t,
  onClose,
  onAdd,
}: {
  t: ReturnType<typeof useTranslations>;
  onClose: () => void;
  onAdd: (trip: Trip) => void;
}) {
  const [origin, setOrigin] = useState('Istanbul');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [success, setSuccess] = useState(false);

  const isValid = origin.trim() && destination.trim() && departureDate && returnDate;

  const handleSubmit = () => {
    if (!isValid) return;

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      destination: destination.trim(),
      country: '',
      flag: getFlagForCity(destination),
      origin: origin.trim(),
      dates: formatDateRange(departureDate, returnDate),
      flightNumber: flightNumber.trim().toUpperCase(),
      status: 'upcoming',
      preparationScore: 0,
      services: DEFAULT_SERVICES.map((s) => ({ ...s })),
    };

    setSuccess(true);
    setTimeout(() => onAdd(newTrip), 1200);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-[430px] z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3">
            <h2 className="text-lg font-bold text-gray-900">{t('trips.addTripForm.title')}</h2>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {success ? (
            <div className="flex flex-col items-center py-10 px-5">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-1">{t('trips.addTripForm.success')}</p>
              <p className="text-sm text-gray-500">{destination} {getFlagForCity(destination)}</p>
            </div>
          ) : (
            <div className="px-5 pb-8 flex flex-col gap-4">
              {/* Origin */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  {t('trips.addTripForm.origin')}
                </label>
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder={t('trips.addTripForm.originPlaceholder')}
                  className="h-11"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  {t('trips.addTripForm.destination')}
                </label>
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={t('trips.addTripForm.destinationPlaceholder')}
                  className="h-11"
                  autoFocus
                />
              </div>

              {/* Dates row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                    {t('trips.addTripForm.departureDate')}
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                    {t('trips.addTripForm.returnDate')}
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departureDate}
                    className="w-full h-11 px-3 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Flight Number */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  {t('trips.addTripForm.flightNumber')}
                </label>
                <Input
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder={t('trips.addTripForm.flightNumberPlaceholder')}
                  className="h-11"
                />
              </div>

              {/* Submit */}
              <Button
                className="w-full h-12 text-base mt-2"
                disabled={!isValid}
                onClick={handleSubmit}
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('trips.addTripForm.submit')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Trip Detail ─────────────────────────────────────────────

function TripDetail({
  trip,
  onBack,
  t,
}: {
  trip: Trip;
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
            <p className="text-xs text-white/50">
              {trip.flightNumber ? `${trip.flightNumber} · ` : ''}{trip.origin} → {trip.destination}
            </p>
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
                <Link href={service.href} className="flex-1 mb-2">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{service.label}</span>
                      </div>
                      {service.status === 'available' && (
                        <Button size="sm" variant="outline" className="text-xs h-7 pointer-events-none">
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
                </Link>
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
