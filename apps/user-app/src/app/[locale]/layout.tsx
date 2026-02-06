import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'tr' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-gray-50">
        <NextIntlClientProvider messages={messages}>
          {/* Mobile frame wrapper for demo */}
          <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center md:p-4">
            <div className="w-full md:max-w-[430px] md:h-[932px] bg-white md:rounded-[3rem] md:shadow-2xl md:border-[14px] md:border-gray-900 relative overflow-hidden">
              {/* Notch (desktop only) */}
              <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-900 rounded-b-2xl z-50" />
              {/* App content */}
              <div className="h-full md:h-[904px] overflow-y-auto overflow-x-hidden">
                {children}
              </div>
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
