import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['@sadak/ui', '@sadak/shared', '@sadak/i18n', '@sadak/database'],
};

export default withNextIntl(nextConfig);
