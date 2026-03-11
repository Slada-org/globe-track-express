import { useState, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, ShieldCheck, Pause, Play, CheckCircle, Loader2, Camera, Trash2, Video, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useShipmentById, useUpdateShipment, useAddTimelineEvent, useAddPayment, useUpdatePayment } from '@/hooks/useShipments';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { ShipmentTimeline } from '@/components/ShipmentTimeline';
import { STATUS_CONFIG, COUNTRIES } from '@/types/shipment';
import type { ShipmentStatus, PaymentType } from '@/types/shipment';
import { toast } from 'sonner';

const STATUSES: ShipmentStatus[] = ['processing', 'picked-up', 'in-transit', 'in-customs', 'on-hold', 'out-for-delivery', 'delivered', 'payment-pending', 'payment-expired'];

export default function AdminShipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, loading: authLoading } = useAuth();
  const { data: shipment, isLoading } = useShipmentById(id || '');
  const updateShipment = useUpdateShipment();
  const addTimeline = useAddTimelineEvent();

  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/admin" replace />;
  if (isLoading) return <main className="container py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></main>;
  if (!shipment) return <main className="container py-20 text-center"><h1 className="text-xl font-bold">Shipment not found</h1></main>;

  const cfg = STATUS_CONFIG[shipment.status];

  const handleStatusUpdate = async (newStatus: string) => {
    const status = newStatus as ShipmentStatus;
    await updateShipment.mutateAsync({
      id: shipment.id,
      updates: {
        status,
        hold_reason: status !== 'on-hold' ? null : shipment.holdReason || null,
      },
    });
    await addTimeline.mutateAsync({
      shipment_id: shipment.id,
      title: STATUS_CONFIG[status].label,
      description: `Status updated to ${STATUS_CONFIG[status].label}`,
    });
    toast.success(`Status updated to ${STATUS_CONFIG[status].label}`);
  };

  return (
    <main className="container py-8 px-4 max-w-5xl">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground">{shipment.trackingCode}</h1>
          <p className="text-muted-foreground">{COUNTRIES[shipment.originCountry]} → {COUNTRIES[shipment.destinationCountry]}</p>
        </div>
        <Badge variant={cfg.color as any} className="text-sm px-4 py-1.5 self-start">{cfg.label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
          <CardContent><ShipmentTimeline events={shipment.timeline} /></CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Update Status</CardTitle></CardHeader>
            <CardContent>
              <Select value={shipment.status} onValueChange={handleStatusUpdate}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <DatesSection shipmentId={shipment.id} estimatedDelivery={shipment.estimatedDelivery} departureDate={shipment.departureDate} />
          <LocationUpdate shipmentId={shipment.id} currentLocation={shipment.currentLocation} />
          <HoldSection shipmentId={shipment.id} currentHoldReason={shipment.holdReason} status={shipment.status} />
          <PaymentRequestSection shipmentId={shipment.id} payments={shipment.payments} />
          <PhotoUploadSection shipmentId={shipment.id} photos={shipment.photos} />
          <InsuranceSection shipmentId={shipment.id} insurance={shipment.insurance} />
          <DeliverSection shipmentId={shipment.id} status={shipment.status} />
        </div>
      </div>
    </main>
  );
}

