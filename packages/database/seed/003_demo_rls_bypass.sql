-- ============================================================
-- Demo-mode RLS bypass policies
-- Adds permissive policies so the hardcoded demo user can
-- read/write without being authenticated via Supabase Auth.
-- Run this AFTER 001_seed_data.sql and 002_demo_user.sql.
-- ============================================================

-- Demo user UUID (must match 002_demo_user.sql & DemoUserContext.tsx)
-- a1b2c3d4-0000-0000-0000-000000000001

-- ─── users table ─────────────────────────────────────────────
CREATE POLICY "demo_users_select"
  ON public.users FOR SELECT
  USING (id = 'a1b2c3d4-0000-0000-0000-000000000001');

CREATE POLICY "demo_users_update"
  ON public.users FOR UPDATE
  USING (id = 'a1b2c3d4-0000-0000-0000-000000000001');

-- ─── user_memberships table ─────────────────────────────────
CREATE POLICY "demo_memberships_select"
  ON public.user_memberships FOR SELECT
  USING (user_id = 'a1b2c3d4-0000-0000-0000-000000000001');

-- ─── transactions table ─────────────────────────────────────
CREATE POLICY "demo_transactions_select"
  ON public.transactions FOR SELECT
  USING (user_id = 'a1b2c3d4-0000-0000-0000-000000000001');

CREATE POLICY "demo_transactions_insert"
  ON public.transactions FOR INSERT
  WITH CHECK (user_id = 'a1b2c3d4-0000-0000-0000-000000000001');

-- ─── trips table ─────────────────────────────────────────────
CREATE POLICY "demo_trips_select"
  ON public.trips FOR SELECT
  USING (user_id = 'a1b2c3d4-0000-0000-0000-000000000001');

CREATE POLICY "demo_trips_insert"
  ON public.trips FOR INSERT
  WITH CHECK (user_id = 'a1b2c3d4-0000-0000-0000-000000000001');

CREATE POLICY "demo_trips_update"
  ON public.trips FOR UPDATE
  USING (user_id = 'a1b2c3d4-0000-0000-0000-000000000001');

-- ─── notifications table ────────────────────────────────────
CREATE POLICY "demo_notifications_select"
  ON public.notifications FOR SELECT
  USING (user_id = 'a1b2c3d4-0000-0000-0000-000000000001');

CREATE POLICY "demo_notifications_update"
  ON public.notifications FOR UPDATE
  USING (user_id = 'a1b2c3d4-0000-0000-0000-000000000001');

-- ─── user_privilege_usage table ─────────────────────────────
CREATE POLICY "demo_usage_select"
  ON public.user_privilege_usage FOR SELECT
  USING (user_id = 'a1b2c3d4-0000-0000-0000-000000000001');

CREATE POLICY "demo_usage_insert"
  ON public.user_privilege_usage FOR INSERT
  WITH CHECK (user_id = 'a1b2c3d4-0000-0000-0000-000000000001');
