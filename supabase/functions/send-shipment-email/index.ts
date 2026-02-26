import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const COUNTRIES: Record<string, string> = {
  NG: 'Nigeria', US: 'United States', GB: 'United Kingdom', DE: 'Germany',
  CN: 'China', JP: 'Japan', FR: 'France', CA: 'Canada', AU: 'Australia',
  IN: 'India', BR: 'Brazil', ZA: 'South Africa', AE: 'UAE', SG: 'Singapore',
  KR: 'South Korea', GH: 'Ghana', KE: 'Kenya', EG: 'Egypt', MX: 'Mexico',
  IT: 'Italy', ES: 'Spain', NL: 'Netherlands', SE: 'Sweden', TR: 'Turkey',
};

const MODES: Record<string, string> = {
  air: 'Air Freight ✈️', sea: 'Sea Freight 🚢', road: 'Road Transport 🚛', bike: 'Bike Courier 🏍️',
};

function buildEmailHtml(role: 'sender' | 'receiver', data: any): string {
  const name = role === 'sender' ? data.senderName : data.receiverName;
  const origin = COUNTRIES[data.originCountry] || data.originCountry;
  const destination = COUNTRIES[data.destinationCountry] || data.destinationCountry;
  const mode = MODES[data.transportMode] || data.transportMode;
  const trackUrl = `${data.siteUrl}/track/${data.trackingCode}`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7">
    <div style="background:#1a1a2e;padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px">IntTrack Shipment Notification</h1>
    </div>
    <div style="padding:32px">
      <p style="color:#18181b;font-size:16px;margin:0 0 16px">Hello <strong>${name}</strong>,</p>
      <p style="color:#52525b;font-size:14px;line-height:1.6;margin:0 0 24px">
        A new shipment has been created ${role === 'sender' ? 'from you' : 'for you'}. Here are the details:
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:10px 12px;color:#71717a;border-bottom:1px solid #f4f4f5">Tracking Code</td>
            <td style="padding:10px 12px;color:#18181b;font-weight:600;border-bottom:1px solid #f4f4f5;font-family:monospace">${data.trackingCode}</td></tr>
        <tr><td style="padding:10px 12px;color:#71717a;border-bottom:1px solid #f4f4f5">Origin</td>
            <td style="padding:10px 12px;color:#18181b;border-bottom:1px solid #f4f4f5">${origin}</td></tr>
        <tr><td style="padding:10px 12px;color:#71717a;border-bottom:1px solid #f4f4f5">Destination</td>
            <td style="padding:10px 12px;color:#18181b;border-bottom:1px solid #f4f4f5">${destination}</td></tr>
        <tr><td style="padding:10px 12px;color:#71717a;border-bottom:1px solid #f4f4f5">Transport</td>
            <td style="padding:10px 12px;color:#18181b;border-bottom:1px solid #f4f4f5">${mode}</td></tr>
        <tr><td style="padding:10px 12px;color:#71717a;border-bottom:1px solid #f4f4f5">Est. Delivery</td>
            <td style="padding:10px 12px;color:#18181b;border-bottom:1px solid #f4f4f5">${data.estimatedDelivery}</td></tr>
        <tr><td style="padding:10px 12px;color:#71717a">Shipping Fee</td>
            <td style="padding:10px 12px;color:#18181b;font-weight:600">$${data.shippingFee}</td></tr>
      </table>
      <div style="margin:28px 0 0;text-align:center">
        <a href="${trackUrl}" style="display:inline-block;background:#1a1a2e;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">
          Track Shipment
        </a>
      </div>
    </div>
    <div style="padding:16px 32px;background:#fafafa;border-top:1px solid #e4e4e7;text-align:center">
      <p style="margin:0;font-size:12px;color:#a1a1aa">IntTrack — International Shipment Tracking</p>
    </div>
  </div>
</body></html>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const siteUrl = Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '').replace('https://api.', 'https://') || '';
    // Use the app's preview/published URL instead
    const appUrl = req.headers.get('origin') || siteUrl;
    const data = { ...body, siteUrl: appUrl };

    const emails: Promise<Response>[] = [];

    if (data.senderEmail) {
      emails.push(
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'IntTrack <onboarding@resend.dev>',
            to: [data.senderEmail],
            subject: `Shipment Created — ${data.trackingCode}`,
            html: buildEmailHtml('sender', data),
          }),
        })
      );
    }

    if (data.receiverEmail) {
      emails.push(
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'IntTrack <onboarding@resend.dev>',
            to: [data.receiverEmail],
            subject: `Shipment Incoming — ${data.trackingCode}`,
            html: buildEmailHtml('receiver', data),
          }),
        })
      );
    }

    const results = await Promise.all(emails);
    const responses = await Promise.all(results.map(r => r.json()));

    return new Response(JSON.stringify({ success: true, results: responses }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Email send error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