function DatesSection({ shipmentId, estimatedDelivery, departureDate }: { shipmentId: string; estimatedDelivery: string; departureDate?: string }) {
  const updateShipment = useUpdateShipment();
  const addTimeline = useAddTimelineEvent();
  const [delivery, setDelivery] = useState(estimatedDelivery || '');
  const [departure, setDeparture] = useState(departureDate || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: Record<string, any> = {};
      if (delivery !== estimatedDelivery) updates.estimated_delivery = delivery;
      if (departure !== (departureDate || '')) updates.departure_date = departure || null;
      if (Object.keys(updates).length === 0) { setSaving(false); return; }
      await updateShipment.mutateAsync({ id: shipmentId, updates });
      if (updates.estimated_delivery) {
        await addTimeline.mutateAsync({ shipment_id: shipmentId, title: 'Delivery Date Updated', description: `Estimated delivery changed to ${delivery}` });
      }
      if (updates.departure_date !== undefined) {
        await addTimeline.mutateAsync({ shipment_id: shipmentId, title: 'Departure Date Updated', description: `Departure/pickup date set to ${departure || 'N/A'}` });
      }
      toast.success('Dates updated');
    } catch { toast.error('Failed to update dates'); }
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Dates</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label>Departure / Pickup Date</Label>
          <Input type="date" value={departure} onChange={e => setDeparture(e.target.value)} />
        </div>
        <div>
          <Label>Estimated Delivery Date</Label>
          <Input type="date" value={delivery} onChange={e => setDelivery(e.target.value)} />
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save Dates
        </Button>
      </CardContent>
    </Card>
  );
}


  const updateShipment = useUpdateShipment();
  const addTimeline = useAddTimelineEvent();
  const [lat, setLat] = useState(currentLocation?.lat?.toString() || '');
  const [lng, setLng] = useState(currentLocation?.lng?.toString() || '');
  const [label, setLabel] = useState(currentLocation?.label || '');

  const handleSave = async () => {
    if (!lat || !lng || !label) { toast.error('Fill all location fields'); return; }
    await updateShipment.mutateAsync({
      id: shipmentId,
      updates: {
        current_lat: parseFloat(lat),
        current_lng: parseFloat(lng),
        current_location_label: label,
        current_location_timestamp: new Date().toISOString(),
      },
    });
    await addTimeline.mutateAsync({
      shipment_id: shipmentId,
      title: 'Location Updated',
      description: `Now at: ${label}`,
      location: label,
    });
    toast.success('Location updated');
  };

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base"><MapPin className="h-4 w-4 inline mr-2 text-accent" />Update Location</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Latitude</Label><Input value={lat} onChange={e => setLat(e.target.value)} type="number" step="any" /></div>
          <div><Label>Longitude</Label><Input value={lng} onChange={e => setLng(e.target.value)} type="number" step="any" /></div>
        </div>
        <div><Label>Location Label</Label><Input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. London Heathrow Airport" /></div>
        <Button variant="accent" size="sm" onClick={handleSave} className="w-full">Save Location</Button>
      </CardContent>
    </Card>
  );
}

