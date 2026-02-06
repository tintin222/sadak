import type { PrivilegeCategory } from '../types';

export const PRIVILEGE_CATEGORIES: { value: PrivilegeCategory; labelKey: string }[] = [
  { value: 'lounge', labelKey: 'privileges.categories.lounge' },
  { value: 'fast_track', labelKey: 'privileges.categories.fast_track' },
  { value: 'esim', labelKey: 'privileges.categories.esim' },
  { value: 'transfer', labelKey: 'privileges.categories.transfer' },
  { value: 'insurance', labelKey: 'privileges.categories.insurance' },
  { value: 'dining', labelKey: 'privileges.categories.dining' },
  { value: 'shopping', labelKey: 'privileges.categories.shopping' },
  { value: 'health', labelKey: 'privileges.categories.health' },
  { value: 'entertainment', labelKey: 'privileges.categories.entertainment' },
  { value: 'other', labelKey: 'privileges.categories.other' },
];

export const PRIVILEGE_CATEGORY_ICONS: Record<PrivilegeCategory, string> = {
  lounge: 'Armchair',
  fast_track: 'Zap',
  esim: 'Smartphone',
  transfer: 'Car',
  insurance: 'Shield',
  dining: 'UtensilsCrossed',
  shopping: 'ShoppingBag',
  health: 'Heart',
  entertainment: 'Ticket',
  other: 'Star',
};

export const PRIVILEGE_CATEGORY_COLORS: Record<PrivilegeCategory, string> = {
  lounge: '#8B5CF6',
  fast_track: '#F59E0B',
  esim: '#3B82F6',
  transfer: '#10B981',
  insurance: '#EF4444',
  dining: '#F97316',
  shopping: '#EC4899',
  health: '#14B8A6',
  entertainment: '#6366F1',
  other: '#6B7280',
};
