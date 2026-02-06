'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button, Card, CardContent, Badge } from '@sadak/ui';
import { Shield, Globe, Calendar, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import WizardLayout from '@/components/flows/WizardLayout';
import SuccessAnimation from '@/components/flows/SuccessAnimation';
import { useDemoUser } from '@/contexts/DemoUserContext';
import { createInsurancePolicy } from '@/lib/flows/supabase-helpers';
import type { InsuranceResult, ServicePackage, Country } from '@/lib/flows/types';

const DESTINATIONS: Country[] = [
  { code: 'DEU', name: 'Germany', flag: '🇩🇪' },
  { code: 'GBR', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FRA', name: 'France', flag: '🇫🇷' },
  { code: 'ITA', name: 'Italy', flag: '🇮🇹' },
  { code: 'ESP', name: 'Spain', flag: '🇪🇸' },
  { code: 'USA', name: 'United States', flag: '🇺🇸' },
  { code: 'EUR', name: 'Europe (Schengen)', flag: '🇪🇺' },
];

const PLANS: ServicePackage[] = [
  {
    id: 'ins-basic', providerName: 'Allianz', providerSlug: 'allianz', name: 'Basic',
    description: 'Essential coverage for your trip', price: 9.99, currency: 'EUR',
    features: ['Medical up to €50,000', 'Baggage loss up to €1,000', 'Trip cancellation up to €2,000', '24/7 assistance hotline'],
    details: { coverageAmount: 50000, medical: 50000, baggage: 1000, cancellation: 2000 },
  },
  {
    id: 'ins-plus', providerName: 'Allianz', providerSlug: 'allianz', name: 'Plus',
    description: 'Comprehensive protection', price: 19.99, currency: 'EUR',
    features: ['Medical up to €100,000', 'Baggage loss up to €2,500', 'Trip cancellation up to €5,000', 'Adventure sports covered', '24/7 multilingual support'],
    details: { coverageAmount: 100000, medical: 100000, baggage: 2500, cancellation: 5000 }, badge: 'Recommended',
  },
  {
    id: 'ins-premium', providerName: 'AXA', providerSlug: 'axa', name: 'Premium',
    description: 'Maximum protection & benefits', price: 34.99, currency: 'EUR',
    features: ['Medical up to €250,000', 'Baggage loss up to €5,000', 'Trip cancellation up to €10,000', 'Car rental coverage', 'Priority claims processing'],
    details: { coverageAmount: 250000, medical: 250000, baggage: 5000, cancellation: 10000 }, badge: 'Best Coverage',
  },
];

const PROVIDER_IDS: Record<string, string> = {
  allianz: 'b0000005-0000-0000-0000-000000000005',
  axa: 'b0000006-0000-0000-0000-000000000006',
};

export default function InsuranceFlowPage() {
  const router = useRouter();
  const demoUser = useDemoUser();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<Country | null>(null);
  const [startDate, setStartDate] = useState('2026-03-22');
  const [endDate, setEndDate] = useState('2026-03-29');
  const [selectedPlan, setSelectedPlan] = useState<ServicePackage | null>(null);
  const [result, setResult] = useState<InsuranceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!destination || !selectedPlan) return;
    setLoading(true);
    setError(null);

    try {
      const res = await createInsurancePolicy({
        userId: demoUser.id,
        providerId: PROVIDER_IDS[selectedPlan.providerSlug] || PROVIDER_IDS.allianz,
        providerName: selectedPlan.providerName,
        planName: selectedPlan.name,
        destination: destination.name,
        startDate,
        endDate,
        coverageAmount: selectedPlan.details.coverageAmount as number,
        amount: selectedPlan.price,
        currency: selectedPlan.currency,
        beneficiaryName: `${demoUser.firstName} ${demoUser.lastName}`,
      });
      setResult(res);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Trip Details', 'Choose Plan', 'Review & Confirm', 'Policy Issued!'];

  return (
    <WizardLayout
      currentStep={step}
      totalSteps={4}
      title={stepTitles[step - 1]}
      subtitle={step < 4 ? 'Travel Insurance' : undefined}
      onBack={() => setStep((s) => s - 1)}
      headerColor="from-red-600 to-rose-700"
      headerIcon={<Shield className="w-6 h-6" />}
    >
      {/* Step 1: Trip Details */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">DESTINATION</label>
            <div className="flex flex-col gap-2">
              {DESTINATIONS.map((d) => (
                <button
                  key={d.code}
                  onClick={() => setDestination(d)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    destination?.code === d.code ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{d.flag}</span>
                  <p className="text-sm font-medium">{d.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">START DATE</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">END DATE</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          <Button className="w-full" disabled={!destination} onClick={() => setStep(2)}>
            Choose Plan <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2: Choose Plan */}
      {step === 2 && destination && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-400">
            {destination.flag} {destination.name} · {startDate} to {endDate}
          </p>

          <div className="flex flex-col gap-3">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id ? 'ring-2 ring-red-500 border-red-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{plan.name}</p>
                        {plan.badge && <Badge variant="success" className="text-[10px]">{plan.badge}</Badge>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{plan.providerName} · {plan.description}</p>
                    </div>
                    <p className="text-lg font-bold">€{plan.price}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-3">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        <span className="text-xs text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button className="w-full mt-2" disabled={!selectedPlan} onClick={() => setStep(3)}>
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && destination && selectedPlan && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Policy Details</h3>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-400">Destination</p>
                  <p className="text-sm font-medium">{destination.flag} {destination.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-400">Travel Period</p>
                  <p className="text-sm font-medium">{startDate} — {endDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-400">Plan</p>
                  <p className="text-sm font-medium">{selectedPlan.name} by {selectedPlan.providerName}</p>
                  <p className="text-xs text-gray-400">Coverage up to €{(selectedPlan.details.coverageAmount as number).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Insured</p>
                  <p className="text-sm font-medium">{demoUser.firstName} {demoUser.lastName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Premium</span>
                <span className="text-sm">€{selectedPlan.price}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold">€{selectedPlan.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>}

          <Button className="w-full" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Issuing Policy...' : 'Purchase Insurance'}
          </Button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && result && (
        <div className="flex flex-col items-center gap-5 pt-4">
          <SuccessAnimation />

          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Policy Issued!</h2>
            <p className="text-sm text-gray-500">You are now covered for your trip</p>
          </div>

          <Card className="w-full">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Policy Number</span>
                <span className="font-mono font-medium">{result.policyNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Plan</span>
                <span className="font-medium">{result.planName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Coverage</span>
                <span className="font-medium">€{result.coverageAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Valid</span>
                <span className="font-medium">{result.startDate} — {result.endDate}</span>
              </div>
            </CardContent>
          </Card>

          <div className="bg-green-50 rounded-xl p-3 w-full">
            <p className="text-xs text-green-700 text-center">
              Policy documents have been sent to {demoUser.email}
            </p>
          </div>

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
