'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button, Input } from '@sadak/ui';
import { Plane } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    // In demo mode, just navigate to OTP page
    // Store the input for the OTP page
    sessionStorage.setItem('sadak_auth_input', input);
    setTimeout(() => {
      router.push('/verify-otp');
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 pt-16 md:pt-12">
      {/* Logo & Welcome */}
      <div className="flex flex-col items-center text-center mt-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
          <Plane className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('auth.welcome')}
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          {t('auth.loginSubtitle')}
        </p>
        <p className="text-xs text-blue-500 bg-blue-50 px-3 py-1 rounded-full mt-2">
          {t('auth.demoNotice')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-auto mb-8">
        <Input
          type="text"
          placeholder={t('auth.phoneOrEmail')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="text-center text-lg h-14"
          autoFocus
        />
        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-base"
          disabled={!input.trim() || loading}
        >
          {loading ? t('common.loading') : t('auth.continue')}
        </Button>
      </form>
    </div>
  );
}
