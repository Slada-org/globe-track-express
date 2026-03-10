export type TransportMode = 'air' | 'sea' | 'road' | 'bike';

export type ShipmentStatus =
  | 'processing'
  | 'picked-up'
  | 'in-transit'
  | 'in-customs'
  | 'on-hold'
  | 'out-for-delivery'
  | 'delivered'
  | 'payment-pending'
  | 'payment-expired';

export type PaymentType = 'shipping' | 'customs' | 'hold-fee' | 'insurance';
export type PaymentStatus = 'pending' | 'expired' | 'confirmed';
export type InsuranceStatus = 'none' | 'requested' | 'priced' | 'paid' | 'active';

export interface ShipmentLocation {
  lat: number;
  lng: number;
  label: string;
  timestamp: string;
}

export type PaymentMethod = 'crypto' | 'western_union' | 'bank_transfer';

export interface PaymentRequest {
  id: string;
  type: PaymentType;
  amount: number;
  paymentMethod: PaymentMethod;
  cryptoCurrency?: string;
  walletAddress?: string;
  paymentDetails?: string;
  expiresAt: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface ShipmentPhoto {
  id: string;
  photoUrl: string;
  caption: string;
  mediaType: 'photo' | 'video';
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
}

export interface Insurance {
  status: InsuranceStatus;
  fee?: number;
  requestedAt?: string;
}

export interface Shipment {
  id: string;
  trackingCode: string;
  status: ShipmentStatus;
  senderName: string;
  senderAddress: string;
  senderCountry: string;
  senderEmail: string;
  receiverName: string;
  receiverAddress: string;
  receiverCountry: string;
  receiverEmail: string;
  originCountry: string;
  destinationCountry: string;
  transportMode: TransportMode;
  estimatedDelivery: string;
  shippingFee: number;
  holdReason?: string;
  currentLocation?: ShipmentLocation;
  locationHistory: ShipmentLocation[];
  timeline: TimelineEvent[];
  payments: PaymentRequest[];
  photos: ShipmentPhoto[];
  insurance: Insurance;
  deliveryNote?: string;
  createdAt: string;
}

export interface CreateShipmentData {
  senderName: string;
  senderAddress: string;
  senderCountry: string;
  senderEmail: string;
  receiverName: string;
  receiverAddress: string;
  receiverCountry: string;
  receiverEmail: string;
  originCountry: string;
  destinationCountry: string;
  transportMode: TransportMode;
  estimatedDelivery: string;
  shippingFee: number;
}

export const COUNTRIES: Record<string, string> = {
  AF: 'Afghanistan', AL: 'Albania', DZ: 'Algeria', AR: 'Argentina', AT: 'Austria',
  AU: 'Australia', BD: 'Bangladesh', BE: 'Belgium', BR: 'Brazil', CA: 'Canada',
  CL: 'Chile', CN: 'China', CO: 'Colombia', CR: 'Costa Rica', CU: 'Cuba',
  CZ: 'Czech Republic', DK: 'Denmark', DO: 'Dominican Republic', EC: 'Ecuador',
  EG: 'Egypt', ET: 'Ethiopia', FI: 'Finland', FR: 'France', DE: 'Germany',
  GH: 'Ghana', GR: 'Greece', GT: 'Guatemala', HN: 'Honduras', HK: 'Hong Kong',
  HU: 'Hungary', IN: 'India', ID: 'Indonesia', IQ: 'Iraq', IE: 'Ireland',
  IL: 'Israel', IT: 'Italy', JM: 'Jamaica', JP: 'Japan', JO: 'Jordan',
  KE: 'Kenya', KR: 'South Korea', KW: 'Kuwait', LB: 'Lebanon', LK: 'Sri Lanka',
  MY: 'Malaysia', MX: 'Mexico', MA: 'Morocco', MM: 'Myanmar', NP: 'Nepal',
  NL: 'Netherlands', NZ: 'New Zealand', NG: 'Nigeria', NO: 'Norway', OM: 'Oman',
  PK: 'Pakistan', PA: 'Panama', PE: 'Peru', PH: 'Philippines', PL: 'Poland',
  PT: 'Portugal', QA: 'Qatar', RO: 'Romania', RU: 'Russia', SA: 'Saudi Arabia',
  SN: 'Senegal', SG: 'Singapore', ZA: 'South Africa', ES: 'Spain', SE: 'Sweden',
  CH: 'Switzerland', TW: 'Taiwan', TZ: 'Tanzania', TH: 'Thailand', TR: 'Turkey',
  UG: 'Uganda', AE: 'UAE', GB: 'United Kingdom', US: 'United States', UY: 'Uruguay',
  VE: 'Venezuela', VN: 'Vietnam', ZM: 'Zambia', ZW: 'Zimbabwe',
};

export const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  AF: { lat: 34.53, lng: 69.17 }, AL: { lat: 41.33, lng: 19.82 }, DZ: { lat: 36.75, lng: 3.04 },
  AR: { lat: -34.6, lng: -58.38 }, AT: { lat: 48.21, lng: 16.37 }, AU: { lat: -33.87, lng: 151.21 },
  BD: { lat: 23.81, lng: 90.41 }, BE: { lat: 50.85, lng: 4.35 }, BR: { lat: -15.79, lng: -47.88 },
  CA: { lat: 45.42, lng: -75.7 }, CL: { lat: -33.45, lng: -70.67 }, CN: { lat: 39.9, lng: 116.4 },
  CO: { lat: 4.71, lng: -74.07 }, CR: { lat: 9.93, lng: -84.08 }, CU: { lat: 23.11, lng: -82.37 },
  CZ: { lat: 50.08, lng: 14.43 }, DK: { lat: 55.68, lng: 12.57 }, DO: { lat: 18.47, lng: -69.9 },
  EC: { lat: -0.18, lng: -78.47 }, EG: { lat: 30.04, lng: 31.24 }, ET: { lat: 9.02, lng: 38.75 },
  FI: { lat: 60.17, lng: 24.94 }, FR: { lat: 48.86, lng: 2.35 }, DE: { lat: 52.52, lng: 13.41 },
  GH: { lat: 5.56, lng: -0.19 }, GR: { lat: 37.98, lng: 23.73 }, GT: { lat: 14.63, lng: -90.51 },
  HN: { lat: 14.07, lng: -87.19 }, HK: { lat: 22.32, lng: 114.17 }, HU: { lat: 47.5, lng: 19.04 },
  IN: { lat: 28.61, lng: 77.23 }, ID: { lat: -6.21, lng: 106.85 }, IQ: { lat: 33.31, lng: 44.37 },
  IE: { lat: 53.35, lng: -6.26 }, IL: { lat: 31.77, lng: 35.22 }, IT: { lat: 41.9, lng: 12.5 },
  JM: { lat: 18.0, lng: -76.79 }, JP: { lat: 35.68, lng: 139.69 }, JO: { lat: 31.95, lng: 35.93 },
  KE: { lat: -1.29, lng: 36.82 }, KR: { lat: 37.57, lng: 126.98 }, KW: { lat: 29.38, lng: 47.99 },
  LB: { lat: 33.89, lng: 35.5 }, LK: { lat: 6.93, lng: 79.84 }, MY: { lat: 3.14, lng: 101.69 },
  MX: { lat: 19.43, lng: -99.13 }, MA: { lat: 33.97, lng: -6.85 }, MM: { lat: 16.87, lng: 96.2 },
  NP: { lat: 27.72, lng: 85.32 }, NL: { lat: 52.37, lng: 4.9 }, NZ: { lat: -41.29, lng: 174.78 },
  NG: { lat: 9.08, lng: 7.49 }, NO: { lat: 59.91, lng: 10.75 }, OM: { lat: 23.59, lng: 58.55 },
  PK: { lat: 33.69, lng: 73.04 }, PA: { lat: 8.98, lng: -79.52 }, PE: { lat: -12.05, lng: -77.04 },
  PH: { lat: 14.6, lng: 120.98 }, PL: { lat: 52.23, lng: 21.01 }, PT: { lat: 38.72, lng: -9.14 },
  QA: { lat: 25.29, lng: 51.53 }, RO: { lat: 44.43, lng: 26.1 }, RU: { lat: 55.76, lng: 37.62 },
  SA: { lat: 24.69, lng: 46.72 }, SN: { lat: 14.69, lng: -17.44 }, SG: { lat: 1.35, lng: 103.82 },
  ZA: { lat: -33.93, lng: 18.42 }, ES: { lat: 40.42, lng: -3.7 }, SE: { lat: 59.33, lng: 18.07 },
  CH: { lat: 46.95, lng: 7.45 }, TW: { lat: 25.03, lng: 121.57 }, TZ: { lat: -6.79, lng: 39.28 },
  TH: { lat: 13.76, lng: 100.5 }, TR: { lat: 41.01, lng: 28.98 }, UG: { lat: 0.35, lng: 32.58 },
  AE: { lat: 25.2, lng: 55.27 }, GB: { lat: 51.51, lng: -0.13 }, US: { lat: 38.9, lng: -77.04 },
  UY: { lat: -34.9, lng: -56.16 }, VE: { lat: 10.49, lng: -66.88 }, VN: { lat: 21.03, lng: 105.85 },
  ZM: { lat: -15.39, lng: 28.32 }, ZW: { lat: -17.83, lng: 31.05 },
};

