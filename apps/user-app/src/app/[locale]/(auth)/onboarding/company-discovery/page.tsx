'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button, Badge, Card } from '@sadak/ui';
import { Building2, Check, Clock, ArrowLeft, Search } from 'lucide-react';

// Mock company data
const COMPANIES = [
  {
    id: 'c0000001-0000-0000-0000-000000000001',
    name: 'Denizbank',
    description: 'Premium travel privileges for cardholders',
    autoDetected: true,
    tier: 'Gold',
    color: '#F59E0B',
  },
  {
    id: 'c0000002-0000-0000-0000-000000000002',
    name: 'Turkish Airlines',
    description: 'Miles&Smiles loyalty program benefits',
    autoDetected: true,
    tier: 'Elite',
    color: '#EF4444',
  },
  {
    id: 'c0000003-0000-0000-0000-000000000003',
    name: 'Garanti BBVA',
    description: 'Bonus card travel privileges',
    autoDetected: false,
    tier: null,
    color: '#10B981',
  },
  {
    id: 'c0000004-0000-0000-0000-000000000004',
    name: 'TROY',
    description: 'National payment network privileges',
    autoDetected: false,
    tier: null,
    color: '#6366F1',
  },
];

export default function CompanyDiscoveryPage() {
  const t = useTranslations();
  const router = useRouter();
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    COMPANIES.filter((c) => c.autoDetected).map((c) => c.id)
  );
  const [requestedCompanies, setRequestedCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleCompany = (id: string) => {
    const company = COMPANIES.find((c) => c.id === id);
    if (company?.autoDetected) return; // Can't deselect auto-detected

    if (requestedCompanies.includes(id)) return; // Already requested

    setRequestedCompanies([...requestedCompanies, id]);
  };

  const handleContinue = () => {
    setLoading(true);
    sessionStorage.setItem(
      'sadak_companies',
      JSON.stringify([...selectedCompanies, ...requestedCompanies])
    );
    setTimeout(() => {
      router.push('/home');
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col p-6 pt-16 md:pt-12">
      {/* Back */}
      <button
        onClick={() => router.push('/onboarding/profile-setup')}
        className="flex items-center gap-2 text-gray-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">{t('common.back')}</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
          <Building2 className="w-7 h-7 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('onboarding.companyDiscovery.title')}
        </h1>
        <p className="text-gray-500 text-sm">
          {t('onboarding.companyDiscovery.subtitle')}
        </p>
      </div>

      {/* Company Cards */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto mb-4">
        {COMPANIES.map((company) => {
          const isSelected = selectedCompanies.includes(company.id);
          const isRequested = requestedCompanies.includes(company.id);

          return (
            <Card
              key={company.id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-200'
                  : isRequested
                  ? 'border-amber-300 bg-amber-50/50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => toggleCompany(company.id)}
            >
              <div className="flex items-start gap-3">
                {/* Company logo placeholder */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ backgroundColor: company.color }}
                >
                  {company.name[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {company.name}
                    </span>
                    {company.tier && (
                      <Badge
                        variant={company.tier === 'Gold' ? 'gold' : 'default'}
                      >
                        {company.tier}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{company.description}</p>

                  {company.autoDetected && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                      <Check className="w-3.5 h-3.5" />
                      {t('onboarding.companyDiscovery.foundYou')}
                    </div>
                  )}
                </div>

                {/* Status indicator */}
                <div className="shrink-0">
                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {isRequested && (
                    <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Continue */}
      <Button
        onClick={handleContinue}
        size="lg"
        className="w-full h-14 text-base"
        disabled={loading}
      >
        {loading ? t('common.loading') : t('onboarding.companyDiscovery.continueToApp')}
      </Button>
    </div>
  );
}
