-- ============================================================
-- SADAK Platform — Demo User Seed
-- Run this AFTER 001_seed_data.sql
-- ============================================================

-- Create demo user in auth.users (Supabase Auth)
-- This uses the raw_user_meta_data approach for demo purposes
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token,
  email_change_token_new
) VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'efe@demo.sadak.app',
  crypt('demo123456', gen_salt('bf')),
  NOW(),
  '+905551234567',
  NOW(),
  NOW(),
  NOW(),
  '{"first_name": "Efe", "last_name": "Yilmaz"}'::jsonb,
  FALSE,
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create user profile in public.users
INSERT INTO public.users (
  id, email, phone, first_name, last_name, preferred_language,
  preferred_currency, home_airport, onboarding_completed
) VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'efe@demo.sadak.app',
  '+905551234567',
  'Efe',
  'Yilmaz',
  'tr',
  'EUR',
  'IST',
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- Create membership: Denizbank Gold
INSERT INTO public.user_memberships (
  id, user_id, company_id, tier_id, status, request_source
) VALUES (
  'ab000001-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'c0000001-0000-0000-0000-000000000001',
  'a0000002-0000-0000-0000-000000000002',
  'active',
  'auto_detected'
) ON CONFLICT (id) DO NOTHING;

-- Create membership: Turkish Airlines Elite
INSERT INTO public.user_memberships (
  id, user_id, company_id, tier_id, status, request_source
) VALUES (
  'ab000002-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'c0000002-0000-0000-0000-000000000002',
  'a0000005-0000-0000-0000-000000000005',
  'active',
  'auto_detected'
) ON CONFLICT (id) DO NOTHING;