export const TRANSPORT_MODES: { value: TransportMode; label: string; icon: string }[] = [
  { value: 'air', label: 'Air Freight', icon: '✈️' },
  { value: 'sea', label: 'Sea Freight', icon: '🚢' },
  { value: 'road', label: 'Road Transport', icon: '🚛' },
  { value: 'bike', label: 'Bike Courier', icon: '🏍️' },
];

export const STATUS_CONFIG: Record<ShipmentStatus, { label: string; color: string }> = {
  'processing': { label: 'Processing', color: 'info' },
  'picked-up': { label: 'Picked Up', color: 'info' },
  'in-transit': { label: 'In Transit', color: 'info' },
  'in-customs': { label: 'In Customs', color: 'warning' },
  'on-hold': { label: 'On Hold', color: 'destructive' },
  'out-for-delivery': { label: 'Out for Delivery', color: 'success' },
  'delivered': { label: 'Delivered', color: 'success' },
  'payment-pending': { label: 'Payment Pending', color: 'warning' },
  'payment-expired': { label: 'Payment Expired', color: 'destructive' },
};

export function generateTrackingCode(origin: string, dest: string): string {
  const year = new Date().getFullYear();
  const o = origin.substring(0, 2).toUpperCase();
  const d = dest.substring(0, 2).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `INT-${year}-${o}${d}-${rand}`;
}
