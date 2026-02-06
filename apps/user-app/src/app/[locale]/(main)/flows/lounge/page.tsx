'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button, Card, CardContent, Badge } from '@sadak/ui';
import { Armchair, MapPin, Users, Clock, Minus, Plus, ArrowRight, Wifi, Coffee, ShowerHead } from 'lucide-react';
import WizardLayout from '@/components/flows/WizardLayout';
import QRCodeDisplay from '@/components/flows/QRCodeDisplay';
import SuccessAnimation from '@/components/flows/SuccessAnimation';
import { useDemoUser } from '@/contexts/DemoUserContext';
import { createServicePass } from '@/lib/flows/supabase-helpers';
import type { ServicePassResult, ServicePackage, Airport } from '@/lib/flows/types';

const AIRPORTS: Airport[] = [
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', terminals: ['International', 'Domestic'] },
  { code: 'SAW', name: 'Sabiha Gokcen Airport', city: 'Istanbul', terminals: ['International'] },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', terminals: ['1', '2'] },
  { code: 'LHR', name: 'London Heathrow', city: 'London', terminals: ['2', '3', '5'] },
  { code: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', terminals: ['2E', '2F'] },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', terminals: ['1', '3'] },
];

const LOUNGES: Record<string, ServicePackage[]> = {
  IST: [
    {
      id: 'lng-ist-1', providerName: 'Priority Pass', providerSlug: 'priority-pass', name: 'IGA Lounge Istanbul',
      description: 'International Terminal · Priority Pass Network', price: 45, currency: 'EUR',
      features: ['Premium buffet & beverages', 'High-speed WiFi', 'Shower facilities', 'Comfortable seating', 'Charging stations'],
      details: { terminal: 'International', maxGuests: 2, amenities: ['food', 'drinks', 'wifi', 'showers'] }, badge: 'Premium',
    },
    {
      id: 'lng-ist-2', providerName: 'LoungeKey', providerSlug: 'loungekey', name: 'Comfort Lounge IST',
      description: 'International Terminal · LoungeKey', price: 35, currency: 'EUR',
      features: ['Snacks & beverages', 'WiFi', 'TV area', 'Comfortable seating'],
      details: { terminal: 'International', maxGuests: 1, amenities: ['food', 'drinks', 'wifi'] },
    },
  ],
  BER: [
    {
      id: 'lng-ber-1', providerName: 'Priority Pass', providerSlug: 'priority-pass', name: 'Airport Club Lounge BER',
      description: 'Terminal 1 · Priority Pass Network', price: 35, currency: 'EUR',
      features: ['Food & drinks', 'WiFi', 'Newspapers', 'Comfortable seating', 'Runway views'],
      details: { terminal: '1', maxGuests: 2, amenities: ['food', 'drinks', 'wifi'] },
    },
  ],
  _default: [
    {
      id: 'lng-gen-1', providerName: 'Priority Pass', providerSlug: 'priority-pass', name: 'Airport Lounge',
      description: 'Priority Pass Network', price: 40, currency: 'EUR',
      features: ['Food & beverages', 'WiFi', 'Comfortable seating', 'Power outlets'],
      details: { terminal: '1', maxGuests: 1, amenities: ['food', 'drinks', 'wifi'] },
    },
  ],
};

const PROVIDER_IDS: Record<string, string> = {
  'priority-pass': 'b0000007-0000-0000-0000-000000000007',
  loungekey: 'b0000008-0000-0000-0000-000000000008',
};