function HoldSection({ shipmentId, currentHoldReason, status }: { shipmentId: string; currentHoldReason?: string; status: ShipmentStatus }) {
  const updateShipment = useUpdateShipment();
  const addTimeline = useAddTimelineEvent();
  const [reason, setReason] = useState(currentHoldReason || '');

  const handleHold = async () => {
    if (!reason) { toast.error('Enter a hold reason'); return; }
    await updateShipment.mutateAsync({ id: shipmentId, updates: { status: 'on-hold', hold_reason: reason } });
    await addTimeline.mutateAsync({ shipment_id: shipmentId, title: 'On Hold', description: reason });
    toast.success('Shipment put on hold');
  };

  const handleRelease = async () => {
    await updateShipment.mutateAsync({ id: shipmentId, updates: { status: 'in-transit', hold_reason: null } });
    await addTimeline.mutateAsync({ shipment_id: shipmentId, title: 'Released', description: 'Hold released, shipment resumed' });
    toast.success('Hold released');
  };

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base"><Pause className="h-4 w-4 inline mr-2 text-destructive" />Hold Management</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div><Label>Hold Reason</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for hold..." rows={2} /></div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" onClick={handleHold} className="flex-1"><Pause className="h-3 w-3 mr-1" />Put On Hold</Button>
          {status === 'on-hold' && <Button variant="success" size="sm" onClick={handleRelease} className="flex-1"><Play className="h-3 w-3 mr-1" />Release</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentRequestSection({ shipmentId, payments }: { shipmentId: string; payments: any[] }) {
  const updateShipment = useUpdateShipment();
  const addTimeline = useAddTimelineEvent();
  const addPayment = useAddPayment();
  const updatePaymentMut = useUpdatePayment();
  const [type, setType] = useState<string>('shipping');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('crypto');
  const [wallet, setWallet] = useState('');
  const [crypto, setCrypto] = useState('USDT');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [hours, setHours] = useState('48');

  const handleRequest = async () => {
    if (!amount) { toast.error('Fill amount'); return; }
    if (paymentMethod === 'crypto' && !wallet) { toast.error('Fill wallet address'); return; }
    if (paymentMethod !== 'crypto' && !paymentDetails) { toast.error('Fill payment details'); return; }

    const methodLabels: Record<string, string> = { crypto: 'Cryptocurrency', western_union: 'Western Union', bank_transfer: 'Bank Transfer' };

    await addPayment.mutateAsync({
      shipment_id: shipmentId,
      type,
      amount: parseFloat(amount),
      payment_method: paymentMethod,
      crypto_currency: paymentMethod === 'crypto' ? crypto : undefined,
      wallet_address: paymentMethod === 'crypto' ? wallet : undefined,
      payment_details: paymentMethod !== 'crypto' ? paymentDetails : undefined,
      expires_at: new Date(Date.now() + parseInt(hours) * 3600000).toISOString(),
    });
    await updateShipment.mutateAsync({ id: shipmentId, updates: { status: 'payment-pending' } });
    await addTimeline.mutateAsync({
      shipment_id: shipmentId,
      title: 'Payment Requested',
      description: `${type} payment of ${amount} via ${methodLabels[paymentMethod]}`,
    });
    setAmount(''); setWallet(''); setPaymentDetails('');
    toast.success('Payment requested');
  };

  const handleConfirm = async (paymentId: string) => {
    await updatePaymentMut.mutateAsync({ id: paymentId, status: 'confirmed' });
    await updateShipment.mutateAsync({ id: shipmentId, updates: { status: 'in-transit' } });
    await addTimeline.mutateAsync({ shipment_id: shipmentId, title: 'Payment Confirmed', description: 'Payment confirmed by admin' });
    toast.success('Payment confirmed');
  };

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base"><CreditCard className="h-4 w-4 inline mr-2 text-accent" />Payment Requests</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {payments.filter(p => p.status === 'pending').map(p => (
          <div key={p.id} className="rounded-lg bg-muted p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{p.type} — {p.amount} {p.paymentMethod === 'crypto' ? p.cryptoCurrency : p.paymentMethod.replace('_', ' ')}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <Button variant="success" size="sm" onClick={() => handleConfirm(p.id)}>Confirm</Button>
          </div>
        ))}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="customs">Customs</SelectItem>
                  <SelectItem value="hold-fee">Hold Fee</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Amount</Label><Input value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" /></div>
          </div>

          <div>
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="western_union">Western Union</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === 'crypto' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Crypto</Label>
                  <Select value={crypto} onValueChange={setCrypto}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Expiry (hours)</Label><Input value={hours} onChange={e => setHours(e.target.value)} type="number" /></div>
              </div>
              <div><Label>Wallet Address</Label><Input value={wallet} onChange={e => setWallet(e.target.value)} placeholder="0x..." /></div>
            </>
          )}

          {paymentMethod !== 'crypto' && (
            <>
              <div><Label>Expiry (hours)</Label><Input value={hours} onChange={e => setHours(e.target.value)} type="number" /></div>
              <div>
                <Label>{paymentMethod === 'western_union' ? 'Western Union Details' : 'Bank Account Details'}</Label>
                <Textarea
                  value={paymentDetails}
                  onChange={e => setPaymentDetails(e.target.value)}
                  placeholder={paymentMethod === 'western_union'
                    ? 'Receiver name, MTCN, location...'
                    : 'Bank name, account number, routing number, SWIFT/IBAN...'}
                  rows={3}
                />
              </div>
            </>
          )}

          <Button variant="accent" size="sm" className="w-full" onClick={handleRequest}>Request Payment</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PhotoUploadSection({ shipmentId, photos }: { shipmentId: string; photos: any[] }) {
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const photoItems = photos.filter(p => p.mediaType === 'photo');
  const videoItems = photos.filter(p => p.mediaType === 'video');
  const canAddPhoto = photoItems.length < 4;
  const canAddVideo = videoItems.length < 1;

  const handleUpload = async (mediaType: 'photo' | 'video') => {
    const fileInput = mediaType === 'photo' ? photoRef.current : videoRef.current;
    const file = fileInput?.files?.[0];
    if (!file) { toast.error(`Select a ${mediaType}`); return; }

    if (mediaType === 'photo' && !canAddPhoto) { toast.error('Maximum 4 photos allowed'); return; }
    if (mediaType === 'video' && !canAddVideo) { toast.error('Maximum 1 video allowed'); return; }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${shipmentId}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('shipment-photos').upload(path, file);
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from('shipment-photos').getPublicUrl(path);

      const { error: dbErr } = await supabase.from('shipment_photos').insert({
        shipment_id: shipmentId,
        photo_url: publicUrl,
        caption: caption || '',
        media_type: mediaType,
      } as any);
      if (dbErr) throw dbErr;

      queryClient.invalidateQueries({ queryKey: ['shipment'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setCaption('');
      if (fileInput) fileInput.value = '';
      toast.success(`${mediaType === 'photo' ? 'Photo' : 'Video'} uploaded`);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string, url: string) => {
    try {
      const parts = url.split('/shipment-photos/');
      if (parts[1]) {
        await supabase.storage.from('shipment-photos').remove([parts[1]]);
      }
      await supabase.from('shipment_photos').delete().eq('id', photoId);
      queryClient.invalidateQueries({ queryKey: ['shipment'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base"><Camera className="h-4 w-4 inline mr-2 text-accent" />Package Media</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">{photoItems.length}/4 photos · {videoItems.length}/1 video</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photos grid */}
        {photoItems.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {photoItems.map(ph => (
              <div key={ph.id} className="relative group rounded-lg overflow-hidden border border-border">
                <img src={ph.photoUrl} alt={ph.caption} className="w-full h-24 object-cover" />
                <button
                  onClick={() => handleDelete(ph.id, ph.photoUrl)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                {ph.caption && <p className="text-xs text-muted-foreground p-1 truncate">{ph.caption}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Video */}
        {videoItems.length > 0 && (
          <div className="space-y-2">
            {videoItems.map(v => (
              <div key={v.id} className="relative group rounded-lg overflow-hidden border border-border">
                <video src={v.photoUrl} controls className="w-full max-h-48 bg-black" />
                <button
                  onClick={() => handleDelete(v.id, v.photoUrl)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                {v.caption && <p className="text-xs text-muted-foreground p-1 truncate">{v.caption}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Upload section */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div><Label>Caption (optional)</Label><Input value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Package at warehouse" /></div>

          {canAddPhoto && (
            <div className="space-y-2">
              <div><Label>Photo</Label><Input ref={photoRef} type="file" accept="image/*" /></div>
              <Button variant="accent" size="sm" className="w-full" onClick={() => handleUpload('photo')} disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
                Upload Photo ({photoItems.length}/4)
              </Button>
            </div>
          )}

          {canAddVideo && (
            <div className="space-y-2">
              <div><Label>Video</Label><Input ref={videoRef} type="file" accept="video/*" /></div>
              <Button variant="accent" size="sm" className="w-full" onClick={() => handleUpload('video')} disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Video className="h-4 w-4 mr-2" />}
                Upload Video ({videoItems.length}/1)
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InsuranceSection({ shipmentId, insurance }: { shipmentId: string; insurance: any }) {
  const updateShipment = useUpdateShipment();
  const addTimeline = useAddTimelineEvent();
  const [fee, setFee] = useState(insurance.fee?.toString() || '');

  const handlePrice = async () => {
    if (!fee) { toast.error('Enter insurance fee'); return; }
    await updateShipment.mutateAsync({
      id: shipmentId,
      updates: { insurance_status: 'priced', insurance_fee: parseFloat(fee) },
    });
    await addTimeline.mutateAsync({ shipment_id: shipmentId, title: 'Insurance Priced', description: `Insurance priced at $${fee}` });
    toast.success('Insurance priced');
  };

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base"><ShieldCheck className="h-4 w-4 inline mr-2 text-accent" />Insurance</CardTitle></CardHeader>
      <CardContent>
        {insurance.status === 'none' && <p className="text-sm text-muted-foreground">No insurance requested</p>}
        {insurance.status === 'requested' && (
          <div className="space-y-3">
            <Badge variant="info">Insurance Requested</Badge>
            <div><Label>Set Insurance Fee ($)</Label><Input value={fee} onChange={e => setFee(e.target.value)} type="number" step="0.01" /></div>
            <Button variant="accent" size="sm" className="w-full" onClick={handlePrice}>Set Price & Notify</Button>
          </div>
        )}
        {insurance.status === 'priced' && <Badge variant="warning">Priced at ${insurance.fee} — Awaiting payment</Badge>}
        {(insurance.status === 'paid' || insurance.status === 'active') && <Badge variant="success">Insurance Active</Badge>}
      </CardContent>
    </Card>
  );
}

function DeliverSection({ shipmentId, status }: { shipmentId: string; status: ShipmentStatus }) {
  const updateShipment = useUpdateShipment();
  const addTimeline = useAddTimelineEvent();
  const [note, setNote] = useState('');

  const handleDeliver = async () => {
    await updateShipment.mutateAsync({
      id: shipmentId,
      updates: { status: 'delivered', delivery_note: note || null },
    });
    await addTimeline.mutateAsync({ shipment_id: shipmentId, title: 'Delivered', description: note || 'Package delivered successfully' });
    toast.success('Shipment marked as delivered');
  };

  if (status === 'delivered') return (
    <Card><CardContent className="p-6 text-center"><Badge variant="success" className="text-base px-6 py-2">✓ Delivered</Badge></CardContent></Card>
  );

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base"><CheckCircle className="h-4 w-4 inline mr-2 text-success" />Mark as Delivered</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div><Label>Delivery Note (optional)</Label><Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Optional delivery notes..." rows={2} /></div>
        <Button variant="success" className="w-full" onClick={handleDeliver}><CheckCircle className="h-4 w-4 mr-2" />Confirm Delivery</Button>
      </CardContent>
    </Card>
  );
}
