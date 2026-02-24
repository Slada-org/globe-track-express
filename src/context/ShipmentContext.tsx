import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Shipment, CreateShipmentData } from '@/types/shipment';
import { generateTrackingCode } from '@/types/shipment';

interface ShipmentContextType {
  shipments: Shipment[];
  addShipment: (data: CreateShipmentData) => Shipment;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  getByTrackingCode: (code: string) => Shipment | undefined;
  isAdmin: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const ShipmentContext = createContext<ShipmentContextType | null>(null);

const ADMIN_PASSWORD = 'admin2026';

const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: '1',
    trackingCode: 'INT-2026-NGUS-08A3B',
    status: 'in-transit',
    senderName: 'Adebayo Okonkwo',
    senderAddress: '15 Marina Road, Lagos',
    senderCountry: 'NG',
    receiverName: 'James Mitchell',
    receiverAddress: '450 5th Avenue, New York, NY 10018',
    receiverCountry: 'US',
    originCountry: 'NG',
    destinationCountry: 'US',
    transportMode: 'air',
    estimatedDelivery: '2026-03-10',
    shippingFee: 450,
    currentLocation: { lat: 51.47, lng: -0.4543, label: 'London Heathrow Airport (Transit)', timestamp: '2026-02-23T08:00:00Z' },
    locationHistory: [],
    timeline: [
      { id: '1', title: 'Shipment Created', description: 'Package registered at Lagos hub', timestamp: '2026-02-20T10:00:00Z', location: 'Lagos, Nigeria' },
      { id: '2', title: 'Picked Up', description: 'Package collected from sender', timestamp: '2026-02-21T09:15:00Z', location: 'Lagos, Nigeria' },
      { id: '3', title: 'In Transit', description: 'Departed Murtala Muhammed International Airport', timestamp: '2026-02-22T14:30:00Z', location: 'Lagos, Nigeria' },
      { id: '4', title: 'In Transit', description: 'Arrived at transit hub', timestamp: '2026-02-23T08:00:00Z', location: 'London, United Kingdom' },
    ],
    payments: [],
    insurance: { status: 'none' },
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: '2',
    trackingCode: 'INT-2026-GBDE-12F9C',
    status: 'on-hold',
    senderName: 'Sarah Williams',
    senderAddress: '22 Baker Street, London',
    senderCountry: 'GB',
    receiverName: 'Hans Mueller',
    receiverAddress: 'Friedrichstraße 43, Berlin',
    receiverCountry: 'DE',
    originCountry: 'GB',
    destinationCountry: 'DE',
    transportMode: 'road',
    estimatedDelivery: '2026-03-05',
    shippingFee: 180,
    holdReason: 'Customs clearance documentation required',
    currentLocation: { lat: 50.9375, lng: 6.9603, label: 'Cologne Customs Office', timestamp: '2026-02-22T16:00:00Z' },
    locationHistory: [],
    timeline: [
      { id: '1', title: 'Shipment Created', description: 'Package registered at London depot', timestamp: '2026-02-18T11:00:00Z', location: 'London, UK' },
      { id: '2', title: 'In Transit', description: 'Departed London via Eurotunnel', timestamp: '2026-02-20T06:00:00Z', location: 'London, UK' },
      { id: '3', title: 'On Hold', description: 'Held at customs — documentation required', timestamp: '2026-02-22T16:00:00Z', location: 'Cologne, Germany' },
    ],
    payments: [
      {
        id: 'p1', type: 'customs', amount: 75, cryptoCurrency: 'USDT',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38',
        expiresAt: '2026-02-28T23:59:59Z', status: 'pending', createdAt: '2026-02-22T17:00:00Z',
      },
    ],
    insurance: { status: 'requested', requestedAt: '2026-02-22T18:00:00Z' },
    createdAt: '2026-02-18T11:00:00Z',
  },
];

export function ShipmentProvider({ children }: { children: React.ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('inttrack_admin') === 'true');

  const addShipment = useCallback((data: CreateShipmentData): Shipment => {
    const newShipment: Shipment = {
      ...data,
      id: crypto.randomUUID(),
      trackingCode: generateTrackingCode(data.originCountry, data.destinationCountry),
      status: 'processing',
      locationHistory: [],
      timeline: [
        { id: crypto.randomUUID(), title: 'Shipment Created', description: 'Package registered in the system', timestamp: new Date().toISOString() },
      ],
      payments: [],
      insurance: { status: 'none' },
      createdAt: new Date().toISOString(),
    };
    setShipments(prev => [newShipment, ...prev]);
    return newShipment;
  }, []);

  const updateShipment = useCallback((id: string, updates: Partial<Shipment>) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const getByTrackingCode = useCallback((code: string) => {
    return shipments.find(s => s.trackingCode.toLowerCase() === code.toLowerCase());
  }, [shipments]);

  const adminLogin = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('inttrack_admin', 'true');
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem('inttrack_admin');
  }, []);

  return (
    <ShipmentContext.Provider value={{ shipments, addShipment, updateShipment, getByTrackingCode, isAdmin, adminLogin, adminLogout }}>
      {children}
    </ShipmentContext.Provider>
  );
}

export function useShipments() {
  const ctx = useContext(ShipmentContext);
  if (!ctx) throw new Error('useShipments must be used within ShipmentProvider');
  return ctx;
}
