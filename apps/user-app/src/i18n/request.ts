import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

const messageImports = {
  tr: () => import('../../../../packages/i18n/messages/tr.json'),
  en: () => import('../../../../packages/i18n/messages/en.json'),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'tr' | 'en')) {
    locale = routing.defaultLocale;
  }

  const importFn = messageImports[locale as keyof typeof messageImports] ?? messageImports.tr;
  const messages = (await importFn()).default;

  return {
    locale,
    messages,
  };
});
