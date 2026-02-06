import { createBrowserClient } from '@supabase/ssr';
import type {
  EsimResult,
  TransferResult,
  InsuranceResult,
  ServicePassResult,
} from './types';

// Use an untyped Supabase client for flow writes to avoid Database generic issues
function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function generateRef(prefix: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = prefix;
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

function generateMockQR(): string {
  return `SADAK-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

function generateICCID(): string {
  let iccid = '8990';
  for (let i = 0; i < 16; i++) {
    iccid += Math.floor(Math.random() * 10);
  }
  return iccid;
}

// ─── eSIM ────────────────────────────────────────────────────

export async function createEsimActivation(params: {
  userId: string;
  providerId: string;
  packageName: string;
  dataAmount: string;
  durationDays: number;
  destinationCountry: string;
  amount: number;
  currency: string;
}): Promise<EsimResult> {
  const supabase = getClient();
  const qrCode = generateMockQR();
  const iccid = generateICCID();
  const expiresAt = new Date(Date.now() + params.durationDays * 86400000).toISOString();

  // Insert transaction
  const { data: tx, error: txErr } = await supabase
    .from('transactions')
    .insert({
      user_id: params.userId,
      type: 'esim',
      status: 'completed',
      provider_id: params.providerId,
      amount: params.amount,
      currency: params.currency,
      discount_amount: 0,
      flow_data: {
        packageName: params.packageName,
        destinationCountry: params.destinationCountry,
        dataAmount: params.dataAmount,
        durationDays: params.durationDays,
      },
    })
    .select('id')
    .single();

  if (txErr) throw new Error(`Transaction failed: ${txErr.message}`);

  // Insert eSIM activation
  const { error: esimErr } = await supabase
    .from('esim_activations')
    .insert({
      transaction_id: tx.id,
      package_name: params.packageName,
      data_amount: params.dataAmount,
      duration_days: params.durationDays,
      destination_country: params.destinationCountry,
      activation_type: 'qr',
      qr_code_data: qrCode,
      provider_package_id: iccid,
      status: 'active',
    });

  if (esimErr) throw new Error(`eSIM activation failed: ${esimErr.message}`);

  return {
    transactionId: tx.id,
    qrCode,
    iccid,
    packageName: params.packageName,
    dataAmount: params.dataAmount,
    durationDays: params.durationDays,
    expiresAt,
  };
}

// ─── Transfer ────────────────────────────────────────────────

export async function createTransferReservation(params: {
  userId: string;
  providerId: string;
  providerName: string;
  vehicleType: string;
  originAddress: string;
  destinationAddress: string;
  pickupTime: string;
  amount: number;
  currency: string;
}): Promise<TransferResult> {
  const supabase = getClient();
  const reservationRef = generateRef('TR-');
  const driverName = ['Ahmet Kaya', 'Mehmet Demir', 'Ali Yildiz', 'Hasan Celik'][Math.floor(Math.random() * 4)];
  const driverPhone = `+9055${Math.floor(10000000 + Math.random() * 90000000)}`;
  const vehiclePlate = `34 ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(100 + Math.random() * 900)}`;

  const { data: tx, error: txErr } = await supabase
    .from('transactions')
    .insert({
      user_id: params.userId,
      type: 'transfer',
      status: 'confirmed',
      provider_id: params.providerId,
      amount: params.amount,
      currency: params.currency,
      discount_amount: 0,
      flow_data: {
        vehicleType: params.vehicleType,
        origin: params.originAddress,
        destination: params.destinationAddress,
        pickupTime: params.pickupTime,
      },
    })
    .select('id')
    .single();

  if (txErr) throw new Error(`Transaction failed: ${txErr.message}`);

  const { error: trErr } = await supabase
    .from('transfer_reservations')
    .insert({
      transaction_id: tx.id,
      provider_name: params.providerName,
      vehicle_type: params.vehicleType,
      origin_address: params.originAddress,
      origin_lat: 41.275,
      origin_lng: 28.751,
      destination_address: params.destinationAddress,
      dest_lat: 41.008,
      dest_lng: 28.978,
      pickup_time: params.pickupTime,
      estimated_duration_min: 45,
      price: params.amount,
      currency: params.currency,
      reservation_ref: reservationRef,
      driver_name: driverName,
      driver_phone: driverPhone,
      status: 'confirmed',
    });

  if (trErr) throw new Error(`Transfer reservation failed: ${trErr.message}`);

  return {
    transactionId: tx.id,
    reservationRef,
    driverName,
    driverPhone,
    vehiclePlate,
    pickupTime: params.pickupTime,
  };
}

// ─── Insurance ───────────────────────────────────────────────

export async function createInsurancePolicy(params: {
  userId: string;
  providerId: string;
  providerName: string;
  planName: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverageAmount: number;
  amount: number;
  currency: string;
  beneficiaryName: string;
}): Promise<InsuranceResult> {
  const supabase = getClient();
  const policyNumber = generateRef('POL-');

  const { data: tx, error: txErr } = await supabase
    .from('transactions')
    .insert({
      user_id: params.userId,
      type: 'insurance',
      status: 'completed',
      provider_id: params.providerId,
      amount: params.amount,
      currency: params.currency,
      discount_amount: 0,
      flow_data: {
        planName: params.planName,
        destination: params.destination,
        coverageAmount: params.coverageAmount,
      },
    })
    .select('id')
    .single();

  if (txErr) throw new Error(`Transaction failed: ${txErr.message}`);

  const { error: insErr } = await supabase
    .from('insurance_policies')
    .insert({
      transaction_id: tx.id,
      provider_name: params.providerName,
      plan_name: params.planName,
      coverage_amount: params.coverageAmount,
      coverage_currency: params.currency,
      premium_price: params.amount,
      premium_currency: params.currency,
      policy_number: policyNumber,
      beneficiary_name: params.beneficiaryName,
      travel_start: params.startDate,
      travel_end: params.endDate,
      status: 'active',
    });

  if (insErr) throw new Error(`Insurance policy failed: ${insErr.message}`);

  return {
    transactionId: tx.id,
    policyNumber,
    planName: params.planName,
    coverageAmount: params.coverageAmount,
    startDate: params.startDate,
    endDate: params.endDate,
  };
}

// ─── Service Pass (Lounge & Fast Track) ──────────────────────

export async function createServicePass(params: {
  userId: string;
  providerId: string;
  serviceType: 'lounge' | 'fast_track';
  venueName: string;
  location: string;
  guestCount: number;
  validFrom: string;
  validUntil: string;
  amount: number;
  currency: string;
}): Promise<ServicePassResult> {
  const supabase = getClient();
  const passNumber = generateRef(params.serviceType === 'lounge' ? 'LNG-' : 'FTK-');
  const qrCode = generateMockQR();

  const { data: tx, error: txErr } = await supabase
    .from('transactions')
    .insert({
      user_id: params.userId,
      type: params.serviceType,
      status: 'completed',
      provider_id: params.providerId,
      amount: params.amount,
      currency: params.currency,
      discount_amount: 0,
      flow_data: {
        venueName: params.venueName,
        location: params.location,
        guestCount: params.guestCount,
      },
    })
    .select('id')
    .single();

  if (txErr) throw new Error(`Transaction failed: ${txErr.message}`);

  const { error: passErr } = await supabase
    .from('service_passes')
    .insert({
      transaction_id: tx.id,
      service_type: params.serviceType,
      venue_name: params.venueName,
      location: params.location,
      access_code: qrCode,
      access_code_type: 'qr',
      valid_from: params.validFrom,
      valid_until: params.validUntil,
      guest_count: params.guestCount,
      status: 'valid',
    });

  if (passErr) throw new Error(`Service pass failed: ${passErr.message}`);

  return {
    transactionId: tx.id,
    passNumber,
    qrCode,
    venueName: params.venueName,
    validFrom: params.validFrom,
    validUntil: params.validUntil,
  };
}
