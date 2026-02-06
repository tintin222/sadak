export const ROUTES = {
  // Auth
  login: '/login',
  verifyOtp: '/verify-otp',
  onboarding: {
    welcome: '/onboarding/welcome',
    profileSetup: '/onboarding/profile-setup',
    companyDiscovery: '/onboarding/company-discovery',
  },
  // Main tabs
  home: '/home',
  privileges: '/privileges',
  privilegeDetail: (id: string) => `/privileges/${id}`,
  marketplace: '/marketplace',
  trips: '/trips',
  tripDetail: (id: string) => `/trips/${id}`,
  profile: '/profile',
  // Flows
  esim: '/flows/esim',
  transfer: '/flows/transfer',
  insurance: '/flows/insurance',
  lounge: '/flows/lounge',
  fastTrack: '/flows/fast-track',
  // Other
  notifications: '/notifications',
  search: '/search',
} as const;
