'use client';

import { useRouter } from '@/i18n/routing';
import { Button, Progress } from '@sadak/ui';
import { ArrowLeft, Check } from 'lucide-react';

interface WizardLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: React.ReactNode;
  headerColor?: string;
  headerIcon?: React.ReactNode;
}

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isCurrent
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'bg-white/30 text-white/70'
              }`}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-6 h-0.5 ${
                  isCompleted ? 'bg-green-500' : 'bg-white/30'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function WizardLayout({
  currentStep,
  totalSteps,
  title,
  subtitle,
  onBack,
  children,
  headerColor = 'from-blue-600 to-blue-800',
  headerIcon,
}: WizardLayoutProps) {
  const router = useRouter();
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleBack = () => {
    if (currentStep <= 1) {
      router.back();
    } else {
      onBack();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className={`bg-gradient-to-br ${headerColor} text-white px-4 pt-10 pb-5 md:pt-8`}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">
              {currentStep <= 1 ? 'Back' : `Step ${currentStep - 1}`}
            </span>
          </button>
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        <div className="flex items-center gap-3">
          {headerIcon && (
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              {headerIcon}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold">{title}</h1>
            {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
          </div>
        </div>

        <div className="mt-4">
          <Progress value={progressPercent} className="h-1 bg-white/20" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-5 pb-24">
        {children}
      </div>
    </div>
  );
}