export default function LoungeFlowPage() {
  const router = useRouter();
  const demoUser = useDemoUser();

  const [step, setStep] = useState(1);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [selectedLounge, setSelectedLounge] = useState<ServicePackage | null>(null);
  const [guestCount, setGuestCount] = useState(0);
  const [accessDate, setAccessDate] = useState('2026-03-22');
  const [accessTime, setAccessTime] = useState('10:00');
  const [result, setResult] = useState<ServicePassResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lounges = selectedAirport
    ? LOUNGES[selectedAirport.code] || LOUNGES._default
    : [];

  const handleConfirm = async () => {
    if (!selectedAirport || !selectedLounge) return;
    setLoading(true);
    setError(null);

    const validFrom = `${accessDate}T${accessTime}:00Z`;
    const validUntil = new Date(new Date(validFrom).getTime() + 4 * 3600000).toISOString();

    try {
      const res = await createServicePass({
        userId: demoUser.id,
        providerId: PROVIDER_IDS[selectedLounge.providerSlug] || PROVIDER_IDS['priority-pass'],
        serviceType: 'lounge',
        venueName: selectedLounge.name,
        location: `${selectedAirport.name} (${selectedAirport.code})`,
        guestCount,
        validFrom,
        validUntil,
        amount: selectedLounge.price + guestCount * selectedLounge.price * 0.7,
        currency: selectedLounge.currency,
      });
      setResult(res);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Select Airport', 'Choose Lounge', 'Review & Confirm', 'Access Pass Ready!'];

  return (
    <WizardLayout
      currentStep={step}
      totalSteps={4}
      title={stepTitles[step - 1]}
      subtitle={step < 4 ? 'Airport Lounge' : undefined}
      onBack={() => setStep((s) => s - 1)}
      headerColor="from-purple-600 to-purple-800"
      headerIcon={<Armchair className="w-6 h-6" />}
    >
      {/* Step 1: Select Airport */}
      {step === 1 && (
        <div className="flex flex-col gap-3">
          {AIRPORTS.map((airport) => (
            <button
              key={airport.code}
              onClick={() => { setSelectedAirport(airport); setStep(2); }}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                selectedAirport?.code === airport.code ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{airport.name}</p>
                <p className="text-xs text-gray-400">{airport.code} · {airport.city}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Choose Lounge */}
      {step === 2 && selectedAirport && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-400">{selectedAirport.name} ({selectedAirport.code})</p>

          <div className="flex flex-col gap-3">
            {lounges.map((lounge) => (
              <Card
                key={lounge.id}
                className={`cursor-pointer transition-all ${
                  selectedLounge?.id === lounge.id ? 'ring-2 ring-purple-500 border-purple-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedLounge(lounge)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{lounge.name}</p>
                        {lounge.badge && <Badge variant="success" className="text-[10px]">{lounge.badge}</Badge>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{lounge.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">€{lounge.price}</p>
                      <p className="text-[10px] text-green-600 font-medium">FREE</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3">
                    {(lounge.details.amenities as string[]).includes('food') && <Coffee className="w-4 h-4 text-gray-400" />}
                    {(lounge.details.amenities as string[]).includes('wifi') && <Wifi className="w-4 h-4 text-gray-400" />}
                    {(lounge.details.amenities as string[]).includes('showers') && <ShowerHead className="w-4 h-4 text-gray-400" />}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {lounge.features.map((f) => (
                      <span key={f} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{f}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Guest count */}
          {selectedLounge && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Guests</p>
                    <p className="text-xs text-gray-400">Max {selectedLounge.details.maxGuests as number} guests</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuestCount(Math.max(0, guestCount - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                      disabled={guestCount === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold w-6 text-center">{guestCount}</span>
                    <button
                      onClick={() => setGuestCount(Math.min(selectedLounge.details.maxGuests as number, guestCount + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                      disabled={guestCount >= (selectedLounge.details.maxGuests as number)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">DATE</label>
              <input
                type="date"
                value={accessDate}
                onChange={(e) => setAccessDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">TIME</label>
              <input
                type="time"
                value={accessTime}
                onChange={(e) => setAccessTime(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <Button className="w-full mt-2" disabled={!selectedLounge} onClick={() => setStep(3)}>
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && selectedAirport && selectedLounge && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Lounge Access Details</h3>
              <div className="flex items-center gap-3">
                <Armchair className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-400">Lounge</p>
                  <p className="text-sm font-medium">{selectedLounge.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-400">Airport</p>
                  <p className="text-sm font-medium">{selectedAirport.name} ({selectedAirport.code})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-400">Access Time</p>
                  <p className="text-sm font-medium">{accessDate} at {accessTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-400">Guests</p>
                  <p className="text-sm font-medium">{guestCount === 0 ? 'Just you' : `You + ${guestCount} guest${guestCount > 1 ? 's' : ''}`}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Lounge access</span>
                <span className="text-sm">€{selectedLounge.price}</span>
              </div>
              {guestCount > 0 && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Guest access (x{guestCount})</span>
                  <span className="text-sm">€{(guestCount * selectedLounge.price * 0.7).toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-600">Privilege discount</span>
                <span className="text-sm text-green-600">-€{(selectedLounge.price + guestCount * selectedLounge.price * 0.7).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold text-green-600">FREE</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                Covered by your {demoUser.companyName} {demoUser.tierName} lounge privilege
              </p>
            </CardContent>
          </Card>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>}

          <Button className="w-full" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Generating Pass...' : 'Get Access Pass'}
          </Button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && result && (
        <div className="flex flex-col items-center gap-5 pt-4">
          <SuccessAnimation />

          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Access Pass Ready!</h2>
            <p className="text-sm text-gray-500">Show this at the lounge reception</p>
          </div>

          <QRCodeDisplay code={result.passNumber} label="Lounge Access Pass" />

          <Card className="w-full">
            <CardContent className="p-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Lounge</span>
                <span className="font-medium">{result.venueName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pass #</span>
                <span className="font-mono">{result.passNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valid From</span>
                <span className="font-medium">{new Date(result.validFrom).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valid Until</span>
                <span className="font-medium">{new Date(result.validUntil).toLocaleString()}</span>
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
