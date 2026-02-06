'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button } from '@sadak/ui';
import { ArrowLeft } from 'lucide-react';

export default function VerifyOTPPage() {
  const t = useTranslations();
  const router = useRouter();
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-verify after countdown (demo mode)
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleVerify();
    }
  }, [countdown]);

  const handleVerify = async () => {
    setVerifying(true);
    // Demo: just navigate to onboarding
    setTimeout(() => {
      router.push('/onboarding/welcome');
    }, 800);
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 pt-16 md:pt-12">
      {/* Back button */}
      <button
        onClick={() => router.push('/login')}
        className="flex items-center gap-2 text-gray-600 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">{t('common.back')}</span>
      </button>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('auth.verifyTitle')}
        </h1>
        <p className="text-gray-500 text-sm">
          {t('auth.verifySubtitle')}
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3 mb-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        ))}
      </div>

      {/* Auto-verify notice */}
      <div className="text-center mb-8">
        {countdown > 0 ? (
          <p className="text-sm text-blue-500 animate-pulse">
            Auto-verifying in {countdown}s...
          </p>
        ) : verifying ? (
          <p className="text-sm text-green-600">Verifying...</p>
        ) : null}
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerify}
        size="lg"
        className="w-full h-14 text-base mt-auto mb-8"
        disabled={verifying || otp.some((d) => !d)}
      >
        {verifying ? t('common.loading') : t('auth.verify')}
      </Button>
    </div>
  );
}
