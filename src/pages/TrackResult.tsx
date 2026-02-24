import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, MapPin, Clock, Plane, Ship, Truck, Bike, AlertTriangle, ShieldCheck, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useShipments } from '@/context/ShipmentContext';
import { ShipmentTimeline } from '@/components/ShipmentTimeline';
import { STATUS_CONFIG, COUNTRIES, TRANSPORT_MODES } from '@/types/shipment';
import type { PaymentRequest } from '@/types/shipment';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const modeIcons = { air: Plane, sea: Ship, road: Truck, bike: Bike };

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    const tick = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setRemaining('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  return <span className={remaining === 'Expired' ? 'text-destructive font-bold' : 'text-accent font-mono font-bold'}>{remaining}</span>;
}

function PaymentSection({ payment }: { payment: PaymentRequest }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(payment.walletAddress);
    toast.success('Wallet address copied!');
  };

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5 text-accent" />
          Payment Required — {payment.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Amount</span>
          <span className="text-xl font-bold text-foreground">{payment.amount} {payment.cryptoCurrency}</span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Send to wallet address:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded bg-muted px-3 py-2 text-xs font-mono text-foreground">{payment.walletAddress}</code>
            <Button variant="outline" size="sm" onClick={handleCopy}>Copy</Button>
          </div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Time remaining</span>
          <Countdown expiresAt={payment.expiresAt} />
        </div>
        {payment.status === 'confirmed' && (
          <Badge variant="success" className="mt-2">✓ Payment Confirmed</Badge>
        )}
      </CardContent>
    </Card>
  );
}

export default function TrackResult() {
  const { code } = useParams<{ code: string }>();
  const { getByTrackingCode, updateShipment } = useShipments();
  const shipment = getByTrackingCode(code || '');

  if (!shipment) {
    return (
      <main className="container py-20 text-center">
        <AlertTriangle className="h-16 w-16 mx-auto text-warning mb-4" />
        <h1 className="text-2xl font-bold mb-2">Shipment Not Found</h1>
        <p className="text-muted-foreground mb-6">No shipment matches tracking code: <strong>{code}</strong></p>
        <Link to="/"><Button variant="accent">Track Another Shipment</Button></Link>
      </main>
    );
  }

  const statusCfg = STATUS_CONFIG[shipment.status];
  const ModeIcon = modeIcons[shipment.transportMode];
  const modeInfo = TRANSPORT_MODES.find(m => m.value === shipment.transportMode);
  const pendingPayments = shipment.payments.filter(p => p.status === 'pending');

  const handleRequestInsurance = () => {
    updateShipment(shipment.id, {
      insurance: { ...shipment.insurance, status: 'requested', requestedAt: new Date().toISOString() },
    });
    toast.success('Insurance request submitted!');
  };

  return (
    <main className="container py-8 px-4 max-w-5xl">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to tracking
      </Link>

      {/* Status Banner */}
      <div className="rounded-xl bg-card border border-border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tracking Code</p>
            <h1 className="text-2xl font-bold font-mono text-foreground">{shipment.trackingCode}</h1>
          </div>
          <Badge variant={statusCfg.color as any} className="text-sm px-4 py-1.5 self-start">
            {statusCfg.label}
          </Badge>
        </div>

        {shipment.holdReason && (
          <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Shipment On Hold</p>
              <p className="text-sm text-muted-foreground">{shipment.holdReason}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">From</p>
                  <p className="font-semibold text-foreground">{shipment.senderName}</p>
                  <p className="text-sm text-muted-foreground">{shipment.senderAddress}</p>
                  <p className="text-sm text-accent font-medium">{COUNTRIES[shipment.originCountry] || shipment.originCountry}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">To</p>
                  <p className="font-semibold text-foreground">{shipment.receiverName}</p>
                  <p className="text-sm text-muted-foreground">{shipment.receiverAddress}</p>
                  <p className="text-sm text-accent font-medium">{COUNTRIES[shipment.destinationCountry] || shipment.destinationCountry}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-6 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <ModeIcon className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">{modeInfo?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Est. {format(new Date(shipment.estimatedDelivery), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ShipmentTimeline events={shipment.timeline} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Map */}
          {shipment.currentLocation && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" /> Current Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-foreground mb-2">{shipment.currentLocation.label}</p>
                <div className="rounded-lg overflow-hidden border border-border aspect-video">
                  <iframe
                    title="Shipment Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${shipment.currentLocation.lat},${shipment.currentLocation.lng}&z=10&output=embed`}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payments */}
          {pendingPayments.map(p => (
            <PaymentSection key={p.id} payment={p} />
          ))}

          {/* Insurance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> Insurance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {shipment.insurance.status === 'none' && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Protect your shipment with optional insurance coverage.</p>
                  <Button variant="outline" size="sm" onClick={handleRequestInsurance} className="w-full">
                    Request Insurance
                  </Button>
                </div>
              )}
              {shipment.insurance.status === 'requested' && (
                <Badge variant="info">Insurance Requested — Awaiting Pricing</Badge>
              )}
              {shipment.insurance.status === 'priced' && (
                <div>
                  <p className="text-sm text-muted-foreground">Insurance fee: <strong>${shipment.insurance.fee}</strong></p>
                  <Badge variant="warning" className="mt-2">Awaiting Payment</Badge>
                </div>
              )}
              {(shipment.insurance.status === 'paid' || shipment.insurance.status === 'active') && (
                <Badge variant="success">✓ Insurance Active</Badge>
              )}
            </CardContent>
          </Card>

          {/* Delivery Note */}
          {shipment.status === 'delivered' && shipment.deliveryNote && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Delivery Note</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{shipment.deliveryNote}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
