'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Badge, Card, Separator, Switch } from '@sadak/ui';
import {
  User,
  Shield,
  Building2,
  ChevronRight,
  Globe,
  Bell,
  DollarSign,
  Plane,
  FileText,
  Smartphone,
  Car,
  HelpCircle,
  Mail,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

const MOCK_PROFILE = {
  firstName: 'Efe',
  lastName: 'Demir',
  email: 'efe@example.com',
  phone: '+90 555 123 45 01',
  troyVerified: true,
};

const MOCK_MEMBERSHIPS = [
  { company: 'Denizbank', tier: 'Gold', status: 'active', color: '#F59E0B', since: 'Jan 2024' },
  { company: 'Turkish Airlines', tier: 'Elite', status: 'active', color: '#EF4444', since: 'Mar 2023' },
];

export default function ProfilePage() {
  const t = useTranslations();
  const router = useRouter();
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="px-4 pt-10 pb-4 md:pt-8">
        <h1 className="text-xl font-bold text-gray-900 mb-4">{t('profile.title')}</h1>

        {/* Profile card */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
            {MOCK_PROFILE.firstName[0]}{MOCK_PROFILE.lastName[0]}
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900">
              {MOCK_PROFILE.firstName} {MOCK_PROFILE.lastName}
            </p>
            <p className="text-sm text-gray-500">{MOCK_PROFILE.email}</p>
          </div>
          <button className="text-sm text-blue-600 font-medium">
            {t('profile.editProfile')}
          </button>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* My Account */}
        <Section title={t('profile.myAccount')}>
          <SettingsItem
            icon={User}
            label={t('profile.personalInfo')}
            trailing={<ChevronRight className="w-4 h-4 text-gray-300" />}
          />
          <SettingsItem
            icon={Shield}
            label={t('profile.troyVerification')}
            trailing={
              MOCK_PROFILE.troyVerified ? (
                <Badge variant="success">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {t('profile.troyVerified')}
                </Badge>
              ) : (
                <Badge variant="warning">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {t('profile.troyNotVerified')}
                </Badge>
              )
            }
          />
          <SettingsItem
            icon={Lock}
            label={t('profile.security')}
            trailing={<ChevronRight className="w-4 h-4 text-gray-300" />}
          />
        </Section>

        {/* My Companies */}
        <Section
          title={t('profile.myCompanies')}
          action={
            <button className="text-xs text-blue-600 font-medium">
              {t('profile.addCompany')}
            </button>
          }
        >
          {MOCK_MEMBERSHIPS.map((membership) => (
            <div
              key={membership.company}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: membership.color }}
              >
                {membership.company[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{membership.company}</p>
                  <Badge
                    variant={membership.tier === 'Gold' ? 'gold' : 'default'}
                    className="text-[10px]"
                  >
                    {membership.tier}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">
                  {t('profile.memberSince', { date: membership.since })}
                </p>
              </div>
              <Badge variant="success" className="text-[10px]">
                {t('profile.active')}
              </Badge>
            </div>
          ))}
        </Section>

        {/* Preferences */}
        <Section title={t('profile.preferences')}>
          <div className="px-4 py-3 border-b border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{t('profile.language')}</span>
              </div>
            </div>
            <div className="flex gap-2 ml-8">
              <button
                onClick={() => setLanguage('tr')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  language === 'tr'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Turkce
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                English
              </button>
            </div>
          </div>
          <SettingsItem
            icon={Bell}
            label={t('profile.notifications')}
            trailing={
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            }
          />
          <SettingsItem
            icon={DollarSign}
            label={t('profile.currency')}
            trailing={<span className="text-sm text-gray-500">EUR</span>}
          />
          <SettingsItem
            icon={Plane}
            label={t('profile.travelPreferences')}
            trailing={<ChevronRight className="w-4 h-4 text-gray-300" />}
          />
        </Section>

        {/* Documents */}
        <Section title={t('profile.documents')}>
          <SettingsItem
            icon={Shield}
            label={t('profile.insurancePolicies')}
            trailing={<ChevronRight className="w-4 h-4 text-gray-300" />}
          />
          <SettingsItem
            icon={Smartphone}
            label={t('profile.esimCodes')}
            trailing={<ChevronRight className="w-4 h-4 text-gray-300" />}
          />
          <SettingsItem
            icon={Car}
            label={t('profile.transferConfirmations')}
            trailing={<ChevronRight className="w-4 h-4 text-gray-300" />}
          />
        </Section>

        {/* Legal */}
        <Section title={t('profile.legal')}>
          <SettingsItem
            icon={FileText}
            label={t('profile.terms')}
            trailing={<ChevronRight className="w-4 h-4 text-gray-300" />}
          />
          <SettingsItem
            icon={Lock}
            label={t('profile.privacy')}
            trailing={<ChevronRight className="w-4 h-4 text-gray-300" />}
          />
          <SettingsItem
            icon={HelpCircle}
            label={t('profile.helpCenter')}
            trailing={<ChevronRight className="w-4 h-4 text-gray-300" />}
          />
          <SettingsItem
            icon={Mail}
            label={t('profile.contactSupport')}
            trailing={<ChevronRight className="w-4 h-4 text-gray-300" />}
          />
          <div className="px-4 py-3 text-xs text-gray-400 text-center">
            {t('profile.appVersion')} 1.0.0 (MVP)
          </div>
        </Section>

        {/* Logout */}
        <button
          onClick={() => router.push('/login')}
          className="flex items-center justify-center gap-2 w-full py-3 text-red-500 font-medium text-sm rounded-2xl border border-red-200 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t('profile.logout')}
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
        {action}
      </div>
      <Card className="overflow-hidden">{children}</Card>
    </div>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  trailing,
}: {
  icon: typeof User;
  label: string;
  trailing: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      {trailing}
    </div>
  );
}
