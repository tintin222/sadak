'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button, Input } from '@sadak/ui';
import { User, ArrowLeft } from 'lucide-react';

export default function ProfileSetupPage() {
  const t = useTranslations();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    setLoading(true);
    // Store profile data in session for demo
    sessionStorage.setItem(
      'sadak_profile',
      JSON.stringify({ firstName, lastName, nationalId, language })
    );
    setTimeout(() => {
      router.push('/onboarding/company-discovery');
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col p-6 pt-16 md:pt-12">
      {/* Back */}
      <button
        onClick={() => router.push('/onboarding/welcome')}
        className="flex items-center gap-2 text-gray-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">{t('common.back')}</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
          <User className="w-7 h-7 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('onboarding.profileSetup.title')}
        </h1>
        <p className="text-gray-500 text-sm">
          {t('onboarding.profileSetup.subtitle')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t('onboarding.profileSetup.firstName')}
          </label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Efe"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t('onboarding.profileSetup.lastName')}
          </label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Demir"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t('onboarding.profileSetup.nationalId')}
          </label>
          <Input
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            placeholder="12345678901"
          />
          <p className="text-xs text-gray-400 mt-1">
            {t('onboarding.profileSetup.nationalIdHint')}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t('onboarding.profileSetup.language')}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setLanguage('tr')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                language === 'tr'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              Turkce
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                language === 'en'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="mt-auto pb-4">
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-base"
            disabled={!firstName.trim() || !lastName.trim() || loading}
          >
            {loading ? t('common.loading') : t('onboarding.profileSetup.complete')}
          </Button>
        </div>
      </form>
    </div>
  );
}
