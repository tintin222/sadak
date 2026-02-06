// ============================================================
// SADAK Platform — Core Type Definitions
// ============================================================

// --- Users ---
export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  national_id: string | null;
  preferred_language: 'tr' | 'en';
  preferred_currency: string;
  home_airport: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  memberships?: UserMembership[];
  active_membership?: UserMembership | null;
  troy_verified?: boolean;
}

// --- Companies ---
export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  website: string | null;
  status: 'active' | 'inactive';
  settings: Record<string, unknown> | null;
  created_at: string;
}

// --- Tiers ---
export interface Tier {
  id: string;
  company_id: string;
  name: string;
  level: number;
  description: string | null;
  color: string | null;
  icon: string | null;
  created_at: string;
}

// --- Memberships ---
export interface UserMembership {
  id: string;
  user_id: string;
  company_id: string;
  tier_id: string;
  status: 'pending' | 'active' | 'rejected' | 'suspended';
  request_source: 'auto_detected' | 'troy' | 'user_request';
  requested_at: string;
  approved_at: string | null;
  approved_by: string | null;
  // Joined relations
  company?: Company;
  tier?: Tier;
}

// --- Privileges ---
export type PrivilegeCategory =
  | 'esim'
  | 'transfer'
  | 'insurance'
  | 'lounge'
  | 'fast_track'
  | 'dining'
  | 'shopping'
  | 'health'
  | 'entertainment'
  | 'other';

export type PrivilegeUsageModel = 'free' | 'discounted' | 'paid';
export type QuotaPeriod = 'daily' | 'monthly' | 'yearly' | 'once';

export interface Privilege {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  category: PrivilegeCategory;
  usage_model: PrivilegeUsageModel;
  discount_percentage: number | null;
  quota_limit: number | null;
  quota_period: QuotaPeriod | null;
  eligible_tier_ids: number[];
  provider_id: string | null;
  validity_start: string | null;
  validity_end: string | null;
  terms: string | null;
  status: 'active' | 'inactive';
  sort_order: number;
  created_at: string;
  // Joined relations
  provider?: Provider;
  company?: Company;
  usage_count?: number;
}

// --- Providers ---
export type ProviderType = 'esim' | 'transfer' | 'insurance' | 'lounge' | 'fast_track';

export interface Provider {
  id: string;
  name: string;
  slug: string;
  type: ProviderType;
  logo_url: string | null;
  description: string | null;
  api_base_url: string | null;
  status: 'active' | 'inactive';
  created_at: string;
}

// --- Trips ---
export type TripStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  user_id: string;
  origin_city: string;
  origin_country: string;
  origin_airport_code: string | null;
  destination_city: string;
  destination_country: string;
  destination_airport_code: string | null;
  flight_number: string | null;
  departure_date: string;
  return_date: string | null;
  status: TripStatus;
  created_at: string;
  // Joined relations
  transactions?: Transaction[];
}

// --- Transactions ---
export type TransactionType = 'esim' | 'transfer' | 'insurance' | 'lounge' | 'fast_track';
export type TransactionStatus = 'pending' | 'confirmed' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  user_id: string;
  trip_id: string | null;
  type: TransactionType;
  status: TransactionStatus;
  provider_id: string;
  privilege_id: string | null;
  amount: number;
  currency: string;
  discount_amount: number;
  flow_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  // Joined
  provider?: Provider;
  privilege?: Privilege;
}

// --- Service-Specific Types ---
export interface EsimActivation {
  id: string;
  transaction_id: string;
  package_name: string;
  data_amount: string;
  duration_days: number;
  destination_country: string;
  flight_number: string | null;
  activation_type: 'qr' | 'link';
  qr_code_data: string | null;
  activation_link: string | null;
  provider_package_id: string | null;
  status: string;
}

export interface TransferReservation {
  id: string;
  transaction_id: string;
  provider_name: string;
  vehicle_type: string;
  origin_address: string;
  origin_lat: number;
  origin_lng: number;
  destination_address: string;
  dest_lat: number;
  dest_lng: number;
  pickup_time: string;
  estimated_duration_min: number;
  price: number;
  currency: string;
  reservation_ref: string;
  driver_name: string | null;
  driver_rating: number | null;
  driver_phone: string | null;
  status: string;
}

export interface InsurancePolicy {
  id: string;
  transaction_id: string;
  provider_name: string;
  plan_name: string;
  coverage_amount: number;
  coverage_currency: string;
  premium_price: number;
  premium_currency: string;
  policy_number: string;
  policy_pdf_url: string | null;
  beneficiary_name: string;
  travel_start: string;
  travel_end: string;
  status: string;
}

export interface ServicePass {
  id: string;
  transaction_id: string;
  service_type: 'lounge' | 'fast_track';
  venue_name: string;
  location: string;
  access_code: string;
  access_code_type: 'qr' | 'barcode';
  valid_from: string;
  valid_until: string;
  guest_count: number;
  used_at: string | null;
  status: string;
}

// --- Notifications ---
export type NotificationType =
  | 'privilege_unlocked'
  | 'trip_reminder'
  | 'transaction_complete'
  | 'membership_update'
  | 'campaign';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
}

// --- Campaigns ---
export type CampaignType = 'discount' | 'gift' | 'extra_quota' | 'promotion';

export interface Campaign {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  type: CampaignType;
  linked_privilege_id: string | null;
  priority: number;
  start_date: string;
  end_date: string;
  target_tier_ids: number[];
  status: 'active' | 'inactive';
  created_at: string;
}

// --- TROY ---
export interface TroyVerification {
  id: string;
  user_id: string;
  national_id_hash: string;
  status: 'verified' | 'not_verified' | 'error';
  verified_at: string | null;
}

// --- Admin ---
export type AdminRole = 'super_admin' | 'company_admin' | 'operator' | 'read_only';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  company_id: string | null;
  status: 'active' | 'inactive';
  created_at: string;
}

// --- Audit ---
export interface AuditLog {
  id: string;
  actor_id: string;
  actor_type: 'admin' | 'provider' | 'system';
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}
