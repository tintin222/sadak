'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button, Card, CardContent, Badge } from '@sadak/ui';
import { Smartphone, Search, Globe, Wifi, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import WizardLayout from '@/components/flows/WizardLayout';
import QRCodeDisplay from '@/components/flows/QRCodeDisplay';
import SuccessAnimation from '@/components/flows/SuccessAnimation';
import { useDemoUser } from '@/contexts/DemoUserContext';
import { createEsimActivation } from '@/lib/flows/supabase-helpers';
import type { EsimResult, ServicePackage, Country } from '@/lib/flows/types';

const COUNTRIES: Country[] = [
  { code: 'DEU', name: 'Germany', flag: '🇩🇪' },
  { code: 'GBR', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FRA', name: 'France', flag: '🇫🇷' },
  { code: 'ITA', name: 'Italy', flag: '🇮🇹' },
  { code: 'ESP', name: 'Spain', flag: '🇪🇸' },
  { code: 'NLD', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'USA', name: 'United States', flag: '🇺🇸' },
  { code: 'JPN', name: 'Japan', flag: '🇯🇵' },
  { code: 'GRC', name: 'Greece', flag: '🇬🇷' },
  { code: 'THA', name: 'Thailand', flag: '🇹🇭' },
  { code: 'ARE', name: 'UAE', flag: '🇦🇪' },
  { code: 'EUR', name: 'Europe (All EU)', flag: '🇪🇺' },
];

const PACKAGES: Record<string, ServicePackage[]> = {
  DEU: [
    { id: 'esim-de-1', providerName: 'Airalo', providerSlug: 'airalo', name: 'Germany 5GB', description: '7 days validity', price: 4.99, currency: 'EUR', features: ['5GB high-speed data', '4G/LTE coverage', 'Instant activation', 'Valid for 7 days'], details: { dataAmount: '5GB', durationDays: 7 } },
    { id: 'esim-de-2', providerName: 'Holafly', providerSlug: 'holafly', name: 'Germany 10GB', description: '15 days validity', price: 8.99, currency: 'EUR', features: ['10GB high-speed data', '4G/LTE coverage', '24/7 support', 'Valid for 15 days'], details: { dataAmount: '10GB', durationDays: 15 }, badge: 'Popular' },
    { id: 'esim-de-3', providerName: 'Airalo', providerSlug: 'airalo', name: 'Germany Unlimited', description: '30 days validity', price: 19.99, currency: 'EUR', features: ['Unlimited data', '4G/LTE coverage', 'Hotspot sharing', 'Valid for 30 days'], details: { dataAmount: 'Unlimited', durationDays: 30 }, badge: 'Best Value' },
  ],
  EUR: [
    { id: 'esim-eu-1', providerName: 'Airalo', providerSlug: 'airalo', name: 'Europe 10GB', description: '30+ countries, 15 days', price: 14.99, currency: 'EUR', features: ['10GB data', '30+ EU countries', '4G/LTE', 'Valid for 15 days'], details: { dataAmount: '10GB', durationDays: 15 } },
    { id: 'esim-eu-2', providerName: 'Holafly', providerSlug: 'holafly', name: 'Europe 20GB', description: '30+ countries, 30 days', price: 24.99, currency: 'EUR', features: ['20GB data', '30+ EU countries', '4G/LTE', 'Valid for 30 days'], details: { dataAmount: '20GB', durationDays: 30 }, badge: 'Best Value' },
  ],
  _default: [
    { id: 'esim-gen-1', providerName: 'Airalo', providerSlug: 'airalo', name: 'Traveler 3GB', description: '7 days validity', price: 5.99, currency: 'EUR', features: ['3GB high-speed data', '4G/LTE coverage', 'Instant activation', 'Valid for 7 days'], details: { dataAmount: '3GB', durationDays: 7 } },
    { id: 'esim-gen-2', providerName: 'Holafly', providerSlug: 'holafly', name: 'Traveler 10GB', description: '15 days validity', price: 11.99, currency: 'EUR', features: ['10GB high-speed data', '4G/LTE coverage', '24/7 support', 'Valid for 15 days'], details: { dataAmount: '10GB', durationDays: 15 }, badge: 'Popular' },
    { id: 'esim-gen-3', providerName: 'Airalo', providerSlug: 'airalo', name: 'Traveler Unlimited', description: '30 days validity', price: 22.99, currency: 'EUR', features: ['Unlimited data', '4G/LTE coverage', 'Hotspot sharing', 'Valid for 30 days'], details: { dataAmount: 'Unlimited', durationDays: 30 } },
  ],
};

// Provider ID mapping (from seed data)
const PROVIDER_IDS: Record<string, string> = {
  airalo: 'b0000001-0000-0000-0000-000000000001',
  holafly: 'b0000002-0000-0000-0000-000000000002',
};

export default function EsimFlowPage() {
  const t = useTranslations();
  const router = useRouter();
  const demoUser = useDemoUser();

  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [result, setResult] = useState<EsimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredCountries = COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  const packages = selectedCountry
    ? PACKAGES[selectedCountry.code] || PACKAGES._default
    : [];

  const handleConfirm = async () => {
    if (!selectedCountry || !selectedPackage) return;
    setLoading(true);
    setError(null);

    try {
      const res = await createEsimActivation({
        userId: demoUser.id,
        providerId: PROVIDER_IDS[selectedPackage.providerSlug] || PROVIDER_IDS.airalo,
        packageName: selectedPackage.name,
        dataAmount: selectedPackage.details.dataAmount as string,
        durationDays: selectedPackage.details.durationDays as number,
        destinationCountry: selectedCountry.name,
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

  const stepTitles = [
    'Select Destination',
    'Choose Package',
    'Review & Confirm',
    'eSIM Activated!',
  ];

  return (
    <WizardLayout
      currentStep={step}
      totalSteps={4}
      title={stepTitles[step - 1]}
      subtitle={step < 4 ? 'International eSIM' : undefined}
      onBack={() => setStep((s) => s - 1)}
      headerColor="from-blue-600 to-cyan-600"
      headerIcon={<Smartphone className="w-6 h-6" />}
    >
      {/* Step 1: Select Country */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-100 text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => { setSelectedCountry(country); setStep(2); }}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                  selectedCountry?.code === country.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="text-2xl">{country.flag}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{country.name}</p>
                  <p className="text-xs text-gray-400">{country.code}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Choose Package */}
      {step === 2 && selectedCountry && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-lg">{selectedCountry.flag}</span>
            <span>{selectedCountry.name}</span>
          </div>

          <div className="flex flex-col gap-3">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`cursor-pointer transition-all ${
                  selectedPackage?.id === pkg.id
                    ? 'ring-2 ring-blue-500 border-blue-500'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-gray-900">{pkg.name}</p>
                        {pkg.badge && (
                          <Badge variant="success" className="text-[10px]">{pkg.badge}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{pkg.providerName} · {pkg.description}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">€{pkg.price}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {pkg.features.map((f) => (
                      <span key={f} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{f}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            className="w-full mt-2"
            disabled={!selectedPackage}
            onClick={() => setStep(3)}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 3: Review & Confirm */}
      {step === 3 && selectedCountry && selectedPackage && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h3>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-400">Destination</p>
                    <p className="text-sm font-medium">{selectedCountry.flag} {selectedCountry.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-400">Package</p>
                    <p className="text-sm font-medium">{selectedPackage.name}</p>
                    <p className="text-xs text-gray-400">{selectedPackage.details.dataAmount as string} · {selectedPackage.providerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-sm font-medium">{selectedPackage.details.durationDays as number} days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Package price</span>
                <span className="text-sm">€{selectedPackage.price}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-600">Privilege discount</span>
                <span className="text-sm text-green-600">-€{selectedPackage.price} (FREE)</span>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold text-green-600">FREE</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                Covered by your {demoUser.companyName} {demoUser.tierName} eSIM privilege
              </p>
            </CardContent>
          </Card>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>
          )}

          <Button className="w-full" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Activating...' : 'Activate eSIM'}
          </Button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && result && (
        <div className="flex flex-col items-center gap-5 pt-4">
          <SuccessAnimation />

          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-1">eSIM Activated!</h2>
            <p className="text-sm text-gray-500">
              Your {result.packageName} is ready to use
            </p>
          </div>

          <QRCodeDisplay code={result.iccid} label="Scan to install eSIM" />

          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Package</span>
                  <span className="font-medium">{result.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Data</span>
                  <span className="font-medium">{result.dataAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Validity</span>
                  <span className="font-medium">{result.durationDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ICCID</span>
                  <span className="font-mono text-xs">{result.iccid}</span>
                </div>
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
