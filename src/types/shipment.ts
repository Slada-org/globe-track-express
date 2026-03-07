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
  NG: 'Nigeria', US: 'United States', GB: 'United Kingdom', DE: 'Germany',
  CN: 'China', JP: 'Japan', FR: 'France', CA: 'Canada', AU: 'Australia',
  IN: 'India', BR: 'Brazil', ZA: 'South Africa', AE: 'UAE', SG: 'Singapore',
  KR: 'South Korea', GH: 'Ghana', KE: 'Kenya', EG: 'Egypt', MX: 'Mexico',
  IT: 'Italy', ES: 'Spain', NL: 'Netherlands', SE: 'Sweden', TR: 'Turkey',
};

export const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  NG: { lat: 9.08, lng: 7.49 }, US: { lat: 38.9, lng: -77.04 }, GB: { lat: 51.51, lng: -0.13 },
  DE: { lat: 52.52, lng: 13.41 }, CN: { lat: 39.9, lng: 116.4 }, JP: { lat: 35.68, lng: 139.69 },
  FR: { lat: 48.86, lng: 2.35 }, CA: { lat: 45.42, lng: -75.7 }, AU: { lat: -33.87, lng: 151.21 },
  IN: { lat: 28.61, lng: 77.23 }, BR: { lat: -15.79, lng: -47.88 }, ZA: { lat: -33.93, lng: 18.42 },
  AE: { lat: 25.2, lng: 55.27 }, SG: { lat: 1.35, lng: 103.82 }, KR: { lat: 37.57, lng: 126.98 },
  GH: { lat: 5.56, lng: -0.19 }, KE: { lat: -1.29, lng: 36.82 }, EG: { lat: 30.04, lng: 31.24 },
  MX: { lat: 19.43, lng: -99.13 }, IT: { lat: 41.9, lng: 12.5 }, ES: { lat: 40.42, lng: -3.7 },
  NL: { lat: 52.37, lng: 4.9 }, SE: { lat: 59.33, lng: 18.07 }, TR: { lat: 41.01, lng: 28.98 },
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
