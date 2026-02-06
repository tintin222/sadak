export interface ServicePackage {
  id: string;
  providerName: string;
  providerSlug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  features: string[];
  details: Record<string, unknown>;
  badge?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  terminals?: string[];
}

export interface LocationOption {
  id: string;
  name: string;
  type: 'airport' | 'city' | 'hotel';
}

// Result types from Supabase writes
export interface EsimResult {
  transactionId: string;
  qrCode: string;
  iccid: string;
  packageName: string;
  dataAmount: string;
  durationDays: number;
  expiresAt: string;
}

export interface TransferResult {
  transactionId: string;
  reservationRef: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  pickupTime: string;
}

export interface InsuranceResult {
  transactionId: string;
  policyNumber: string;
  planName: string;
  coverageAmount: number;
  startDate: string;
  endDate: string;
}

export interface ServicePassResult {
  transactionId: string;
  passNumber: string;
  qrCode: string;
  venueName: string;
  validFrom: string;
  validUntil: string;
}
