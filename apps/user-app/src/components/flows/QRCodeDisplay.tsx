'use client';

import { Card, CardContent } from '@sadak/ui';
import { QrCode } from 'lucide-react';

interface QRCodeDisplayProps {
  code: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function QRCodeDisplay({ code, label, size = 'md' }: QRCodeDisplayProps) {
  const sizeMap = { sm: 120, md: 180, lg: 240 };
  const px = sizeMap[size];

  return (
    <Card className="inline-flex flex-col items-center">
      <CardContent className="p-5 flex flex-col items-center gap-3">
        {/* Mock QR code pattern */}
        <div
          className="bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center relative overflow-hidden"
          style={{ width: px, height: px }}
        >
          <div className="absolute inset-2 grid grid-cols-8 grid-rows-8 gap-[2px]">
            {Array.from({ length: 64 }, (_, i) => {
              // Deterministic pattern from the code string
              const charCode = code.charCodeAt(i % code.length) || 0;
              const filled = (charCode + i * 7) % 3 !== 0;
              return (
                <div
                  key={i}
                  className={`rounded-[1px] ${filled ? 'bg-gray-900' : 'bg-white'}`}
                />
              );
            })}
          </div>
          {/* Center icon */}
          <div className="relative z-10 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <QrCode className="w-6 h-6 text-gray-900" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-0.5">{label}</p>
          <p className="text-sm font-mono font-medium text-gray-700 tracking-wider">{code}</p>
        </div>
      </CardContent>
    </Card>
  );
}
