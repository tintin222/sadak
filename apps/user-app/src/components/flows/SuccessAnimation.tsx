'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessAnimationProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function SuccessAnimation({ size = 'md' }: SuccessAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sizeMap = {
    sm: { container: 'w-16 h-16', icon: 'w-10 h-10' },
    md: { container: 'w-20 h-20', icon: 'w-12 h-12' },
    lg: { container: 'w-24 h-24', icon: 'w-16 h-16' },
  };

  const s = sizeMap[size];

  return (
    <div
      className={`${s.container} rounded-full bg-green-100 flex items-center justify-center transition-all duration-500 ${
        visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      }`}
    >
      <CheckCircle2 className={`${s.icon} text-green-600`} />
    </div>
  );
}
