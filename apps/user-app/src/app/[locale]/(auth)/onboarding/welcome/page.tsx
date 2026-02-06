'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button } from '@sadak/ui';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const slides = [
  {
    titleKey: 'onboarding.slide1Title',
    subtitleKey: 'onboarding.slide1Subtitle',
  },
  {
    titleKey: 'onboarding.slide2Title',
    subtitleKey: 'onboarding.slide2Subtitle',
  },
  {
    titleKey: 'onboarding.slide3Title',
    subtitleKey: 'onboarding.slide3Subtitle',
  },
];

export default function WelcomePage() {
  const t = useTranslations();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/onboarding/profile-setup');
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/profile-setup');
  };

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Skip button */}
      <div className="flex justify-end p-4 pt-10 md:pt-6">
        <button
          onClick={handleSkip}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1"
        >
          {t('onboarding.skip')}
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-40 h-40 rounded-3xl bg-white flex items-center justify-center mb-10 shadow-xl overflow-hidden">
          <Image
            src="/sadak-logo.jpeg"
            alt="Sadakat"
            width={160}
            height={160}
            className="object-contain p-2"
            priority
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t(slide.titleKey)}
        </h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-sm">
          {t(slide.subtitleKey)}
        </p>
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-10">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          size="lg"
          className="w-full h-14 text-base"
        >
          {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
          {isLast ? <ArrowRight className="w-5 h-5 ml-2" /> : <ChevronRight className="w-5 h-5 ml-1" />}
        </Button>
      </div>
    </div>
  );
}
