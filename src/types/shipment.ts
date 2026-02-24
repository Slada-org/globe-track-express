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

export interface PaymentRequest {
  id: string;
  type: PaymentType;
  amount: number;
  cryptoCurrency: string;
  walletAddress: string;
  expiresAt: string;
  status: PaymentStatus;
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
  receiverName: string;
  receiverAddress: string;
  receiverCountry: string;
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
  insurance: Insurance;
  deliveryNote?: string;
  createdAt: string;
}

export interface CreateShipmentData {
  senderName: string;
  senderAddress: string;
  senderCountry: string;
  receiverName: string;
  receiverAddress: string;
  receiverCountry: string;
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
