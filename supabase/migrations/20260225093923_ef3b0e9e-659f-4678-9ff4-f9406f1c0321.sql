
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles: only admins can read
CREATE POLICY "Admins can read user_roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Shipments table
CREATE TABLE public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'processing',
  sender_name text NOT NULL,
  sender_address text DEFAULT '',
  sender_country text NOT NULL,
  receiver_name text NOT NULL,
  receiver_address text DEFAULT '',
  receiver_country text NOT NULL,
  origin_country text NOT NULL,
  destination_country text NOT NULL,
  transport_mode text NOT NULL DEFAULT 'air',
  estimated_delivery date NOT NULL,
  shipping_fee numeric NOT NULL DEFAULT 0,
  hold_reason text,
  current_lat numeric,
  current_lng numeric,
  current_location_label text,
  current_location_timestamp timestamptz,
  insurance_status text NOT NULL DEFAULT 'none',
  insurance_fee numeric,
  insurance_requested_at timestamptz,
  delivery_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Everyone can read shipments (public tracking)
CREATE POLICY "Public can read shipments" ON public.shipments
  FOR SELECT USING (true);

-- Admins can insert/update/delete shipments
CREATE POLICY "Admins can insert shipments" ON public.shipments
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update shipments" ON public.shipments
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete shipments" ON public.shipments
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Timeline events table
CREATE TABLE public.timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  timestamp timestamptz NOT NULL DEFAULT now(),
  location text
);
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read timeline_events" ON public.timeline_events
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert timeline_events" ON public.timeline_events
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update timeline_events" ON public.timeline_events
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Payments table
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  amount numeric NOT NULL,
  crypto_currency text NOT NULL DEFAULT 'USDT',
  wallet_address text NOT NULL,
  expires_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read payments" ON public.payments
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert payments" ON public.payments
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update payments" ON public.payments
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
