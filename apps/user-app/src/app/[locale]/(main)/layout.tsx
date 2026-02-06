'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Home, Gift, ShoppingBag, MapPin, User } from 'lucide-react';
import { DemoUserProvider } from '@/contexts/DemoUserContext';

const tabs = [
  { key: 'home', icon: Home, href: '/home' as const },
  { key: 'privileges', icon: Gift, href: '/privileges' as const },
  { key: 'marketplace', icon: ShoppingBag, href: '/marketplace' as const },
  { key: 'trips', icon: MapPin, href: '/trips' as const },
  { key: 'profile', icon: User, href: '/profile' as const },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations('tabs');
  const isFlowPage = pathname.includes('/flows/');

  return (
    <DemoUserProvider>
    <div className="flex flex-col min-h-full">
      {/* Page content */}
      <div className={`flex-1 ${isFlowPage ? '' : 'pb-20'}`}>{children}</div>

      {/* Bottom Tab Navigation — hidden on flow pages */}
      <nav className={`fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-[402px] bg-white border-t border-gray-200 z-40 ${isFlowPage ? 'hidden' : ''}`}>
        <div className="flex justify-around items-center h-16 pb-safe">
          {tabs.map(({ key, icon: Icon, href }) => {
            const isActive = pathname.includes(href);

            return (
              <Link
                key={key}
                href={href}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`}
                />
                <span className="text-[10px] font-medium">{t(key)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </DemoUserProvider>
  );
}
