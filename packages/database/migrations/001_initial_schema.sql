-- ============================================================
-- SADAK Platform — Full Database Schema
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Users (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  national_id TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'tr',
  preferred_currency TEXT NOT NULL DEFAULT 'TRY',
  home_airport TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create user profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, phone)
  VALUES (NEW.id, NEW.email, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- Companies
-- ============================================================
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  settings JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Tiers (per company)
-- ============================================================
CREATE TABLE public.tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, level)
);

-- ============================================================
-- User Memberships
-- ============================================================
CREATE TABLE public.user_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES public.tiers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected', 'suspended')),
  request_source TEXT NOT NULL DEFAULT 'user_request' CHECK (request_source IN ('auto_detected', 'troy', 'user_request')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  UNIQUE(user_id, company_id)
);

CREATE INDEX idx_user_memberships_user ON public.user_memberships(user_id);
CREATE INDEX idx_user_memberships_company ON public.user_memberships(company_id);

-- ============================================================
-- Providers
-- ============================================================
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('esim', 'transfer', 'insurance', 'lounge', 'fast_track')),
  logo_url TEXT,
  description TEXT,
  api_base_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Privileges
-- ============================================================
CREATE TABLE public.privileges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('esim', 'transfer', 'insurance', 'lounge', 'fast_track', 'dining', 'shopping', 'health', 'entertainment', 'other')),
  usage_model TEXT NOT NULL DEFAULT 'free' CHECK (usage_model IN ('free', 'discounted', 'paid')),
  discount_percentage NUMERIC,
  quota_limit INTEGER,
  quota_period TEXT CHECK (quota_period IN ('daily', 'monthly', 'yearly', 'once')),
  eligible_tier_ids UUID[] NOT NULL DEFAULT '{}',
  provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
  validity_start DATE,
  validity_end DATE,
  terms TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_privileges_company ON public.privileges(company_id);
CREATE INDEX idx_privileges_category ON public.privileges(category);
CREATE INDEX idx_privileges_provider ON public.privileges(provider_id);

-- ============================================================
-- User Privilege Usage Tracking
-- ============================================================
CREATE TABLE public.user_privilege_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  privilege_id UUID NOT NULL REFERENCES public.privileges(id) ON DELETE CASCADE,
  membership_id UUID NOT NULL REFERENCES public.user_memberships(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  transaction_id UUID,
  period_key TEXT NOT NULL
);

CREATE INDEX idx_privilege_usage_user ON public.user_privilege_usage(user_id);
CREATE INDEX idx_privilege_usage_period ON public.user_privilege_usage(user_id, privilege_id, period_key);

-- ============================================================
-- Campaigns
-- ============================================================
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('discount', 'gift', 'extra_quota', 'promotion')),
  linked_privilege_id UUID REFERENCES public.privileges(id) ON DELETE SET NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_tier_ids UUID[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Marketplace Categories
-- ============================================================
CREATE TABLE public.marketplace_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- ============================================================
-- Trips
-- ============================================================
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  origin_city TEXT NOT NULL,
  origin_country TEXT NOT NULL,
  origin_airport_code TEXT,
  destination_city TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  destination_airport_code TEXT,
  flight_number TEXT,
  departure_date DATE NOT NULL,
  return_date DATE,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trips_user ON public.trips(user_id);
CREATE INDEX idx_trips_status ON public.trips(status);

-- ============================================================
-- Transactions
-- ============================================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('esim', 'transfer', 'insurance', 'lounge', 'fast_track')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'failed', 'cancelled')),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  privilege_id UUID REFERENCES public.privileges(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  flow_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_transactions_user ON public.transactions(user_id);
CREATE INDEX idx_transactions_trip ON public.transactions(trip_id);

-- ============================================================
-- eSIM Activations
-- ============================================================
CREATE TABLE public.esim_activations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  data_amount TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  destination_country TEXT NOT NULL,
  flight_number TEXT,
  activation_type TEXT NOT NULL DEFAULT 'qr' CHECK (activation_type IN ('qr', 'link')),
  qr_code_data TEXT,
  activation_link TEXT,
  provider_package_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- ============================================================
-- Transfer Reservations
-- ============================================================
CREATE TABLE public.transfer_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  origin_address TEXT NOT NULL,
  origin_lat NUMERIC,
  origin_lng NUMERIC,
  destination_address TEXT NOT NULL,
  dest_lat NUMERIC,
  dest_lng NUMERIC,
  pickup_time TIMESTAMPTZ NOT NULL,
  estimated_duration_min INTEGER,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY',
  reservation_ref TEXT,
  driver_name TEXT,
  driver_rating NUMERIC,
  driver_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- ============================================================
-- Insurance Policies
-- ============================================================
CREATE TABLE public.insurance_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  coverage_amount NUMERIC NOT NULL,
  coverage_currency TEXT NOT NULL DEFAULT 'EUR',
  premium_price NUMERIC NOT NULL,
  premium_currency TEXT NOT NULL DEFAULT 'EUR',
  policy_number TEXT NOT NULL,
  policy_pdf_url TEXT,
  beneficiary_name TEXT NOT NULL,
  travel_start DATE NOT NULL,
  travel_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

-- ============================================================
-- Service Passes (Lounge + Fast Track)
-- ============================================================
CREATE TABLE public.service_passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('lounge', 'fast_track')),
  venue_name TEXT NOT NULL,
  location TEXT NOT NULL,
  access_code TEXT NOT NULL,
  access_code_type TEXT NOT NULL DEFAULT 'qr' CHECK (access_code_type IN ('qr', 'barcode')),
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 0,
  used_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active'
);

-- ============================================================
-- Notifications
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('privilege_unlocked', 'trip_reminder', 'transaction_complete', 'membership_update', 'campaign')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);

-- ============================================================
-- TROY Verifications
-- ============================================================
CREATE TABLE public.troy_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  national_id_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_verified' CHECK (status IN ('verified', 'not_verified', 'error')),
  verified_at TIMESTAMPTZ
);

-- ============================================================
-- Admin Users
-- ============================================================
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('super_admin', 'company_admin', 'operator', 'read_only')),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Provider Users
-- ============================================================
CREATE TABLE public.provider_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'operator',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Audit Logs
-- ============================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('admin', 'provider', 'system')),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privileges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_privilege_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users: own data
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Companies: public read
CREATE POLICY "companies_select_all" ON public.companies FOR SELECT USING (true);

-- Tiers: public read
CREATE POLICY "tiers_select_all" ON public.tiers FOR SELECT USING (true);

-- Memberships: own data
CREATE POLICY "memberships_select_own" ON public.user_memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "memberships_insert_own" ON public.user_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "memberships_update_own" ON public.user_memberships FOR UPDATE USING (auth.uid() = user_id);

-- Providers: public read
CREATE POLICY "providers_select_all" ON public.providers FOR SELECT USING (true);

-- Privileges: public read
CREATE POLICY "privileges_select_all" ON public.privileges FOR SELECT USING (true);

-- Privilege usage: own data
CREATE POLICY "usage_select_own" ON public.user_privilege_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usage_insert_own" ON public.user_privilege_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Campaigns: public read
CREATE POLICY "campaigns_select_all" ON public.campaigns FOR SELECT USING (true);

-- Marketplace categories: public read
CREATE POLICY "categories_select_all" ON public.marketplace_categories FOR SELECT USING (true);

-- Trips: own data
CREATE POLICY "trips_select_own" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trips_insert_own" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trips_update_own" ON public.trips FOR UPDATE USING (auth.uid() = user_id);

-- Transactions: own data
CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: own data
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
