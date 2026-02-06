-- ============================================================
-- SADAK Platform — Demo Seed Data
-- ============================================================

-- ============================================================
-- Companies
-- ============================================================
INSERT INTO public.companies (id, name, slug, logo_url, description, website, status) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Denizbank', 'denizbank', '/logos/denizbank.svg', 'Turkey''s leading private bank with comprehensive travel privileges for cardholders.', 'https://www.denizbank.com', 'active'),
  ('c0000002-0000-0000-0000-000000000002', 'Turkish Airlines', 'turkish-airlines', '/logos/turkish-airlines.svg', 'Flag carrier airline of Turkey with Miles&Smiles loyalty program.', 'https://www.turkishairlines.com', 'active'),
  ('c0000003-0000-0000-0000-000000000003', 'Garanti BBVA', 'garanti-bbva', '/logos/garanti-bbva.svg', 'One of Turkey''s largest banks offering premium travel benefits.', 'https://www.garantibbva.com.tr', 'active'),
  ('c0000004-0000-0000-0000-000000000004', 'TROY', 'troy', '/logos/troy.svg', 'Turkey''s national payment network providing verification-based privileges.', 'https://www.troyodeme.com', 'active');

-- ============================================================
-- Tiers
-- ============================================================
-- Denizbank tiers
INSERT INTO public.tiers (id, company_id, name, level, description, color, icon) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Classic', 1, 'Denizbank Classic cardholder', '#6B7280', 'credit-card'),
  ('a0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'Gold', 2, 'Denizbank Gold cardholder', '#F59E0B', 'crown'),
  ('a0000003-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'Platinum', 3, 'Denizbank Platinum cardholder', '#8B5CF6', 'gem');

-- Turkish Airlines tiers
INSERT INTO public.tiers (id, company_id, name, level, description, color, icon) VALUES
  ('a0000004-0000-0000-0000-000000000004', 'c0000002-0000-0000-0000-000000000002', 'Classic', 1, 'Miles&Smiles Classic member', '#6B7280', 'plane'),
  ('a0000005-0000-0000-0000-000000000005', 'c0000002-0000-0000-0000-000000000002', 'Elite', 2, 'Miles&Smiles Elite member', '#3B82F6', 'star'),
  ('a0000006-0000-0000-0000-000000000006', 'c0000002-0000-0000-0000-000000000002', 'Elite Plus', 3, 'Miles&Smiles Elite Plus member', '#EF4444', 'award');

-- Garanti BBVA tiers
INSERT INTO public.tiers (id, company_id, name, level, description, color, icon) VALUES
  ('a0000007-0000-0000-0000-000000000007', 'c0000003-0000-0000-0000-000000000003', 'Flexi', 1, 'Garanti BBVA Flexi cardholder', '#6B7280', 'credit-card'),
  ('a0000008-0000-0000-0000-000000000008', 'c0000003-0000-0000-0000-000000000003', 'Bonus Gold', 2, 'Garanti BBVA Bonus Gold cardholder', '#F59E0B', 'crown'),
  ('a0000009-0000-0000-0000-000000000009', 'c0000003-0000-0000-0000-000000000003', 'Bonus Platinum', 3, 'Garanti BBVA Bonus Platinum cardholder', '#8B5CF6', 'gem');

-- ============================================================
-- Providers
-- ============================================================
INSERT INTO public.providers (id, name, slug, type, logo_url, description, status) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'Airalo', 'airalo', 'esim', '/logos/airalo.svg', 'Global eSIM marketplace with coverage in 200+ countries.', 'active'),
  ('b0000002-0000-0000-0000-000000000002', 'Holafly', 'holafly', 'esim', '/logos/holafly.svg', 'Unlimited data eSIM provider for international travelers.', 'active'),
  ('b0000003-0000-0000-0000-000000000003', 'BiTaksi', 'bitaksi', 'transfer', '/logos/bitaksi.svg', 'Turkey''s largest taxi and transfer booking platform.', 'active'),
  ('b0000004-0000-0000-0000-000000000004', 'Uber', 'uber', 'transfer', '/logos/uber.svg', 'Global ride-sharing and transfer service.', 'active'),
  ('b0000005-0000-0000-0000-000000000005', 'Allianz', 'allianz', 'insurance', '/logos/allianz.svg', 'Leading global insurance provider for travel coverage.', 'active'),
  ('b0000006-0000-0000-0000-000000000006', 'AXA', 'axa', 'insurance', '/logos/axa.svg', 'International insurance and travel protection.', 'active'),
  ('b0000007-0000-0000-0000-000000000007', 'Priority Pass', 'priority-pass', 'lounge', '/logos/priority-pass.svg', 'World''s largest independent airport lounge access program.', 'active'),
  ('b0000008-0000-0000-0000-000000000008', 'LoungeKey', 'loungekey', 'lounge', '/logos/loungekey.svg', 'Premium airport lounge access network.', 'active'),
  ('b0000009-0000-0000-0000-000000000009', 'Airport Dimensions', 'airport-dimensions', 'fast_track', '/logos/airport-dimensions.svg', 'Fast track security and airport services.', 'active');

-- ============================================================
-- Privileges — Denizbank
-- ============================================================
-- Denizbank Gold privileges
INSERT INTO public.privileges (id, company_id, title, description, category, usage_model, quota_limit, quota_period, eligible_tier_ids, provider_id, validity_end, sort_order) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Airport Lounge Access', 'Complimentary access to 1,200+ airport lounges worldwide via Priority Pass.', 'lounge', 'free', 3, 'monthly', ARRAY['a0000002-0000-0000-0000-000000000002', 'a0000003-0000-0000-0000-000000000003']::UUID[], 'b0000007-0000-0000-0000-000000000007', '2026-12-31', 1),
  ('d0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'International eSIM', 'Free eSIM data package for international trips.', 'esim', 'free', 1, 'monthly', ARRAY['a0000002-0000-0000-0000-000000000002', 'a0000003-0000-0000-0000-000000000003']::UUID[], 'b0000001-0000-0000-0000-000000000001', '2026-12-31', 2),
  ('d0000003-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'Airport Transfer Discount', '10% discount on all airport transfer bookings.', 'transfer', 'discounted', NULL, NULL, ARRAY['a0000002-0000-0000-0000-000000000002', 'a0000003-0000-0000-0000-000000000003']::UUID[], 'b0000003-0000-0000-0000-000000000003', '2026-12-31', 3);

-- Denizbank Platinum (all Gold privileges + more)
INSERT INTO public.privileges (id, company_id, title, description, category, usage_model, quota_limit, quota_period, eligible_tier_ids, provider_id, discount_percentage, validity_end, sort_order) VALUES
  ('d0000004-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001', 'Premium Lounge Access + Guest', 'Complimentary lounge access with +1 guest at 1,200+ lounges.', 'lounge', 'free', 5, 'monthly', ARRAY['a0000003-0000-0000-0000-000000000003']::UUID[], 'b0000007-0000-0000-0000-000000000007', NULL, '2026-12-31', 4),
  ('d0000005-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000001', 'Premium eSIM Package', 'Two free eSIM data packages per month for international travel.', 'esim', 'free', 2, 'monthly', ARRAY['a0000003-0000-0000-0000-000000000003']::UUID[], 'b0000001-0000-0000-0000-000000000001', NULL, '2026-12-31', 5),
  ('d0000006-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000001', 'Premium Transfer Discount', '20% discount on all airport transfer bookings.', 'transfer', 'discounted', NULL, NULL, ARRAY['a0000003-0000-0000-0000-000000000003']::UUID[], 'b0000003-0000-0000-0000-000000000003', 20, '2026-12-31', 6),
  ('d0000007-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000001', 'Fast Track Security', 'Skip the queues with complimentary fast track security access.', 'fast_track', 'free', NULL, NULL, ARRAY['a0000003-0000-0000-0000-000000000003']::UUID[], 'b0000009-0000-0000-0000-000000000009', NULL, '2026-12-31', 7),
  ('d0000008-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000001', 'Quarterly Travel Insurance', 'One free comprehensive travel insurance per quarter.', 'insurance', 'free', 1, 'yearly', ARRAY['a0000003-0000-0000-0000-000000000003']::UUID[], 'b0000005-0000-0000-0000-000000000005', NULL, '2026-12-31', 8);

-- ============================================================
-- Privileges — Turkish Airlines
-- ============================================================
INSERT INTO public.privileges (id, company_id, title, description, category, usage_model, quota_limit, quota_period, eligible_tier_ids, provider_id, validity_end, sort_order) VALUES
  ('d0000009-0000-0000-0000-000000000009', 'c0000002-0000-0000-0000-000000000002', 'Miles&Smiles Lounge Access', 'Access to Turkish Airlines CIP Lounges.', 'lounge', 'free', 2, 'monthly', ARRAY['a0000005-0000-0000-0000-000000000005', 'a0000006-0000-0000-0000-000000000006']::UUID[], 'b0000008-0000-0000-0000-000000000008', '2026-12-31', 1),
  ('d0000010-0000-0000-0000-000000000010', 'c0000002-0000-0000-0000-000000000002', 'Priority Fast Track', 'Fast track security access at partner airports.', 'fast_track', 'free', NULL, NULL, ARRAY['a0000005-0000-0000-0000-000000000005', 'a0000006-0000-0000-0000-000000000006']::UUID[], 'b0000009-0000-0000-0000-000000000009', '2026-12-31', 2),
  ('d0000011-0000-0000-0000-000000000011', 'c0000002-0000-0000-0000-000000000002', 'Unlimited Lounge + Guest', 'Unlimited access to all partner lounges with +1 guest.', 'lounge', 'free', NULL, NULL, ARRAY['a0000006-0000-0000-0000-000000000006']::UUID[], 'b0000008-0000-0000-0000-000000000008', '2026-12-31', 3),
  ('d0000012-0000-0000-0000-000000000012', 'c0000002-0000-0000-0000-000000000002', 'International Flight eSIM', 'Free eSIM for all international flights.', 'esim', 'free', NULL, NULL, ARRAY['a0000006-0000-0000-0000-000000000006']::UUID[], 'b0000002-0000-0000-0000-000000000002', '2026-12-31', 4);

-- ============================================================
-- Privileges — Garanti BBVA
-- ============================================================
INSERT INTO public.privileges (id, company_id, title, description, category, usage_model, quota_limit, quota_period, eligible_tier_ids, provider_id, discount_percentage, validity_end, sort_order) VALUES
  ('d0000013-0000-0000-0000-000000000013', 'c0000003-0000-0000-0000-000000000003', 'Bonus Lounge Access', 'Complimentary lounge access at major airports.', 'lounge', 'free', 2, 'monthly', ARRAY['a0000008-0000-0000-0000-000000000008', 'a0000009-0000-0000-0000-000000000009']::UUID[], 'b0000007-0000-0000-0000-000000000007', NULL, '2026-12-31', 1),
  ('d0000014-0000-0000-0000-000000000014', 'c0000003-0000-0000-0000-000000000003', 'Travel Insurance Discount', '15% discount on all travel insurance policies.', 'insurance', 'discounted', NULL, NULL, ARRAY['a0000008-0000-0000-0000-000000000008', 'a0000009-0000-0000-0000-000000000009']::UUID[], 'b0000005-0000-0000-0000-000000000005', 15, '2026-12-31', 2),
  ('d0000015-0000-0000-0000-000000000015', 'c0000003-0000-0000-0000-000000000003', 'Premium Lounge + Guest', 'Extended lounge access with +1 guest at 1,200+ lounges.', 'lounge', 'free', 4, 'monthly', ARRAY['a0000009-0000-0000-0000-000000000009']::UUID[], 'b0000007-0000-0000-0000-000000000007', NULL, '2026-12-31', 3),
  ('d0000016-0000-0000-0000-000000000016', 'c0000003-0000-0000-0000-000000000003', 'Bonus eSIM Package', 'One free eSIM data package per month.', 'esim', 'free', 1, 'monthly', ARRAY['a0000009-0000-0000-0000-000000000009']::UUID[], 'b0000002-0000-0000-0000-000000000002', NULL, '2026-12-31', 4),
  ('d0000017-0000-0000-0000-000000000017', 'c0000003-0000-0000-0000-000000000003', 'Free EU Travel Insurance', 'Complimentary travel insurance for all EU destinations.', 'insurance', 'free', NULL, NULL, ARRAY['a0000009-0000-0000-0000-000000000009']::UUID[], 'b0000006-0000-0000-0000-000000000006', NULL, '2026-12-31', 5);

-- ============================================================
-- Marketplace Categories
-- ============================================================
INSERT INTO public.marketplace_categories (id, name, slug, icon, description, sort_order) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'eSIM', 'esim', 'Smartphone', 'Stay connected abroad', 1),
  ('e0000002-0000-0000-0000-000000000002', 'Airport Transfer', 'transfer', 'Car', 'Ride to/from airport', 2),
  ('e0000003-0000-0000-0000-000000000003', 'Travel Insurance', 'insurance', 'Shield', 'Travel worry-free', 3),
  ('e0000004-0000-0000-0000-000000000004', 'Airport Lounge', 'lounge', 'Armchair', 'Relax before your flight', 4),
  ('e0000005-0000-0000-0000-000000000005', 'Fast Track', 'fast-track', 'Zap', 'Skip the queues', 5);

-- ============================================================
-- Campaigns
-- ============================================================
INSERT INTO public.campaigns (id, title, description, type, priority, start_date, end_date, status) VALUES
  ('f0000001-0000-0000-0000-000000000001', 'Welcome Bonus', 'First eSIM free for all new SADAK users! Activate your first international data package at no cost.', 'gift', 10, '2026-01-01', '2026-12-31', 'active'),
  ('f0000002-0000-0000-0000-000000000002', 'Summer Travel Deal', '40% off all airport transfer bookings throughout July. Book your ride and save big!', 'discount', 8, '2026-07-01', '2026-07-31', 'active'),
  ('f0000003-0000-0000-0000-000000000003', 'Berlin Special', 'Free lounge access at Berlin Brandenburg Airport (BER) for all SADAK members this month.', 'gift', 9, '2026-03-01', '2026-03-31', 'active'),
  ('f0000004-0000-0000-0000-000000000004', 'Insurance Bundle', 'Buy eSIM + Travel Insurance together and save 25% on the total. Smart travelers bundle!', 'discount', 7, '2026-01-01', '2026-06-30', 'active'),
  ('f0000005-0000-0000-0000-000000000005', 'Refer & Earn', 'Refer a friend to SADAK and earn an extra lounge visit. Your friend gets one too!', 'extra_quota', 6, '2026-01-01', '2026-12-31', 'active');

-- ============================================================
-- NOTE: Demo user data (users, memberships, trips, transactions)
-- will be created via the application's demo auth flow.
-- The seed below creates them directly for convenience.
-- ============================================================

-- We'll insert demo users after they sign up through the auth flow.
-- For now, the companies, tiers, providers, privileges, and campaigns
-- are all that's needed to get the app running.
