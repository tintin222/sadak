'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button, Card, CardContent, Badge } from '@sadak/ui';
import { Zap, MapPin, Clock, ArrowRight, Timer } from 'lucide-react';
import WizardLayout from '@/components/flows/WizardLayout';
import QRCodeDisplay from '@/components/flows/QRCodeDisplay';
import SuccessAnimation from '@/components/flows/SuccessAnimation';
import { useDemoUser } from '@/contexts/DemoUserContext';
import { createServicePass } from '@/lib/flows/supabase-helpers';
import type { ServicePassResult, Airport } from '@/lib/flows/types';

const AIRPORTS: (Airport & { waitTime: string; price: number })[] = [
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', terminals: ['International', 'Domestic'], waitTime: '~5 min', price: 30 },
  { code: 'SAW', name: 'Sabiha Gokcen Airport', city: 'Istanbul', terminals: ['International'], waitTime: '~8 min', price: 25 },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', terminals: ['1', '2'], waitTime: '~5 min', price: 25 },
  { code: 'LHR', name: 'London Heathrow', city: 'London', terminals: ['2', '3', '5'], waitTime: '~10 min', price: 35 },
  { code: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', terminals: ['2E', '2F'], waitTime: '~8 min', price: 28 },
];

const TIME_SLOTS = [
  { id: 'early', label: 'Early Morning', time: '05:00 — 08:00', icon: '🌅' },
  { id: 'morning', label: 'Morning', time: '08:00 — 12:00', icon: '☀️' },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 — 17:00', icon: '🌤️' },
  { id: 'evening', label: 'Evening', time: '17:00 — 22:00', icon: '🌆' },
  { id: 'night', label: 'Late Night', time: '22:00 — 05:00', icon: '🌙' },
];

const PROVIDER_ID = 'b0000009-0000-0000-0000-000000000009'; // Airport Dimensions

export default function FastTrackFlowPage() {
  const router = useRouter();
  const demoUser = useDemoUser();

  const [step, setStep] = useState(1);
  const [selectedAirport, setSelectedAirport] = useState<(typeof AIRPORTS)[0] | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);
  const [accessDate, setAccessDate] = useState('2026-03-22');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [result, setResult] = useState<ServicePassResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!selectedAirport || !selectedTerminal || !selectedSlot) return;
    setLoading(true);
    setError(null);

    const slot = TIME_SLOTS.find((s) => s.id === selectedSlot)!;
    const startHour = slot.time.split(' — ')[0];
    const endHour = slot.time.split(' — ')[1];
    const validFrom = `${accessDate}T${startHour}:00Z`;
    const validUntil = `${accessDate}T${endHour}:00Z`;

    try {
      const res = await createServicePass({
        userId: demoUser.id,
        providerId: PROVIDER_ID,
        serviceType: 'fast_track',
        venueName: `Fast Track Security · Terminal ${selectedTerminal}`,
        location: `${selectedAirport.name} (${selectedAirport.code})`,
        guestCount: 0,
        validFrom,
        validUntil,
        amount: selectedAirport.price,
        currency: 'EUR',
      });
      setResult(res);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Select Airport', 'Choose Time Slot', 'Review & Confirm', 'Fast Track Pass Ready!'];

  return (
    <WizardLayout
      currentStep={step}
      totalSteps={4}
      title={stepTitles[step - 1]}
      subtitle={step < 4 ? 'Fast Track Security' : undefined}
      onBack={() => setStep((s) => s - 1)}
      headerColor="from-amber-500 to-orange-600"
      headerIcon={<Zap className="w-6 h-6" />}
    >
      {/* Step 1: Airport & Terminal */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {AIRPORTS.map((airport) => (
              <button
                key={airport.code}
                onClick={() => { setSelectedAirport(airport); setSelectedTerminal(null); }}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  selectedAirport?.code === airport.code ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{airport.name}</p>
                  <p className="text-xs text-gray-400">{airport.code} · Avg wait: {airport.waitTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">€{airport.price}</p>
                  <p className="text-[10px] text-green-600 font-medium">FREE</p>
                </div>
              </button>
            ))}
          </div>

          {selectedAirport && (
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">TERMINAL</label>
              <div className="flex gap-2">
                {selectedAirport.terminals?.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTerminal(t)}
                    className={`flex-1 p-3 rounded-xl border text-center text-sm font-medium transition-all ${
                      selectedTerminal === t ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Terminal {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            className="w-full"
            disabled={!selectedAirport || !selectedTerminal}
            onClick={() => setStep(2)}
          >
            Choose Time <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2: Time Slot */}
      {step === 2 && selectedAirport && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-400">
            {selectedAirport.name} · Terminal {selectedTerminal}
          </p>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">DATE</label>
            <input
              type="date"
              value={accessDate}
              onChange={(e) => setAccessDate(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">TIME SLOT</label>
            <div className="flex flex-col gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    selectedSlot === slot.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{slot.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{slot.label}</p>
                    <p className="text-xs text-gray-400">{slot.time}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full mt-2" disabled={!selectedSlot} onClick={() => setStep(3)}>
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && selectedAirport && selectedSlot && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Fast Track Details</h3>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-gray-400">Airport</p>
                  <p className="text-sm font-medium">{selectedAirport.name} · Terminal {selectedTerminal}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-gray-400">Date & Time</p>
                  <p className="text-sm font-medium">{accessDate} · {TIME_SLOTS.find((s) => s.id === selectedSlot)?.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-gray-400">Average Wait</p>
                  <p className="text-sm font-medium">{selectedAirport.waitTime} (vs 30-45 min regular)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Fast Track pass</span>
                <span className="text-sm">€{selectedAirport.price}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-600">Privilege discount</span>
                <span className="text-sm text-green-600">-€{selectedAirport.price} (FREE)</span>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold text-green-600">FREE</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                Covered by your {demoUser.companyName} {demoUser.tierName} fast track privilege
              </p>
            </CardContent>
          </Card>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>}

          <Button className="w-full" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Generating Pass...' : 'Get Fast Track Pass'}
          </Button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && result && (
        <div className="flex flex-col items-center gap-5 pt-4">
          <SuccessAnimation />

          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Fast Track Pass Ready!</h2>
            <p className="text-sm text-gray-500">Show this at the security lane entrance</p>
          </div>

          <QRCodeDisplay code={result.passNumber} label="Fast Track Security Pass" size="lg" />

          <Card className="w-full">
            <CardContent className="p-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Airport</span>
                <span className="font-medium">{selectedAirport?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Terminal</span>
                <span className="font-medium">{selectedTerminal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pass #</span>
                <span className="font-mono">{result.passNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valid</span>
                <span className="font-medium">{TIME_SLOTS.find((s) => s.id === selectedSlot)?.time}</span>
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
