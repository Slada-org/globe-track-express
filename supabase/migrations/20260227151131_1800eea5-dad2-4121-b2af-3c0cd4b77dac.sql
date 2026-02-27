
-- Add payment method and details columns to payments table
ALTER TABLE public.payments ADD COLUMN payment_method text NOT NULL DEFAULT 'crypto';
ALTER TABLE public.payments ADD COLUMN payment_details text DEFAULT '';

-- Make crypto_currency and wallet_address nullable (not needed for non-crypto methods)
ALTER TABLE public.payments ALTER COLUMN crypto_currency DROP NOT NULL;
ALTER TABLE public.payments ALTER COLUMN crypto_currency SET DEFAULT NULL;
ALTER TABLE public.payments ALTER COLUMN wallet_address DROP NOT NULL;
ALTER TABLE public.payments ALTER COLUMN wallet_address SET DEFAULT NULL;

-- Create shipment_photos table
CREATE TABLE public.shipment_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id uuid NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  caption text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.shipment_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read shipment_photos" ON public.shipment_photos FOR SELECT USING (true);
CREATE POLICY "Admins can insert shipment_photos" ON public.shipment_photos FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete shipment_photos" ON public.shipment_photos FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for shipment photos
INSERT INTO storage.buckets (id, name, public) VALUES ('shipment-photos', 'shipment-photos', true);

-- Storage policies
CREATE POLICY "Public can view shipment photos" ON storage.objects FOR SELECT USING (bucket_id = 'shipment-photos');
CREATE POLICY "Admins can upload shipment photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'shipment-photos' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete shipment photos" ON storage.objects FOR DELETE USING (bucket_id = 'shipment-photos' AND has_role(auth.uid(), 'admin'::app_role));
