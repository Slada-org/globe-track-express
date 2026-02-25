import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Shipment, CreateShipmentData, TimelineEvent, PaymentRequest, Insurance } from '@/types/shipment';
import { generateTrackingCode } from '@/types/shipment';

// Map DB row to Shipment type
function mapShipment(row: any, timeline: any[], payments: any[]): Shipment {
  return {
    id: row.id,
    trackingCode: row.tracking_code,
    status: row.status,
    senderName: row.sender_name,
    senderAddress: row.sender_address || '',
    senderCountry: row.sender_country,
    receiverName: row.receiver_name,
    receiverAddress: row.receiver_address || '',
    receiverCountry: row.receiver_country,
    originCountry: row.origin_country,
    destinationCountry: row.destination_country,
    transportMode: row.transport_mode,
    estimatedDelivery: row.estimated_delivery,
    shippingFee: Number(row.shipping_fee),
    holdReason: row.hold_reason || undefined,
    currentLocation: row.current_lat != null ? {
      lat: Number(row.current_lat),
      lng: Number(row.current_lng),
      label: row.current_location_label || '',
      timestamp: row.current_location_timestamp || '',
    } : undefined,
    locationHistory: [],
    timeline: timeline.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      timestamp: t.timestamp,
      location: t.location || undefined,
    })),
    payments: payments.map(p => ({
      id: p.id,
      type: p.type,
      amount: Number(p.amount),
      cryptoCurrency: p.crypto_currency,
      walletAddress: p.wallet_address,
      expiresAt: p.expires_at,
      status: p.status,
      createdAt: p.created_at,
    })),
    insurance: {
      status: row.insurance_status || 'none',
      fee: row.insurance_fee ? Number(row.insurance_fee) : undefined,
      requestedAt: row.insurance_requested_at || undefined,
    },
    deliveryNote: row.delivery_note || undefined,
    createdAt: row.created_at,
  };
}

export function useShipmentsList() {
  return useQuery({
    queryKey: ['shipments'],
    queryFn: async (): Promise<Shipment[]> => {
      const { data: rows, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      const ids = (rows || []).map(r => r.id);
      
      const [tlRes, payRes] = await Promise.all([
        supabase.from('timeline_events').select('*').in('shipment_id', ids).order('timestamp', { ascending: true }),
        supabase.from('payments').select('*').in('shipment_id', ids).order('created_at', { ascending: true }),
      ]);

      const timelineMap = new Map<string, any[]>();
      (tlRes.data || []).forEach(t => {
        const arr = timelineMap.get(t.shipment_id) || [];
        arr.push(t);
        timelineMap.set(t.shipment_id, arr);
      });

      const paymentMap = new Map<string, any[]>();
      (payRes.data || []).forEach(p => {
        const arr = paymentMap.get(p.shipment_id) || [];
        arr.push(p);
        paymentMap.set(p.shipment_id, arr);
      });

      return (rows || []).map(r => mapShipment(r, timelineMap.get(r.id) || [], paymentMap.get(r.id) || []));
    },
  });
}

export function useShipmentByTracking(code: string) {
  return useQuery({
    queryKey: ['shipment', 'tracking', code],
    queryFn: async (): Promise<Shipment | null> => {
      const { data: row, error } = await supabase
        .from('shipments')
        .select('*')
        .ilike('tracking_code', code)
        .maybeSingle();
      if (error) throw error;
      if (!row) return null;

      const [tlRes, payRes] = await Promise.all([
        supabase.from('timeline_events').select('*').eq('shipment_id', row.id).order('timestamp', { ascending: true }),
        supabase.from('payments').select('*').eq('shipment_id', row.id).order('created_at', { ascending: true }),
      ]);

      return mapShipment(row, tlRes.data || [], payRes.data || []);
    },
    enabled: !!code,
  });
}

export function useShipmentById(id: string) {
  return useQuery({
    queryKey: ['shipment', id],
    queryFn: async (): Promise<Shipment | null> => {
      const { data: row, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      if (!row) return null;

      const [tlRes, payRes] = await Promise.all([
        supabase.from('timeline_events').select('*').eq('shipment_id', row.id).order('timestamp', { ascending: true }),
        supabase.from('payments').select('*').eq('shipment_id', row.id).order('created_at', { ascending: true }),
      ]);

      return mapShipment(row, tlRes.data || [], payRes.data || []);
    },
    enabled: !!id,
  });
}

export function useCreateShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateShipmentData) => {
      const trackingCode = generateTrackingCode(data.originCountry, data.destinationCountry);
      const { data: row, error } = await supabase
        .from('shipments')
        .insert({
          tracking_code: trackingCode,
          sender_name: data.senderName,
          sender_address: data.senderAddress,
          sender_country: data.senderCountry,
          receiver_name: data.receiverName,
          receiver_address: data.receiverAddress,
          receiver_country: data.receiverCountry,
          origin_country: data.originCountry,
          destination_country: data.destinationCountry,
          transport_mode: data.transportMode,
          estimated_delivery: data.estimatedDelivery,
          shipping_fee: data.shippingFee,
        })
        .select()
        .single();
      if (error) throw error;

      // Add initial timeline event
      await supabase.from('timeline_events').insert({
        shipment_id: row.id,
        title: 'Shipment Created',
        description: 'Package registered in the system',
      });

      return { trackingCode, id: row.id };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shipments'] }),
  });
}

export function useUpdateShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from('shipments')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['shipments'] });
      qc.invalidateQueries({ queryKey: ['shipment', vars.id] });
      qc.invalidateQueries({ queryKey: ['shipment', 'tracking'] });
    },
  });
}

export function useAddTimelineEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (event: { shipment_id: string; title: string; description: string; location?: string; timestamp?: string }) => {
      const { error } = await supabase.from('timeline_events').insert({
        shipment_id: event.shipment_id,
        title: event.title,
        description: event.description,
        location: event.location || null,
        timestamp: event.timestamp || new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shipments'] });
      qc.invalidateQueries({ queryKey: ['shipment'] });
    },
  });
}

export function useAddPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payment: { shipment_id: string; type: string; amount: number; crypto_currency: string; wallet_address: string; expires_at: string }) => {
      const { error } = await supabase.from('payments').insert(payment);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shipments'] });
      qc.invalidateQueries({ queryKey: ['shipment'] });
    },
  });
}

export function useUpdatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('payments').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shipments'] });
      qc.invalidateQueries({ queryKey: ['shipment'] });
    },
  });
}
