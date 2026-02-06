'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button, Card, CardContent, Badge } from '@sadak/ui';
import { Car, MapPin, Clock, Users, ChevronRight, ArrowRight, CheckCircle2 } from 'lucide-react';
import WizardLayout from '@/components/flows/WizardLayout';
import SuccessAnimation from '@/components/flows/SuccessAnimation';
import { useDemoUser } from '@/contexts/DemoUserContext';
import { createTransferReservation } from '@/lib/flows/supabase-helpers';
import type { TransferResult, ServicePackage } from '@/lib/flows/types';

const AIRPORTS = [
  { id: 'ist', name: 'Istanbul Airport (IST)', city: 'Istanbul' },
  { id: 'saw', name: 'Sabiha Gokcen (SAW)', city: 'Istanbul' },
  { id: 'ber', name: 'Berlin Brandenburg (BER)', city: 'Berlin' },
  { id: 'lhr', name: 'London Heathrow (LHR)', city: 'London' },
  { id: 'cdg', name: 'Paris CDG (CDG)', city: 'Paris' },
];

const CITY_LOCATIONS = [
  { id: 'city-center', name: 'City Center', type: 'city' as const },
  { id: 'hotel', name: 'Hotel (Enter address)', type: 'hotel' as const },
  { id: 'train-station', name: 'Train Station', type: 'city' as const },
];

const VEHICLE_PACKAGES: ServicePackage[] = [
  {
    id: 'tr-eco', providerName: 'BiTaksi', providerSlug: 'bitaksi', name: 'Economy',
    description: 'Standard sedan, up to 3 passengers', price: 29, currency: 'EUR',
    features: ['Standard sedan', 'Up to 3 passengers', '2 luggage', 'Professional driver'],
    details: { vehicleType: 'economy', capacity: 3 },
  },
  {
    id: 'tr-comfort', providerName: 'Uber', providerSlug: 'uber', name: 'Comfort',
    description: 'Premium sedan, up to 3 passengers', price: 39, currency: 'EUR',
    features: ['Premium sedan', 'Up to 3 passengers', '3 luggage', 'Free WiFi', 'Water bottles'],
    details: { vehicleType: 'comfort', capacity: 3 }, badge: 'Popular',
  },
  {
    id: 'tr-luxury', providerName: 'Uber', providerSlug: 'uber', name: 'Luxury',
    description: 'Executive car, up to 3 passengers', price: 69, currency: 'EUR',
    features: ['Executive car', 'Leather seats', 'Complimentary refreshments', 'Flight tracking'],
    details: { vehicleType: 'luxury', capacity: 3 }, badge: 'Premium',
  },
  {
    id: 'tr-van', providerName: 'BiTaksi', providerSlug: 'bitaksi', name: 'Van',
    description: 'Spacious van, up to 6 passengers', price: 59, currency: 'EUR',
    features: ['Spacious van', 'Up to 6 passengers', '6 luggage', 'Perfect for groups'],
    details: { vehicleType: 'van', capacity: 6 },
  },
];

const PROVIDER_IDS: Record<string, string> = {
  bitaksi: 'b0000003-0000-0000-0000-000000000003',
  uber: 'b0000004-0000-0000-0000-000000000004',
};

export default function TransferFlowPage() {
  const router = useRouter();
  const demoUser = useDemoUser();

  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState<string | null>(null);
  const [dropoff, setDropoff] = useState<string | null>(null);
  const [date, setDate] = useState('2026-03-22');
  const [time, setTime] = useState('14:00');
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [result, setResult] = useState<TransferResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!pickup || !dropoff || !selectedPackage) return;
    setLoading(true);
    setError(null);

    try {
      const res = await createTransferReservation({
        userId: demoUser.id,
        providerId: PROVIDER_IDS[selectedPackage.providerSlug] || PROVIDER_IDS.uber,
        providerName: selectedPackage.providerName,
        vehicleType: selectedPackage.details.vehicleType as string,
        originAddress: pickup,
        destinationAddress: dropoff,
        pickupTime: `${date}T${time}:00Z`,
        amount: selectedPackage.price,
        currency: selectedPackage.currency,
      });
      setResult(res);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Pickup & Dropoff', 'Choose Vehicle', 'Review & Confirm', 'Reservation Confirmed!'];

  return (
    <WizardLayout
      currentStep={step}
      totalSteps={4}
      title={stepTitles[step - 1]}
      subtitle={step < 4 ? 'Airport Transfer' : undefined}
      onBack={() => setStep((s) => s - 1)}
      headerColor="from-green-600 to-emerald-700"
      headerIcon={<Car className="w-6 h-6" />}
    >
      {/* Step 1: Locations */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">PICKUP</label>
            <div className="flex flex-col gap-2">
              {AIRPORTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setPickup(a.name)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    pickup === a.name ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.city}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">DROPOFF</label>
            <div className="flex flex-col gap-2">
              {CITY_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setDropoff(loc.name)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    dropoff === loc.name ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="text-sm font-medium">{loc.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">DATE</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">TIME</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <Button className="w-full" disabled={!pickup || !dropoff} onClick={() => setStep(2)}>
            Choose Vehicle <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2: Choose Vehicle */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-400">
            {pickup} → {dropoff} · {date} at {time}
          </p>

          <div className="flex flex-col gap-3">
            {VEHICLE_PACKAGES.map((pkg) => (
              <Card
                key={pkg.id}
                className={`cursor-pointer transition-all ${
                  selectedPackage?.id === pkg.id ? 'ring-2 ring-green-500 border-green-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{pkg.name}</p>
                        {pkg.badge && <Badge variant="success" className="text-[10px]">{pkg.badge}</Badge>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{pkg.providerName} · {pkg.description}</p>
                    </div>
                    <p className="text-lg font-bold">€{pkg.price}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pkg.features.map((f) => (
                      <span key={f} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{f}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button className="w-full mt-2" disabled={!selectedPackage} onClick={() => setStep(3)}>
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && selectedPackage && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-gray-900">Trip Details</h3>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs text-gray-400">Pickup</p>
                  <p className="text-sm font-medium">{pickup}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-400">Dropoff</p>
                  <p className="text-sm font-medium">{dropoff}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Pickup Time</p>
                  <p className="text-sm font-medium">{date} at {time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Vehicle</p>
                  <p className="text-sm font-medium">{selectedPackage.name} · {selectedPackage.providerName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Transfer fee</span>
                <span className="text-sm">€{selectedPackage.price}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-600">Privilege discount (10%)</span>
                <span className="text-sm text-green-600">-€{(selectedPackage.price * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold">€{(selectedPackage.price * 0.9).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>}

          <Button className="w-full" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Reservation'}
          </Button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && result && (
        <div className="flex flex-col items-center gap-5 pt-4">
          <SuccessAnimation />

          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Reservation Confirmed!</h2>
            <p className="text-sm text-gray-500">Your driver will be waiting for you</p>
          </div>

          <Card className="w-full">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Reference</span>
                <span className="font-mono font-medium">{result.reservationRef}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Driver</span>
                <span className="font-medium">{result.driverName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Phone</span>
                <span className="font-medium">{result.driverPhone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vehicle</span>
                <span className="font-medium">{result.vehiclePlate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pickup</span>
                <span className="font-medium">{new Date(result.pickupTime).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => router.push('/marketplace')}>
              Back to Market
            </Button>
            <Button className="flex-1" onClick={() => router.push('/home')}>
              Go Home
            </Button>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
