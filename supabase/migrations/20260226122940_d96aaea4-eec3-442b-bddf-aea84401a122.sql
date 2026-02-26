ALTER TABLE public.shipments ADD COLUMN sender_email text DEFAULT '' NOT NULL;
ALTER TABLE public.shipments ADD COLUMN receiver_email text DEFAULT '' NOT NULL;